# 🤖 Setup Rápido: Semantic Release + Automação CI/CD

**Tempo estimado:** 30-45 minutos para setup completo

---

## 📋 Pré-requisitos

- [ ] Acesso ao repositório GitHub como Admin
- [ ] Conta Firebase com permissão
- [ ] Node.js 18+ instalado
- [ ] pnpm instalado

---

## Step 1️⃣: Instalar Dependências (5 min)

```powershell
# No terminal do projeto
pnpm add -D semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/exec
pnpm add -D firebase-admin
```

---

## Step 2️⃣: Criar `.releaserc.json` (2 min)

**Caminho:** `.releaserc.json` (raiz do projeto)

```json
{
  "branches": ["main"],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits"
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "preset": "conventionalcommits"
      }
    ],
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/exec",
      {
        "prepareCmd": "node scripts/update-version.js ${nextRelease.version}"
      }
    ],
    [
      "@semantic-release/exec",
      {
        "publishCmd": "node scripts/publish-version.js ${nextRelease.version}"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "src/version.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]"
      }
    ]
  ]
}
```

---

## Step 3️⃣: Criar Scripts (10 min)

### 3.1 - `scripts/update-version.js`

```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const newVersion = process.argv[2]

if (!newVersion) {
  console.error('❌ Versão não fornecida')
  process.exit(1)
}

try {
  // Atualizar src/version.json
  const versionFile = path.join(__dirname, '../src/version.json')
  const versionData = {
    version: newVersion,
    buildNumber: Math.floor(Date.now() / 1000),
    releaseDate: new Date().toISOString(),
    changelog: []
  }

  fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2))

  // Atualizar package.json
  const packageFile = path.join(__dirname, '../package.json')
  const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf-8'))
  packageData.version = newVersion
  fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))

  console.log(`✅ Versão atualizada para ${newVersion}`)
} catch (error) {
  console.error('❌ Erro ao atualizar versão:', error.message)
  process.exit(1)
}
```

### 3.2 - `scripts/publish-version.js`

```javascript
#!/usr/bin/env node

const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

const newVersion = process.argv[2]

if (!newVersion) {
  console.error('❌ Versão não fornecida')
  process.exit(1)
}

async function publishVersion() {
  try {
    // Inicializar Firebase Admin
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT

    if (!serviceAccountJson) {
      console.error('❌ FIREBASE_SERVICE_ACCOUNT não definida')
      process.exit(1)
    }

    let serviceAccount
    try {
      serviceAccount = JSON.parse(
        Buffer.from(serviceAccountJson, 'base64').toString('utf-8')
      )
    } catch (e) {
      serviceAccount = JSON.parse(serviceAccountJson)
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
    })

    const db = admin.firestore()

    // Ler changelog
    const changelogFile = path.join(__dirname, '../CHANGELOG.md')
    const changelog = fs.readFileSync(changelogFile, 'utf-8')

    // Extrair mudanças do primeiro release
    const lines = changelog.split('\n')
    const changelogLines = []
    let started = false

    for (const line of lines) {
      if (line.startsWith('## ') && started) break
      if (line.startsWith('## ')) started = true
      if (started && line.trim() && !line.startsWith('##')) {
        const cleaned = line.replace(/^- /, '').trim()
        if (cleaned) changelogLines.push(cleaned)
      }
    }

    // Buscar versão anterior
    const configRef = db.collection('app-config').doc('version')
    const currentDoc = await configRef.get()
    const previousVersion = currentDoc.exists
      ? currentDoc.data().latestVersion
      : '0.0.0'

    // Atualizar Firestore
    await configRef.set(
      {
        currentVersion: previousVersion,
        latestVersion: newVersion,
        updateUrl: `https://play.google.com/store/apps/details?id=${process.env.ANDROID_PACKAGE_ID || 'com.garagem.inteligente'}`,
        changelog: changelogLines.filter((l) => l.length > 0),
        releaseDate: admin.firestore.Timestamp.now(),
        isCritical: false,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        updatedBy: 'automatic-ci-release'
      },
      { merge: false }
    )

    console.log(`✅ Firestore atualizado com versão ${newVersion}`)
    console.log(`📝 Changelog: ${changelogLines.length} itens`)

    // Finalizar Firebase
    await admin.app().delete()
  } catch (error) {
    console.error('❌ Erro ao publicar versão:', error.message)
    console.error(error)
    process.exit(1)
  }
}

publishVersion()
```

---

## Step 4️⃣: Criar GitHub Actions Workflow (5 min)

**Caminho:** `.github/workflows/release.yml`

```yaml
name: Semantic Release & Build

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build

      - name: 🤖 Semantic Release
        uses: cycjimmy/semantic-release-action@v4
        with:
          semantic_version: 21.1.1
          extra_plugins: |
            @semantic-release/changelog
            @semantic-release/exec
            @semantic-release/git
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GIT_AUTHOR_NAME: 'GitHub Actions'
          GIT_AUTHOR_EMAIL: 'actions@github.com'
          GIT_COMMITTER_NAME: 'GitHub Actions'
          GIT_COMMITTER_EMAIL: 'actions@github.com'

      - name: 🔔 Publish to Firebase
        run: node scripts/publish-version.js ${{ env.NEXTRELEASE_VERSION }}
        env:
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_JSON }}
          ANDROID_PACKAGE_ID: 'com.garagem.inteligente'
          VITE_FIREBASE_DATABASE_URL: ${{ secrets.VITE_FIREBASE_DATABASE_URL }}
```

---

## Step 5️⃣: Configurar GitHub Secrets (10 min)

### 5.1 - Obter FIREBASE_SERVICE_ACCOUNT_JSON

```powershell
# 1. Vá em Firebase Console
# → Project Settings
# → Service Accounts
# → Generate New Private Key

# 2. Arquivo baixa como firebase-service-account.json

# 3. Converta para base64:
$content = Get-Content "firebase-service-account.json" -Raw
$base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
$base64 | Set-Clipboard

# 4. Agora cola no GitHub Secrets
```

### 5.2 - Adicionar Secrets no GitHub

**Caminho:** GitHub → Repository → Settings → Secrets and variables → Actions

**Adicionar:**

| Secret Name | Valor |
|------------|-------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Base64 da chave Firebase (do passo 5.1) |
| `VITE_FIREBASE_DATABASE_URL` | `https://seu-projeto.firebaseio.com` |

---

## Step 6️⃣: Criar src/version.json (1 min)

**Caminho:** `src/version.json`

```json
{
  "version": "1.0.0",
  "buildNumber": 1,
  "releaseDate": "2025-10-24T00:00:00Z",
  "changelog": []
}
```

---

## Step 7️⃣: Validar Setup (3 min)

```powershell
# Verificar que semantic-release está instalado
pnpm list semantic-release

# Verificar que .releaserc.json existe
Test-Path "./.releaserc.json"

# Verificar que scripts existem
Test-Path "./scripts/update-version.js"
Test-Path "./scripts/publish-version.js"

# Verificar que workflow existe
Test-Path "./.github/workflows/release.yml"

# Verificar que src/version.json existe
Test-Path "./src/version.json"
```

---

## 🧪 Teste Piloto (10 min)

### Teste Local

```powershell
# 1. Fazer commit de teste
git commit --allow-empty -m "test: validando semantic-release

BREAKING CHANGE: teste piloto"

# 2. Fazer push
git push origin main

# 3. Ir em GitHub → Actions
# → Ver workflow "Semantic Release & Build" rodando
# → Aguardar conclusão

# 4. Verificar resultado:
# ✅ Nova tag v1.1.0 criada?
# ✅ CHANGELOG.md atualizado?
# ✅ src/version.json atualizado para 1.1.0?
# ✅ Firebase atualizado?
```

### Se Algo Falhar

```powershell
# Ver logs do workflow
# GitHub → Actions → Último workflow → Ver detalhes

# Erros comuns:
# 1. FIREBASE_SERVICE_ACCOUNT não em base64
#    Solução: Reconverter conforme passo 5.1

# 2. VITE_FIREBASE_DATABASE_URL errada
#    Solução: Verificar em Firebase Console

# 3. Scripts faltando
#    Solução: Garantir que estão em scripts/

# 4. Sem commits convencionais
#    Solução: Usar "fix:", "feat:", "breaking:"
```

---

## ✅ Checklist Final

- [ ] Dependências instaladas (`pnpm list semantic-release`)
- [ ] `.releaserc.json` criado na raiz
- [ ] `scripts/update-version.js` criado
- [ ] `scripts/publish-version.js` criado
- [ ] `.github/workflows/release.yml` criado
- [ ] `src/version.json` criado
- [ ] GitHub Secrets configurados:
  - [ ] `FIREBASE_SERVICE_ACCOUNT_JSON`
  - [ ] `VITE_FIREBASE_DATABASE_URL`
- [ ] Teste piloto realizado com sucesso
- [ ] Nova tag v1.1.0+ criada no Git
- [ ] CHANGELOG.md gerado
- [ ] Firebase atualizado com nova versão

---

## 📚 Próximos Passos

Depois que a automação estiver pronta:

1. ✅ Implementar composable `useAppVersion.ts`
2. ✅ Implementar store `appVersion.ts`
3. ✅ Implementar componente `UpdateBanner.vue`
4. ✅ Integrar em App.vue e HomePage
5. ✅ Rodar testes

Todos os detalhes em: [APP_UPDATE_NOTIFICATION_PRD.md](../prds/APP_UPDATE_NOTIFICATION_PRD.md)

---

## 🆘 Suporte

Se algo não funcionar:

1. Verificar logs do GitHub Actions (Actions → Último workflow)
2. Verificar se commits seguem padrão convencional
3. Validar Firebase Service Account (em base64)
4. Validar que não há erros em type-check/lint/build
5. Perguntar! 😊

**Criado:** 24 de outubro de 2025

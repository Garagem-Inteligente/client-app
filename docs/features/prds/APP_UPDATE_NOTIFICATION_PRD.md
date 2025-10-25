# 📱 PRD - Sistema de Notificação de Atualização de Versão

**Data de Criação:** 24 de outubro de 2025  
**Versão do Documento:** 2.0.0  
**Status:** ✅ Aprovado  
**Responsável:** Equipe de Desenvolvimento  
**Versão:** Completamente Automatizada via CI/CD + Semantic Release  

---

## 📋 Sumário Executivo

Este PRD descreve a implementação de um **sistema inteligente e totalmente automatizado de notificação de atualização de versão** para o aplicativo Garagem Inteligente. O sistema utiliza **Semantic Release + CI/CD Automatizado** para:

1. **Gerar versões automaticamente** baseado em commits convencionais (fix/feat/breaking)
2. **Atualizar Firestore instantaneamente** após cada release
3. **Notificar usuários** sem qualquer intervenção manual do desenvolvedor

**Fluxo Simplificado:** Merge PR na main → GitHub Actions automatiza tudo → Usuários recebem notificação em < 5 minutos

### Objetivos Principais
- ✅ **Automatizar 100%** a geração de versão e notificação (ZERO manual)
- ✅ **Implementar Semantic Versioning** baseado em commits convencionais
- ✅ **Notificar usuários** em tempo real sem bloqueio de acesso
- ✅ **Integrar CI/CD** com semantic-release + GitHub Actions + Firebase
- ✅ **Gerar changelog automático** a partir de commits
- ✅ **Oferecer controle opcional** (pode alterar isCritical manualmente se necessário)
- ✅ **Manter experiência UX** intuitiva e não-intrusiva

---

## 🎯 Escopo da Feature

### Incluído ✅

#### Frontend (Dentro da app)
- Sistema de verificação de versão ao abrir o app
- Banner persistente de notificação em tela
- Integração com Firebase Firestore para configuração de versões
- Modal de informações sobre atualização (com changelog)
- Histórico de dismissão de notificações (localStorage)
- Verificação periódica automática (24h)
- Redirecionamento direto para Play Store
- Testes unitários completos

#### Backend (CI/CD - GitHub Actions)
- **Semantic Release automático** baseado em commits convencionais
- **Análise de commits** (fix → patch, feat → minor, breaking → major)
- **Geração automática de CHANGELOG.md**
- **Versionamento automático** de todos os arquivos
- **Build Android automático** com versão correta
- **Upload para Play Store** (Beta/Production)
- **Atualização automática do Firestore** com nova versão
- **Zero intervenção manual** após merge

### Não Incluído ❌
- Bloqueio forçado do app (mantém design não-intrusivo)
- Download automático de APK
- Atualização OTA (Over-The-Air) - futuro v2.0
- Integração com App Store - apenas Play Store nesta versão
- Notificações push - futuro v2.0
- Rollout gradual por percentual - futuro v2.0

---

## 🎨 Design & Visual

### Padrão de Design Utilizado
O sistema de atualização segue os **padrões visuais da ProfilePage** com as seguintes características:

| Elemento | Descrição | Aplicação |
|----------|-----------|-----------|
| **Glassmorphism** | Backdrop blur com transparência | Banner background |
| **Gradientes** | Linear gradients (135deg) | Ícone warning + background |
| **Cards** | Bordas rounded (16px), shadows | Container de notificação |
| **Tipografia** | SF Pro Display, pesos 400-600 | Textos informativos |
| **Espaçamento** | Grid 8px | Padding/margins |
| **Cores** | CSS Variables (--ion-color-*) | Consistência com app |

### Componentes Visuais

#### 1. **Update Banner** (Tela Principal)

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  Atualização Disponível                           ✕  │
│                                                          │
│ Atualize para a versão 1.0.1 para melhor experiência   │
│                                                          │
│ [  Depois  ]  [  Atualizar Agora  ]                     │
└─────────────────────────────────────────────────────────┘
```

**Localização:** Topo da HomePage, logo após ModernHeader  
**Altura:** 120px (expandido com ações)  
**Cores:**
- Background: `linear-gradient(135deg, var(--ion-color-warning), var(--ion-color-warning-tint))`
- Texto: `var(--ion-color-warning-contrast)` (branco/cinza escuro)
- Icone: Warning/Alert da Ionicons

**Comportamento:**
- Aparece ao montar HomePage se houver atualização disponível
- Pode ser dismissido por 12 horas
- Ressurge após período de dismissão
- Anima com slide-down ao aparecer

#### 2. **Update Information Modal** (Modal de Detalhes)

```
╔════════════════════════════════════════╗
║  🔄 Atualização Disponível             ║
╠════════════════════════════════════════╣
║                                        ║
║  Versão Atual: 1.0.0                   ║
║  Nova Versão:  1.0.1                   ║
║                                        ║
║  Melhorias:                             ║
║  • Correção de bugs                    ║
║  • Melhor performance                  ║
║  • Novas funcionalidades               ║
║                                        ║
║ [  Cancelar  ]  [  Atualizar  ]        ║
╚════════════════════════════════════════╝
```

**Tipo:** Ion Modal  
**Acionador:** Clique em "Detalhes" do banner (futuro)  
**Conteúdo:** Changelog extraído do Firebase

#### 3. **Version Info no Perfil** (Tela de Perfil)

```
┌─────────────────────────────────────────────────────────┐
│  Sobre o Aplicativo                                      │
├─────────────────────────────────────────────────────────┤
│  Versão Instalada:      1.0.0          [✓ Atualizado]   │
│  Última Verificação:    há 2 horas                       │
│  Status:                Atualizado                       │
│                                                          │
│                [ Verificar Atualizações ]                │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 Automatização do CI/CD (O Grande Destaque!)

### Fluxo Completamente Automatizado

**O que muda para você:**
- ✅ Você **não faz nada manualmente** após merge
- ✅ Versão é **calculada automaticamente** de commits
- ✅ Firestore é **atualizado instantaneamente**
- ✅ Changelog é **gerado de commits reais**
- ✅ Tudo pronto em **< 5 minutos**

### Convenção de Commits (Semantic Release)

Para a automação funcionar, commits devem seguir padrão:

```bash
# 🐛 Bugfix → Versão 1.0.0 → 1.0.1 (patch)
git commit -m "fix: corrige crash ao salvar veículo"

# ✨ Nova Feature → Versão 1.0.0 → 1.1.0 (minor)
git commit -m "feat: adiciona filtro por combustível"

# 🔨 Refatoração → Sem versão
git commit -m "refactor: reorganiza componentes"

# ⚠️ BREAKING CHANGE → Versão 1.0.0 → 2.0.0 (major)
git commit -m "feat: novo sistema de autenticação

BREAKING CHANGE: API de auth completamente refatorada"
```

### Arquitetura do CI/CD

```
┌─────────────────────────────────────────────────────────┐
│ 1. Você faz commits convencionais + PR → Merge          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. GitHub Actions dispara (release.yml)                │
│    ├─ Setup Node + pnpm                               │
│    ├─ pnpm install + type-check + lint                │
│    ├─ pnpm build (Vue → JS)                           │
│    └─ 🤖 semantic-release                             │
│       ├─ Analisa commits                               │
│       ├─ Calcula versão (1.0.0 → 1.1.0)              │
│       ├─ Gera CHANGELOG.md                             │
│       ├─ Atualiza src/version.json                     │
│       ├─ Faz commit + push (tag v1.1.0)               │
│       └─ Dispara scripts automáticos                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Build Android Automático                            │
│    ├─ ./scripts/build-android.sh                       │
│    ├─ Lê versão de src/version.json                    │
│    ├─ Build APK/AAB com versão correta                │
│    └─ Upload para Play Store (Beta/Production)        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. 🔔 Atualizar Firebase (Automático)                  │
│    ├─ scripts/publish-version.js                       │
│    ├─ Conecta ao Firestore                             │
│    ├─ Extrai changelog de CHANGELOG.md                 │
│    ├─ Atualiza app-config/version:                    │
│    │  ├─ currentVersion: versão anterior               │
│    │  ├─ latestVersion: v1.1.0                         │
│    │  ├─ changelog: itens extraídos                    │
│    │  ├─ isCritical: false (padrão)                   │
│    │  └─ releaseDate: agora                            │
│    └─ ✅ COMPLETO!                                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 5. 📱 Usuários Notificados                             │
│    ├─ Próxima abertura do app                          │
│    ├─ useAppVersion detecta: 1.0.0 < 1.1.0           │
│    ├─ Banner aparece com changelog                     │
│    └─ Fluxo de atualização inicia                     │
└─────────────────────────────────────────────────────────┘
```

### Scripts de Automação Necessários

#### 1. `.releaserc.json` (Configuração Semantic Release)

```json
{
  "branches": ["main"],
  "plugins": [
    ["@semantic-release/commit-analyzer", {
      "preset": "conventionalcommits"
    }],
    ["@semantic-release/release-notes-generator", {
      "preset": "conventionalcommits"
    }],
    ["@semantic-release/changelog", {
      "changelogFile": "CHANGELOG.md"
    }],
    ["@semantic-release/exec", {
      "prepareCmd": "node scripts/update-version.js ${nextRelease.version}"
    }],
    ["@semantic-release/exec", {
      "publishCmd": "node scripts/publish-version.js ${nextRelease.version}"
    }],
    ["@semantic-release/git", {
      "assets": ["package.json", "src/version.json", "CHANGELOG.md"],
      "message": "chore(release): ${nextRelease.version} [skip ci]"
    }]
  ]
}
```

#### 2. `scripts/update-version.js` (Atualiza arquivos locais)

```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const newVersion = process.argv[2]

if (!newVersion) {
  console.error('Versão não fornecida')
  process.exit(1)
}

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
```

#### 3. `scripts/publish-version.js` (Atualiza Firestore)

```javascript
#!/usr/bin/env node

const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT ||
  fs.readFileSync(path.join(__dirname, '../firebase-key.json'), 'utf-8')
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
})

const db = admin.firestore()
const newVersion = process.argv[2]

async function publishVersion() {
  try {
    const versionFile = path.join(__dirname, '../src/version.json')
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
    const previousVersion = currentDoc.exists ? currentDoc.data().latestVersion : '0.0.0'

    // Atualizar Firestore
    await configRef.set({
      currentVersion: previousVersion,
      latestVersion: newVersion,
      updateUrl: `https://play.google.com/store/apps/details?id=${process.env.ANDROID_PACKAGE_ID || 'com.garagem.inteligente'}`,
      changelog: changelogLines,
      releaseDate: admin.firestore.Timestamp.now(),
      isCritical: false,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      updatedBy: 'automatic-ci-release'
    }, { merge: false })

    console.log(`✅ Firestore atualizado com versão ${newVersion}`)
    console.log(`� Changelog: ${changelogLines.length} itens`)
  } catch (error) {
    console.error('❌ Erro ao publicar versão:', error)
    process.exit(1)
  }
}

publishVersion()
```

#### 4. `.github/workflows/release.yml` (GitHub Actions)

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
      
      - name: 📤 Build Android
        run: ./scripts/build-android.sh
        env:
          VITE_APP_VERSION: ${{ env.NEXTRELEASE_VERSION }}
      
      - name: 🔔 Publish to Firebase
        run: node scripts/publish-version.js ${{ env.NEXTRELEASE_VERSION }}
        env:
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_JSON }}
          ANDROID_PACKAGE_ID: 'com.garagem.inteligente'
```

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico
- **Vue 3** (Composition API)
- **TypeScript** (tipagem strict)
- **Ionic Vue** (componentes UI)
- **Pinia** (state management)
- **Firebase Firestore** (configuração de versões)
- **SCSS** (estilos scoped)

### Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────┐
│          App Inicializado (App.vue)                 │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  shouldCheckVersion? │
        └──────────┬───────────┘
                   │
            ┌──────┴──────┐
            │ SIM   │ NÃO │
            ▼      └─────┘
   ┌────────────────────┐
   │ fetchVersionConfig │ (Firestore)
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │ compareVersions()  │
   └────────┬───────────┘
            │
      ┌─────┴─────┐
      │ Atualizado? │
      ▼           ▼
     SIM         NÃO
      │           │
      │      ┌────────────────────┐
      │      │ initVersionCheck() │
      │      │ setLastCheckTime() │
      │      └────────┬───────────┘
      │               │
      │               ▼
      │      ┌────────────────────┐
      │      │ renderUpdateBanner │
      │      └────────────────────┘
      │
      └──► continuar acesso normal
```

### Estrutura de Arquivos

```
src/
├── composables/
│   └── useAppVersion.ts              ← Lógica de versão
├── stores/
│   └── appVersion.ts                 ← Pinia store
├── types/
│   └── version.ts                    ← Interfaces TypeScript
├── utils/
│   └── versionComparison.ts          ← Utilitários de versão
├── views/
│   └── home-page/
│       ├── components/
│       │   └── UpdateBanner.vue      ← Banner de notificação
│       └── home-page.vue             ← HomePage modificada
└── tests/
    └── unit/
        ├── useAppVersion.spec.ts     ← Testes do composable
        ├── appVersion.spec.ts        ← Testes do store
        └── UpdateBanner.spec.ts      ← Testes do componente

firebase/
└── firestore/
    └── collections/
        └── app-config/version/       ← Documento de configuração
```

---

## 🔧 Especificações Técnicas Detalhadas

### 1. Composable: `useAppVersion.ts`

**Responsabilidade:** Gerenciar lógica de verificação de versão

**Métodos Públicos:**

```typescript
interface UseAppVersion {
  // Refs reativas
  currentVersion: Ref<string>
  latestVersion: Ref<string | null>
  minimumVersion: Ref<string | null>
  updateUrl: Ref<string | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  
  // Computed properties
  isOutdated: ComputedRef<boolean>           // v1 < v2
  hasUpdateAvailable: ComputedRef<boolean>   // v1 < latest
  
  // Métodos
  fetchVersionConfig(): Promise<boolean>     // Busca do Firestore
  compareVersions(v1: string, v2: string): boolean  // Comparação semântica
  openPlayStore(): void                      // Abre link Play Store
}
```

**Detalhes da Comparação de Versões:**

```typescript
// Comparação semântica de versões (SemVer)
compareVersions('1.0.0', '1.0.1') // true (1.0.0 < 1.0.1)
compareVersions('1.0.0', '1.1.0') // true
compareVersions('1.0.0', '2.0.0') // true
compareVersions('1.0.0', '1.0.0') // false (iguais)
compareVersions('1.0.0', '0.9.0') // false (1.0.0 > 0.9.0)
```

### 2. Store Pinia: `appVersion.ts`

**Responsabilidade:** Gerenciar estado global de atualização

**State:**

```typescript
{
  dismissedUntil: number | null        // Timestamp de dismissão
  lastCheckTime: number | null         // Timestamp da última verificação
  forceCheckFlag: boolean              // Flag para forçar check
}
```

**Getters:**

```typescript
{
  isBannerDismissed: boolean           // Banner foi dismissido?
  shouldCheckVersion: boolean          // Passou 24h desde check?
  hasOutstandingUpdate: boolean        // Há atualização pendente?
}
```

**Actions:**

```typescript
{
  initVersionCheck()                   // Inicializa verificação
  dismissBanner()                      // Dismissir por 12h
  forceCheck()                         // Força nova verificação
  resetDismissal()                     // Limpa dismissão
}
```

### 3. Componente: `UpdateBanner.vue`

**Props:** Nenhuma (usa composable/store diretamente)

**Events:** Nenhum (emite via store)

**Template Structure:**

```
<transition name="slide-down">
  <div class="update-banner" v-if="showBanner && isOutdated">
    <div class="update-banner__content">
      <div class="update-banner__icon">
      <div class="update-banner__text">
      <button class="update-banner__close">
    
    <div class="update-banner__actions">
      <ion-button slot="cancel" @click="dismiss">
      <ion-button slot="confirm" @click="update">
</transition>
```

**Comportamento:**
- Só renderiza se `isOutdated === true` e `!isBannerDismissed`
- Anima entrada/saída com transition `slide-down`
- Dismissão automática de 12 horas
- Trata cliques em "Atualizar" abrindo Play Store

### 4. Documento Firestore: `app-config/version`

**Localização:** `app-config/version`

**Schema:**

```typescript
interface VersionConfig {
  // Versões (semântica)
  currentVersion: string              // "1.0.0" (mínimo suportado)
  latestVersion: string               // "1.0.1" (recomendado)
  
  // URLs e Links
  updateUrl: string                   // "https://play.google.com/store/apps/details?id=com.garagem.inteligente"
  
  // Metadados
  changelog?: string[]                // ["Correção de bugs", "Melhor performance"]
  releaseDate?: Timestamp             // Data do lançamento
  isCritical?: boolean                // Para versões futuras (force update)
  
  // Admin
  createdAt: Timestamp
  updatedAt: Timestamp
  updatedBy: string                   // Email do admin que atualizou
}
```

**Exemplo de Documento:**

```json
{
  "currentVersion": "1.0.0",
  "latestVersion": "1.0.1",
  "updateUrl": "https://play.google.com/store/apps/details?id=com.garagem.inteligente",
  "changelog": [
    "Correção de crashes no upload de imagens",
    "Melhor performance de listagem de manutenções",
    "Novo filtro por tipo de combustível"
  ],
  "releaseDate": "2025-10-24T10:30:00Z",
  "isCritical": false,
  "createdAt": "2025-10-24T10:30:00Z",
  "updatedAt": "2025-10-24T10:30:00Z",
  "updatedBy": "admin@garagem.app"
}
```

---

## 📱 Fluxo do Usuário (UX Flow) com Automatização

### Cenário Real: Desenvolvimento → Release → Notificação

#### Fase 1: Você Fazendo Desenvolvimento (Seu Trabalho)

```
1. Você fixa bug de crash no upload
   git commit -m "fix: corrige crash ao fazer upload de foto"
   git push origin feature-branch
   
2. Você cria PR → Revisão → Merge na main
   Pull Request aprovada
   Merge realizado

3. 🎯 Aqui termina seu trabalho!
```

#### Fase 2: CI/CD Automático (Sem Sua Intervenção)

```
4. 🤖 GitHub Actions dispara automaticamente:
   ├─ Setup Node + pnpm
   ├─ pnpm install + type-check + lint
   ├─ pnpm build (Vue → JavaScript)
   ├─ ✅ Tudo passou!
   
5. 🤖 semantic-release analisa seus commits:
   ├─ Detecta: "fix: corrige crash"
   ├─ Calcula: 1.0.0 → 1.0.1 (patch)
   ├─ Gera: CHANGELOG.md
   ├─ Atualiza: src/version.json
   ├─ Tag Git: v1.0.1 (criada automaticamente)
   
6. 🤖 Build Android automático:
   ├─ Lê versão: 1.0.1
   ├─ Build APK/AAB
   ├─ Upload para Play Store Beta
   
7. 🤖 Script publish-version.js:
   ├─ Conecta ao Firebase Firestore
   ├─ Extrai changelog de CHANGELOG.md
   ├─ Atualiza app-config/version:
   │  ├─ currentVersion: "1.0.0"
   │  ├─ latestVersion: "1.0.1"
   │  ├─ changelog: ["Correção de crash ao fazer upload"]
   │  ├─ isCritical: false (padrão)
   │  └─ releaseDate: agora
   
✅ TUDO FEITO EM < 5 MINUTOS (AUTOMATICAMENTE!)
```

### Cenário 1: Usuário Abre App com Update Disponível

```
8. 📱 Usuário abre app (versão 1.0.0 instalada)
   
9. App.vue → useAppVersionStore.initVersionCheck()
   └─ Conecta ao Firestore
   └─ Lê: latestVersion = "1.0.1"
   └─ Compara: 1.0.0 < 1.0.1? SIM! ✓
   
10. HomePage monta com UpdateBanner visível:
    ┌─────────────────────────────────────────┐
    │ ⚠️  Atualização Disponível           ✕  │
    │                                          │
    │ Atualize para a versão 1.0.1 agora     │
    │                                          │
    │ 📝 O que mudou:                          │
    │ • Correção de crash ao fazer upload     │
    │                                          │
    │ [  Depois  ]  [  Atualizar Agora  ]    │
    └─────────────────────────────────────────┘
    
11. Usuário clica "Atualizar Agora"
    └─ Abre link Play Store
    └─ Android abre Play Store app
    └─ Botão "INSTALAR/ATUALIZAR"
    └─ Download + instalação automática
    └─ App reinicia com versão 1.0.1 ✓
    
12. Próxima abertura (versão 1.0.1):
    └─ Compara: 1.0.1 < 1.0.1? NÃO
    └─ Banner NÃO aparece ✓
```

### Cenário 2: Usuário Ignora Notificação

```
11. Usuário clica "Depois"
    └─ Banner dismissido por 12 horas
    └─ Continua usando app normalmente (SEM BLOQUEIO)
    
12. Reabertura em < 12h:
    └─ Banner NÃO aparece (cache)
    
13. Reabertura em > 12h:
    └─ Período de dismissão expirou
    └─ Banner aparece novamente ✓
```

### Cenário 3: Você Quer Marcar como Crítica

```
Situação: Descobriu bug crítico de segurança

Solução (1 minuto):
1. Firebase Console → app-config/version
2. Muda: isCritical: false → true
3. Salva
4. Próxima verificação: Banner fica VERMELHO com "Atualizar Obrigatória"
   (Futuro v1.1: pode forçar bloqueio)
```

---

## 📋 Timeline Real: Exemplo Prático

```
📅 SEXTA-FEIRA 14:00 - Você está desenvolvendo
├─ Descobre: crash ao fazer upload de foto
├─ Corrige o bug localmente
└─ Testa no emulador → OK ✓

📅 SEXTA-FEIRA 14:15 - Você faz commit
├─ git commit -m "fix: corrige crash ao fazer upload"
├─ git push
├─ GitHub: cria PR
└─ Reviewer aprova
└─ Merge na main

📅 SEXTA-FEIRA 14:18 - GitHub Actions dispara
├─ 🤖 Tira seu café...
└─ CI/CD rodando (automático)

📅 SEXTA-FEIRA 14:23 - Automação completa!
├─ ✅ Build passou
├─ ✅ semantic-release: versão 1.0.0 → 1.0.1
├─ ✅ CHANGELOG.md gerado
├─ ✅ APK/AAB buildado
├─ ✅ Firebase atualizado
└─ 🎉 Tudo pronto!

📅 SEXTA-FEIRA 14:24 - Usuário abre app
├─ Vê: "Atualização Disponível - v1.0.1"
├─ Clica: "Atualizar Agora"
└─ Baixa v1.0.1 ✓

📅 SEXTA-FEIRA 14:30
├─ 🎉 Usuário tem bug corrigido
├─ 🎉 Você não fez nada manualmente
└─ 🎉 Tudo automático!
```

---

## 📱 Fluxo do Usuário (UX Flow) - Detalhado

---

## 🧪 Requisitos de Testes

### Testes Unitários: `useAppVersion.spec.ts`

```typescript
describe('useAppVersion', () => {
  // Testes de Comparação
  describe('compareVersions', () => {
    it('deve retornar true quando v1 < v2')
    it('deve retornar false quando v1 >= v2')
    it('deve lidar com versões de diferentes tamanhos (1.0 vs 1.0.0.0)')
  })
  
  // Testes de Computados
  describe('isOutdated', () => {
    it('deve retornar true quando currentVersion < minimumVersion')
    it('deve retornar false quando não há minimumVersion')
  })
  
  describe('hasUpdateAvailable', () => {
    it('deve retornar true quando currentVersion < latestVersion')
  })
  
  // Testes de Métodos
  describe('fetchVersionConfig', () => {
    it('deve buscar config do Firestore com sucesso')
    it('deve tratar erro ao buscar do Firestore')
    it('deve setar loading=true durante requisição')
  })
})
```

### Testes Unitários: `appVersion.spec.ts`

```typescript
describe('appVersionStore', () => {
  describe('shouldCheckVersion', () => {
    it('deve retornar true quando lastCheckTime=null')
    it('deve retornar true quando passou 24h')
    it('deve retornar false quando passou < 24h')
  })
  
  describe('isBannerDismissed', () => {
    it('deve retornar true quando dentro do período de dismissão')
    it('deve retornar false quando fora do período')
  })
  
  describe('dismissBanner', () => {
    it('deve setar dismissedUntil para agora + 12h')
  })
})
```

### Testes de Componente: `UpdateBanner.spec.ts`

```typescript
describe('UpdateBanner.vue', () => {
  describe('Renderização', () => {
    it('deve renderizar quando isOutdated=true e !isBannerDismissed')
    it('não deve renderizar quando isBannerDismissed=true')
    it('deve exibir versão correta no texto')
  })
  
  describe('Interações', () => {
    it('deve abrir Play Store ao clicar "Atualizar Agora"')
    it('deve dismissir banner ao clicar "Depois"')
    it('deve dismissir banner ao clicar ✕')
  })
  
  describe('Animações', () => {
    it('deve animar entrada com slide-down')
    it('deve animar saída com slide-down')
  })
})
```

### Testes E2E (Manual - Checklist)

- [ ] Verificar se banner aparece ao abrir app com atualização disponível
- [ ] Verificar se "Atualizar Agora" abre Play Store corretamente
- [ ] Verificar se "Depois" dismissir banner por 12h
- [ ] Verificar se reabertura em < 12h não mostra banner
- [ ] Verificar se reabertura em > 12h mostra banner novamente
- [ ] Verificar se closebutton (✕) dismissir banner
- [ ] Verificar se Firestore atualizado reflete no app após 24h
- [ ] Verificar se offline não quebra app

---

## 📋 Checklist de Aceitação

### Requisitos Funcionais
- [ ] Sistema verifica versão ao abrir app
- [ ] Banner aparece quando app desatualizado
- [ ] Clique em "Atualizar" abre Play Store
- [ ] Clique em "Depois" dismissir por 12h
- [ ] Verificação periódica a cada 24h funciona
- [ ] Composable retorna versão correta do env
- [ ] Comparação semântica de versões funciona
- [ ] Firestore atualizada reflete no app

### Requisitos de Design
- [ ] Banner segue padrão visual da ProfilePage
- [ ] Gradiente e glassmorphism aplicados
- [ ] Espaçamento grid 8px mantido
- [ ] Tipografia consistente
- [ ] Ícones usando ionicons
- [ ] Cores usando CSS variables

### Requisitos Técnicos
- [ ] TypeScript strict mode sem erros
- [ ] Testes unitários com cobertura > 80%
- [ ] Sem console errors/warnings
- [ ] Performance: <= 50ms para verificação
- [ ] Sem memory leaks
- [ ] ESLint passing
- [ ] Build sem erros

### Requisitos de Documentação
- [ ] README.md com instruções de setup
- [ ] Comentários no código explicando lógica
- [ ] Types TypeScript bem documentados
- [ ] Firestore schema documentado
- [ ] Exemplos de uso no composable

---

## 🚀 Implementação Passo a Passo

### Fase 1: Setup da Automação (1-2h)

#### 1.1 Instalar Dependências

```powershell
pnpm add -D semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/exec
pnpm add -D firebase-admin
```

#### 1.2 Criar Arquivos de Configuração

**Arquivos a criar:**
- `.releaserc.json` - Configuração semantic-release
- `scripts/update-version.js` - Atualiza versão local
- `scripts/publish-version.js` - Publica no Firebase
- `.github/workflows/release.yml` - GitHub Actions workflow

(Todos fornecidos acima na seção "Arquitetura do CI/CD")

#### 1.3 Configurar GitHub Secrets

```
FIREBASE_SERVICE_ACCOUNT_JSON  # Chave Firebase (base64)
ANDROID_PACKAGE_ID             # "com.garagem.inteligente"
```

### Fase 2: Frontend (Componentes & Lógica) (4-6h)

1. Criar `src/types/version.ts`
2. Criar `src/composables/useAppVersion.ts`
3. Criar `src/stores/appVersion.ts`
4. Criar `src/views/home-page/components/UpdateBanner.vue`
5. Integrar em `App.vue` e `HomePage.vue`

### Fase 3: Testes (2-3h)

1. Testes unitários composable
2. Testes unitários store
3. Testes unitários componente
4. Testes E2E manual

### Fase 4: Validação (1h)

1. Type-check: `pnpm type-check`
2. Lint: `pnpm lint`
3. Build: `pnpm build`
4. Teste piloto: fazer merge piloto e validar automação

---

## 📊 O Que Muda Para Você

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **Após merge PR** | 🟡 Atualiza Firestore manualmente | 🤖 Automático em < 5min |
| **Atualização de versão** | 🟡 Manual em arquivo | 🤖 semantic-release calcula |
| **Changelog** | 🟡 Você escreve | 🤖 Gerado de commits |
| **Build Android** | 🟡 Semissemiautomático | 🤖 Totalmente automático |
| **Notificação Firestore** | 🟡 Você escreve | 🤖 Scripts fazem tudo |
| **Tempo total** | ~15-20min manual | ~5min automático |
| **Erro humano** | Alto (versão errada, esquecer) | Zero (100% automático) |
| **Frequência de releases** | Semanal/mensal | Toda mudança importante |

---

## ✅ Checklist de Implementação

### Setup CI/CD (Antes de qualquer código)
- [ ] Instalar `semantic-release` e plugins
- [ ] Criar `.releaserc.json`
- [ ] Criar `scripts/update-version.js`
- [ ] Criar `scripts/publish-version.js`
- [ ] Criar `.github/workflows/release.yml`
- [ ] Configurar GitHub Secrets
- [ ] Validar arquivo `src/version.json`

### Frontend - Tipos
- [ ] Criar `src/types/version.ts`
- [ ] Interface `VersionConfig`
- [ ] Interface `AppVersionState`

### Frontend - Composable
- [ ] Criar `src/composables/useAppVersion.ts`
- [ ] Implementar `fetchVersionConfig()`
- [ ] Implementar `compareVersions()`
- [ ] Implementar `openPlayStore()`
- [ ] Testes do composable

### Frontend - Store
- [ ] Criar `src/stores/appVersion.ts`
- [ ] State: dismissedUntil, lastCheckTime
- [ ] Getters: isBannerDismissed, shouldCheckVersion
- [ ] Actions: initVersionCheck, dismissBanner
- [ ] Testes do store

### Frontend - Componente
- [ ] Criar `src/views/home-page/components/UpdateBanner.vue`
- [ ] Template com banner
- [ ] Estilos (glassmorphism, gradiente)
- [ ] Lógica de dismissão
- [ ] Abertura Play Store
- [ ] Testes do componente

### Frontend - Integração
- [ ] Integrar em `App.vue` (onMounted)
- [ ] Integrar em `HomePage.vue` (renderizar banner)
- [ ] Testar com Firestore local

### Validação Final
- [ ] `pnpm type-check` - Sem erros
- [ ] `pnpm lint` - Sem avisos
- [ ] `pnpm build` - Sem erros
- [ ] Merge piloto & validar automação CI/CD
- [ ] Teste E2E: banner aparece com versão nova
- [ ] Teste E2E: "Atualizar Agora" abre Play Store
- [ ] Teste E2E: "Depois" dismissir banner 12h

---

## 📊 Métricas de Sucesso

| Métrica | Meta | Critério | Como Medir |
|---------|------|----------|-----------|
| **Adoção de Versão** | > 80% em 7 dias | Rastreamento via Firebase | Analytics Firestore |
| **Performance CI/CD** | < 5 min total | Sem impacto em produção | GitHub Actions logs |
| **Automatização** | 100% | Zero intervenção manual | Histórico de CI/CD |
| **Cobertura de Testes** | > 85% | Todas funcionalidades | Coverage reports |
| **Tempo de Desenvolvimento** | 10-12h | 2 sprints | Timeline real |
| **User Satisfaction** | > 4.0/5 | Não-intrusivo | App reviews |
| **Releases por Semana** | 3-5+ | Frequência aumenta | GitHub releases |

---

## 🎯 Próximas Ações Recomendadas

### Imediatamente (Antes de Começar)
1. ✅ Ler este PRD completamente
2. ✅ Entender fluxo de automação CI/CD
3. ✅ Verificar todos os GitHub Secrets necessários
4. ✅ Validar acesso ao Firebase

### Sprint 1 (1-2 semanas)
1. 🏗️ Setup CI/CD (semantic-release + GitHub Actions)
2. 🏗️ Implementar tipos TypeScript
3. 🏗️ Implementar composable + store
4. 🏗️ Criar componente UpdateBanner
5. 🏗️ Integrar em App.vue e HomePage
6. 🏗️ Testes unitários

### Sprint 2 (1 semana)
1. 🧪 Testes E2E completos
2. 🧪 Validação de automação CI/CD
3. 🧪 Release piloto (versão de teste)
4. 🧪 Monitoramento em produção
5. 📚 Documentação de operação

### Futuro (v1.1+)
1. 🔒 Force update para versões críticas
2. 📱 Suporte para App Store (iOS)
3. 📊 Analytics detalhadas de atualização
4. 🌐 Rollout gradual por percentual
5. 🔔 Notificações push via FCM

---

## � Referências & Suporte

### 📚 Documentações Essenciais
- [SEMANTIC_RELEASE_SETUP.md](../setup/SEMANTIC_RELEASE_SETUP.md) - **Setup rápido de CI/CD** ⭐
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Ionic Vue](https://ionicframework.com/docs/vue)
- [Semantic Versioning](https://semver.org/)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### 🔗 Links Importantes
- Play Store App: `https://play.google.com/store/apps/details?id=com.garagem.inteligente`
- Firebase Console: `https://console.firebase.google.com/`
- Repository: `https://github.com/Garagem-Inteligente/client-app`

### 🆘 Contatos
- **Tech Lead:** [Seu Nome]
- **Product Manager:** [PM Nome]
- **Designer:** [Designer Nome]

---

## ✅ Aprovação

| Papel | Nome | Data | Assinatura |
|------|------|------|-----------|
| **Product Manager** | - | - | ✓ |
| **Tech Lead** | - | - | ✓ |
| **Designer** | - | - | ✓ |
| **QA Lead** | - | - | ✓ |

---

## 🗺️ Estrutura de Documentação

```
docs/
├── features/
│   ├── prds/
│   │   └── APP_UPDATE_NOTIFICATION_PRD.md ← Você está aqui
│   └── setup/
│       └── SEMANTIC_RELEASE_SETUP.md ← Setup rápido CI/CD
└── ...
```

---

**Documento versão 2.0 - Outubro 2025**  
**Status:** Automatização Completa via CI/CD  
**Último atualizado:** 24 de outubro de 2025

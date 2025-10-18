# 🚀 CI/CD Flow - Garagem Inteligente

## 📋 Visão Geral

Este documento descreve o fluxo completo de CI/CD do projeto Garagem Inteligente.

## 🔄 Workflow Triggers

O pipeline é acionado automaticamente em:

1. **Push para branches principais:**
   - `master`
   - `main`

2. **Pull Requests para:**
   - `master`
   - `main`

3. **Execução Manual:**
   - Via GitHub Actions UI (workflow_dispatch)

## 🏗️ Jobs do Pipeline

### 1. 🔍 Debug Info
- Exibe informações do evento que acionou o workflow
- Útil para debugging e auditoria
- **Duração estimada:** < 1 minuto

### 2. 🔍 Quality Check
- **Dependências:** debug-info
- **Executa em:** Todos os eventos (push, PR, manual)
- **Steps:**
  - Checkout do código
  - Setup do pnpm (v8)
  - Setup do Node.js (v20)
  - Instalação de dependências
  - Type checking (`pnpm run type-check`)
  - Build check (`pnpm run build`)
- **Duração estimada:** 3-5 minutos

### 3. 🌐 Deploy Web
- **Dependências:** quality-check
- **Executa em:** Apenas em push (não em PRs)
- **Steps:**
  - Checkout do código
  - Setup do ambiente (pnpm + Node.js)
  - Instalação de dependências
  - Geração de informações de versão
  - Build da aplicação
  - Deploy para Firebase Hosting
  - Criação de summary do deployment
- **Deploy para:**
  - 🌐 **Domínio Principal:** https://app.garageminteligente.com.br
  - 🔥 **Firebase Hosting:** https://app-garageminteligente.web.app
- **Duração estimada:** 5-7 minutos

### 4. 📱 Build Android
- **Dependências:** quality-check
- **Executa em:** Apenas em push (não em PRs)
- **Steps:**
  - Checkout do código
  - Setup do ambiente (pnpm, Node.js, Java 17)
  - Instalação de dependências
  - Geração de informações de versão
  - Build dos assets web
  - Sync do Capacitor
  - Build do APK Android (Debug)
  - Upload do APK como artifact
  - Criação de summary do build
- **Artifact:** `android-apk-{VERSION}`
- **Retenção:** 30 dias
- **Duração estimada:** 10-15 minutos

### 5. 🏷️ Create Release
- **Dependências:** deploy-web, build-android
- **Executa em:** Apenas em push (não em PRs)
- **Steps:**
  - Checkout do código
  - Geração da versão
  - Download do APK Android
  - Criação de GitHub Release
  - Anexa o APK ao release
- **Duração estimada:** 1-2 minutos

## 📦 Versionamento

O sistema de versionamento é automático e baseado em:

```bash
VERSION="v{YYYY.MM.DD}-{SHORT_SHA}"
```

**Exemplo:** `v2025.10.17-3ec171d`

### Informações de Versão

Cada build gera um arquivo `src/version.json` com:

```json
{
  "version": "v2025.10.17-3ec171d",
  "buildNumber": "42",
  "buildDate": "2025-10-17T14:30:00Z",
  "gitSha": "3ec171d...",
  "gitRef": "refs/heads/master",
  "platform": "web" | "android"
}
```

## 🔐 Secrets Necessários

Certifique-se de configurar os seguintes secrets no GitHub:

1. **GITHUB_TOKEN** (automático)
   - Usado para criar releases e comentários em PRs

2. **FIREBASE_SERVICE_ACCOUNT**
   - Credenciais do Firebase para deploy
   - Obtido via `firebase login:ci`

## 🌐 Firebase Hosting

### Configuração Atual

- **Site ID:** `app-garageminteligente`
- **Project ID:** `autocare-platform`
- **Domínio Personalizado:** `app.garageminteligente.com.br`
- **Pasta de Deploy:** `dist/`

### Domínio Personalizado

Para configurar o domínio personalizado:

1. Acesse o Firebase Console
2. Vá em Hosting
3. Adicione o domínio customizado: `app.garageminteligente.com.br`
4. Configure os registros DNS conforme instruído:
   ```
   Tipo: A
   Nome: app
   Valor: [IP fornecido pelo Firebase]
   ```

## 📊 Monitoramento

### Verificar Status do Pipeline

1. Acesse: https://github.com/Mikeofic/garagem-inteligente-app-client/actions
2. Veja a lista de workflows executados
3. Clique em um workflow para ver detalhes

### Logs

Cada step do pipeline gera logs detalhados que podem ser acessados:
- GitHub Actions > Workflow Run > Job > Step

## 🐛 Troubleshooting

### Pipeline não está rodando?

1. **Verifique a branch:**
   ```bash
   git branch
   # Deve estar em master ou main
   ```

2. **Verifique se o push foi feito:**
   ```bash
   git log origin/master..master --oneline
   # Não deve retornar nada (branches sincronizadas)
   ```

3. **Force push se necessário:**
   ```bash
   git push origin master --force
   ```

### Deploy falhando?

1. **Verifique o secret FIREBASE_SERVICE_ACCOUNT:**
   - GitHub > Settings > Secrets and variables > Actions
   - Deve existir e estar válido

2. **Verifique o firebase.json:**
   - Site ID deve ser `app-garageminteligente`
   - Project ID deve corresponder ao Firebase

### Build Android falhando?

1. **Verifique dependências do Gradle**
2. **Verifique configuração do Capacitor**
3. **Veja logs do Gradle para erros específicos**

## 🔄 Fluxo de Trabalho Recomendado

### Desenvolvimento

1. Crie uma feature branch:
   ```bash
   git checkout -b feature/minha-feature
   ```

2. Desenvolva e commit:
   ```bash
   git add .
   git commit -m "feat: minha nova feature"
   ```

3. Push para o repositório:
   ```bash
   git push origin feature/minha-feature
   ```

4. Crie um Pull Request no GitHub

### Release

1. Merge do PR para `master`:
   - Pipeline roda automaticamente
   - Quality check é executado
   - Deploy para Firebase
   - Build do Android APK
   - Release é criada no GitHub

2. Verifique o deploy:
   - Acesse https://app.garageminteligente.com.br
   - Verifique a versão no footer/settings

3. Baixe o APK:
   - GitHub > Releases > Última release
   - Download do APK anexado

## 📈 Métricas

- **Tempo total do pipeline:** ~15-20 minutos
- **Execuções mensais estimadas:** 50-100
- **Custo:** Gratuito (GitHub Actions free tier)

## 🔗 Links Úteis

- **GitHub Actions:** https://github.com/Mikeofic/garagem-inteligente-app-client/actions
- **Firebase Console:** https://console.firebase.google.com/project/autocare-platform
- **App Web:** https://app.garageminteligente.com.br
- **Firebase Hosting:** https://app-garageminteligente.web.app

---

**Última atualização:** 17/10/2025
**Versão do documento:** 1.0

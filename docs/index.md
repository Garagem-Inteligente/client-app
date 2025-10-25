# 📚 Documentação — Garagem Inteligente

Índice organizado por contexto e feature. O `README.md` do projeto permanece na raiz.

## 📑 Índice

### 🚀 Primeiros Passos
- **[setup.md](setup.md)** — Setup local, variáveis de ambiente, dependências (pnpm)
- **[mobile-dev.md](mobile-dev.md)** — Desenvolvimento mobile com hot reload
- **[android-studio-setup.md](android-studio-setup.md)** — Configurar Android Studio no Windows

### 🏗️ Build & Ambiente
- **[android-build.md](android-build.md)** — Build Android, gradle, APK/AAB
- **[ci-cd.md](ci-cd.md)** — Workflows CI/CD, GitHub Actions, secrets, deployments

### 🎯 Features Principais
- **[account-linking.md](account-linking.md)** — Account Linking (vincular múltiplas contas)
- **[transfer-implementation.md](transfer-implementation.md)** — Transferência de veículos entre usuários
- **[password-change.md](password-change.md)** — Recuperação e alteração de senha (SendGrid)

### 📋 Referência
- **[prd.md](prd.md)** — Product Requirements Document (requisitos)
- **[developer-notes.md](developer-notes.md)** — Notas de UI/UX, dark cards, tabbar, estilos

### 📝 Histórico & Consolidação
- **[consolidacao-log.md](consolidacao-log.md)** — Log de consolidação e reorganização de documentação

---

## 🗂️ Padrão de Nomes

Toda documentação segue padrão **kebab-case** (minúsculas com hífens):
- ✅ `account-linking.md`
- ✅ `android-studio-setup.md`
- ✅ `mobile-dev.md`
- ✅ `consolidacao-log.md`
- ❌ Sem MAIÚSCULAS
- ❌ Sem sufixos redundantes (`-WINDOWS`, `-README`)

---

## 💡 Como Contribuir

1. Mantenha documentação na pasta `docs/`
2. Use nomes descritivos e lowercase com hífens
3. Atualize este índice quando adicionar novos documentos
4. Remova links obsoletos ou arquivos quando consolidados

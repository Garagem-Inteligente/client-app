# 🚗 Garagem Inteligente - App Mobile

[![Ionic Vue](https://img.shields.io/badge/Ionic%20Vue-8.0.0-3880FF?style=flat&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.3.0-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4.3-119EFF?style=flat&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

Aplicativo mobile para a plataforma **Garagem Inteligente** - uma solução completa para gerenciamento de veículos, manutenções e histórico automotivo.

---

## ✨ Características

- 📱 **Ionic Vue 8** - Framework mobile híbrido com Vue 3
- ⚡ **Vue 3.3** - Composition API e performance otimizada
- 🔥 **Firebase** - Autenticação, Firestore e Storage
- 📦 **Capacitor** - Build para iOS, Android e PWA
- 🎨 **Ionic Components** - UI nativa e responsiva
- 🔒 **TypeScript** - Tipagem estática para maior segurança
- 🏪 **Pinia** - Gerenciamento de estado moderno
- 📷 **Camera API** - Captura de fotos dos veículos
- 📍 **Geolocation** - Localização de oficinas próximas
- 🔔 **Push Notifications** - Notificações em tempo real

---

## 🏗️ Tecnologias Principais

### Core
- **Ionic Vue** `8.0.0` - Framework mobile híbrido
- **Vue** `3.3.0` - Framework JavaScript progressivo
- **TypeScript** `5.6.2` - Superset tipado do JavaScript
- **Capacitor** `7.4.3` - Runtime nativo

### Backend & Infraestrutura
- **Firebase** `12.4.0` - Backend as a Service
  - Authentication
  - Firestore Database
  - Storage
  - Cloud Functions
- **Pinia** `3.0.3` - Store management

### Capacitor Plugins
- **@capacitor/camera** - Captura de fotos
- **@capacitor/geolocation** - Geolocalização
- **@capacitor/push-notifications** - Notificações push
- **@capacitor/device** - Informações do dispositivo
- **@capacitor/network** - Status da rede

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18.x ou superior
- **pnpm** 8.x ou superior
- **Ionic CLI** - `pnpm add -g @ionic/cli`
- **Capacitor CLI** - `pnpm add -g @capacitor/cli`

### Instalação Rápida

1. **Clone o repositório:**
```bash
git clone https://github.com/Garagem-Inteligente/client-app.git
cd client-app
```

2. **Siga o guia de setup:**
```bash
# Veja docs/setup.md para instruções detalhadas de configuração
# Inclui: variáveis de ambiente, Firebase, pnpm, functions, etc.
```

3. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173` 🎉

---

## 📚 Documentação

Toda a documentação detalhada está organizada em `docs/`:

- **[docs/index.md](docs/index.md)** — Índice de todos os guias
- **[docs/setup.md](docs/setup.md)** — Setup local, variáveis de ambiente, Firebase e dependências
- **[docs/ci-cd.md](docs/ci-cd.md)** — Workflows CI/CD, GitHub Actions e deployments
- **[docs/android-build.md](docs/android-build.md)** — Build e instalação de APK Android
- **[docs/developer-notes.md](docs/developer-notes.md)** — Notas de desenvolvimento e UI/UX
- **[docs/account-linking.md](docs/account-linking.md)** — Account Linking
- **[docs/transfer-implementation.md](docs/transfer-implementation.md)** — Sistema de transferência
- **[docs/password-change.md](docs/password-change.md)** — Fluxo de troca de senha

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento (porta 5173) |
| `pnpm build` | Gera a versão de produção |
| `pnpm preview` | Visualiza a build de produção |
| `pnpm test:unit` | Executa testes unitários |
| `pnpm lint` | Executa o ESLint |
| `pnpm type-check` | Verifica tipagem TypeScript |

---

## 📁 Estrutura do Projeto

```
app-client/
├── android/                  # Projeto Android (Capacitor)
├── ios/                      # Projeto iOS (Capacitor)
├── src/
│   ├── components/           # Componentes Vue reutilizáveis
│   ├── firebase/            # Configuração Firebase
│   │   └── config.ts
│   ├── router/              # Configuração de rotas
│   │   └── index.ts
│   ├── stores/              # Stores Pinia
│   │   ├── auth.ts
│   │   └── vehicles.ts
│   ├── views/               # Páginas da aplicação
│   │   ├── LoginPage.vue
│   │   ├── RegisterPage.vue
│   │   ├── HomePage.vue
│   │   ├── VehiclesPage.vue
│   │   ├── VehicleFormPage.vue
│   │   ├── VehicleDetailPage.vue
│   │   ├── OrdersPage.vue
│   │   ├── ProfilePage.vue
│   │   └── TabsPage.vue
│   ├── theme/               # Tema Ionic
│   │   └── variables.css
│   ├── App.vue              # Componente raiz
│   └── main.ts              # Entry point
├── public/                  # Assets estáticos
├── capacitor.config.ts      # Configuração Capacitor
├── ionic.config.json        # Configuração Ionic
├── package.json             # Dependências do projeto
└── vite.config.ts          # Configuração Vite
```

---

## 📱 Funcionalidades

### ✅ Implementadas

- **Autenticação**
  - Login com email/senha
  - Registro de usuários
  - Recuperação de senha
  - Logout

- **Gestão de Veículos**
  - Cadastro de veículos
  - Listagem de veículos
  - Edição de veículos
  - Exclusão de veículos
  - Filtros por tipo
  - Informações do seguro

- **Interface**
  - Design responsivo
  - Navegação por abas
  - Componentes Ionic
  - Estados de loading/erro
  - Modais e alertas

### 🚧 Em Desenvolvimento

- **Serviços**
  - Solicitação de serviços
  - Acompanhamento de status
  - Histórico de serviços
  - Avaliação de oficinas

- **Notificações**
  - Push notifications
  - Notificações de status
  - Lembretes de manutenção

- **Recursos Avançados**
  - Upload de fotos
  - Geolocalização
  - Chat com oficinas
  - Relatórios

---

## 🔧 Capacitor

### Android

1. **Sincronize o projeto:**
```bash
npx cap sync
```

2. **Abra no Android Studio:**
```bash
npx cap open android
```

### iOS

1. **Sincronize o projeto:**
```bash
npx cap sync
```

2. **Abra no Xcode:**
```bash
npx cap open ios
```

---

## 🚀 Deploy

Para instruções completas de deployment, veja **[docs/ci-cd.md](docs/ci-cd.md)**.

**Resumo rápido:**

```bash
# Build
pnpm build

# Sincronizar com Capacitor
npx cap sync

# Deploy automático via GitHub Actions
git push origin seu-branch
```

---

## 🛠️ Desenvolvimento

### Boas Práticas

1. **Sempre use TypeScript** com tipagem estrita
2. **Use pnpm** para gerenciar dependências
3. **Siga padrão de commits:**
   - `feat:` novas funcionalidades
   - `fix:` correções de bugs
   - `docs:` documentação
   - `refactor:` refatorações
   - `test:` testes
   - `style:` formatação
4. **Rode linter antes de commits:**
   ```bash
   pnpm lint
   pnpm type-check
   ```
5. **Mantenha componentes pequenos e reutilizáveis**
6. **Use Pinia** para gerenciamento de estado

### Qualidade de Código

Sequência recomendada antes de commitar:

```bash
pnpm type-check    # Verifica tipagem TypeScript
pnpm lint          # ESLint
pnpm test:unit     # Testes unitários
pnpm build         # Build de produção
```

---

## 🐛 Troubleshooting

### Problema: Erro de módulo não encontrado

**Solução:** `rm -rf node_modules && pnpm install`

### Problema: Capacitor não sincroniza

**Solução:** `npx cap sync --force`

### Problema: Erro de Firebase

**Solução:** Verifique o arquivo `.env` conforme [docs/setup.md](docs/setup.md)

### Problema: Build falha

**Solução:** 
```bash
pnpm build
```
Verifique os logs de erro. Para mais detalhes, veja [docs/ci-cd.md](docs/ci-cd.md)

---

## 📄 Licença

Este projeto é **privado** e propriedade de Michel Santos (@Mikeofic).

---

## 👨‍💻 Autor

**Michel Santos**
- GitHub: [@Mikeofic](https://github.com/Mikeofic)
- Empresa: Anota.ai
- Cargo: Desenvolvedor Senior

---

## 🤝 Contribuindo

Como este é um repositório privado, contribuições são restritas. Se você tem acesso e deseja contribuir:

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Faça suas alterações: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

---

## 📝 Changelog

### [1.0.0] - 2025-10-16

#### 🎉 Inicial
- Projeto criado com Ionic Vue 8.0.0
- Integração completa com Firebase
- Autenticação implementada
- Gestão de veículos completa
- Interface responsiva com Ionic components
- Capacitor configurado para iOS/Android
- TypeScript e Pinia configurados
- Estrutura de navegação por abas

---

<div align="center">

**Feito com ❤️ usando Ionic Vue e Capacitor**

</div>





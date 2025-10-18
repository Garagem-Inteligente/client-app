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
- **npm** 8.x ou superior
- **Ionic CLI** - `npm install -g @ionic/cli`
- **Capacitor CLI** - `npm install -g @capacitor/cli`

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/Mikeofic/garagem-inteligente-app.git
cd garagem-inteligente-app
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Preencha o arquivo `.env` com suas credenciais do Firebase:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:8100` 🎉

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Visualiza a build de produção |
| `npm run test:unit` | Executa testes unitários |
| `npm run test:e2e` | Executa testes E2E |
| `npm run lint` | Executa o ESLint |

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

## 🔧 Configuração do Capacitor

### Android

1. **Adicione a plataforma Android:**
```bash
npx cap add android
```

2. **Sincronize o projeto:**
```bash
npx cap sync
```

3. **Abra no Android Studio:**
```bash
npx cap open android
```

### iOS

1. **Adicione a plataforma iOS:**
```bash
npx cap add ios
```

2. **Sincronize o projeto:**
```bash
npx cap sync
```

3. **Abra no Xcode:**
```bash
npx cap open ios
```

---

## 🚀 Deploy

### PWA (Progressive Web App)

```bash
npm run build
npx cap sync
```

### Android

1. **Gere a build:**
```bash
npx cap build android
```

2. **Assine o APK:**
```bash
npx cap run android --prod
```

### iOS

1. **Gere a build:**
```bash
npx cap build ios
```

2. **Abra no Xcode e faça o deploy:**
```bash
npx cap open ios
```

---

## 🛠️ Desenvolvimento

### Boas Práticas

1. **Sempre use TypeScript** para tipagem estática
2. **Siga a convenção de commits**: 
   - `feat:` para novas funcionalidades
   - `fix:` para correções
   - `docs:` para documentação
   - `style:` para formatação
   - `refactor:` para refatoração
3. **Execute `npm run lint`** antes de fazer commits
4. **Mantenha componentes pequenos e reutilizáveis**
5. **Use Pinia para gerenciamento de estado**

### Estrutura de Componentes

```vue
<template>
  <!-- Template com Ionic components -->
</template>

<script setup lang="ts">
// Composition API com TypeScript
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
```

---

## 🐛 Troubleshooting

### Problema: Erro de módulo não encontrado

**Solução:** `rm -rf node_modules && npm install`

### Problema: Capacitor não sincroniza

**Solução:** `npx cap sync --force`

### Problema: Erro de Firebase

**Solução:** Verifique se o arquivo `.env` está configurado corretamente

### Problema: Build falha

**Solução:** `npm run build` e verifique os logs de erro

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





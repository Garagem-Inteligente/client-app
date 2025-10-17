# 📋 Plano de Migração - Garagem Inteligente

**Data:** 15 de outubro de 2025  
**Status:** Em Planejamento  
**Modelo:** Projetos Independentes (Sem Monorepo)

---

## 🎯 Objetivo da Migração

Transformar o projeto monorepo `autocare-landing-page` em **4 aplicações independentes** sob o domínio **Garagem Inteligente**, mantendo o Firebase existente e garantindo:

- ✅ Independência entre projetos (deploy, versão, stack)
- ✅ Reutilização do backend Firebase atual
- ✅ Continuidade de dados (usuários, veículos, ordens)
- ✅ Atomic Design + TypeScript + SCSS + Tailwind
- ✅ Deploy otimizado por subdomínio

---

## 📊 Visão Geral da Estrutura

### De: Monorepo (autocare-landing-page)

```
autocare-landing-page/
├── apps/
│   ├── landing-consumer/
│   ├── landing-workshops/
│   ├── workshops-web/
│   └── clients-app/
└── packages/ (shared)
    ├── domain/
    ├── api/
    ├── firebase/
    └── tokens/
```

**Problemas:**
- ❌ 1.120 dependências compartilhadas
- ❌ Build acoplado entre apps
- ❌ Deploy conjunto
- ❌ Versão única para todos

### Para: Projetos Independentes (Garagem Inteligente)

```
Garagem Inteligente/
├── 📦 landing-page-client/       ← garageminteligente.com.br
├── 📦 landing-page-workshop/     ← oficina.garageminteligente.com.br
├── 📦 platform-workshop/         ← oficina.garageminteligente.com.br/dashboard
└── 📦 app-client/                ← iOS + Android + PWA
```

**Benefícios:**
- ✅ Deploy independente por projeto
- ✅ Versão e CI/CD próprios
- ✅ Stack otimizada para cada caso
- ✅ Menos dependências (~200-400 por projeto)
- ✅ Manutenção simplificada

---

## 🏗️ Arquitetura dos Projetos

### 1. landing-page-client (Landing Principal)

**URL:** https://garageminteligente.com.br  
**Público:** Clientes finais (donos de veículos)  
**Objetivo:** Apresentar serviços, gerar leads, CTA para app

**Stack:**
```yaml
Framework: Nuxt 3.19+ (latest stable)
UI: Vue 3.5+ (Composition API)
Linguagem: TypeScript 5.6+
Estilos: Tailwind CSS 3.x + SCSS modules
Backend: Firebase (Auth, Firestore readonly)
SEO: Nuxt SSG + Meta tags + Sitemap
Deploy: Firebase Hosting
```

**Estrutura:**
```
landing-page-client/
├── assets/
│   ├── styles/
│   │   ├── main.scss
│   │   ├── variables.scss
│   │   └── tailwind.scss
│   └── images/
├── components/
│   ├── atoms/        (Button, Input, Badge, Icon)
│   ├── molecules/    (Card, FormField, NavItem)
│   ├── organisms/    (Navbar, Hero, Footer, ContactForm)
│   └── templates/    (PageLayout, SectionLayout)
├── composables/
│   ├── useFirebase.ts
│   ├── useAuth.ts
│   └── useAnalytics.ts
├── pages/
│   ├── index.vue           (Home)
│   ├── servicos.vue        (Serviços)
│   ├── como-funciona.vue   (Como funciona)
│   └── contato.vue         (Contato)
├── public/
├── firebase.json
├── nuxt.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

### 2. landing-page-workshop (Landing Oficinas)

**URL:** https://oficina.garageminteligente.com.br  
**Público:** Oficinas parceiras  
**Objetivo:** Cadastro de oficinas, apresentar benefícios

**Stack:**
```yaml
Framework: Nuxt 3.19+ (SSG)
UI: Vue 3.5+ (Composition API)
Linguagem: TypeScript 5.6+
Estilos: Tailwind CSS 3.x + SCSS
Backend: Firebase (Auth, Firestore)
Forms: Vuelidate ou VeeValidate
Deploy: Firebase Hosting (subdomain)
```

**Diferenças da landing-client:**
- ✅ Foco em B2B (oficinas)
- ✅ Formulário de cadastro de oficina
- ✅ CTA para plataforma (/dashboard)
- ✅ Depoimentos de oficinas parceiras

**Estrutura:** Similar à landing-client, com componentes específicos para oficinas

---

### 3. platform-workshop (Dashboard Oficinas)

**URL:** https://oficina.garageminteligente.com.br/dashboard  
**Público:** Oficinas autenticadas  
**Objetivo:** Gestão de ordens, veículos, clientes, agenda

**Stack:**
```yaml
Framework: Nuxt 3.19+ (SSR)
UI: Vue 3.5+ (Composition API)
Linguagem: TypeScript 5.6+
Estilos: Tailwind CSS 3.x + SCSS
Backend: Firebase (Auth, Firestore, Storage, Functions)
State: Pinia 2.x (store management)
Forms: VeeValidate + Zod
Charts: Chart.js ou ApexCharts
Deploy: Firebase Hosting (subdomain + route)
```

**Features principais:**
- ✅ Dashboard com KPIs
- ✅ Gestão de ordens de serviço
- ✅ Cadastro de veículos
- ✅ Gestão de clientes
- ✅ Calendário/agenda
- ✅ Upload de fotos (Storage)
- ✅ Notificações (FCM)

**Estrutura:**
```
platform-workshop/
├── assets/
│   └── styles/
│       ├── main.scss
│       ├── dashboard.scss
│       └── components.scss
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   │   ├── Sidebar.vue
│   │   ├── Topbar.vue
│   │   ├── OrderCard.vue
│   │   └── VehicleCard.vue
│   └── templates/
│       └── DashboardLayout.vue
├── composables/
│   ├── useFirebase.ts
│   ├── useAuth.ts
│   ├── useOrders.ts
│   ├── useVehicles.ts
│   └── useClients.ts
├── middleware/
│   ├── auth.ts           (route guard)
│   └── workshop-only.ts  (verifica se é oficina)
├── pages/
│   ├── login.vue
│   ├── dashboard/
│   │   ├── index.vue     (Overview)
│   │   ├── ordens.vue    (Ordens de serviço)
│   │   ├── veiculos.vue  (Veículos)
│   │   ├── clientes.vue  (Clientes)
│   │   ├── agenda.vue    (Calendário)
│   │   └── perfil.vue    (Perfil da oficina)
│   └── cadastro.vue
├── stores/
│   ├── auth.ts
│   ├── orders.ts
│   ├── vehicles.ts
│   └── notifications.ts
├── types/
│   ├── order.ts
│   ├── vehicle.ts
│   ├── client.ts
│   └── workshop.ts
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   └── firebase-utils.ts
├── firebase.json
├── nuxt.config.ts
├── tailwind.config.js
└── package.json
```

---

### 4. app-client (Aplicativo Mobile)

**Plataformas:** iOS, Android, PWA  
**Público:** Clientes finais  
**Objetivo:** Solicitar serviços, acompanhar ordens, histórico

**Stack:**
```yaml
Framework: Ionic Vue 8.x
UI: Ionic Components + Vue 3.5+
Native: Capacitor 6.x
Linguagem: TypeScript 5.6+
Estilos: Ionic CSS + Custom SCSS + Tailwind
Backend: Firebase (Auth, Firestore, Storage, FCM)
State: Pinia 2.x
Build: Vite 7.x
Deploy iOS: App Store (Fastlane)
Deploy Android: Play Store (Fastlane)
Deploy Web: Firebase Hosting (app.garageminteligente.com.br)
```

**Features principais:**
- ✅ Autenticação (email, Google, Apple)
- ✅ Cadastro de veículos
- ✅ Solicitação de serviços
- ✅ Acompanhamento de ordens
- ✅ Histórico de serviços
- ✅ Notificações push (FCM)
- ✅ Chat com oficina (opcional)
- ✅ Upload de fotos (câmera)
- ✅ Geolocalização (oficinas próximas)

**Estrutura:**
```
app-client/
├── android/              (Capacitor Android)
├── ios/                  (Capacitor iOS)
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── ionic-custom.scss
│   │   │   └── tailwind.scss
│   │   └── images/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── composables/
│   │   ├── useFirebase.ts
│   │   ├── useAuth.ts
│   │   ├── useCamera.ts
│   │   ├── useGeolocation.ts
│   │   └── usePushNotifications.ts
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── vehicles.ts
│   │   ├── orders.ts
│   │   └── notifications.ts
│   ├── types/
│   ├── views/
│   │   ├── TabsPage.vue
│   │   ├── HomePage.vue
│   │   ├── VehiclesPage.vue
│   │   ├── OrdersPage.vue
│   │   ├── NotificationsPage.vue
│   │   └── ProfilePage.vue
│   ├── App.vue
│   └── main.ts
├── capacitor.config.json
├── vite.config.ts
├── tailwind.config.js
├── ionic.config.json
└── package.json
```

---

## 🔥 Estratégia de Migração do Firebase

### Firebase Existente (Reutilizar)

**Projeto atual:** `autocare-landing-page` (Firebase Console)

**Recursos em uso:**
- ✅ Authentication (usuários existentes)
- ✅ Firestore (coleções: users, vehicles, workshops, orders)
- ✅ Storage (fotos de veículos e ordens)
- ✅ Hosting (site atual)

### Estratégia de Migração

#### Opção 1: Mesmo Projeto Firebase (Recomendada)

**Vantagens:**
- ✅ Dados continuam funcionando
- ✅ Usuários não precisam recadastrar
- ✅ Sem custo adicional
- ✅ Migração transparente

**Configuração:**
```bash
# Firebase Hosting - Multiple sites/subdomains
firebase.json:
{
  "hosting": [
    {
      "target": "landing-client",
      "public": "dist",
      "site": "garageminteligente"
    },
    {
      "target": "landing-workshop",
      "public": "dist",
      "site": "oficina-garageminteligente"
    },
    {
      "target": "platform-workshop",
      "public": "dist",
      "site": "oficina-dashboard-garageminteligente"
    },
    {
      "target": "app-client-web",
      "public": "www",
      "site": "app-garageminteligente"
    }
  ]
}
```

**Firestore Structure (Manter):**
```
firestore/
├── users/
│   └── {userId}/
│       ├── role: "client" | "workshop"
│       ├── email: string
│       ├── profile: {...}
│       └── vehicles/ (subcollection)
├── workshops/
│   └── {workshopId}/
│       ├── name: string
│       ├── location: geopoint
│       ├── services: string[]
│       └── reviews/ (subcollection)
├── orders/
│   └── {orderId}/
│       ├── clientId: ref
│       ├── workshopId: ref
│       ├── vehicleId: ref
│       ├── status: enum
│       ├── services: string[]
│       ├── photos: string[]
│       └── timeline: array
└── notifications/
    └── {notificationId}/
```

**Security Rules (Atualizar):**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      
      match /vehicles/{vehicleId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Workshops
    match /workshops/{workshopId} {
      allow read: if true; // Public listings
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'workshop';
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.clientId ||
                     request.auth.uid == resource.data.workshopId;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.workshopId;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if false; // Only Functions can write
    }
  }
}
```

---

## 🎨 Design System (Atomic Design)

### Princípios

Todos os 4 projetos seguirão o mesmo design system, baseado no `auto-care-landing-page`, mas adaptado para cada contexto.

### Estrutura de Componentes

#### Atoms (Elementos básicos)
```typescript
// components/atoms/AButton.vue
<template>
  <button 
    :class="buttonClasses"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >
    <AIcon v-if="icon" :name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.button {
  @apply px-4 py-2 rounded-lg font-medium transition-all;
  
  &--primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
  
  &--secondary {
    @apply bg-gray-600 text-white hover:bg-gray-700;
  }
  
  // ... other variants
}
</style>
```

**Lista de Atoms:**
- AButton (botão base)
- AInput (campo de texto)
- ATextarea (área de texto)
- ASelect (dropdown)
- ACheckbox (checkbox)
- ARadio (radio button)
- AIcon (ícone SVG)
- ABadge (badge/tag)
- ASpinner (loading spinner)
- AAvatar (avatar de usuário)

#### Molecules (Combinações de atoms)
```typescript
// components/molecules/MFormField.vue
<template>
  <div class="form-field">
    <label v-if="label" :for="id" class="form-field__label">
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>
    
    <AInput
      :id="id"
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :error="!!errorMessage"
      @blur="handleBlur"
    />
    
    <span v-if="errorMessage" class="form-field__error">
      {{ errorMessage }}
    </span>
    
    <span v-else-if="hint" class="form-field__hint">
      {{ hint }}
    </span>
  </div>
</template>
```

**Lista de Molecules:**
- MFormField (label + input + error)
- MCard (card com header/body/footer)
- MNavItem (item de navegação)
- MSearchBar (barra de busca)
- MFileUpload (upload de arquivo)
- MDatePicker (seletor de data)
- MTag (tag removível)
- MToast (notificação toast)

#### Organisms (Seções complexas)
```typescript
// components/organisms/ONavbar.vue
<template>
  <header class="navbar">
    <div class="navbar__container">
      <router-link to="/" class="navbar__logo">
        <img src="@/assets/logo.svg" alt="Garagem Inteligente" />
      </router-link>
      
      <nav class="navbar__menu">
        <MNavItem 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          :label="item.label"
        />
      </nav>
      
      <div class="navbar__actions">
        <AButton v-if="!isAuthenticated" @click="login">
          Entrar
        </AButton>
        <AButton v-else variant="outline" @click="logout">
          Sair
        </AButton>
      </div>
    </div>
  </header>
</template>
```

**Lista de Organisms:**
- ONavbar (navegação principal)
- OFooter (rodapé)
- OHero (hero section)
- OSidebar (sidebar de dashboard)
- OOrderCard (card de ordem)
- OVehicleCard (card de veículo)
- OContactForm (formulário de contato)
- OWorkshopCard (card de oficina)

#### Templates (Layouts de página)
```vue
// components/templates/TDashboardLayout.vue
<template>
  <div class="dashboard-layout">
    <OSidebar :items="sidebarItems" />
    
    <main class="dashboard-layout__main">
      <OTopbar :user="currentUser" />
      
      <div class="dashboard-layout__content">
        <slot />
      </div>
    </main>
  </div>
</template>
```

---

## 🎨 Sistema de Estilos (SCSS + Tailwind)

### Estrutura de SCSS

```scss
// assets/styles/variables.scss
// Design Tokens
$colors: (
  'primary': (
    50: #f0f9ff,
    100: #e0f2fe,
    200: #bae6fd,
    300: #7dd3fc,
    400: #38bdf8,
    500: #0ea5e9,
    600: #0284c7,  // Main
    700: #0369a1,
    800: #075985,
    900: #0c4a6e,
  ),
  'gray': (
    50: #f9fafb,
    100: #f3f4f6,
    200: #e5e7eb,
    300: #d1d5db,
    400: #9ca3af,
    500: #6b7280,
    600: #4b5563,
    700: #374151,
    800: #1f2937,
    900: #111827,
  ),
);

$spacing: (
  0: 0,
  1: 0.25rem,
  2: 0.5rem,
  3: 0.75rem,
  4: 1rem,
  5: 1.25rem,
  6: 1.5rem,
  8: 2rem,
  10: 2.5rem,
  12: 3rem,
  16: 4rem,
  20: 5rem,
  24: 6rem,
);

$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px,
);

$font-sizes: (
  'xs': 0.75rem,
  'sm': 0.875rem,
  'base': 1rem,
  'lg': 1.125rem,
  'xl': 1.25rem,
  '2xl': 1.5rem,
  '3xl': 1.875rem,
  '4xl': 2.25rem,
);
```

```scss
// assets/styles/mixins.scss
@use 'variables' as *;

// Responsive breakpoints
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

// Card styles
@mixin card {
  @apply bg-white rounded-lg shadow-md p-6;
}

// Button styles
@mixin button-base {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
  cursor: pointer;
  
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

// Form field
@mixin form-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500;
}
```

```scss
// assets/styles/main.scss
@import 'variables';
@import 'mixins';
@import 'tailwind';

// Global styles
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  @apply bg-gray-50 text-gray-900;
}

// Utility classes
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section {
  @apply py-16 md:py-24;
}
```

---

## 📦 Configuração de Dependências por Projeto

### landing-page-client (Nuxt SSG)

```json
{
  "name": "landing-page-client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "deploy": "npm run generate && firebase deploy --only hosting:landing-client"
  },
  "dependencies": {
    "firebase": "^10.14.0",
    "nuxt": "^3.19.0",
    "vue": "^3.5.18",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.9.0",
    "@nuxtjs/tailwindcss": "^6.12.0",
    "sass": "^1.82.0",
    "typescript": "^5.6.0",
    "vite": "^7.1.0"
  }
}
```

**Estimativa:** ~250-300 deps (vs 1.120 do monorepo)

### landing-page-workshop (Similar)

Mesmas deps da landing-client

### platform-workshop (Nuxt SSR + State Management)

```json
{
  "dependencies": {
    "firebase": "^10.14.0",
    "nuxt": "^3.19.0",
    "pinia": "^2.2.0",
    "vue": "^3.5.18",
    "vue-router": "^4.5.0",
    "vee-validate": "^4.15.0",
    "zod": "^3.24.0",
    "chart.js": "^4.4.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.9.0",
    "@nuxtjs/tailwindcss": "^6.12.0",
    "@pinia/nuxt": "^0.9.0",
    "sass": "^1.82.0",
    "typescript": "^5.6.0"
  }
}
```

**Estimativa:** ~350-400 deps

### app-client (Ionic + Capacitor)

```json
{
  "dependencies": {
    "@capacitor/android": "^6.2.0",
    "@capacitor/app": "^6.0.0",
    "@capacitor/camera": "^6.0.0",
    "@capacitor/core": "^6.2.0",
    "@capacitor/device": "^6.0.0",
    "@capacitor/geolocation": "^6.0.0",
    "@capacitor/ios": "^6.2.0",
    "@capacitor/push-notifications": "^6.0.0",
    "@ionic/vue": "^8.4.0",
    "@ionic/vue-router": "^8.4.0",
    "firebase": "^10.14.0",
    "pinia": "^2.2.0",
    "vue": "^3.5.18",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.2.0",
    "@vitejs/plugin-vue": "^5.2.0",
    "sass": "^1.82.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0",
    "vite": "^7.1.0"
  }
}
```

**Estimativa:** ~400-450 deps

---

## 🚀 Roadmap de Migração

### Fase 1: Setup Inicial (Semana 1)
- [ ] Criar pasta `Garagem Inteligente/`
- [ ] Inicializar 4 repositórios Git separados
- [ ] Configurar Firebase para múltiplos sites
- [ ] Criar documentação base

### Fase 2: Landing Pages (Semana 2-3)
- [ ] Setup landing-page-client (Nuxt + Tailwind + SCSS)
- [ ] Migrar componentes Atomic Design
- [ ] Criar páginas principais
- [ ] Deploy no Firebase Hosting (garageminteligente.com.br)
- [ ] Setup landing-page-workshop (similar)
- [ ] Deploy no Firebase Hosting (oficina.garageminteligente.com.br)

### Fase 3: Platform Workshop (Semana 4-5)
- [ ] Setup platform-workshop (Nuxt + Pinia + Firebase)
- [ ] Implementar autenticação e guards
- [ ] Criar dashboard e páginas principais
- [ ] Integrar com Firestore (CRUD completo)
- [ ] Deploy no Firebase Hosting (oficina.garageminteligente.com.br/dashboard)

### Fase 4: App Mobile (Semana 6-7)
- [ ] Setup app-client (Ionic + Capacitor)
- [ ] Configurar iOS e Android
- [ ] Implementar telas principais
- [ ] Integrar com Firebase (Auth + Firestore + Storage)
- [ ] Configurar push notifications
- [ ] Build e teste em dispositivos

### Fase 5: CI/CD e Deploy (Semana 8)
- [ ] Configurar GitHub Actions para cada projeto
- [ ] Setup Fastlane para iOS e Android
- [ ] Documentar processo de deploy
- [ ] Testes finais em produção

### Fase 6: Migração de Dados (Semana 9)
- [ ] Backup do Firestore atual
- [ ] Migrar/ajustar estrutura de dados se necessário
- [ ] Testes de integridade
- [ ] Rollout gradual

---

## ✅ Checklist de Migração

### Por Projeto

**Landing Page Client:**
- [ ] Repositório criado e clonado
- [ ] Nuxt 3 configurado
- [ ] Tailwind + SCSS setup
- [ ] Firebase SDK integrado
- [ ] Componentes Atomic Design migrados
- [ ] Páginas criadas
- [ ] SEO configurado (meta tags, sitemap)
- [ ] Firebase Hosting configurado
- [ ] CI/CD pipeline criado
- [ ] Deploy em produção

**Landing Page Workshop:**
- [ ] (mesmos itens da landing client)
- [ ] Formulário de cadastro de oficina
- [ ] Integração com Firestore para cadastro

**Platform Workshop:**
- [ ] Repositório criado
- [ ] Nuxt 3 + Pinia configurado
- [ ] Autenticação implementada
- [ ] Guards de rota configurados
- [ ] Dashboard com KPIs
- [ ] CRUD de ordens de serviço
- [ ] CRUD de veículos
- [ ] CRUD de clientes
- [ ] Upload de imagens (Storage)
- [ ] Notificações implementadas
- [ ] Deploy em produção

**App Client:**
- [ ] Repositório criado
- [ ] Ionic + Capacitor configurado
- [ ] Configuração iOS (App ID, provisioning)
- [ ] Configuração Android (bundle ID, keystore)
- [ ] Telas principais implementadas
- [ ] Firebase Auth integrado
- [ ] Firestore integrado
- [ ] Push notifications configuradas
- [ ] Câmera e geolocalização integradas
- [ ] Build iOS gerado
- [ ] Build Android gerado
- [ ] PWA configurada
- [ ] Submetido às lojas (iOS/Android)

---

## 📈 Próximos Passos Imediatos

**Agora vou:**
1. ✅ Criar a estrutura de documentação completa
2. ✅ Gerar guia de setup do Firebase
3. ✅ Criar template base para cada projeto
4. ✅ Documentar processo de deploy

**Você deve:**
1. Revisar este plano e confirmar se está alinhado
2. Fornecer acesso ao projeto Firebase atual (se necessário)
3. Decidir sobre nomes finais dos repositórios
4. Confirmar estrutura de subdomínios

---

**Status:** Aguardando confirmação para iniciar a implementação  
**Próximo documento:** `FIREBASE-SETUP.md` (configuração detalhada do Firebase)

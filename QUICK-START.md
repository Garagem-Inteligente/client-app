# 🚀 Quick Start - Garagem Inteligente

**Guia rápido** para iniciar os 4 projetos independentes

---

## 📁 Estrutura de Pastas

```
Garagem Inteligente/
├── Landing-page-client/          # Nuxt 3 SSG - garageminteligente.com.br
├── Landing-page-workshop/         # Nuxt 3 SSG - oficina.garageminteligente.com.br
├── Platform-workshop/             # Nuxt 3 SSR - oficina.garageminteligente.com.br/dashboard
└── App-client/                    # Ionic + Capacitor - iOS/Android/PWA
```

---

## 🏁 Setup Inicial - Landing Page Client

### 1. Criar projeto Nuxt 3

```bash
cd "/home/michel/Documentos/Pessoal/Garagem Inteligente/Landing-page-client"

# Inicializar package.json
cat > package.json << 'EOF'
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
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "vue": "^3.5.12",
    "nuxt": "^3.14.1592",
    "firebase": "^11.0.2",
    "@vueuse/core": "^11.2.0",
    "@vueuse/nuxt": "^11.2.0"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.2",
    "@nuxt/eslint": "^0.5.7",
    "@nuxt/image": "^1.8.1",
    "nuxt-icon": "^1.0.0",
    "sass": "^1.80.6",
    "typescript": "^5.6.3"
  }
}
EOF

# Instalar dependências
pnpm install
```

### 2. Criar nuxt.config.ts

```bash
cat > nuxt.config.ts << 'EOF'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  devtools: { enabled: true },
  
  // SSG mode
  ssr: true,
  
  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      nodeVersion: '20'
    }
  },
  
  // Generate static pages
  generate: {
    routes: [
      '/',
      '/features',
      '/pricing',
      '/about',
      '/contact'
    ]
  },
  
  // SEO
  app: {
    head: {
      title: 'Garagem Inteligente - Gerencie seu veículo',
      htmlAttrs: {
        lang: 'pt-BR'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Conecte-se às melhores oficinas e cuide do seu carro com praticidade' },
        { name: 'theme-color', content: '#10b981' },
        { property: 'og:title', content: 'Garagem Inteligente' },
        { property: 'og:description', content: 'Gerencie manutenções, histórico e documentos do seu veículo' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://garageminteligente.com.br' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://garageminteligente.com.br' }
      ]
    }
  },
  
  // CSS
  css: [
    '~/assets/scss/main.scss'
  ],
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/eslint',
    'nuxt-icon'
  ],
  
  // Tailwind
  tailwindcss: {
    cssPath: '~/assets/scss/tailwind.scss',
    configPath: 'tailwind.config.ts'
  },
  
  // Runtime config
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
  },
  
  // Performance
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    typedPages: true
  }
})
EOF
```

### 3. Criar tsconfig.json

```bash
cat > tsconfig.json << 'EOF'
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
EOF
```

### 4. Criar Tailwind config

```bash
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
EOF
```

### 5. Criar estrutura SCSS

```bash
mkdir -p assets/scss

# assets/scss/main.scss
cat > assets/scss/main.scss << 'EOF'
// Variables
@import './variables';

// Base
@import './base';

// Components (Atomic Design será adicionado depois)
EOF

# assets/scss/variables.scss
cat > assets/scss/variables.scss << 'EOF'
// Colors
$primary: #10b981;
$primary-dark: #059669;
$secondary: #64748b;
$danger: #ef4444;
$warning: #f59e0b;
$success: #10b981;

// Spacing
$spacing-xs: 0.25rem;  // 4px
$spacing-sm: 0.5rem;   // 8px
$spacing-md: 1rem;     // 16px
$spacing-lg: 1.5rem;   // 24px
$spacing-xl: 2rem;     // 32px
$spacing-2xl: 3rem;    // 48px

// Typography
$font-family-base: 'Inter', system-ui, sans-serif;
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-base: 1rem;    // 16px
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px
$font-size-2xl: 1.5rem;   // 24px
$font-size-3xl: 1.875rem; // 30px
$font-size-4xl: 2.25rem;  // 36px

// Border radius
$radius-sm: 0.25rem;  // 4px
$radius-md: 0.375rem; // 6px
$radius-lg: 0.5rem;   // 8px
$radius-xl: 0.75rem;  // 12px
$radius-2xl: 1rem;    // 16px

// Shadows
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
$shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
$shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

// Breakpoints (matching Tailwind)
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;

// Z-index
$z-dropdown: 1000;
$z-sticky: 1020;
$z-fixed: 1030;
$z-modal-backdrop: 1040;
$z-modal: 1050;
$z-popover: 1060;
$z-tooltip: 1070;
EOF

# assets/scss/base.scss
cat > assets/scss/base.scss << 'EOF'
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: 1.5;
  color: #1f2937;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
EOF

# assets/scss/tailwind.scss
cat > assets/scss/tailwind.scss << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
```

### 6. Criar estrutura de componentes Atomic Design

```bash
# Criar diretórios
mkdir -p components/atoms
mkdir -p components/molecules
mkdir -p components/organisms
mkdir -p components/templates

# Atoms
mkdir -p components/atoms/AButton
mkdir -p components/atoms/AInput
mkdir -p components/atoms/ABadge
mkdir -p components/atoms/AIcon
mkdir -p components/atoms/ASpinner

# Molecules
mkdir -p components/molecules/MFormField
mkdir -p components/molecules/MCard
mkdir -p components/molecules/MAlert

# Organisms
mkdir -p components/organisms/ONavbar
mkdir -p components/organisms/OFooter
mkdir -p components/organisms/OHero
```

### 7. Criar .env

```bash
cat > .env << 'EOF'
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
EOF
```

### 8. Criar .gitignore

```bash
cat > .gitignore << 'EOF'
# Nuxt
.nuxt
.output
.data
.env
.env.*
!.env.example

# Dependencies
node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*

# Editor
.vscode
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Firebase
.firebase
firebase-debug.log
firestore-debug.log
ui-debug.log
EOF
```

### 9. Instalar e rodar

```bash
pnpm install
pnpm run dev
```

🎉 **Landing Page Client** configurado! Acesse: http://localhost:3000

---

## 🏁 Setup Inicial - Landing Page Workshop

```bash
cd "/home/michel/Documentos/Pessoal/Garagem Inteligente/Landing-page-workshop"

# Copiar estrutura do Landing Client
cp -r "../Landing-page-client/package.json" .
cp -r "../Landing-page-client/nuxt.config.ts" .
cp -r "../Landing-page-client/tsconfig.json" .
cp -r "../Landing-page-client/tailwind.config.ts" .
cp -r "../Landing-page-client/.gitignore" .
cp -r "../Landing-page-client/.env" .
cp -r "../Landing-page-client/assets" .

# Atualizar package.json
sed -i 's/"landing-page-client"/"landing-page-workshop"/' package.json

# Criar estrutura de componentes
mkdir -p components/atoms
mkdir -p components/molecules
mkdir -p components/organisms

# Instalar
pnpm install
pnpm run dev
```

---

## 🏁 Setup Inicial - Platform Workshop

```bash
cd "/home/michel/Documentos/Pessoal/Garagem Inteligente/Platform-workshop"

# Inicializar package.json (SSR + Pinia)
cat > package.json << 'EOF'
{
  "name": "platform-workshop",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "vue": "^3.5.12",
    "nuxt": "^3.14.1592",
    "firebase": "^11.0.2",
    "@vueuse/core": "^11.2.0",
    "@vueuse/nuxt": "^11.2.0",
    "@pinia/nuxt": "^0.5.5",
    "pinia": "^2.2.6",
    "vee-validate": "^4.14.7",
    "zod": "^3.23.8",
    "@vee-validate/zod": "^4.14.7"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.2",
    "@nuxt/eslint": "^0.5.7",
    "nuxt-icon": "^1.0.0",
    "sass": "^1.80.6",
    "typescript": "^5.6.3"
  }
}
EOF

# nuxt.config.ts (SSR)
cat > nuxt.config.ts << 'EOF'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  devtools: { enabled: true },
  
  // SSR mode
  ssr: true,
  
  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      nodeVersion: '20',
      serverFunctionName: 'platformWorkshopSsr'
    }
  },
  
  // Auth middleware
  routeRules: {
    '/dashboard/**': { ssr: true },
    '/login': { ssr: false },
    '/register': { ssr: false }
  },
  
  css: ['~/assets/scss/main.scss'],
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    'nuxt-icon'
  ],
  
  runtimeConfig: {
    firebaseAdminKey: process.env.FIREBASE_ADMIN_KEY,
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID
    }
  }
})
EOF

# Copiar configs base
cp ../Landing-page-client/tsconfig.json .
cp ../Landing-page-client/tailwind.config.ts .
cp ../Landing-page-client/.gitignore .
cp -r ../Landing-page-client/assets .

# Criar estrutura
mkdir -p stores
mkdir -p middleware
mkdir -p composables
mkdir -p components/atoms
mkdir -p components/molecules
mkdir -p components/organisms

pnpm install
pnpm run dev
```

---

## 🏁 Setup Inicial - App Client (Mobile)

```bash
cd "/home/michel/Documentos/Pessoal/Garagem Inteligente/App-client"

# Criar projeto Ionic Vue
npm init @ionic/app app-client blank --type vue --capacitor --package-id br.com.garageminteligente.app

cd app-client

# Adicionar Tailwind
pnpm add -D tailwindcss postcss autoprefixer
pnpm exec tailwindcss init -p

# Adicionar Firebase
pnpm add firebase

# Adicionar Capacitor plugins
pnpm add @capacitor/camera @capacitor/push-notifications @capacitor/local-notifications @capacitor/app @capacitor/browser

# Sync
pnpm exec cap sync
```

---

## 📋 Ordem de Implementação Recomendada

1. **Landing Page Client** (Mais simples, SSG)
   - Componentes Atomic Design
   - Páginas estáticas
   - Firebase Auth básico
   
2. **Landing Page Workshop** (Similar ao Client)
   - Reutilizar componentes
   - Páginas adaptadas para oficinas
   
3. **Platform Workshop** (Mais complexo, SSR + Pinia)
   - Autenticação completa
   - Dashboard
   - CRUD Firestore
   
4. **App Client** (Mobile, mais trabalhoso)
   - Interface mobile
   - Capacitor plugins
   - Build iOS/Android

---

## 🔥 Firebase Setup

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Selecionar projeto
firebase use --add

# Criar sites de hosting
firebase hosting:sites:create garageminteligente
firebase hosting:sites:create oficina-garageminteligente
firebase hosting:sites:create oficina-dashboard-garageminteligente
firebase hosting:sites:create app-garageminteligente
```

---

## ✅ Próximos Passos

1. ✅ Migrar componentes da landing atual para Landing-page-client
2. ⏳ Criar componentes Atomic Design
3. ⏳ Implementar páginas
4. ⏳ Configurar Firebase
5. ⏳ Deploy

**Documentação completa:** Veja `MIGRATION-PLAN.md`, `FIREBASE-SETUP.md`, `DEPLOYMENT-GUIDE.md`

# 🚀 Guia Completo de Deploy - Garagem Inteligente

**Atualizado:** 15 de outubro de 2025  
**Modelo:** 4 projetos independentes, deploys separados

---

## 📋 Visão Geral

### Estratégia de Deploy

| Projeto | Framework | Tipo | Plataforma | URL |
|---------|-----------|------|------------|-----|
| **landing-page-client** | Nuxt 3 | SSG | Firebase Hosting | garageminteligente.com.br |
| **landing-page-workshop** | Nuxt 3 | SSG | Firebase Hosting | oficina.garageminteligente.com.br |
| **platform-workshop** | Nuxt 3 | SSR | Firebase Hosting + Functions | oficina.garageminteligente.com.br/dashboard |
| **app-client** | Ionic + Capacitor | Hybrid | App Stores + PWA | iOS, Android, app.garageminteligente.com.br |

### Ambiente de Build

```bash
# Versões recomendadas
Node.js: 20.x LTS
pnpm: 9.x
Firebase CLI: 13.x
Ionic CLI: 7.x
```

---

## 🏗️ Build e Deploy - Landing Page Client

### Configuração do Projeto

```bash
cd landing-page-client

# Instalar dependências
pnpm install

# Verificar build local
pnpm run generate
pnpm run preview
```

### nuxt.config.ts (SSG)

```typescript
export default defineNuxtConfig({
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
      meta: [
        { name: 'description', content: 'Conecte-se às melhores oficinas e cuide do seu carro com praticidade' },
        { property: 'og:title', content: 'Garagem Inteligente' },
        { property: 'og:description', content: 'Gerencie manutenções, histórico e documentos do seu veículo' },
        { property: 'og:image', content: 'https://garageminteligente.com.br/og-image.jpg' },
        { property: 'og:url', content: 'https://garageminteligente.com.br' }
      ],
      link: [
        { rel: 'canonical', href: 'https://garageminteligente.com.br' }
      ]
    }
  },
  
  // Performance
  experimental: {
    payloadExtraction: true
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon'
  ]
})
```

### Deploy para Firebase Hosting

```bash
# 1. Build
pnpm run generate

# 2. Deploy
firebase deploy --only hosting:landing-client

# 3. Verificar
open https://garageminteligente.com.br
```

### CI/CD com GitHub Actions

```yaml
# .github/workflows/deploy-landing-client.yml
name: Deploy Landing Client

on:
  push:
    branches:
      - main
    paths:
      - 'landing-page-client/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Install dependencies
        working-directory: landing-page-client
        run: pnpm install --frozen-lockfile
      
      - name: Build
        working-directory: landing-page-client
        run: pnpm run generate
        env:
          NUXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NUXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
          channelId: live
          target: landing-client
          entryPoint: landing-page-client
```

### Environment Variables

```bash
# .env.production
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=autocare-landing-page.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=autocare-landing-page
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=autocare-landing-page.firebasestorage.app
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NUXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🏗️ Build e Deploy - Landing Page Workshop

### Configuração Similar ao Client

```bash
cd landing-page-workshop
pnpm install
pnpm run generate
firebase deploy --only hosting:landing-workshop
```

### nuxt.config.ts (SSG)

```typescript
export default defineNuxtConfig({
  ssr: true,
  
  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      nodeVersion: '20'
    }
  },
  
  generate: {
    routes: [
      '/',
      '/como-funciona',
      '/vantagens',
      '/planos',
      '/cadastro'
    ]
  },
  
  app: {
    head: {
      title: 'Garagem Inteligente para Oficinas',
      meta: [
        { name: 'description', content: 'Gerencie clientes, ordens de serviço e aumente sua visibilidade' }
      ]
    }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon'
  ]
})
```

### GitHub Actions

```yaml
# .github/workflows/deploy-landing-workshop.yml
name: Deploy Landing Workshop

on:
  push:
    branches:
      - main
    paths:
      - 'landing-page-workshop/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Install dependencies
        working-directory: landing-page-workshop
        run: pnpm install --frozen-lockfile
      
      - name: Build
        working-directory: landing-page-workshop
        run: pnpm run generate
        env:
          NUXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NUXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
          channelId: live
          target: landing-workshop
          entryPoint: landing-page-workshop
```

---

## 🏗️ Build e Deploy - Platform Workshop (SSR)

### Configuração do Projeto

```bash
cd platform-workshop
pnpm install

# Build local
pnpm run build
pnpm run preview
```

### nuxt.config.ts (SSR com Firebase Functions)

```typescript
export default defineNuxtConfig({
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
  
  // Runtime config
  runtimeConfig: {
    // Server-only
    firebaseAdminKey: process.env.FIREBASE_ADMIN_KEY,
    
    // Public (client + server)
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID
    }
  },
  
  // Auth middleware
  routeRules: {
    '/dashboard/**': { ssr: true },
    '/login': { ssr: false },
    '/register': { ssr: false }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon'
  ]
})
```

### Middleware de Autenticação

```typescript
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password']
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // Verificar autenticação no client
  if (process.client) {
    const { currentUser } = useAuth()
    
    if (!currentUser.value && to.path.startsWith('/dashboard')) {
      return navigateTo('/login')
    }
  }
  
  // SSR: verificar token no cookie
  if (process.server) {
    const token = useCookie('auth-token')
    
    if (!token.value && to.path.startsWith('/dashboard')) {
      return navigateTo('/login')
    }
  }
})
```

### Deploy para Firebase Hosting + Functions

```bash
# 1. Build Nuxt SSR
pnpm run build

# 2. Deploy hosting + function
firebase deploy --only hosting:platform-workshop,functions:platformWorkshopSsr

# 3. Verificar
open https://oficina.garageminteligente.com.br/dashboard
```

### GitHub Actions (SSR)

```yaml
# .github/workflows/deploy-platform-workshop.yml
name: Deploy Platform Workshop

on:
  push:
    branches:
      - main
    paths:
      - 'platform-workshop/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Install dependencies
        working-directory: platform-workshop
        run: pnpm install --frozen-lockfile
      
      - name: Build
        working-directory: platform-workshop
        run: pnpm run build
        env:
          NUXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NUXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_ADMIN_KEY: ${{ secrets.FIREBASE_ADMIN_KEY }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
          channelId: live
          target: platform-workshop
          entryPoint: platform-workshop
      
      - name: Deploy Cloud Function
        run: |
          cd platform-workshop/.output/server
          firebase deploy --only functions:platformWorkshopSsr
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### Environment Variables (SSR)

```bash
# .env.production
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=autocare-landing-page.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=autocare-landing-page
FIREBASE_ADMIN_KEY={"type":"service_account",...}
```

---

## 📱 Build e Deploy - App Client (Mobile)

### Configuração do Projeto

```bash
cd app-client
pnpm install

# Sync Capacitor
pnpm exec cap sync
```

### capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'br.com.garageminteligente.app',
  appName: 'Garagem Inteligente',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10b981',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      iconColor: '#10b981'
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'keystore/garagem-inteligente.keystore',
      keystoreAlias: 'garagem-inteligente',
      releaseType: 'APK'
    }
  },
  ios: {
    scheme: 'Garagem Inteligente'
  }
}

export default config
```

### Build para Android

```bash
# 1. Build web assets
pnpm run build

# 2. Sync com Capacitor
pnpm exec cap sync android

# 3. Abrir no Android Studio
pnpm exec cap open android

# 4. Build Release APK/AAB
# No Android Studio:
# - Build > Generate Signed Bundle / APK
# - Selecionar keystore
# - Build Release

# Ou via CLI:
cd android
./gradlew assembleRelease
# APK gerado em: android/app/build/outputs/apk/release/app-release.apk

# Para Google Play (AAB):
./gradlew bundleRelease
# AAB gerado em: android/app/build/outputs/bundle/release/app-release.aab
```

### Criar Keystore Android

```bash
keytool -genkey -v \
  -keystore keystore/garagem-inteligente.keystore \
  -alias garagem-inteligente \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STRONG_PASSWORD \
  -keypass YOUR_STRONG_PASSWORD \
  -dname "CN=Garagem Inteligente, OU=Mobile, O=Garagem Inteligente, L=São Paulo, ST=SP, C=BR"
```

### Build para iOS

```bash
# 1. Build web assets
pnpm run build

# 2. Sync com Capacitor
pnpm exec cap sync ios

# 3. Abrir no Xcode
pnpm exec cap open ios

# 4. Configurar no Xcode:
# - Signing & Capabilities > Team
# - Product > Archive
# - Distribute App > App Store Connect
```

### Configurar iOS (Xcode)

1. **Signing & Capabilities**
   - Team: Selecionar Apple Developer Account
   - Bundle Identifier: `br.com.garageminteligente.app`
   - Provisioning Profile: Automatic

2. **Push Notifications**
   - Capabilities > Push Notifications (ativar)
   - APNs Key no Firebase Console

3. **Info.plist**
```xml
<key>NSCameraUsageDescription</key>
<string>Permitir câmera para fotos do veículo</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Acessar galeria para fotos do veículo</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Localização para encontrar oficinas próximas</string>
```

### Deploy PWA (Web)

```bash
# 1. Build
pnpm run build

# 2. Deploy
firebase deploy --only hosting:app-client-web

# 3. Verificar
open https://app.garageminteligente.com.br
```

### GitHub Actions (Mobile CI)

```yaml
# .github/workflows/deploy-app-client.yml
name: Build App Client

on:
  push:
    branches:
      - main
    paths:
      - 'app-client/**'
  workflow_dispatch:

jobs:
  build-android:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      
      - name: Install dependencies
        working-directory: app-client
        run: pnpm install --frozen-lockfile
      
      - name: Build web assets
        working-directory: app-client
        run: pnpm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Sync Capacitor
        working-directory: app-client
        run: pnpm exec cap sync android
      
      - name: Decode Keystore
        run: |
          echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > app-client/keystore/garagem-inteligente.keystore
      
      - name: Build Android APK
        working-directory: app-client/android
        run: ./gradlew assembleRelease
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: garagem-inteligente
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
      
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-release.apk
          path: app-client/android/app/build/outputs/apk/release/app-release.apk
  
  build-ios:
    runs-on: macos-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Install dependencies
        working-directory: app-client
        run: pnpm install --frozen-lockfile
      
      - name: Build web assets
        working-directory: app-client
        run: pnpm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Sync Capacitor
        working-directory: app-client
        run: pnpm exec cap sync ios
      
      - name: Build iOS Archive
        working-directory: app-client/ios/App
        run: |
          xcodebuild -workspace App.xcworkspace \
            -scheme App \
            -configuration Release \
            -archivePath App.xcarchive \
            archive
      
      - name: Upload Archive
        uses: actions/upload-artifact@v4
        with:
          name: app-ios.xcarchive
          path: app-client/ios/App/App.xcarchive
  
  deploy-pwa:
    runs-on: ubuntu-latest
    needs: [build-android, build-ios]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Install dependencies
        working-directory: app-client
        run: pnpm install --frozen-lockfile
      
      - name: Build
        working-directory: app-client
        run: pnpm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
          channelId: live
          target: app-client-web
          entryPoint: app-client
```

---

## 🔐 Secrets e Variáveis de Ambiente

### GitHub Secrets (Repository Settings)

```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
FIREBASE_MEASUREMENT_ID
FIREBASE_ADMIN_KEY (JSON service account)
FIREBASE_SERVICE_ACCOUNT (JSON para GitHub Actions)
FIREBASE_TOKEN (firebase login:ci)
ANDROID_KEYSTORE_BASE64 (base64 do .keystore)
KEYSTORE_PASSWORD
KEY_PASSWORD
APPLE_TEAM_ID
APPLE_CERTIFICATE_BASE64
APPLE_PROVISIONING_PROFILE_BASE64
```

### Como gerar Firebase Service Account

```bash
# Firebase Console > Project Settings > Service Accounts
# > Generate new private key

# Converter para base64 (para GitHub Secrets)
cat service-account.json | base64
```

### Como gerar Firebase Token (CI)

```bash
firebase login:ci

# Copiar token gerado e adicionar em GitHub Secrets
```

---

## 🧪 Testing antes do Deploy

### Landing Pages (SSG)

```bash
# Build local
pnpm run generate

# Preview
pnpm run preview

# Testes
pnpm run test
pnpm run test:e2e

# Lighthouse CI
npx lhci autorun
```

### Platform Workshop (SSR)

```bash
# Build local
pnpm run build

# Preview SSR
pnpm run preview

# Test com Firebase Emulator
firebase emulators:start --only hosting,functions

# Testes
pnpm run test
pnpm run test:e2e
```

### App Client (Mobile)

```bash
# Build web
pnpm run build

# Test no navegador
pnpm run dev

# Test no Android Emulator
pnpm exec cap run android

# Test no iOS Simulator
pnpm exec cap run ios

# Testes unitários
pnpm run test:unit

# Testes E2E mobile
pnpm run test:e2e:android
pnpm run test:e2e:ios
```

---

## 📊 Monitoramento Pós-Deploy

### Firebase Performance

```typescript
// Verificar métricas no Firebase Console
// Performance > Web ou App (iOS/Android)

// Métricas importantes:
// - First Contentful Paint (FCP) < 1.8s
// - Largest Contentful Paint (LCP) < 2.5s
// - First Input Delay (FID) < 100ms
// - Cumulative Layout Shift (CLS) < 0.1
// - Time to Interactive (TTI) < 3.8s
```

### Firebase Analytics

```typescript
// Verificar eventos no Firebase Console
// Analytics > Events

// Eventos importantes:
// - page_view
// - sign_up
// - login
// - add_vehicle
// - create_order
// - complete_order
// - app_open (mobile)
// - screen_view (mobile)
```

### Firebase Crashlytics (Mobile)

```typescript
// Verificar crashes no Firebase Console
// Crashlytics > Dashboard

// Monitorar:
// - Crash-free users %
// - Crash-free sessions %
// - Top crashes
// - ANRs (Android)
```

---

## 🚨 Rollback e Troubleshooting

### Rollback Firebase Hosting

```bash
# Listar deploys
firebase hosting:channel:list

# Ver versões anteriores
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live

# Rollback para versão anterior
firebase hosting:rollback
```

### Rollback Mobile Apps

**Android:**
```bash
# Google Play Console > Release > Production
# Selecionar versão anterior > "Create new release from this release"
```

**iOS:**
```bash
# App Store Connect > App > TestFlight ou App Store
# Não é possível rollback direto
# Submeter nova versão corrigida
```

### Debug Common Issues

**Build Failure (Nuxt):**
```bash
# Limpar cache
rm -rf .nuxt .output node_modules
pnpm install
pnpm run build

# Verificar TypeScript
pnpm exec nuxt typecheck

# Verificar env vars
echo $NUXT_PUBLIC_FIREBASE_API_KEY
```

**Firebase Deploy Error:**
```bash
# Re-login
firebase logout
firebase login

# Verificar projeto
firebase projects:list
firebase use PROJECT_ID

# Deploy com debug
firebase deploy --debug
```

**Capacitor Sync Issues:**
```bash
# Limpar e resync
rm -rf ios android
pnpm exec cap add android
pnpm exec cap add ios
pnpm exec cap sync
```

---

## ✅ Checklist de Deploy

### Landing Page Client
- [ ] Build local OK (`pnpm run generate`)
- [ ] Preview OK (`pnpm run preview`)
- [ ] Lighthouse score > 90
- [ ] SEO meta tags configurados
- [ ] Firebase Hosting target correto
- [ ] Deploy realizado
- [ ] DNS apontando corretamente
- [ ] SSL ativo
- [ ] Analytics funcionando

### Landing Page Workshop
- [ ] Build local OK
- [ ] Preview OK
- [ ] Lighthouse score > 90
- [ ] SEO meta tags configurados
- [ ] Firebase Hosting target correto
- [ ] Deploy realizado
- [ ] DNS apontando corretamente
- [ ] SSL ativo
- [ ] Analytics funcionando

### Platform Workshop
- [ ] Build local OK (`pnpm run build`)
- [ ] Preview SSR OK
- [ ] Autenticação funcionando
- [ ] Middleware de auth OK
- [ ] Firestore queries OK
- [ ] Storage upload OK
- [ ] Firebase Hosting + Functions deployed
- [ ] DNS configurado
- [ ] SSL ativo
- [ ] Performance monitoring ativo

### App Client - Android
- [ ] Build web OK
- [ ] Capacitor sync OK
- [ ] APK/AAB gerado
- [ ] Keystore configurado
- [ ] Firebase Analytics funcionando
- [ ] Push notifications OK
- [ ] Câmera funcionando
- [ ] Deep links configurados
- [ ] Testado em dispositivo físico
- [ ] Submetido para Google Play

### App Client - iOS
- [ ] Build web OK
- [ ] Capacitor sync OK
- [ ] Xcode build OK
- [ ] Signing configurado
- [ ] APNs configurado
- [ ] Firebase Analytics funcionando
- [ ] Push notifications OK
- [ ] Câmera funcionando
- [ ] Deep links configurados
- [ ] Testado em dispositivo físico
- [ ] Submetido para TestFlight/App Store

### App Client - PWA
- [ ] Build OK
- [ ] Service Worker funcionando
- [ ] Manifest.json configurado
- [ ] Icons corretos
- [ ] Firebase Hosting deployed
- [ ] DNS configurado
- [ ] SSL ativo
- [ ] Install prompt OK

---

## 📚 Recursos Adicionais

### Documentação

- [Nuxt Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Capacitor Deployment](https://capacitorjs.com/docs/deployment)
- [Ionic Deployment](https://ionicframework.com/docs/deployment/app-store)

### Tools

- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Ionic CLI](https://ionicframework.com/docs/cli)
- [Capacitor CLI](https://capacitorjs.com/docs/cli)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Próximo:** Implementação prática dos 4 projetos 🚀

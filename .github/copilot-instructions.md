# Garagem Inteligente - AI Coding Instructions

## 🏗️ Architecture Overview

This is an **Ionic Vue 8 + Capacitor** mobile app with Firebase backend for vehicle management and maintenance tracking.

### Core Stack
- **Frontend**: Ionic Vue 8 + Vue 3 Composition API + TypeScript
- **State**: Pinia stores with composable patterns
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Mobile**: Capacitor for iOS/Android with native plugins
- **Build**: Vite + custom Android build scripts

## 🗂️ Critical Architecture Patterns

### Component Organization (Atomic Design)
```
src/components/
├── atoms/          # Base Ionic wrappers (AButton, AInput, ACard)
├── molecules/      # Small composed components
├── organisms/      # Complex UI sections (ModernHeader)
└── index.ts        # Central exports
```

**Pattern**: All atoms are Ionic component wrappers with consistent prop interfaces. Use `AButton` instead of `ion-button` directly.

### State Management (Pinia + Firebase)
```typescript
// Store pattern: reactive refs + computed + async actions
const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)

// Firebase integration with error handling
const login = async (email: string, password: string) => {
  loading.value = true
  error.value = null
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    error.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}
```

### Navigation & Auth Guards
- **Protected routes**: Use `meta: { requiresAuth: true }`
- **Guest routes**: Use `meta: { requiresGuest: true }`
- **Auth initialization**: Router waits for Firebase auth state before navigation

### Firebase Data Patterns
```typescript
// Collection structure
users/{userId} → { name, email, userType: 'user' | 'workshop' }
vehicles/{vehicleId} → { userId, make, model, year, plate, ... }
maintenance/{maintenanceId} → { vehicleId, type, cost, date, ... }

// Query pattern with user isolation
const q = query(
  collection(db, 'vehicles'),
  where('userId', '==', authStore.user?.id),
  orderBy('createdAt', 'desc')
)
```

## 🔧 Development Workflows

### Mobile Development
```bash
# Development
pnpm dev                    # Web development server
npx cap sync               # Sync web build to native
npx cap run android        # Run on Android device/emulator

# Production builds
./scripts/build-android.sh         # Complete Android APK build
pnpm build && npx cap sync # Sync for native builds
```

### Environment Setup
- **Firebase config**: All env vars prefixed with `VITE_FIREBASE_`
- **Required files**: `.env` (from `.env.example`), `google-services.json` for Android
- **Validation**: Firebase config validates required env vars on startup

### Component Development Patterns
```vue
<template>
  <ion-page>
    <ModernHeader :title="pageTitle" />
    <ion-content class="custom-content">
      <!-- Always wrap in container for consistent styling -->
      <div class="container">
        <ACard v-for="item in items" :key="item.id">
          <!-- Content -->
        </ACard>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// Use Composition API with TypeScript
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Always type interfaces
interface PageData {
  id: string
  title: string
}

const authStore = useAuthStore()
const router = useRouter()
</script>
```

## 🎯 Project-Specific Conventions

### Error Handling
- **Global pattern**: `error.value = getErrorMessage(err)` using `utils/errorMessages.ts`
- **Loading states**: Always pair async operations with `loading.value` toggles
- **User feedback**: Use `ion-alert` for errors, `ion-toast` for success

### Data Persistence
- **File uploads**: Convert to base64 strings stored in Firestore documents
- **Images**: Store as `imageUrl?: string` (base64) in vehicle/maintenance records
- **Timestamps**: Use Firebase `Timestamp` for consistent timezone handling

### Navigation Patterns
```typescript
// Programmatic navigation with type safety
const handleNavigation = (path: string) => {
  router.push(path)
}

// Modal-style pages for forms (vehicle/new, maintenance/new)
// Tab-based navigation for main sections
```

### Build & Deployment
  - **Android builds**: Use `./scripts/build-android.sh` script (handles pnpm build + cap sync + gradle)
- **Version management**: `src/version.json` tracks app version
- **CI/CD**: Check `docs/CI-CD-*.md` for deployment workflows

## 🔍 Key Integration Points

### Capacitor Plugins
```typescript
// Camera for vehicle photos
import { Camera, CameraResultType } from '@capacitor/camera'

// Geolocation for workshop finder
import { Geolocation } from '@capacitor/geolocation'

// Always handle permissions and platform differences
```

### Firebase Services
- **Auth**: Email/password with user profiles in Firestore
- **Firestore**: Document-based with user data isolation
- **Storage**: File uploads via base64 conversion (no direct Storage API usage)
- **Functions**: Background processing for notifications

When working on this codebase, prioritize mobile-first responsive design, ensure Firebase offline support, and maintain the atomic component structure. Always test on both web (`pnpm dev`) and native platforms (`npx cap run android`) before committing.

🎨 UI/UX Development Standards
Styling Architecture
REQUIRED: All new pages and components MUST use:

SCSS with scoped styles (<style scoped lang="scss">)
CSS Variables for colors from src/theme/variables.scss
Create new CSS variables when needed following existing naming conventions

vue<style scoped lang="scss">
.my-component {
  background: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast);
  // Use existing variables or create new ones in variables.scss
}
</style>

## 🎨 CSS Architecture & Advanced Selector Nesting

MANDATORY: Use advanced SCSS nesting with parent selectors (&) and direct child combinators (>) for better performance and maintainability:

### ✅ CORRECT: Advanced Nesting Pattern
```scss
.component {
  // Base styles
  
  &:hover {
    // Hover states using parent selector
  }
  
  > .child-element {
    // Direct child targeting
    
    &:hover {
      // Nested hover states
    }
  }
  
  &-modifier {
    // BEM-style modifiers
  }
}
```

### ❌ WRONG: Traditional CSS Approach
```scss
.component:hover { /* Avoid separate hover rules */ }
.component .child-element:hover { /* Avoid descendant selectors */ }
.component-modifier { /* Avoid separate modifier classes */ }
```

### Key Principles:
- **Parent Selectors (`&`)**: Use `&:hover`, `&:focus`, `&:active` for state management
- **Direct Children (`>`)**: Use `> .child` for precise targeting and better performance
- **BEM Modifiers (`&-modifier`)**: Use `&-success`, `&-error` for component variants
- **Hierarchical Nesting**: Maximum 4 levels deep to maintain readability
- **Avoid Descendant Selectors**: Never use `.parent .child` - use direct targeting instead

Responsive Design Priority
Mobile-First Approach: Every UI element must be:

Optimized for mobile (primary target)
Responsive for desktop (secondary)
Tested on both before completion

Use Ionic's responsive grid and breakpoint utilities. Reference ProfilePage and DashboardPage for design consistency.
📦 Code Organization Principles
Single Responsibility Rule
MANDATORY: Break down code into smaller units:

Components: Extract reusable UI into separate components (atoms/molecules/organisms)
Composables: Move business logic to src/composables/ (e.g., useVehicles.ts, useMaintenance.ts)
Utils: Pure functions go to src/utils/ (e.g., formatters.ts, validators.ts)

Goal: Keep files under 200 lines when possible. Large files indicate refactoring opportunities.
Component Reusability Check
BEFORE creating new components, ALWAYS:

Check src/components/atoms/ for existing base components
Check src/components/molecules/ for composed patterns
Verify if similar UI exists in ProfilePage or DashboardPage
Reuse existing components instead of duplicating code

Example: Need an input? Use AInput from atoms, don't create a new one.
🔤 TypeScript & Type Safety
Strict Typing Requirements
ALL code must be fully typed:

Props: Use defineProps<PropsInterface>()
Functions: Explicit return types
Data structures: Define interfaces in src/types/
Store state: Type all refs and computed properties

typescript// ✅ CORRECT: Fully typed
interface Vehicle {
  id: string
  make: string
  model: string
  year: number
}

const getVehicle = async (id: string): Promise<Vehicle | null> => {
  // Implementation
}

// ❌ WRONG: Missing types
const getVehicle = async (id) => {
  // Implementation
}
No any types unless absolutely necessary with documented justification.
💬 Code Comments & Documentation
Language & Comment Policy

All comments in Portuguese (PT-BR)
Comment only when necessary: Explain WHY, not WHAT
Complex logic: Add brief explanation
Public APIs: Document parameters and return values

typescript// ✅ BOM: Explica o motivo
// Usa throttle para evitar chamadas excessivas à API do Firebase
const debouncedSearch = debounce(searchVehicles, 300)

// ❌ RUIM: Óbvio demais
// Define a variável loading como true
loading.value = true
Documentation Standards
Create documentation ONLY for:

Pending tasks: docs/TODO.md
Completed features: docs/CHANGELOG.md
Complex workflows: Architecture decisions, integration patterns
Useful tutorials: Setup guides, deployment processes

Avoid: Over-documenting simple code, redundant READMEs, excessive inline docs.
⚡ Performance & Compatibility
Cross-Platform Requirements
EVERY feature must work on:

✅ Android (primary target)
✅ iOS (test when possible)
✅ Web (development environment)

Reactivity Best Practices

Use ref() and computed() correctly
Avoid unnecessary watchers
Lazy-load heavy components with defineAsyncComponent()
Optimize list rendering with v-for keys

Performance Checklist

 Images optimized (compressed, proper formats)
 Large lists use virtual scrolling when needed
 Firebase queries limited and indexed
 No memory leaks (cleanup in onUnmounted)

♿ Accessibility & Visual Standards
Design Consistency
Reference components for design patterns:

ProfilePage: Color schemes, spacing, typography
DashboardPage: Card layouts, navigation patterns, data visualization

Maintain consistent:

Button styles and states
Card shadows and borders
Icon usage and sizing
Spacing scale (8px grid system)

Accessibility Requirements
MANDATORY for all UI:

Color contrast: Minimum WCAG AA (4.5:1 for text)
Touch targets: Minimum 44x44px for mobile
ARIA labels: All interactive elements
Keyboard navigation: Focusable and logical tab order
Screen reader support: Semantic HTML and Ionic components

vue<!-- ✅ CORRETO: Acessível -->
<ion-button 
  aria-label="Adicionar novo veículo"
  @click="addVehicle"
>
  <ion-icon :icon="add" />
</ion-button>

<!-- ❌ ERRADO: Sem contexto -->
<ion-button @click="addVehicle">
  <ion-icon :icon="add" />
</ion-button>
SEO Optimization

Semantic HTML5 tags
Meta tags for web version
Descriptive page titles
Alt text for all images

🤝 Communication Guidelines
When Uncertain
ALWAYS ask for clarification when:

Instructions are ambiguous
Requirements conflict with existing patterns
Unsure about implementation approach
Need more context about user needs

Communicate clearly:

"Não entendi [parte específica]. Você pode explicar melhor?"
"Existem duas abordagens possíveis: A ou B. Qual prefere?"
"Não tenho certeza sobre [aspecto]. Preciso de mais detalhes sobre [contexto]."

Never assume - clarity prevents rework.
🎯 Quality Checklist
Before marking any task as complete, verify:

 Follows Atomic Design structure
 Uses SCSS scoped styles with CSS variables and advanced selector nesting (&:hover, >.-modifier)
 Fully typed with TypeScript
 Mobile-first responsive design
 Reuses existing components when possible
 Code split into appropriate composables/utils
 Comments in Portuguese (when necessary)
 Accessible (contrast, ARIA, keyboard navigation)
 Tested on mobile and desktop
 Matches design system from ProfilePage/DashboardPage
 No performance regressions
 Works on Android and iOS (when applicable)

 sempre verifique se já há um terminal rodando o código que você queria rodar, se já houver terminais sem utilizado, utilize-os antes de abrir novos.
antes de perdir permissão para executar um comando no terminal, explique brevemente o que aquele comando fará de forma didática.
as alterações no firebase NUNCA devem impactar dados reais dos usuários sem um aviso prévio e autorização explícita.

 deve também iniciar e utilizar os mcps disponíveis, sem depender que eu solicite isso explicitamente.
- nesse projeto usamos PNPM e não NPM
 deve seguir sem excessão essa sequencia antes de commitar uma nova feature ou uma correção de bug:
  - sempre que rodar testes unitários já rode com o comando para finaliza-lo automaticamente após a conclusão, sem necessidade de intervenção manual.
  - type-check: verificar se todo o código novo ou modificado está devidamente tipado em TypeScript, sem uso de any desnecessário.
  - lint: rodar o linter para garantir que o código segue os padrões de estilo definidos no projeto.
  - verificar se há avisos, warnings, erros ou informação de itens depreciados, caso haja, corrigir antes de prosseguir, sem excessão.
  - após chegado até aqui, vamos rodar os testes unitários existentes para aquela página garantindo que nada foi quebrado
  - caso não exista testes para aquela página / componente, me pergunte se deve criar novos testes unitaários.
  - rode os testes unitarios garantindo que todos passem sem erros, warnings ou avisos.
  - sempre que rodar um teste coloque um fallback para rodar em modo watch, assim caso haja necessidade de rodar novamente, o ambiente já estará pronto.
  - por fim, rode a aplicação localmente usando 'pnpm dev' e verifique manualmente se tudo está funcionando conforme esperado naquela página / componente modificado ou criado.
  - sempre que possível, escreva testes unitários para qualquer nova funcionalidade ou correção de bug.
  - faça o commit em portugues e em topicos que identifiquem o que foi alterado para ser utilizado na geração do changelog automaticamente.
  faça um resumo pequeno no chat do que foi alterado, criado ou corrigido e pergunte se há mais algo a ser feito antes de finalizar.

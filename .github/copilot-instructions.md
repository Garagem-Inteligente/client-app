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
./build-android.sh         # Complete Android APK build
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
- **Android builds**: Use `./build-android.sh` script (handles pnpm build + cap sync + gradle)
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
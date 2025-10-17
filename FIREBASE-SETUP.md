# 🔥 Guia de Setup do Firebase - Garagem Inteligente

**Projeto:** Garagem Inteligente (migração do autocare-landing-page)  
**Modelo:** Um projeto Firebase, múltiplos sites (hosting targets)

---

## 📋 Visão Geral

### Estratégia: Projeto Firebase Único

**Por quê?**
- ✅ Reutilizar dados existentes (users, vehicles, orders)
- ✅ Autenticação compartilhada
- ✅ Custo otimizado (1 projeto Blaze)
- ✅ Migração transparente para usuários
- ✅ Gerenciamento centralizado

**Recursos utilizados:**
- 🔐 Authentication (Email/Password, Google, Apple)
- 📊 Firestore Database
- 📦 Cloud Storage
- 🌐 Hosting (4 sites)
- ☁️ Cloud Functions (opcional)
- 📨 Cloud Messaging (FCM)
- 📈 Analytics

---

## 🚀 Setup Inicial

### 1. Configurar Multiple Sites no Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Selecionar projeto existente
firebase use --add
# Escolha o projeto: autocare-landing-page (ou seu ID)
# Alias: production

# Criar sites adicionais (Firebase Console ou CLI)
firebase hosting:sites:create garageminteligente
firebase hosting:sites:create oficina-garageminteligente
firebase hosting:sites:create oficina-dashboard-garageminteligente
firebase hosting:sites:create app-garageminteligente
```

### 2. Configurar Domínios Personalizados

No **Firebase Console** > **Hosting** > **Add custom domain**:

1. **garageminteligente.com.br**
   - Site: `garageminteligente`
   - DNS: Configure A/AAAA records conforme instruções

2. **oficina.garageminteligente.com.br**
   - Site: `oficina-garageminteligente`
   - DNS: CNAME apontando para Firebase

3. **oficina.garageminteligente.com.br/dashboard** (routing)
   - Site: `oficina-dashboard-garageminteligente`
   - Ou usar rewrites no mesmo site

4. **app.garageminteligente.com.br** (PWA)
   - Site: `app-garageminteligente`
   - DNS: CNAME apontando para Firebase

---

## 📁 Estrutura do Firestore

### Collections Principais

```
firestore/
├── users/                          (Usuários - clientes e oficinas)
│   └── {userId}/
│       ├── email: string
│       ├── name: string
│       ├── phone: string
│       ├── role: "client" | "workshop"
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       ├── profile: {
│       │   cpf?: string (clientes)
│       │   cnpj?: string (oficinas)
│       │   address?: {...}
│       │   avatar?: string (Storage URL)
│       │ }
│       └── [subcollections]
│           ├── vehicles/         (veículos do cliente)
│           └── notifications/    (notificações do usuário)
│
├── workshops/                      (Dados públicos das oficinas)
│   └── {workshopId}/              (workshopId = userId da oficina)
│       ├── userId: ref(users/{userId})
│       ├── name: string
│       ├── description: string
│       ├── phone: string
│       ├── email: string
│       ├── address: {
│       │   street: string
│       │   number: string
│       │   city: string
│       │   state: string
│       │   zipCode: string
│       │   coordinates: geopoint
│       │ }
│       ├── services: string[]    (serviços oferecidos)
│       ├── workingHours: {
│       │   monday: { open: "08:00", close: "18:00" }
│       │   tuesday: {...}
│       │   ...
│       │ }
│       ├── rating: number        (0-5)
│       ├── totalReviews: number
│       ├── photos: string[]      (Storage URLs)
│       ├── isActive: boolean
│       ├── createdAt: timestamp
│       └── [subcollections]
│           └── reviews/          (avaliações da oficina)
│
├── vehicles/                       (Veículos cadastrados)
│   └── {vehicleId}/
│       ├── userId: ref(users/{userId})
│       ├── plate: string
│       ├── brand: string         (marca)
│       ├── model: string
│       ├── year: number
│       ├── color: string
│       ├── fuelType: "gasoline" | "ethanol" | "diesel" | "flex" | "electric"
│       ├── mileage: number       (km rodados)
│       ├── photos: string[]      (Storage URLs)
│       ├── documents: {
│       │   renavam: string
│       │   chassis: string
│       │ }
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── orders/                         (Ordens de Serviço)
│   └── {orderId}/
│       ├── clientId: ref(users/{clientId})
│       ├── workshopId: ref(users/{workshopId})
│       ├── vehicleId: ref(vehicles/{vehicleId})
│       ├── status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
│       ├── services: [
│       │   {
│       │     name: string
│       │     description: string
│       │     price: number
│       │   }
│       │ ]
│       ├── scheduledDate: timestamp
│       ├── completedDate?: timestamp
│       ├── totalPrice: number
│       ├── paymentStatus: "pending" | "paid"
│       ├── notes: string
│       ├── photos: {
│       │   before: string[]      (Storage URLs)
│       │   after: string[]
│       │ }
│       ├── timeline: [
│       │   {
│       │     status: string
│       │     timestamp: timestamp
│       │     note: string
│       │   }
│       │ ]
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── reviews/                        (Avaliações das oficinas)
│   └── {reviewId}/
│       ├── workshopId: ref(workshops/{workshopId})
│       ├── clientId: ref(users/{clientId})
│       ├── orderId: ref(orders/{orderId})
│       ├── rating: number        (1-5)
│       ├── comment: string
│       ├── photos: string[]
│       ├── response?: {          (resposta da oficina)
│       │   text: string
│       │   timestamp: timestamp
│       │ }
│       └── createdAt: timestamp
│
└── notifications/                  (Notificações push)
    └── {notificationId}/
        ├── userId: ref(users/{userId})
        ├── title: string
        ├── body: string
        ├── type: "order_update" | "review" | "promotion" | "system"
        ├── data: map           (dados específicos do tipo)
        ├── read: boolean
        ├── sentAt: timestamp
        └── createdAt: timestamp
```

### Indexes Necessários

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clientId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "workshopId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "scheduledDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "workshops",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isActive", "order": "ASCENDING" },
        { "fieldPath": "rating", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "workshopId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 🔒 Security Rules

### Firestore Rules

```javascript
// firestore.rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isWorkshop() {
      return isAuthenticated() && getUserRole() == 'workshop';
    }
    
    function isClient() {
      return isAuthenticated() && getUserRole() == 'client';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false; // Soft delete apenas
      
      // Vehicles subcollection
      match /vehicles/{vehicleId} {
        allow read: if isOwner(userId) || isWorkshop();
        allow write: if isOwner(userId);
      }
      
      // Notifications subcollection
      match /notifications/{notificationId} {
        allow read: if isOwner(userId);
        allow write: if false; // Apenas Functions podem escrever
      }
    }
    
    // Workshops collection (dados públicos)
    match /workshops/{workshopId} {
      allow read: if true; // Public para listagem
      allow create: if isWorkshop() && request.auth.uid == workshopId;
      allow update: if isOwner(workshopId);
      allow delete: if false;
      
      // Reviews subcollection
      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if isClient();
        allow update: if isOwner(resource.data.clientId) && 
                         request.resource.data.rating == resource.data.rating; // Não pode mudar rating
        allow delete: if false;
      }
    }
    
    // Vehicles collection (global)
    match /vehicles/{vehicleId} {
      allow read: if isOwner(resource.data.userId) || isWorkshop();
      allow write: if isOwner(resource.data.userId);
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.clientId) || 
                     isOwner(resource.data.workshopId);
      
      allow create: if isClient() && 
                       request.auth.uid == request.resource.data.clientId;
      
      allow update: if isOwner(resource.data.workshopId) || 
                       (isOwner(resource.data.clientId) && 
                        resource.data.status == 'pending'); // Cliente só pode cancelar se pending
      
      allow delete: if false; // Soft delete apenas
    }
    
    // Reviews collection (global)
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isClient() && 
                       request.auth.uid == request.resource.data.clientId;
      allow update: if isOwner(resource.data.clientId) ||
                       (isOwner(resource.data.workshopId) && 
                        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['response']));
      allow delete: if false;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isOwner(resource.data.userId);
      allow write: if false; // Apenas Functions podem escrever
    }
  }
}
```

### Storage Rules

```javascript
// storage.rules
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isImageFile() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024; // 5MB
    }
    
    // User avatars
    match /users/{userId}/avatar/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) && 
                      isImageFile() && 
                      isValidSize();
    }
    
    // Vehicle photos
    match /vehicles/{vehicleId}/photos/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated() && 
                      isImageFile() && 
                      isValidSize();
    }
    
    // Workshop photos
    match /workshops/{workshopId}/photos/{fileName} {
      allow read: if true;
      allow write: if isOwner(workshopId) && 
                      isImageFile() && 
                      isValidSize();
    }
    
    // Order photos (before/after)
    match /orders/{orderId}/photos/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
                      isImageFile() && 
                      isValidSize();
    }
    
    // Review photos
    match /reviews/{reviewId}/photos/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated() && 
                      isImageFile() && 
                      isValidSize();
    }
  }
}
```

---

## 🔐 Authentication Setup

### Provedores Habilitados

```bash
# Firebase Console > Authentication > Sign-in method

1. Email/Password ✅
   - Ativar
   - Não exigir verificação de email (por ora)

2. Google ✅
   - Ativar
   - Configurar OAuth consent screen
   - Adicionar domínios autorizados:
     - garageminteligente.com.br
     - oficina.garageminteligente.com.br
     - app.garageminteligente.com.br

3. Apple (iOS) ✅
   - Ativar
   - Configurar Apple Developer Console
   - Service ID: br.com.garageminteligente.signin
   - Adicionar domínios e redirect URLs
```

### Custom Claims (para roles)

```typescript
// functions/src/auth.ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

// Trigger quando usuário é criado
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Buscar role no Firestore
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(user.uid)
    .get()
  
  const role = userDoc.data()?.role || 'client'
  
  // Setar custom claim
  await admin.auth().setCustomUserClaims(user.uid, { role })
  
  console.log(`User ${user.uid} created with role: ${role}`)
})

// Função para atualizar role manualmente (admin only)
export const setUserRole = functions.https.onCall(async (data, context) => {
  // Verificar se é admin
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set user roles'
    )
  }
  
  const { userId, role } = data
  
  if (!['client', 'workshop', 'admin'].includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid role'
    )
  }
  
  // Atualizar Firestore
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .update({ role })
  
  // Atualizar custom claim
  await admin.auth().setCustomUserClaims(userId, { role })
  
  return { success: true, userId, role }
})
```

---

## 📨 Cloud Messaging (FCM) Setup

### 1. Configurar FCM no Firebase Console

```
Firebase Console > Project Settings > Cloud Messaging
- Ativar Firebase Cloud Messaging API
- Gerar Server Key (legacy)
- Copiar Sender ID
```

### 2. Configurar nos Apps

**Web (PWA):**
```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "..."
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload)
  
  const { title, body, icon } = payload.notification
  
  self.registration.showNotification(title, {
    body,
    icon: icon || '/icon-192x192.png',
    badge: '/badge-72x72.png'
  })
})
```

**iOS:**
```swift
// AppDelegate.swift
import Firebase
import FirebaseMessaging

func application(_ application: UIApplication, 
                didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
  FirebaseApp.configure()
  
  UNUserNotificationCenter.current().delegate = self
  application.registerForRemoteNotifications()
  
  Messaging.messaging().delegate = self
  
  return true
}
```

**Android:**
```kotlin
// AndroidManifest.xml
<service
    android:name=".FirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

### 3. Salvar FCM Tokens no Firestore

```typescript
// composables/usePushNotifications.ts
export const usePushNotifications = () => {
  const { currentUser } = useAuth()
  
  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      const messaging = getMessaging()
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      })
      
      // Salvar token no Firestore
      if (currentUser.value) {
        await updateDoc(doc(db, 'users', currentUser.value.uid), {
          fcmTokens: arrayUnion(token)
        })
      }
    }
  }
  
  return { requestPermission }
}
```

---

## 🌐 Hosting Configuration

### firebase.json (Multi-site)

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": [
    {
      "target": "landing-client",
      "public": "dist",
      "site": "garageminteligente",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "cleanUrls": true,
      "trailingSlash": false,
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "**/*.@(jpg|jpeg|gif|png|webp|svg)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=31536000"
            }
          ]
        }
      ]
    },
    {
      "target": "landing-workshop",
      "public": "dist",
      "site": "oficina-garageminteligente",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "platform-workshop",
      "public": "dist",
      "site": "oficina-dashboard-garageminteligente",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "app-client-web",
      "public": "www",
      "site": "app-garageminteligente",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ],
  "functions": {
    "source": "functions",
    "runtime": "nodejs20",
    "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"]
  }
}
```

### .firebaserc (Targets)

```json
{
  "projects": {
    "default": "autocare-landing-page",
    "production": "autocare-landing-page"
  },
  "targets": {
    "autocare-landing-page": {
      "hosting": {
        "landing-client": [
          "garageminteligente"
        ],
        "landing-workshop": [
          "oficina-garageminteligente"
        ],
        "platform-workshop": [
          "oficina-dashboard-garageminteligente"
        ],
        "app-client-web": [
          "app-garageminteligente"
        ]
      }
    }
  }
}
```

---

## 🚀 Deploy Commands

### Deploy Individual

```bash
# Landing Client
cd landing-page-client
npm run generate
firebase deploy --only hosting:landing-client

# Landing Workshop
cd landing-page-workshop
npm run generate
firebase deploy --only hosting:landing-workshop

# Platform Workshop
cd platform-workshop
npm run build
firebase deploy --only hosting:platform-workshop

# App Client (Web/PWA)
cd app-client
npm run build
firebase deploy --only hosting:app-client-web
```

### Deploy All

```bash
# Deploy todas as rules primeiro
firebase deploy --only firestore:rules,storage:rules

# Deploy todos os sites
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions
```

---

## 📊 Monitoramento e Analytics

### Firebase Analytics

```typescript
// composables/useAnalytics.ts
import { logEvent, setUserProperties } from 'firebase/analytics'

export const useAnalytics = () => {
  const analytics = getAnalytics()
  
  const trackPageView = (pageName: string) => {
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      page_location: window.location.href
    })
  }
  
  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    logEvent(analytics, eventName, params)
  }
  
  const setUserProps = (props: Record<string, any>) => {
    setUserProperties(analytics, props)
  }
  
  return {
    trackPageView,
    trackEvent,
    setUserProps
  }
}
```

### Performance Monitoring

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: 'https://www.gstatic.com/firebasejs/performance-standalone.js',
          defer: true
        }
      ]
    }
  }
})
```

---

## ✅ Checklist de Setup

- [ ] Projeto Firebase selecionado
- [ ] 4 sites de hosting criados
- [ ] Domínios personalizados configurados
- [ ] DNS apontando para Firebase
- [ ] Firestore rules atualizadas
- [ ] Storage rules configuradas
- [ ] Indexes do Firestore criados
- [ ] Authentication providers habilitados
- [ ] FCM configurado
- [ ] Cloud Functions deployadas
- [ ] Analytics habilitado
- [ ] Performance Monitoring ativo

---

**Próximo documento:** `DEPLOYMENT-GUIDE.md` (processo completo de deploy)

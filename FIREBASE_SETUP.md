# 🔒 Firebase Security Rules - AutoCare Platform

## Firestore Security Rules

**IMPORTANTE:** Configure estas regras no Firebase Console antes de colocar em produção!

### Como Configurar

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `autocare-platform`
3. Vá em **Firestore Database** → **Rules**
4. Cole as regras abaixo e clique em **Publish**

### Regras de Segurança

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Função para verificar se o usuário é o dono do recurso
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Regras para a coleção de veículos
    match /vehicles/{vehicleId} {
      // Permitir leitura apenas dos próprios veículos
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      
      // Permitir criação apenas se o userId corresponde ao usuário autenticado
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.keys().hasAll(['make', 'model', 'year', 'plate', 'mileage', 'fuelType', 'userId', 'createdAt', 'updatedAt']);
      
      // Permitir atualização apenas do próprio veículo
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.userId == request.auth.uid;
      
      // Permitir exclusão apenas do próprio veículo
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Regras para a coleção de manutenções
    match /maintenance/{maintenanceId} {
      // Função para verificar se o veículo pertence ao usuário
      function vehicleBelongsToUser(vehicleId) {
        return isAuthenticated() && 
               exists(/databases/$(database)/documents/vehicles/$(vehicleId)) &&
               get(/databases/$(database)/documents/vehicles/$(vehicleId)).data.userId == request.auth.uid;
      }
      
      // Permitir leitura se o veículo pertence ao usuário
      allow read: if vehicleBelongsToUser(resource.data.vehicleId);
      
      // Permitir criação se o veículo pertence ao usuário
      allow create: if isAuthenticated() && 
                       vehicleBelongsToUser(request.resource.data.vehicleId) &&
                       request.resource.data.keys().hasAll(['vehicleId', 'type', 'description', 'cost', 'mileage', 'date', 'createdAt']);
      
      // Permitir atualização se o veículo pertence ao usuário
      allow update: if isAuthenticated() && 
                       vehicleBelongsToUser(resource.data.vehicleId) &&
                       request.resource.data.vehicleId == resource.data.vehicleId;
      
      // Permitir exclusão se o veículo pertence ao usuário
      allow delete: if vehicleBelongsToUser(resource.data.vehicleId);
    }
    
    // Bloquear acesso a todas as outras coleções
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Explicação das Regras

#### 1. **Coleção `vehicles`**
- **Read:** Usuário só pode ler seus próprios veículos
- **Create:** Usuário só pode criar veículos para si mesmo
- **Update:** Usuário só pode atualizar seus próprios veículos
- **Delete:** Usuário só pode deletar seus próprios veículos

#### 2. **Coleção `maintenance`**
- **Read:** Usuário só pode ler manutenções de seus próprios veículos
- **Create:** Usuário só pode criar manutenções para seus próprios veículos
- **Update:** Usuário só pode atualizar manutenções de seus próprios veículos
- **Delete:** Usuário só pode deletar manutenções de seus próprios veículos

#### 3. **Validações Incluídas**
- ✅ Verificação de autenticação
- ✅ Verificação de propriedade (userId)
- ✅ Verificação de campos obrigatórios
- ✅ Proteção contra modificação de userId
- ✅ Bloqueio padrão para outras coleções

---

## 🧪 Como Testar as Regras

### No Firebase Console

1. Vá em **Firestore Database** → **Rules** → **Rules Playground**
2. Teste diferentes cenários:

#### Teste 1: Ler Veículos (Sucesso)
```javascript
// Configuração
Simular como: Authenticated
Auth UID: user123

// Operação
get /databases/(default)/documents/vehicles/vehicle1

// Dados do documento
{
  userId: "user123",
  make: "Toyota",
  model: "Corolla"
}

// Resultado esperado: ✅ Allow
```

#### Teste 2: Ler Veículos de Outro Usuário (Falha)
```javascript
// Configuração
Simular como: Authenticated
Auth UID: user123

// Operação
get /databases/(default)/documents/vehicles/vehicle2

// Dados do documento
{
  userId: "user456",
  make: "Honda",
  model: "Civic"
}

// Resultado esperado: ❌ Deny
```

#### Teste 3: Criar Veículo (Sucesso)
```javascript
// Configuração
Simular como: Authenticated
Auth UID: user123

// Operação
create /databases/(default)/documents/vehicles/vehicle3

// Dados da requisição
{
  userId: "user123",
  make: "Ford",
  model: "Focus",
  year: 2023,
  plate: "ABC-1234",
  mileage: 5000,
  fuelType: "gasoline",
  createdAt: timestamp,
  updatedAt: timestamp
}

// Resultado esperado: ✅ Allow
```

---

## 📱 Firebase Hosting - Deploy

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Fazer Login

```bash
firebase login
```

### 3. Inicializar Projeto

```bash
firebase init
```

**Seleções:**
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Use an existing project → autocare-platform
- 📁 Public directory: `dist`
- ✅ Configure as a single-page app: **Yes**
- ❌ Set up automatic builds with GitHub: **No** (por enquanto)
- ❌ Overwrite index.html: **No**

### 4. Build da Aplicação

```bash
npm run build
```

### 5. Deploy

```bash
firebase deploy
```

### 6. Verificar Deploy

Acesse a URL fornecida, algo como:
```
https://autocare-platform.web.app
```

---

## 🔐 Variáveis de Ambiente no Production

### Opção 1: Firebase Hosting (Recomendado)

As variáveis de ambiente no Vite são processadas em **build time**, não runtime. Isso significa que as variáveis já vêm "baked" no bundle final.

**Não é necessário** configurar variáveis de ambiente no servidor, pois:
1. As chaves do Firebase são **públicas por design** (protegidas por Security Rules)
2. As variáveis já estão no build (`dist/`)

### Opção 2: Múltiplos Ambientes

Se precisar de diferentes ambientes (dev, staging, prod):

#### .env.development
```bash
VITE_FIREBASE_API_KEY=dev_key_here
VITE_FIREBASE_PROJECT_ID=autocare-dev
# ...
```

#### .env.production
```bash
VITE_FIREBASE_API_KEY=prod_key_here
VITE_FIREBASE_PROJECT_ID=autocare-platform
# ...
```

**Build para produção:**
```bash
npm run build -- --mode production
```

---

## 🔍 Monitoramento e Analytics

### Firebase Analytics

Já configurado! Apenas certifique-se de que está funcionando:

1. Acesse Firebase Console → Analytics
2. Verifique eventos automáticos (page_view, etc.)
3. Adicione eventos personalizados se necessário

### Exemplo de Evento Customizado

```typescript
import { analytics } from '@/firebase/config'
import { logEvent } from 'firebase/analytics'

// Em qualquer componente
const handleAddVehicle = async () => {
  await vehiclesStore.addVehicle(formData.value)
  
  // Log evento
  if (analytics) {
    logEvent(analytics, 'vehicle_added', {
      make: formData.value.make,
      model: formData.value.model,
      fuelType: formData.value.fuelType
    })
  }
}
```

---

## 🚨 Checklist Pré-Deploy

Antes de fazer o primeiro deploy em produção, verifique:

- [ ] ✅ Firestore Security Rules configuradas
- [ ] ✅ Firebase Authentication habilitado (Email/Password)
- [ ] ✅ Variáveis de ambiente configuradas (.env)
- [ ] ✅ Build de produção funcionando (`npm run build`)
- [ ] ✅ Testes manuais realizados
- [ ] ✅ Verificar se .env está no .gitignore
- [ ] ✅ Analytics configurado
- [ ] ⚠️ Domínio customizado (opcional)
- [ ] ⚠️ SSL/HTTPS (automático no Firebase Hosting)

---

## 📊 Monitoramento de Custos

### Como Monitorar Uso (Firebase Console)

1. Acesse **Project Settings** → **Usage and Billing**
2. Verifique:
   - Authentication: Usuários ativos mensais (MAU)
   - Firestore: Leituras, escritas, storage
   - Hosting: Bandwidth, storage
   - Storage: GB armazenado (Fase 2)

### Alertas de Cota

Configure alertas para ser notificado antes de atingir limites:

1. Vá em **Project Settings** → **Usage and Billing** → **Details & Settings**
2. Configure **Budget alerts**
3. Defina limite (ex: R$ 10/mês) e email de notificação

---

## 🐛 Troubleshooting Comum

### Erro: "Missing or insufficient permissions"
**Causa:** Security Rules bloqueando acesso
**Solução:** Verifique se as regras estão publicadas corretamente

### Erro: "Firebase: Error (auth/network-request-failed)"
**Causa:** Problemas de rede ou CORS
**Solução:** Verifique configuração de domínios autorizados

### Build quebrado após mudanças
**Causa:** Variáveis de ambiente não configuradas
**Solução:** Verifique se o arquivo .env existe e está correto

### Deploy falha com erro 403
**Causa:** Permissões insuficientes
**Solução:** Execute `firebase login` novamente

---

## 📞 Suporte

### Recursos Oficiais
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Status](https://status.firebase.google.com/)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)

### Logs e Debug
```bash
# Ver logs do Firestore
firebase firestore:logs

# Ver logs do Hosting
firebase hosting:logs

# Debug mode
DEBUG=* firebase deploy
```

---

**Última atualização:** 12 de outubro de 2025
**Versão:** 1.0.0

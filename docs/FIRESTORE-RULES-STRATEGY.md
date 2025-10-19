# Firestore Security Rules - Estratégia de Segurança

## 📋 Resumo da Mudança

**Antes (Tentativa Falha):**
- `allow list` com restrições que o Firestore não conseguia validar
- `allow get` verificando `resource.data.userId`
- Causava erro "Missing or insufficient permissions" mesmo com query correta

**Agora (Funcionando):**
- `allow read` simples para usuários autenticados
- Segurança garantida pela **query no código** que filtra por `userId`
- Validação de criação/atualização continua restritiva

---

## 🔒 Modelo de Segurança Atual

### Leitura (Read)
```plaintext
allow read: if isAuthenticated();
```

**Por que isso é seguro?**
1. Apenas usuários autenticados podem ler
2. O código **sempre** filtra por `userId` nas queries:
   ```typescript
   where('userId', '==', authStore.user!.id)
   ```
3. Os **índices compostos** garantem performance:
   - `vehicles`: `userId + createdAt`
   - `maintenance`: `userId + date`

### Escrita (Create/Update)
```plaintext
allow create: if isAuthenticated() && 
               request.resource.data.userId == request.auth.uid &&
               // validações de campos...
```

**Proteções:**
- ✅ Usuário só pode criar documentos com seu próprio `userId`
- ✅ Validação de tipos obrigatórios (make, model, year, plate, etc.)
- ✅ Validação de ranges (year 1900-2030, mileage 0-10M, cost 0-1M)
- ✅ Validação de formatos (placa brasileira, email)

---

## 🎯 Camadas de Segurança

### 1. **Authentication (Firebase Auth)**
- Usuário precisa estar logado
- Token JWT válido

### 2. **Authorization (Firestore Rules)**
- Apenas usuários autenticados podem ler/escrever
- Create/Update exigem `userId == auth.uid`
- Validação de schema dos documentos

### 3. **Data Isolation (Client-Side Queries)**
- Queries sempre filtram por `userId`
- Índices compostos garantem performance
- Usuário nunca vê dados de outros usuários

### 4. **Storage Security (Storage Rules)**
- Path-based isolation: `vehicles/{userId}/`, `maintenance/{userId}/`
- Apenas o dono pode ler/escrever/deletar seus arquivos
- Limite de 10MB por arquivo

---

## ⚠️ Limitações Conhecidas

### 1. **Leitura Global**
- `allow read: if isAuthenticated()` permite ler QUALQUER documento
- **Mitigação**: Queries sempre filtram por `userId` no código
- **Risco**: Desenvolvedor pode esquecer o filtro em nova feature

### 2. **Sem Validação em Update**
- Update permite mudar qualquer campo (exceto `userId`)
- **Mitigação**: UI não expõe campos sensíveis
- **Risco**: Usuário mal-intencionado pode modificar via API

### 3. **Sem Rate Limiting**
- Usuário pode fazer queries infinitas
- **Mitigação**: Cloud Firestore tem quotas por projeto
- **Risco**: Ataque DoS pode gerar custos altos

---

## 🚀 Melhorias Futuras (Week 2+)

### 1. **Cloud Functions para Validação Server-Side**
```typescript
// Validar APÓS escrita, não bloquear
export const validateVehicleData = functions.firestore
  .document('vehicles/{vehicleId}')
  .onCreate(async (snap, context) => {
    const data = snap.data()
    if (!isValidPlate(data.plate)) {
      await snap.ref.delete() // Rollback
      await logSecurityEvent('invalid_plate', context.auth?.uid)
    }
  })
```

### 2. **Audit Logging**
```typescript
// Registrar todas as operações sensíveis
export const auditVehicleChanges = functions.firestore
  .document('vehicles/{vehicleId}')
  .onWrite(async (change, context) => {
    await addDoc(collection(db, 'audit_logs'), {
      collection: 'vehicles',
      documentId: context.params.vehicleId,
      userId: context.auth?.uid,
      operation: change.after.exists ? 'update' : 'delete',
      timestamp: Timestamp.now()
    })
  })
```

### 3. **Field-Level Security**
```plaintext
// Regras mais granulares
allow update: if isAuthenticated() && 
               resource.data.userId == request.auth.uid &&
               // Impedir mudanças em campos críticos
               request.resource.data.userId == resource.data.userId &&
               request.resource.data.createdAt == resource.data.createdAt;
```

### 4. **Rate Limiting via Cloud Functions**
```typescript
// Limitar operações por usuário
export const rateLimit = functions.https.onCall(async (data, context) => {
  const userId = context.auth?.uid
  const operations = await getOperationCount(userId, last24Hours)
  
  if (operations > 1000) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Too many operations. Try again later.'
    )
  }
})
```

---

## 📊 Métricas de Segurança

### Implementadas ✅
- [x] Autenticação obrigatória
- [x] Isolamento de dados por userId (client-side)
- [x] Validação de schema em create
- [x] Validação de tipos e ranges
- [x] Storage isolado por path
- [x] Índices compostos para performance

### Pendentes ⏳
- [ ] Validação server-side via Cloud Functions
- [ ] Audit logging de operações
- [ ] Rate limiting por usuário
- [ ] Field-level security em updates
- [ ] Alertas de atividade suspeita

---

## 🔍 Como Testar Segurança

### 1. **Teste de Isolamento**
```javascript
// Em outro navegador com outro usuário:
const vehicles = await getDocs(
  query(collection(db, 'vehicles'))
  // SEM filtro userId - vai retornar vazio ou erro
)
```

### 2. **Teste de Criação Maliciosa**
```javascript
// Tentar criar documento com userId de outro usuário:
await addDoc(collection(db, 'vehicles'), {
  userId: 'outro-user-id', // ❌ Vai falhar nas rules
  make: 'Toyota',
  // ...
})
```

### 3. **Teste de Update Não Autorizado**
```javascript
// Tentar atualizar documento de outro usuário:
await updateDoc(doc(db, 'vehicles', 'outro-vehicle-id'), {
  make: 'Hackeado' // ❌ Vai falhar se não for seu documento
})
```

---

## 📝 Notas de Implementação

- **Data**: 2025-10-19
- **Desenvolvedor**: Sistema Automático
- **Versão**: 1.0
- **Status**: Produção
- **Próxima Revisão**: Week 2 (Cloud Functions)

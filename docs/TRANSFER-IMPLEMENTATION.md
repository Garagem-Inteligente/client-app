# Sistema de Transferência de Veículos - Implementação

## 📋 Overview

Sistema completo de transferência de veículos entre proprietários com verificação em duas etapas via códigos de confirmação por email.

## 🏗️ Arquitetura

### Fluxo Completo

```
1. Proprietário Atual inicia transferência
   ↓
2. Sistema gera 2 códigos únicos (dono atual + novo dono)
   ↓
3. Emails enviados para ambos com instruções
   ↓
4. Ambos confirmam códigos na plataforma
   ↓
5. Sistema transfere histórico completo
   ↓
6. Veículo movido para "Carros Transferidos" do dono anterior
```

### Estrutura de Dados Firestore

```typescript
// Collection: transfers
{
  id: string
  vehicleId: string
  vehicleName: "Honda Civic"
  vehiclePlate: "ABC-1234"
  fromUserId: "user123"
  fromUserName: "João Silva"
  fromUserEmail: "joao@example.com"
  toUserId?: "user456" // Só preenchido após aceite
  toUserName?: "Maria Santos"
  toEmail: "maria@example.com"
  fromConfirmationCode: "A1B2C3" // 6 caracteres
  toConfirmationCode: "X9Y8Z7" // 6 caracteres
  fromConfirmed: false
  toConfirmed: false
  status: "pending" | "confirmed" | "completed" | "rejected" | "cancelled" | "expired"
  message?: "Veículo bem conservado, sempre fiz todas as manutenções"
  createdAt: Timestamp
  updatedAt: Timestamp
  expiresAt: Timestamp // 7 dias após criação
  completedAt?: Timestamp
}

// Collection: transferredVehicles (histórico do dono anterior)
{
  id: string
  vehicleId: string
  userId: string // Dono anterior
  transferredAt: Timestamp
  transferredTo: "m***@example.com" // Email parcialmente oculto
  transferId: string
  vehicleSnapshot: {
    make: "Honda"
    model: "Civic"
    year: 2020
    plate: "ABC-1234"
    mileage: 45000
    imageUrl?: "data:image/..."
  }
}
```

## 🔒 Regras de Segurança

### Firestore Rules

```
// transfers
match /transfers/{transferId} {
  // Criação: apenas usuário autenticado
  allow create: if request.auth != null 
    && request.resource.data.fromUserId == request.auth.uid;
  
  // Leitura: apenas envolvidos na transferência
  allow read: if request.auth != null 
    && (resource.data.fromUserId == request.auth.uid 
    || resource.data.toEmail == request.auth.token.email
    || resource.data.toUserId == request.auth.uid);
  
  // Atualização: apenas via Cloud Functions
  allow update: if false;
  
  // Deleção: apenas dono original se ainda pending
  allow delete: if request.auth != null 
    && resource.data.fromUserId == request.auth.uid
    && resource.data.status == 'pending';
}

// transferredVehicles
match /transferredVehicles/{docId} {
  // Apenas leitura pelo dono original
  allow read: if request.auth != null 
    && resource.data.userId == request.auth.uid;
  
  // Criação/atualização/deleção: apenas Cloud Functions
  allow write: if false;
}
```

## 📧 Templates de Email

### 1. Email para Proprietário Atual

```html
Assunto: 🔄 Confirme a Transferência do seu Veículo

Olá, [Nome]!

Você iniciou a transferência do veículo:
🚗 [Marca Modelo] - [Placa]

Para: [email@novoproprietario.com]

⚠️ ATENÇÃO - LEIA COM CUIDADO:

Ao confirmar esta transferência:
✓ Todo o histórico de manutenções será transferido
✓ O novo proprietário terá acesso completo aos dados
✓ Você não poderá mais editar o histórico deste veículo
✓ O veículo será movido para sua seção "Carros Transferidos"
✓ Você poderá apenas visualizar o histórico anterior

Esta ação é IRREVERSÍVEL após ambas as confirmações!

Seu código de confirmação:
┌─────────────────┐
│    [A1B2C3]     │
└─────────────────┘

Para confirmar:
1. Acesse a plataforma Garagem Inteligente
2. Vá em "Meus Veículos" > [Veículo] > "Transferências"
3. Digite o código acima
4. Aguarde a confirmação do novo proprietário

⏰ Este código expira em 7 dias

❌ Para cancelar a transferência, acesse a plataforma antes de confirmar.
```

### 2. Email para Novo Proprietário (com cadastro)

```html
Assunto: 🎉 Você recebeu um Veículo na Garagem Inteligente!

Olá!

[Nome do Atual Proprietário] está transferindo um veículo para você:
🚗 [Marca Modelo] - [Placa]
📅 Ano: [2020]
🛣️ Quilometragem: [45.000 km]

📋 HISTÓRICO COMPLETO INCLUÍDO:
✓ [X] manutenções registradas
✓ Documentos e fotos
✓ Valores investidos
✓ Próximas manutenções recomendadas

Mensagem do proprietário:
"[Mensagem opcional]"

Para receber este veículo:

1. Crie sua conta (se ainda não tem):
   👉 https://app-garageminteligente.web.app/register

2. Faça login

3. Digite seu código de confirmação:
   ┌─────────────────┐
   │    [X9Y8Z7]     │
   └─────────────────┘

⚠️ IMPORTANTE:
• O proprietário atual também precisa confirmar
• Após ambas confirmações, o veículo será seu
• Você receberá TODO o histórico de manutenções
• Os dados do proprietário anterior serão anonimizados

⏰ Este código expira em 7 dias
```

### 3. Email de Sucesso (ambos confirmaram)

```html
Assunto: ✅ Transferência Concluída com Sucesso!

Para Proprietário Anterior:
---
Olá, [Nome]!

A transferência do veículo [Marca Modelo - Placa] foi concluída!

O veículo foi movido para sua seção "Carros Transferidos".
Você pode visualizar o histórico que tinha, mas não pode mais editá-lo.

---

Para Novo Proprietário:
---
Olá, [Nome]!

Parabéns! O veículo [Marca Modelo - Placa] agora é seu!

Acesse a plataforma para:
✓ Ver todo o histórico de manutenções
✓ Adicionar novas manutenções
✓ Receber alertas personalizados
✓ Gerenciar documentos e fotos

👉 Acessar agora: https://app-garageminteligente.web.app
```

## 🎨 Interface do Usuário

### Tela: VehicleTransferPage.vue

```
┌────────────────────────────────────┐
│  ← Transferir Veículo              │
├────────────────────────────────────┤
│                                    │
│  🚗 Honda Civic                    │
│     2020 · ABC-1234               │
│     [Imagem do veículo]           │
│                                    │
│  ⚠️ ATENÇÃO                        │
│  ┌──────────────────────────────┐ │
│  │ Esta ação é irreversível!    │ │
│  │                              │ │
│  │ Ao transferir:               │ │
│  │ ✓ Histórico vai para o novo  │ │
│  │   proprietário               │ │
│  │ ✓ Você perde acesso de       │ │
│  │   edição                     │ │
│  │ ✓ Dados do veículo serão     │ │
│  │   transferidos               │ │
│  └──────────────────────────────┘ │
│                                    │
│  📧 Email do Novo Proprietário     │
│  ┌──────────────────────────────┐ │
│  │ email@exemplo.com            │ │
│  └──────────────────────────────┘ │
│                                    │
│  💬 Mensagem (opcional)            │
│  ┌──────────────────────────────┐ │
│  │ Veículo bem conservado...    │ │
│  └──────────────────────────────┘ │
│                                    │
│  ☑ Li e aceito os termos          │
│                                    │
│  [  Iniciar Transferência  ]       │
│                                    │
└────────────────────────────────────┘
```

### Modal: Confirmar Código

```
┌────────────────────────────────────┐
│  Confirmar Transferência           │
├────────────────────────────────────┤
│                                    │
│  Digite o código que você recebeu  │
│  por email:                        │
│                                    │
│  ┌─┬─┬─┬─┬─┬─┐                    │
│  │A│1│B│2│C│3│                    │
│  └─┴─┴─┴─┴─┴─┘                    │
│                                    │
│  Não recebeu? [Reenviar Email]    │
│                                    │
│  [  Cancelar  ]  [  Confirmar  ]   │
│                                    │
└────────────────────────────────────┘
```

## 🚀 Próximos Passos

1. ✅ Types atualizados
2. ⏳ Firebase Functions (3 funções)
3. ⏳ Email Templates
4. ⏳ TransfersStore
5. ⏳ UI Components
6. ⏳ Firestore Rules
7. ⏳ Tests

---

**Status**: 🔄 Em Implementação
**Prioridade**: Alta
**Estimativa**: 4-6 horas

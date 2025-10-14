# Firebase Cloud Functions - AutoCare

Sistema de email para a plataforma AutoCare usando SendGrid.

## 📦 Funções Disponíveis

### 1. `sendTransferEmail`
Envia email com código de transferência de veículo.

**Parâmetros:**
```typescript
{
  to: string              // Email do destinatário
  ownerName: string       // Nome do proprietário atual
  vehicleMake: string     // Marca do veículo
  vehicleModel: string    // Modelo do veículo
  vehicleYear: number     // Ano do veículo
  transferCode: string    // Código de 6 dígitos
  isOwner: boolean        // true = email para dono, false = email para receptor
}
```

### 2. `sendMaintenanceAlert`
Envia alerta de manutenção próxima ou atrasada.

**Parâmetros:**
```typescript
{
  to: string              // Email do usuário
  userName: string        // Nome do usuário
  vehicleMake: string     // Marca do veículo
  vehicleModel: string    // Modelo do veículo
  vehicleYear: number     // Ano do veículo
  maintenanceType: string // Tipo de manutenção (ex: "Troca de Óleo")
  dueDate: string         // Data formatada (ex: "15/01/2025")
  isOverdue: boolean      // true = atrasada, false = próxima
}
```

### 3. `sendWelcomeEmail`
Envia email de boas-vindas para novos usuários.

**Parâmetros:**
```typescript
{
  to: string       // Email do novo usuário
  userName: string // Nome do usuário
}
```

## 🔧 Configuração

### 1. Criar conta SendGrid
1. Acesse: https://sendgrid.com/
2. Crie uma conta gratuita (100 emails/dia)
3. Verifique seu domínio ou use email de teste
4. Gere uma API Key em: Settings > API Keys

### 2. Configurar variáveis de ambiente

```bash
# Definir API Key do SendGrid
firebase functions:config:set sendgrid.key="SG.xxxxxxxxxxxxx"

# Definir email remetente (deve ser verificado no SendGrid)
firebase functions:config:set sendgrid.from="noreply@seudominio.com"

# Ver configuração atual
firebase functions:config:get
```

### 3. Deploy

```bash
# Deploy de todas as functions
firebase deploy --only functions

# Deploy de função específica
firebase deploy --only functions:sendWelcomeEmail
```

## 🧪 Teste Local

```bash
# Instalar Firebase Emulator Suite
npm install -g firebase-tools

# Iniciar emulators
firebase emulators:start --only functions

# As functions estarão disponíveis em:
# http://localhost:5001/autocare-platform/us-central1/sendTransferEmail
```

**Testar com curl:**

```bash
# Email de boas-vindas
curl -X POST http://localhost:5001/autocare-platform/us-central1/sendWelcomeEmail \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "to": "usuario@example.com",
      "userName": "João Silva"
    }
  }'
```

## 📊 Monitoramento

### Ver logs
```bash
# Logs em tempo real
firebase functions:log

# Logs de função específica
firebase functions:log --only sendTransferEmail

# Logs no Console do Firebase
# https://console.firebase.google.com/ > Functions > Logs
```

### Métricas
- Invocações: Console Firebase > Functions > Dashboard
- Erros: Console Firebase > Functions > Health
- Custos: Console Firebase > Usage and Billing

## 💰 Limites e Custos

### SendGrid (Free Tier)
- ✅ 100 emails/dia
- ✅ Templates básicos
- ❌ Sem domínio personalizado

### Firebase Functions (Spark Plan - Free)
- ✅ 2M invocações/mês
- ✅ 400k GB-segundos/mês
- ✅ 200k CPU-segundos/mês

### Upgrade para Blaze (Pay-as-you-go)
- Necessário para produção
- $0.40 por milhão de invocações
- $0.0000025 por GB-segundo

## 🚀 Integração no Frontend

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions()

// Enviar email de boas-vindas
const sendWelcome = httpsCallable(functions, 'sendWelcomeEmail')
await sendWelcome({
  to: user.email,
  userName: user.displayName
})

// Enviar código de transferência
const sendTransfer = httpsCallable(functions, 'sendTransferEmail')
await sendTransfer({
  to: 'destinatario@example.com',
  ownerName: 'João Silva',
  vehicleMake: 'Toyota',
  vehicleModel: 'Corolla',
  vehicleYear: 2020,
  transferCode: 'ABC123',
  isOwner: true
})

// Enviar alerta de manutenção
const sendAlert = httpsCallable(functions, 'sendMaintenanceAlert')
await sendAlert({
  to: user.email,
  userName: user.displayName,
  vehicleMake: vehicle.make,
  vehicleModel: vehicle.model,
  vehicleYear: vehicle.year,
  maintenanceType: 'Troca de Óleo',
  dueDate: '15/01/2025',
  isOverdue: false
})
```

## 🔒 Segurança

- ✅ Todas as functions usam `onCall` (autenticação integrada)
- ✅ Validação de parâmetros obrigatórios
- ✅ Rate limiting automático pelo Firebase
- ✅ API Keys em variáveis de ambiente (não no código)

## 📝 Notas Importantes

1. **SendGrid API Key**: Nunca commite a API key no código
2. **Email Remetente**: Deve ser verificado no SendGrid
3. **Domínio Personalizado**: Recomendado para produção (evita spam)
4. **Templates HTML**: Inline CSS para compatibilidade com clientes de email
5. **Logs**: Sempre use `logger.info/error` para monitoramento

## 🐛 Troubleshooting

### Erro: "API key not valid"
```bash
# Verificar configuração
firebase functions:config:get

# Reconfigurar
firebase functions:config:set sendgrid.key="SUA_API_KEY"
firebase deploy --only functions
```

### Emails não chegam
1. Verificar spam/lixeira
2. Verificar SendGrid Activity (dashboard)
3. Verificar se email remetente está verificado
4. Conferir logs: `firebase functions:log`

### Erro de CORS
```typescript
// Adicionar ao firebase.json
{
  "functions": {
    "cors": true
  }
}
```

## 📚 Recursos

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [SendGrid Node.js Docs](https://docs.sendgrid.com/for-developers/sending-email/v3-nodejs-code-example)
- [SendGrid Email Templates](https://sendgrid.com/solutions/email-templates/)
- [Firebase Functions Pricing](https://firebase.google.com/pricing)

# 🚀 Quick Start - Troca de Senha

## Setup Rápido (5 minutos)

### 1. Instalar Functions
```bash
./setup-functions.sh
```

### 2. Obter SendGrid API Key
1. Acesse: https://signup.sendgrid.com/ (grátis)
2. Vá em Settings → API Keys
3. Create API Key → Full Access
4. Copie a key (SG.xxxx...)

### 3. Configurar API Key
```bash
firebase functions:config:set sendgrid.key="SUA_KEY_AQUI"
```

### 4. Deploy
```bash
firebase deploy --only functions
```

## ✅ Pronto!

Agora você pode:
- Alterar senha pelo app (Perfil → Alterar Senha)
- Receber emails bonitos de confirmação
- Ter indicador de força de senha

## 🧪 Testar Localmente

```bash
# Terminal 1: Emuladores
firebase emulators:start

# Terminal 2: Desenvolvimento
pnpm dev
```

## 📧 Configurar Email do Remetente

Edite `functions/src/index.ts`:
```typescript
from: {
  email: "noreply@seudominio.com",  // ← Altere aqui
  name: "Garagem Inteligente",
}
```

**Importante:** Verifique o sender no SendGrid!

## 🐛 Problemas?

### Emails não chegam
- Verifique spam/lixeira
- Confirme sender verificado no SendGrid
- Veja logs: `firebase functions:log`

### Erro de API Key
```bash
# Ver configs atuais
firebase functions:config:get

# Reconfigurar
firebase functions:config:set sendgrid.key="SUA_KEY"
firebase deploy --only functions
```

## 📚 Mais Informações

- Documentação completa: `docs/PASSWORD-CHANGE-SENDGRID.md`
- Detalhes de implementação: `docs/PASSWORD-CHANGE-IMPLEMENTATION.md`

---

**Tempo total de setup: ~5 minutos** ⚡

# 📧 Guia de Configuração do SendGrid

## ⚠️ PROBLEMA IDENTIFICADO

A API Key do SendGrid não está configurada! O arquivo `.env` ainda contém o valor placeholder.

## 🔧 Solução - Configurar SendGrid

### Passo 1: Obter API Key do SendGrid

1. Acesse: https://app.sendgrid.com/settings/api_keys
2. Faça login (ou crie uma conta gratuita)
3. Clique em **"Create API Key"**
4. Configure:
   - **Nome**: `Garagem Inteligente Functions`
   - **Permissões**: **Full Access** (ou pelo menos **Mail Send**)
5. Clique em **"Create & View"**
6. **COPIE A CHAVE IMEDIATAMENTE** (ela só é mostrada uma vez!)

### Passo 2: Configurar no Projeto

1. Abra o arquivo `functions/.env`
2. Substitua a linha:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   ```
   Por:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   (Cole sua chave real)

### Passo 3: Verificar Domínio (IMPORTANTE!)

O SendGrid requer verificação do domínio de envio:

**Opção 1: Usar Email Pessoal (Rápido - Para Testes)**
- Vá em: https://app.sendgrid.com/settings/sender_auth/senders
- Adicione `noreply@garageminteligente.app` OU seu email pessoal
- Verifique o email de confirmação

**Opção 2: Verificar Domínio (Recomendado - Produção)**
- Vá em: https://app.sendgrid.com/settings/sender_auth
- Clique em "Verify a Single Sender"
- Configure DNS do domínio `garageminteligente.app`

### Passo 4: Testar Envio

Execute o script de teste:

```bash
cd functions
node test-email.js
```

**Resultado esperado:**
```
✅ Email enviado com sucesso!

📬 Verifique sua caixa de entrada e pasta de spam
📧 Email: mikeribeirooficial@gmail.com
📄 Assunto: 🧪 Teste de Email - Garagem Inteligente

✨ SendGrid está configurado corretamente!
```

## 📋 Checklist de Configuração

- [ ] Criar conta no SendGrid
- [ ] Gerar API Key
- [ ] Copiar e colar API Key no `functions/.env`
- [ ] Verificar email de envio (sender)
- [ ] Executar `node test-email.js`
- [ ] Receber email de teste
- [ ] Fazer redeploy das functions: `firebase deploy --only functions`

## 🚨 Possíveis Erros

### Erro: "API key does not start with SG."
**Causa**: API Key não foi configurada ou está incorreta
**Solução**: Verifique o arquivo `.env`

### Erro: "Sender identity not verified"
**Causa**: Domínio ou email de envio não foi verificado
**Solução**: Acesse SendGrid > Settings > Sender Authentication

### Erro: "Permission denied"
**Causa**: API Key com permissões insuficientes
**Solução**: Crie nova API Key com "Full Access"

## 💡 Alternativa: Usar Email Pessoal Temporariamente

Se você não tem acesso ao domínio `garageminteligente.app`, pode usar seu email pessoal:

**No arquivo `functions/src/index.ts`, troque:**

```typescript
from: {
  email: "noreply@garageminteligente.app",
  name: "Garagem Inteligente",
}
```

**Por:**

```typescript
from: {
  email: "mikeribeirooficial@gmail.com",  // Seu email verificado
  name: "Garagem Inteligente",
}
```

Depois execute:
```bash
firebase deploy --only functions
```

## 📞 Suporte

Caso ainda tenha problemas:
1. Verifique os logs: `firebase functions:log`
2. Consulte: https://docs.sendgrid.com/
3. Teste novamente com o script: `node test-email.js`

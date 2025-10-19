# Configuração de Troca de Senha com SendGrid

## 🚀 Funcionalidades Implementadas

### Interface de Usuário
- ✅ Modal moderno de alteração de senha
- ✅ Indicador visual de força da senha
- ✅ Validação em tempo real
- ✅ Dicas de segurança
- ✅ Reautenticação obrigatória

### Backend (Firebase Functions)
- ✅ Função para envio de email de redefinição
- ✅ Função para confirmação de alteração
- ✅ Templates HTML modernos e responsivos
- ✅ Integração com SendGrid

## 📋 Pré-requisitos

1. Conta no [SendGrid](https://sendgrid.com/) (Plano gratuito suporta até 100 emails/dia)
2. API Key do SendGrid configurada
3. Firebase Functions habilitado no projeto

## 🔧 Configuração

### 1. Instalar Dependências das Functions

```bash
cd functions
npm install
```

### 2. Configurar SendGrid API Key

#### Opção A: Via Firebase CLI (Recomendado para Produção)

```bash
firebase functions:config:set sendgrid.key="SUA_API_KEY_AQUI"
```

#### Opção B: Via Variável de Ambiente (Para Desenvolvimento Local)

Crie um arquivo `.env` em `functions/`:

```env
SENDGRID_API_KEY=SUA_API_KEY_AQUI
```

### 3. Obter API Key do SendGrid

1. Acesse [SendGrid Dashboard](https://app.sendgrid.com/)
2. Vá em **Settings** → **API Keys**
3. Click em **Create API Key**
4. Selecione **Full Access** ou **Restricted Access** com permissões:
   - Mail Send: Full Access
5. Copie a API Key (você só verá ela uma vez!)

### 4. Configurar Sender Email

No código `functions/src/index.ts`, atualize o email do remetente:

```typescript
from: {
  email: "noreply@seudominio.com",  // Altere para seu domínio
  name: "Garagem Inteligente",
}
```

**Importante:** O email do remetente deve ser verificado no SendGrid:
1. Acesse **Settings** → **Sender Authentication**
2. Verifique um domínio completo (recomendado) OU
3. Verifique um email individual

### 5. Deploy das Functions

```bash
# Build
npm run build

# Deploy
firebase deploy --only functions
```

## 🧪 Teste Local

### 1. Iniciar Emuladores

```bash
# Na raiz do projeto
firebase emulators:start
```

### 2. Testar Functions Localmente

```bash
cd functions
npm run serve
```

## 📧 Templates de Email

### Email de Redefinição de Senha
- Design moderno com gradientes
- Botão de ação destacado
- Avisos de segurança
- Link com expiração de 1 hora

### Email de Confirmação
- Informações de data/hora da alteração
- Status visual de sucesso
- Dicas de segurança
- Alerta caso não tenha sido o usuário

## 🎨 Personalização dos Templates

Os templates HTML estão em `functions/src/index.ts` nas funções:
- `getPasswordResetEmailTemplate()`
- `getPasswordChangeConfirmationTemplate()`

Você pode personalizar:
- Cores (gradientes, backgrounds)
- Logo (adicione URL da sua logo)
- Textos e mensagens
- Footer com links

## 🔒 Segurança

### Proteções Implementadas

1. **Reautenticação Obrigatória**: Usuário deve fornecer senha atual
2. **Validação de Força**: Indicador visual de senha fraca/forte
3. **Confirmação por Email**: Notificação automática de mudanças
4. **Functions Autenticadas**: Apenas usuários logados podem chamar
5. **Rate Limiting**: SendGrid implementa automaticamente

### Boas Práticas

- ✅ Senhas com mínimo de 6 caracteres (Firebase Auth)
- ✅ Indicador de força incentiva senhas fortes
- ✅ Email de confirmação alerta sobre mudanças não autorizadas
- ✅ Links de reset expiram em 1 hora
- ✅ Não expõe informações sensíveis nos erros

## 📱 Fluxo de Uso

### Alteração de Senha (Usuário Logado)

1. Usuário acessa Perfil → Alterar Senha
2. Digita senha atual (reautenticação)
3. Digita nova senha (vê indicador de força)
4. Confirma nova senha
5. Sistema valida e atualiza
6. Email de confirmação é enviado automaticamente

### Recuperação de Senha (Usuário Esqueceu)

1. Na tela de login, click em "Esqueci minha senha"
2. Digita email cadastrado
3. Firebase envia link de reset
4. SendGrid envia email com template bonito
5. Usuário click no link e define nova senha

## 🐛 Troubleshooting

### Erro: "SendGrid API Key not configured"
- Verifique se configurou a API Key corretamente
- Rode `firebase functions:config:get` para ver configs atuais

### Erro: "Invalid From Address"
- Verifique o sender no SendGrid (Settings → Sender Authentication)
- Email precisa estar verificado

### Emails não chegam
1. Verifique spam/lixeira
2. Chec k SendGrid Activity log (Email Activity)
3. Verifique limites do plano gratuito (100/dia)
4. Confirme que o domínio está verificado

### Functions não deployam
```bash
# Limpar e rebuildar
cd functions
rm -rf node_modules lib
npm install
npm run build
cd ..
firebase deploy --only functions
```

## 📊 Monitoramento

### SendGrid Dashboard
- **Email Activity**: Ver todos emails enviados/entregues/abertos
- **Statistics**: Métricas de delivery
- **Suppressions**: Emails bloqueados/bounced

### Firebase Console
- **Functions Logs**: Ver execução e erros
- **Authentication**: Monitorar alterações de senha

## 💰 Custos

### SendGrid Free Tier
- ✅ 100 emails/dia grátis permanentemente
- ✅ Suficiente para maioria das apps pequenas/médias
- ✅ Sem cartão de crédito necessário

### Firebase Functions
- ✅ 2 milhões de invocações/mês grátis
- ✅ 400.000 GB-segundos/mês grátis
- ✅ Suficiente para começar

## 🔄 Próximos Passos

Melhorias futuras sugeridas:

1. **Rate Limiting Custom**: Limitar tentativas de troca de senha
2. **2FA**: Adicionar autenticação de dois fatores
3. **Auditoria**: Log detalhado de mudanças de segurança
4. **Notificações Push**: Além de email, notificar no app
5. **Templates Dinâmicos**: Usar SendGrid Dynamic Templates
6. **A/B Testing**: Testar diferentes templates de email

## 📚 Referências

- [SendGrid Docs](https://docs.sendgrid.com/)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Email Templates](https://github.com/sendgrid/email-templates)

---

**Desenvolvido para Garagem Inteligente** 🚗

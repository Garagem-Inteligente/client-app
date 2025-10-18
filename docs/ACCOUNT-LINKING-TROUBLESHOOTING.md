# Account Linking - Troubleshooting

## ❌ Erro: "Firebase: Error (auth/invalid-credential)"

### 🔍 Diagnóstico

Este erro aparece quando você tenta fazer login com email/senha após ter vinculado sua conta com o Google.

**Possíveis causas:**

1. ✅ **Você vinculou o Google e agora só pode entrar pelo Google**
2. ⚠️ **A senha foi alterada ou está incorreta**
3. 🔧 **O provedor de email/senha foi desabilitado no Firebase**

---

## ✅ Soluções

### Solução 1: Use o Google Sign-In (RECOMENDADO) ✨

Como você já vinculou sua conta com o Google, use o botão:

```
🔵 Continuar com Google
```

**Vantagens:**
- ✅ Mais rápido
- ✅ Mais seguro (sem necessidade de senha)
- ✅ Sincroniza foto do perfil
- ✅ Login único em múltiplos dispositivos

---

### Solução 2: Redefina sua Senha 🔑

Se você **realmente precisa** usar email/senha:

1. **Na tela de login**, clique em **"Esqueceu a senha?"**
2. **Digite seu email** (o mesmo que você usa no Google)
3. **Verifique seu email** - você receberá um link do Firebase
4. **Crie uma nova senha**
5. **Tente fazer login novamente** com email/senha

Após redefinir a senha, você poderá usar **ambos os métodos**:
- 📧 Email/senha
- 🔵 Google Sign-In

---

### Solução 3: Verifique os Provedores Ativos 🔧

Para entender o que está acontecendo:

1. **Abra o Console do Navegador** (F12)
2. **Cole este código** no console:

```javascript
// Verificar provedores ativos
import('firebase/auth').then(({ getAuth }) => {
  const auth = getAuth()
  console.log('Usuário logado:', auth.currentUser?.email)
  console.log('Provedores disponíveis:', 
    auth.currentUser?.providerData.map(p => p.providerId)
  )
})
```

3. **Veja o resultado**:
   - Se aparecer `["password", "google.com"]` → Ambos estão ativos ✅
   - Se aparecer apenas `["google.com"]` → Só Google está ativo ⚠️
   - Se aparecer `null` → Você não está logado

---

### Solução 4: Verifique no Firebase Console 🌐

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto: **Garagem Inteligente**
3. Vá em: **Authentication** → **Users**
4. Encontre seu email na lista
5. Clique no usuário para ver os **Sign-in providers**

Você verá algo como:

```
Email/Password: ✅ Enabled
Google: ✅ Enabled
```

Se **Email/Password** estiver **desabilitado**, você precisa:

1. Clicar em **"Add provider"**
2. Selecionar **"Email/Password"**
3. Definir uma nova senha

---

## 🎯 Entendendo o Account Linking

### Como funciona?

Quando você **vincula** sua conta Google a uma conta existente:

```
Antes da vinculação:
├─ Email/Senha: ✅ Ativo
└─ Google: ❌ Não vinculado

Depois da vinculação:
├─ Email/Senha: ✅ Ativo (DEVERIA continuar ativo)
└─ Google: ✅ Ativo
```

### O que pode dar errado?

Em raros casos, o Firebase pode:

1. **Desabilitar o provedor de senha** durante a vinculação
2. **Criar um novo UID** em vez de vincular (se algo deu errado)
3. **Exigir redefinição de senha** por segurança

---

## 🔐 Recomendações de Segurança

### Use Autenticação Multi-Fator (MFA)

Para máxima segurança, recomendamos:

1. **Manter ambos os provedores ativos**:
   - Email/Senha (backup)
   - Google Sign-In (principal)

2. **Usar senha forte** se optar por email/senha:
   - Mínimo 8 caracteres
   - Letras maiúsculas e minúsculas
   - Números e símbolos

3. **Preferir Google Sign-In**:
   - Autenticação gerenciada pelo Google
   - Menos risco de phishing
   - Recuperação mais fácil

---

## 📋 Checklist de Troubleshooting

Antes de pedir ajuda, verifique:

- [ ] Tentei usar o botão "Continuar com Google"
- [ ] Tentei redefinir minha senha via "Esqueceu a senha?"
- [ ] Verifiquei os provedores ativos no console do navegador
- [ ] Verifiquei no Firebase Console quais provedores estão habilitados
- [ ] Tentei fazer logout completo e login novamente
- [ ] Limpei cache/cookies do navegador
- [ ] Testei em navegador anônimo (modo privado)

---

## 🆘 Ainda com Problemas?

Se nenhuma solução funcionou:

1. **Certifique-se** de estar usando o **email correto**
2. **Tente fazer login** em outro dispositivo/navegador
3. **Verifique** se não há problemas de rede/firewall
4. **Entre em contato** com o suporte técnico

**Informações úteis para suporte:**
- Email usado: `_______`
- Método de login tentado: Email/Senha OU Google
- Erro exato: `auth/invalid-credential`
- Já tentou redefinir senha?: Sim/Não
- Consegue entrar com Google?: Sim/Não

---

## ✅ Solução Rápida (TL;DR)

**Se você vinculou o Google e não consegue mais entrar com senha:**

1. Use o botão **"Continuar com Google"** ✨
2. OU clique em **"Esqueceu a senha?"** e redefina 🔑
3. Após redefinir, ambos os métodos funcionarão ✅

**A vinculação NÃO deveria desabilitar o email/senha, mas se aconteceu, redefinir a senha resolve!** 🎯

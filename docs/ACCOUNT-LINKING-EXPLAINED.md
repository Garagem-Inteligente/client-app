# 🔗 Account Linking - Explicação Técnica

## ❓ Cenário: Email Duplicado com Providers Diferentes

### Situação

Você cria uma conta com:
- **Email**: `usuario@exemplo.com`
- **Método**: Email/Senha
- **UID Firebase**: `abc123`

Depois, tenta fazer login com:
- **Email**: `usuario@exemplo.com` (mesmo email!)
- **Método**: Google Sign-In
- **UID Firebase**: `xyz789` (DIFERENTE!)

## 🔥 Como o Firebase Funciona

### Comportamento Padrão (SEM Account Linking)

O Firebase **permite criar contas separadas** com o mesmo email, mas provedores diferentes:

```
Conta 1:
- Email: usuario@exemplo.com
- Provider: password
- UID: abc123
- Firestore: users/abc123

Conta 2:
- Email: usuario@exemplo.com  
- Provider: google.com
- UID: xyz789
- Firestore: users/xyz789
```

**Resultado**: Você tem **2 contas completamente separadas** 🤯

### Problemas Causados

1. ❌ **Dados duplicados**: Veículos e manutenções ficam em documentos diferentes
2. ❌ **Confusão**: Usuário não entende por que os dados sumiram
3. ❌ **Perde histórico**: Se criou veículos com email/senha, não vê ao logar com Google

## ✅ Solução: Account Linking do Firebase

O Firebase oferece **Account Linking** (vinculação de contas) para resolver isso.

### Como Funciona

1. **Usuário tenta login com Google** usando email já cadastrado
2. **Firebase detecta conflito** com `fetchSignInMethodsForEmail()`
3. **Sistema pede a senha** ao usuário (uma única vez)
4. **Faz login** com email/senha  
5. **Vincula** a conta Google com `linkWithCredential()`
6. ✅ **Agora são UMA conta** com 2 métodos de login

### Resultado Final

```
Conta Única:
- Email: usuario@exemplo.com
- Providers: ['password', 'google.com']
- UID: abc123 (mantém o UID original)
- Firestore: users/abc123 (mantém dados originais)
```

De agora em diante, o usuário pode fazer login com:
- ✅ Email + Senha
- ✅ Google Sign-In
- ✅ Ambos acessam a **MESMA conta** e **MESMOS dados**

## 🛠️ Implementação Atual

### O que está implementado

1. ✅ **Google Sign-In básico** (`signInWithGoogle()`)
2. ✅ **Rastreamento de providers** (campo `providers` no Firestore)
3. ✅ **Método para desvincular Google** (`unlinkGoogleAccount()`)
4. ✅ **Verificação de métodos** (`checkSignInMethods()`)

### O que FALTA implementar

Para vincular contas automaticamente quando há conflito de email, precisamos:

1. **Detectar conflito** ao tentar login com Google
2. **Mostrar modal/alert** pedindo a senha do usuário
3. **Fazer login com senha** usando `signInWithEmailAndPassword()`
4. **Vincular Google** usando `linkWithPopup()` ou `linkWithCredential()`

## 🚧 Limitação Técnica

**Não é possível vincular automaticamente sem interação do usuário.**

Por quê?
- O Firebase não armazena senhas em texto plano (segurança!)
- Não temos acesso à senha do usuário
- O usuário PRECISA fornecer a senha para provar que é o dono da conta

## 🎯 Fluxo Recomendado (A Implementar)

### Cenário: Login com Google quando já existe conta com senha

```typescript
// 1. Usuário clica em "Continuar com Google"
GoogleSignInButton.click()

// 2. Popup do Google abre
const result = await signInWithPopup(auth, googleProvider)

// 3. Verificar se email já existe com outro provider
const methods = await fetchSignInMethodsForEmail(auth, result.user.email)

// 4. Se existir 'password', mostrar modal
if (methods.includes('password')) {
  // Modal: "Você já tem uma conta com este email. Digite sua senha para vincular."
  const password = await showPasswordModal()
  
  // 5. Fazer logout do Google temporário
  await signOut(auth)
  
  // 6. Login com senha
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  
  // 7. Vincular Google à conta
  const googleCredential = GoogleAuthProvider.credential(result.user.idToken)
  await linkWithCredential(userCredential.user, googleCredential)
  
  // ✅ Pronto! Agora é uma conta única com 2 providers
}
```

## 📱 UI/UX Sugerida

### Modal de Vinculação

```
╔════════════════════════════════════════╗
║  🔗 Vincular Conta Google              ║
╠════════════════════════════════════════╣
║                                        ║
║  Você já tem uma conta cadastrada com  ║
║  usuario@exemplo.com usando senha.     ║
║                                        ║
║  Digite sua senha para vincular sua    ║
║  conta Google e poder fazer login      ║
║  com ambos os métodos.                 ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ 🔒 Senha: ••••••••••            │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║  [ Vincular ]  [ Cancelar ]            ║
║                                        ║
╚════════════════════════════════════════╝
```

### Página de Perfil - Gerenciar Conexões

```
═══════════════════════════════════════════
Métodos de Login Conectados
═══════════════════════════════════════════

✅ Email e Senha
   usuario@exemplo.com
   [ Alterar Senha ]

✅ Google
   Conectado via Google
   [ Desvincular Google ]

───────────────────────────────────────────
⚠️ Você precisa ter pelo menos um método 
   de login ativo.
═══════════════════════════════════════════
```

## 🔒 Segurança

### Por que pedir a senha?

- **Prova de identidade**: Garante que a pessoa que está vinculando é o dono da conta
- **Previne sequestro**: Impede que alguém com acesso ao Google vincule sem permissão
- **Padrão da indústria**: Google, Facebook, Apple fazem isso

### Alternativa: Email de Confirmação

Se não quiser pedir a senha, pode:
1. Enviar email com link de confirmação
2. Usuário clica no link
3. Sistema vincula as contas

Mas isso é **mais trabalhoso** e **menos conveniente**.

## 📊 Estado Atual do Código

### `src/stores/auth.ts`

#### `signInWithGoogle()`
- ✅ Cria conta Google normalmente
- ✅ Salva provider como `['google']` no Firestore
- ❌ **NÃO detecta conflito com email/senha**
- ❌ **NÃO vincula automaticamente**

#### `unlinkGoogleAccount()`
- ✅ Desvincula Google mantendo email/senha
- ✅ Verifica se tem senha antes de desvincular
- ✅ Atualiza Firestore removendo 'google' dos providers

#### `checkSignInMethods()`
- ✅ Retorna lista de provedores para um email
- ✅ Útil para detectar conflitos antes do login

### Próximos Passos

1. **Criar componente `AccountLinkingModal.vue`**
   - Input de senha
   - Botões Vincular/Cancelar
   - Loading state

2. **Atualizar `GoogleSignInButton.vue`**
   - Detectar conflito após popup
   - Mostrar modal se necessário
   - Chamar método de vinculação

3. **Criar método `linkGoogleAccount()` no auth store**
   - Receber email e senha
   - Fazer login com senha
   - Vincular credencial do Google
   - Atualizar Firestore

4. **Adicionar seção na ProfilePage**
   - Listar provedores conectados
   - Botão para desvincular Google
   - Aviso sobre manter pelo menos 1 método

## 🧪 Testes Necessários

### Cenário 1: Novo usuário com Google
- ✅ Criar conta via Google
- ✅ Verificar documento no Firestore com `providers: ['google']`
- ✅ Fazer logout e login novamente com Google

### Cenário 2: Usuário existente com senha tenta Google
- ⏳ Criar conta com email/senha
- ⏳ Tentar login com Google (mesmo email)
- ⏳ Modal deve aparecer pedindo senha
- ⏳ Vincular com sucesso
- ⏳ Verificar `providers: ['password', 'google']`

### Cenário 3: Desvincular Google
- ⏳ Usuário com ambos os métodos
- ⏳ Clicar em "Desvincular Google"
- ⏳ Verificar `providers: ['password']`
- ⏳ Tentar login com Google (deve criar conta nova)

### Cenário 4: Tentar desvincular sem senha
- ⏳ Usuário apenas com Google
- ⏳ Tentar desvincular
- ⏳ Deve mostrar erro: "Configure senha primeiro"

## 📚 Referências

- [Firebase Account Linking](https://firebase.google.com/docs/auth/web/account-linking)
- [Firebase Multiple Accounts](https://firebase.google.com/docs/auth/web/google-signin#handling_account_exists_with_different_credential_errors)
- [linkWithCredential API](https://firebase.google.com/docs/reference/js/auth.md#linkwithcredential)

---

**Status**: Account linking **parcialmente implementado**. Falta criar UI para solicitar senha e implementar método de vinculação.

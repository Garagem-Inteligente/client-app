# Google Sign-In Integration

## 📋 Overview

Este documento descreve a integração do Google Sign-In com Firebase Authentication no projeto Garagem Inteligente.

## 🎯 Implementação Completa

### 1. Auth Store (`src/stores/auth.ts`)

Adicionado método `signInWithGoogle()` que:
- Usa `GoogleAuthProvider` do Firebase Auth
- Abre popup para seleção de conta Google (`prompt: 'select_account'`)
- Verifica se usuário já existe no Firestore
- Cria novo documento para novos usuários com `userType: 'user'`
- Sincroniza dados (email, nome, avatar) com Firestore
- Retorna `true` em caso de sucesso

### 2. Google Sign-In Button Component

**Arquivo**: `src/components/atoms/GoogleSignInButton.vue`

**Features**:
- Design moderno com logo oficial do Google (4 cores)
- Estado de loading com spinner
- Animações suaves (hover, active, pulse)
- Suporte a tema escuro (glassmorphism)
- Redirecionamento automático para `/tabs/home` após login
- Tratamento de erros integrado com authStore

**Estilo**:
- Background branco no modo claro
- Glassmorphism com blur no modo escuro
- Border-radius: 12px
- Altura: 56px (consistente com outros inputs)
- Hover: elevação com shadow e translateY(-2px)

### 3. Integração nas Páginas de Auth

#### LoginPage.vue
- Botão posicionado após o divider "ou"
- Acima do botão "Criar nova conta"
- Importado de `@/components`

#### RegisterPage.vue
- Botão posicionado após o divider "ou"
- Acima do botão "Já tenho uma conta"
- Importado de `@/components`

## ⚙️ Configuração Firebase

### Passo 1: Habilitar Google Sign-In no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto: **Garagem-inteligente** (`autocare-platform`)
3. Navegue para **Authentication** → **Sign-in method**
4. Clique em **Google** na lista de provedores
5. Clique em **Enable** (Ativar)
6. Configure os campos:
   - **Project support email**: Seu email de suporte (ex: contato@garageminteligente.com.br)
   - **Project public-facing name**: "Garagem Inteligente" (já preenchido)
7. Clique em **Save**

### Passo 2: Adicionar Domínio Autorizado (se necessário)

Se você testar em produção (`app.garageminteligente.com.br`):

1. No Firebase Console → **Authentication** → **Settings** (aba)
2. Role até **Authorized domains**
3. Clique em **Add domain**
4. Adicione: `app.garageminteligente.com.br`
5. Salve

**Nota**: `localhost` já está autorizado por padrão para desenvolvimento.

## 🧪 Testando a Integração

### Teste Local (Development)

1. Execute o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

2. Acesse `http://localhost:5174/login`

3. Clique no botão **"Continuar com Google"**

4. Selecione uma conta Google no popup

5. Após login bem-sucedido:
   - Deve redirecionar para `/tabs/home`
   - Navbar deve mostrar nome do usuário
   - Firestore deve ter documento em `users/{uid}` com:
     ```json
     {
       "email": "user@gmail.com",
       "name": "Nome do Usuário",
       "avatar": "https://lh3.googleusercontent.com/...",
       "userType": "user",
       "provider": "google",
       "createdAt": Timestamp,
       "updatedAt": Timestamp
     }
     ```

6. Teste logout:
   - Navegue para `/tabs/profile`
   - Clique em "Sair"
   - Deve redirecionar para `/login`

### Teste em Produção

1. Deploy para Firebase Hosting:
   ```bash
   pnpm build
   firebase deploy --only hosting
   ```

2. Acesse `https://app.garageminteligente.com.br/login`

3. Repita os testes acima

## 🔒 Segurança

### Dados Armazenados

O método `signInWithGoogle()` armazena no Firestore:
- **Email**: obtido do Google (`firebaseUser.email`)
- **Nome**: obtido do Google (`firebaseUser.displayName` ou fallback para parte antes do @)
- **Avatar**: URL da foto do Google (`firebaseUser.photoURL`)
- **UserType**: definido como `'user'` por padrão (pode ser alterado manualmente para `'workshop'`)
- **Provider**: marcador `'google'` para identificar origem do login

### Permissões Solicitadas

O Google Sign-In solicita:
- **Email**: para identificação do usuário
- **Profile**: nome e foto do perfil público

**Não são solicitados**:
- Acesso a contatos
- Acesso a calendário
- Acesso a outros dados do Google

### Firebase Security Rules

Certifique-se de que as regras do Firestore permitem:
- **Leitura**: usuário autenticado pode ler seu próprio documento
- **Escrita**: usuário autenticado pode criar/atualizar seu próprio documento

Exemplo:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🐛 Troubleshooting

### Erro: "This domain is not authorized"

**Causa**: Domínio não está na lista de domínios autorizados do Firebase.

**Solução**:
1. Firebase Console → Authentication → Settings → Authorized domains
2. Adicione o domínio (ex: `app.garageminteligente.com.br`)

### Erro: "Popup closed by user"

**Causa**: Usuário fechou o popup sem completar o login.

**Solução**: Isso é esperado. O erro é capturado silenciosamente e o usuário pode tentar novamente.

### Erro: "Network request failed"

**Causa**: Problema de conexão ou bloqueio de popup.

**Soluções**:
1. Verifique conexão com internet
2. Desabilite bloqueadores de popup
3. Verifique se o Firebase está acessível (sem firewall bloqueando)

### Usuário logado mas não redireciona

**Causa**: Router guard pode estar falhando.

**Solução**:
1. Verifique `src/router/index.ts` → meta: `{ requiresAuth: true }`
2. Confirme que `authStore.initialized` está `true`
3. Verifique console do navegador para erros

## 📊 Monitoramento

### Firebase Console

Monitore logins no Firebase Console:
1. **Authentication** → **Users**: lista de todos os usuários
2. Filtro por provedor: selecione "Google" para ver apenas logins do Google
3. **Analytics** → **Authentication**: gráficos de logins ao longo do tempo

### Firestore

Verifique documentos criados:
1. **Firestore Database** → **users** collection
2. Procure por campo `provider: "google"`
3. Confirme campos: `email`, `name`, `avatar`, `userType`

## 🚀 Próximos Passos

### Melhorias Futuras

1. **Apple Sign-In**: adicionar suporte para iOS
2. **Facebook Sign-In**: adicionar provedor do Facebook
3. **Account Linking**: permitir vincular conta Google a email/senha existente
4. **Offline Support**: implementar persistência offline do Firebase Auth
5. **Avatar Upload**: permitir usuário alterar avatar padrão do Google

### Observações

- O botão do Google Sign-In é **reutilizável** e pode ser usado em qualquer página
- O design é **responsivo** e se adapta a temas claros/escuros
- O método `signInWithGoogle()` pode ser chamado de **qualquer componente** que importe o authStore
- **Novos usuários** são criados automaticamente com `userType: 'user'` (não workshop)

## 📚 Referências

- [Firebase Authentication - Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Ionic Vue Components](https://ionicframework.com/docs/vue/overview)
- [Pinia State Management](https://pinia.vuejs.org/)

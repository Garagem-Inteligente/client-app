# 🔧 CORREÇÃO: Missing or Insufficient Permission

## 🚨 PROBLEMA IDENTIFICADO
Erro "missing or insufficient permission" indica problema com permissões OAuth no Google Cloud Console.

## 🔍 VERIFICAÇÕES NECESSÁRIAS

### 1. **Google Cloud Console - OAuth Consent Screen**
1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=autocare-platform
2. Verifique se o **OAuth consent screen** está configurado:
   - ✅ **User Type:** External (para apps públicos)
   - ✅ **App name:** Garagem Inteligente
   - ✅ **User support email:** Seu email
   - ✅ **Developer contact information:** Seu email
   - ✅ **Scopes:** `../auth/userinfo.email` e `../auth/userinfo.profile`

### 2. **Google Cloud Console - OAuth Client**
1. Acesse: https://console.cloud.google.com/apis/credentials?project=autocare-platform
2. Verifique se existe um **OAuth 2.0 Client ID** para Android:
   - ✅ **Application type:** Android
   - ✅ **Package name:** `com.garageminteligente.app`
   - ✅ **SHA-1:** `BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8`

### 3. **Firebase Console - Authentication**
1. Acesse: https://console.firebase.google.com/project/autocare-platform/authentication/providers
2. Verifique se **Google** está habilitado:
   - ✅ **Enable:** Ativado
   - ✅ **Project support email:** Configurado
   - ✅ **Web SDK configuration:** Configurado

## 🔧 SOLUÇÕES

### Solução 1: Configurar OAuth Consent Screen
Se não estiver configurado:
1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=autocare-platform
2. Clique em "CONFIGURE CONSENT SCREEN"
3. Selecione "External" → "CREATE"
4. Preencha:
   - **App name:** Garagem Inteligente
   - **User support email:** Seu email
   - **Developer contact information:** Seu email
5. Clique em "SAVE AND CONTINUE"
6. Em "Scopes", adicione:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
7. Clique em "SAVE AND CONTINUE"
8. Em "Test users", adicione seu email
9. Clique em "SAVE AND CONTINUE"

### Solução 2: Verificar OAuth Client
1. Acesse: https://console.cloud.google.com/apis/credentials?project=autocare-platform
2. Verifique se existe um OAuth Client para Android
3. Se não existir, crie um:
   - Clique em "CREATE CREDENTIALS" → "OAuth client ID"
   - Selecione "Android"
   - **Package name:** `com.garageminteligente.app`
   - **SHA-1:** `BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8`

### Solução 3: Verificar APIs Habilitadas
1. Acesse: https://console.cloud.google.com/apis/library?project=autocare-platform
2. Verifique se estas APIs estão habilitadas:
   - ✅ **Google+ API** (se disponível)
   - ✅ **Google Sign-In API**
   - ✅ **Firebase Authentication API**

## 🎯 TESTE APÓS CORREÇÃO

1. Faça as correções acima
2. Execute: `./fix-google-signin.sh`
3. Teste o login com Google
4. Verifique os toasts na tela

## 📱 LOGS ESPERADOS

Após correção, você deve ver:
- ✅ "Iniciando login com Google..."
- ✅ "Login bem-sucedido! Aguardando sincronização..."
- ✅ "Bem-vindo, [nome do usuário]!"

## 🚨 SE AINDA NÃO FUNCIONAR

1. Verifique se o app está em modo de teste
2. Adicione seu email como test user no OAuth consent screen
3. Verifique se o Google Play Services está atualizado no dispositivo
4. Tente com uma conta Google diferente

# Fix: Google Sign-In no Android com Capacitor Firebase Authentication

**Data:** 18 de outubro de 2025  
**Problema:** Login com Google funciona no web mas falha no APK Android (tela branca)  
**Solução:** Implementação do plugin `@capacitor-firebase/authentication` para autenticação nativa

---

## 🔴 Problema Identificado

### Sintomas
1. ✅ Login com Google funciona perfeitamente no navegador (desenvolvimento web)
2. ❌ No APK Android instalado, o login com Google:
   - Abre uma página do Firebase
   - Redireciona para: `https://accounts.google.com/v3/signin/accountchooser?...`
   - Após selecionar conta, vai para: `https://autocare-platform.firebaseapp.com/__/auth/handler?...`
   - **Fica em tela branca** e não completa o login

### Causa Raiz
```typescript
// ❌ PROBLEMA: Código original usava signInWithPopup
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider) // Não funciona em app nativo!
}
```

**Por que não funciona no Android?**
- `signInWithPopup()` abre uma janela popup do navegador
- Em apps nativos (Android/iOS), não há conceito de "popup window"
- O fluxo OAuth precisa ser redirecionado através do sistema operacional
- URLs de redirecionamento (`https://autocare-platform.firebaseapp.com/__/auth/handler`) não voltam para o app

---

## ✅ Solução Implementada

### 1. Instalação do Plugin Capacitor Firebase Authentication

```bash
pnpm add @capacitor-firebase/authentication
npx cap sync android
```

**O que o plugin faz:**
- Integra com o sistema de autenticação nativo do Android/iOS
- Usa o SDK nativo do Google Sign-In
- Gerencia automaticamente deep links e redirecionamentos
- Retorna credenciais que podem ser usadas com Firebase Auth

### 2. Atualização do Auth Store

**Arquivo:** `src/stores/auth.ts`

#### Imports Adicionados
```typescript
import { Capacitor } from '@capacitor/core'
import { FirebaseAuthentication } from '@capacitor-firebase/authentication'
```

#### Método `signInWithGoogle` Atualizado
```typescript
const signInWithGoogle = async () => {
  loading.value = true
  error.value = null
  
  try {
    const isNative = Capacitor.isNativePlatform()
    let firebaseUser: FirebaseUser
    
    if (isNative) {
      // 🟢 NOVO: Fluxo nativo para Android/iOS
      console.log('🔐 Login Google via Capacitor (Nativo)')
      
      const result = await FirebaseAuthentication.signInWithGoogle()
      
      if (!result.user) {
        throw new Error('Usuário não encontrado na resposta do Google')
      }
      
      // O plugin já faz o signIn automaticamente no Firebase Auth
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Erro ao sincronizar com Firebase Auth')
      }
      
      firebaseUser = currentUser
    } else {
      // ✅ MANTIDO: Fluxo web usando popup
      console.log('🔐 Login Google via Popup (Web)')
      
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      firebaseUser = result.user
    }
    
    // ... resto do código para salvar no Firestore
  } catch (err: unknown) {
    console.error('❌ Erro no login Google:', err)
    error.value = err instanceof Error ? err.message : 'Erro ao fazer login com Google'
    return false
  } finally {
    loading.value = false
  }
}
```

### 3. Sincronização do Capacitor

```bash
npx cap sync android
```

**Saída esperada:**
```
[info] Found 10 Capacitor plugins for android:
       @capacitor-firebase/authentication@7.3.1  ← Plugin registrado!
       @capacitor/app@7.1.0
       @capacitor/camera@7.0.2
       ... (outros plugins)
```

---

## 🎯 Como Funciona

### Fluxo Web (Navegador)
```
1. Usuário clica "Entrar com Google"
2. signInWithPopup() abre popup do Google
3. Usuário seleciona conta
4. Google retorna credenciais via popup
5. Firebase Auth autentica
6. App salva dados no Firestore
7. ✅ Login completo
```

### Fluxo Nativo (Android/iOS) - NOVO
```
1. Usuário clica "Entrar com Google"
2. FirebaseAuthentication.signInWithGoogle() é chamado
3. Plugin abre tela nativa de seleção de conta Google
4. Sistema operacional gerencia autenticação OAuth
5. Plugin recebe credenciais do Google
6. Plugin automaticamente autentica no Firebase Auth
7. onAuthStateChanged dispara com novo usuário
8. App salva dados no Firestore
9. ✅ Login completo
```

### Detecção de Plataforma
```typescript
const isNative = Capacitor.isNativePlatform()

// isNative = true  → Android/iOS (usa FirebaseAuthentication)
// isNative = false → Web (usa signInWithPopup)
```

---

## 📋 Configuração do Android

### Arquivo google-services.json
✅ **Já configurado** em: `android/app/google-services.json`

Contém:
- `client_id` para autenticação OAuth
- Configurações do Firebase project
- Chaves de API

### Arquivo build.gradle
✅ **Já configurado** em: `android/build.gradle`

```groovy
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.4.2' ← Plugin do Google Services
  }
}
```

✅ **Já aplicado** em: `android/app/build.gradle`

```groovy
try {
  def servicesJSON = file('google-services.json')
  if (servicesJSON.text) {
    apply plugin: 'com.google.gms.google-services' ← Aplicado!
  }
} catch(Exception e) {
  logger.info("google-services.json not found...")
}
```

### Capacitor Sync
O comando `npx cap sync android` automaticamente:
- ✅ Registra o plugin `@capacitor-firebase/authentication`
- ✅ Adiciona dependências no Gradle
- ✅ Configura permissões no AndroidManifest.xml
- ✅ Copia assets web para `android/app/src/main/assets/public`

---

## 🔧 Teste e Validação

### Como Testar no Android

#### 1. Rebuild do APK
```bash
pnpm build
npx cap sync android
npx cap run android
```

Ou usando o script:
```bash
./scripts/build-android.sh
```

#### 2. Instalar no Dispositivo
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Ou:
```bash
./scripts/install-apk.sh
```

#### 3. Testar Login
1. Abrir app no dispositivo Android
2. Navegar para tela de login
3. Clicar em "Entrar com Google"
4. **Deve abrir tela nativa** de seleção de conta Google (não navegador)
5. Selecionar conta
6. **Deve retornar ao app** e completar login (não tela branca)
7. Verificar se usuário está autenticado

### Logs Esperados (Logcat)
```
🔐 Login Google via Capacitor (Nativo)
I/FirebaseAuth: [FirebaseAuth] Signing in with credential...
D/FirebaseAuthentication: Sign-in successful for user: user@example.com
✅ Firebase Auth user: uid123456
```

### Comportamento Esperado

#### ✅ Antes (Web)
- Login com popup funciona normalmente
- Sem mudanças no comportamento

#### ✅ Depois (Android)
- Não abre mais navegador/popup
- Usa tela nativa de seleção de conta
- Retorna ao app após autenticação
- Login completa com sucesso

---

## 🐛 Troubleshooting

### Erro: "No user found in result"
**Causa:** Plugin não conseguiu autenticar  
**Solução:**
1. Verificar se `google-services.json` está correto
2. Verificar SHA-1/SHA-256 no Firebase Console
3. Recompilar APK após adicionar fingerprints

### Erro: "Failed to sign in with Google"
**Causa:** Configuração OAuth incorreta  
**Solução:**
1. Ir ao Firebase Console → Authentication → Sign-in method
2. Verificar se Google está habilitado
3. Verificar se support email está configurado
4. Verificar OAuth client ID no Google Cloud Console

### Tela Branca Persiste
**Causa:** APK ainda usando código antigo  
**Solução:**
```bash
# Limpar build antiga
rm -rf android/app/build

# Rebuild completo
pnpm build
npx cap sync android
./scripts/build-android.sh

# Desinstalar app antigo do dispositivo
adb uninstall com.garageminteligente.app

# Reinstalar
./scripts/install-apk.sh
```

### Plugin não encontrado
**Causa:** Capacitor não sincronizou  
**Solução:**
```bash
npx cap sync android
```

Verificar output:
```
[info] Found 10 Capacitor plugins for android:
       @capacitor-firebase/authentication@7.3.1  ← Deve aparecer!
```

---

## 📚 Referências

### Documentação Oficial
- [Capacitor Firebase Authentication](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication)
- [Firebase Auth Web](https://firebase.google.com/docs/auth/web/google-signin)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/start)

### Configuração Firebase
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console - OAuth](https://console.cloud.google.com/apis/credentials)

### SHA Fingerprints (Android)
Para adicionar no Firebase Console:
```bash
# Debug SHA-1
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release SHA-1 (quando criar release keystore)
keytool -list -v -keystore path/to/release.keystore -alias release
```

---

## ✅ Checklist de Implementação

- [x] Plugin `@capacitor-firebase/authentication` instalado
- [x] Imports adicionados no `auth.ts`
- [x] Método `signInWithGoogle` atualizado com detecção de plataforma
- [x] Fluxo nativo implementado com `FirebaseAuthentication.signInWithGoogle()`
- [x] Fluxo web mantido com `signInWithPopup()`
- [x] Capacitor sincronizado (`npx cap sync android`)
- [x] Logs de debug adicionados
- [x] Tratamento de erros implementado
- [ ] Testar no Android (próximo passo)
- [ ] Verificar SHA fingerprints no Firebase Console
- [ ] Testar com múltiplas contas Google
- [ ] Testar logout e re-login

---

## 🚀 Próximos Passos

1. **Rebuild e Teste no Android**
   ```bash
  ./scripts/build-android.sh
  ./scripts/install-apk.sh
   ```

2. **Verificar SHA Fingerprints**
   - Gerar SHA-1 do debug keystore
   - Adicionar no Firebase Console → Project Settings → Android App
   - Baixar novo `google-services.json` se necessário

3. **Teste Completo do Fluxo**
   - Login com Google (primeira vez)
   - Logout
   - Login com Google (conta existente)
   - Verificar dados salvos no Firestore

4. **Preparar para Release** (futuro)
   - Criar release keystore
   - Gerar SHA-1 do release keystore
   - Adicionar no Firebase Console
   - Testar APK release

---

## 📝 Notas de Desenvolvimento

### Por que não usar signInWithRedirect?
`signInWithRedirect()` também não funciona bem em apps nativos porque:
- Redireciona para URL externa
- App perde contexto quando navegador abre
- Deep link de retorno pode falhar
- UX ruim (sair do app → navegador → voltar ao app)

### Por que Capacitor Firebase Authentication?
- ✅ Usa SDKs nativos do Google (melhor UX)
- ✅ Integração perfeita com Firebase Auth
- ✅ Gerencia tokens automaticamente
- ✅ Suporte a múltiplos provedores (Google, Apple, etc.)
- ✅ Mantém usuário logado entre sessões
- ✅ Open source e bem mantido

### Compatibilidade
- ✅ Android 5.0+ (API 21+)
- ✅ iOS 13.0+
- ✅ Web (fallback para signInWithPopup)
- ✅ Capacitor 5.0+

---

## 🎯 Resultado Esperado

Após implementação:

**Web:**
- ✅ Login com Google via popup (sem mudanças)
- ✅ UX familiar do navegador

**Android:**
- ✅ Login com Google via tela nativa
- ✅ Sem tela branca
- ✅ Sem redirecionamentos quebrados
- ✅ UX nativa e profissional
- ✅ Login rápido e confiável

**Ambos:**
- ✅ Dados salvos corretamente no Firestore
- ✅ Estado de autenticação sincronizado
- ✅ Avatar e nome do usuário carregados
- ✅ UserType gerenciado corretamente

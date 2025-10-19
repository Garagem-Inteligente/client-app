# 🔐 Google Sign-In Android - Configuração Completa

**Status**: ✅ Configurado em 18/10/2025

## 📋 O que foi configurado

### 1. Arquivo `google-services.json`
- ✅ Adicionado em `android/app/google-services.json`
- ✅ Package name: `com.garageminteligente.app`
- ✅ OAuth clients configurados (2 clients)

### 2. Variáveis Gradle (`android/variables.gradle`)
```gradle
// Firebase Authentication - Google Sign-In
rgcfaIncludeGoogle = true
androidxCredentialsVersion = '1.3.0'
```

### 3. Capacitor Config (`capacitor.config.ts`)
```typescript
plugins: {
  FirebaseAuthentication: {
    skipNativeAuth: false,
    providers: ['google.com']
  }
}
```

### 4. SHA Fingerprints do Certificado de Debug
```
SHA-1: BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8
SHA-256: 7F:CF:50:F0:BF:0F:C4:24:EB:99:1A:76:F5:97:4D:00:27:4B:74:D2:AE:A0:E4:D5:40:C5:A6:01:98:46:4F:08
```

---

## 🚀 Próximos Passos OBRIGATÓRIOS

### ⚠️ IMPORTANTE: Adicionar SHA Fingerprints ao Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto **autocare-platform**
3. Vá em **⚙️ Configurações do Projeto** → **Geral**
4. Role até **"Seus apps"** → Selecione o app Android
5. Role até **"Impressões digitais de certificado SHA"**
6. Clique em **"Adicionar impressão digital"**
7. Adicione o **SHA-1**:
   ```
   BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8
   ```
8. Clique em **"Adicionar impressão digital"** novamente
9. Adicione o **SHA-256**:
   ```
   7F:CF:50:F0:BF:0F:C4:24:EB:99:1A:76:F5:97:4D:00:27:4B:74:D2:AE:A0:E4:D5:40:C5:A6:01:98:46:4F:08
   ```
10. **Baixe o `google-services.json` atualizado** (Firebase pode regenerar com novos tokens)
11. Substitua o arquivo em `android/app/google-services.json` se necessário

### ✅ Verificar Google Sign-In habilitado no Firebase

1. No Firebase Console → **Authentication** → **Sign-in method**
2. Verifique se **Google** está **Ativado**
3. Se não estiver:
   - Clique em **Google**
   - **Ative** o provedor
   - Configure o **e-mail de suporte do projeto**
   - Clique em **Salvar**

---

## 🔨 Build e Deploy

### Após adicionar SHA fingerprints ao Firebase Console:

```bash
# 1. Sincronizar Capacitor (já feito)
npx cap sync android

# 2. Limpar build (já feito)
cd android && ./gradlew clean && cd ..

# 3. Rebuild completo
./scripts/build-android.sh

# Ou build manual:
cd android
./gradlew assembleDebug
cd ..

# 4. Instalar no dispositivo
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ou usar o script:
./scripts/install-apk.sh
```

---

## 🧪 Como Testar

1. Abra o app no dispositivo Android
2. Vá para a tela de Login
3. Clique no botão **"Entrar com Google"**
4. **Deve abrir**: Seletor de contas Google nativo do Android
5. Selecione uma conta
6. **Sucesso**: Redirecionamento para /tabs/home

### 🐛 Se não funcionar:

Verifique no Logcat do Android:
```bash
adb logcat | grep -E "FirebaseAuth|Google|CapacitorFirebase"
```

Logs esperados:
```
🔐 Login Google via Capacitor (Nativo)
FirebaseAuthentication: signInWithGoogle started
GoogleAuthProviderHandler: Building GoogleSignInClient
```

---

## 📚 Documentação Oficial

- Plugin: https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication
- Setup Google: https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/authentication/docs/setup-google.md
- Firebase Android: https://firebase.google.com/docs/auth/android/google-signin

---

## 🔄 Para Produção (Release Build)

Quando for gerar o APK/AAB de produção:

1. **Gere o keystore de produção** (se ainda não tiver):
   ```bash
   keytool -genkey -v -keystore release-key.keystore \
     -alias release -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Obtenha o SHA-1/SHA-256 do keystore de produção**:
   ```bash
   keytool -list -v -keystore release-key.keystore \
     -alias release | grep -E "SHA1|SHA256"
   ```

3. **Adicione os fingerprints de PRODUÇÃO** ao Firebase Console

4. **Baixe o `google-services.json` atualizado**

5. **Configure o signing no `android/app/build.gradle`**

---

## 📝 Notas Técnicas

### Por que precisa do google-services.json?

O plugin `@capacitor-firebase/authentication` usa os **SDKs nativos do Firebase** (Java/Kotlin no Android), não o Firebase Web SDK. Por isso:

- ✅ **Web**: Usa Firebase Web SDK + `firebaseConfig` do `.env`
- ✅ **Android/iOS**: Usa Firebase Native SDK + `google-services.json`/`GoogleService-Info.plist`

### Estratégia Híbrida

```typescript
// src/stores/auth.ts
const isNative = Capacitor.isNativePlatform()

if (isNative) {
  // Android/iOS → Plugin nativo
  await FirebaseAuthentication.signInWithGoogle()
} else {
  // Web → Firebase Web SDK
  await signInWithPopup(auth, provider)
}
```

---

**Configurado por**: GitHub Copilot  
**Data**: 18 de outubro de 2025  
**Versão do Plugin**: @capacitor-firebase/authentication@7.3.1

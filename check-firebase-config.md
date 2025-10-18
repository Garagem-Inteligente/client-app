# 🔥 Verificação da Configuração do Firebase

## SHA-1 Fingerprint
**SHA-1 do debug keystore:** `BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8`

## Configurações do Firebase Console

### 1. Verificar SHA-1 no Firebase Console
1. Acesse: https://console.firebase.google.com/project/autocare-platform/settings/general
2. Vá para "Seus aplicativos" → Android App
3. Verifique se o SHA-1 `BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8` está listado
4. Se não estiver, adicione-o

### 2. Verificar Google Sign-In
1. Acesse: https://console.firebase.google.com/project/autocare-platform/authentication/providers
2. Verifique se "Google" está habilitado
3. Verifique se o "Email de suporte do projeto" está configurado

### 3. Verificar OAuth Client
1. Acesse: https://console.cloud.google.com/apis/credentials?project=autocare-platform
2. Verifique se existe um OAuth 2.0 Client ID para Android
3. Verifique se o package name é: `com.garageminteligente.app`
4. Verifique se o SHA-1 está correto

## Configurações do App

### Package Name
- **Configurado:** `com.garageminteligente.app`
- **Firebase:** `com.garageminteligente.app`
- **Android Manifest:** `com.garageminteligente.app`

### Client ID
- **Android:** `868408826724-fraf20uj8jeflctur19rif19lbgiapse.apps.googleusercontent.com`

## Possíveis Problemas

### 1. SHA-1 não configurado
**Sintoma:** "Falha ao conectar com o Google"
**Solução:** Adicionar SHA-1 no Firebase Console

### 2. Google Play Services desatualizado
**Sintoma:** Erro de autenticação
**Solução:** Atualizar Google Play Services no dispositivo

### 3. Plugin não sincronizado
**Sintoma:** Plugin não encontrado
**Solução:** `npx cap sync android`

### 4. Configuração OAuth incorreta
**Sintoma:** Erro de client ID
**Solução:** Verificar configuração no Google Cloud Console

## Comandos de Debug

```bash
# Verificar SHA-1
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Rebuild APK
./build-android.sh

# Instalar APK
./install-apk.sh

# Ver logs
adb logcat | grep -E "(Firebase|Google|Auth)"

# Debug completo
./debug-google-signin.sh
```

## Próximos Passos

1. ✅ Verificar SHA-1 no Firebase Console
2. ✅ Verificar Google Sign-In habilitado
3. ✅ Verificar OAuth Client configurado
4. 🔄 Rebuild e testar APK
5. 🔄 Verificar logs do dispositivo

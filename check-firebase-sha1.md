# 🔥 VERIFICAÇÃO CRÍTICA: SHA-1 no Firebase Console

## ⚠️ PROBLEMA IDENTIFICADO

O usuário está sendo autenticado no Google (aparece no Firebase Console), mas não está sincronizando com o app. Isso indica que o **SHA-1 não está configurado corretamente** no Firebase Console.

## 🔍 FINGERPRINTS DO DEBUG KEYSTORE
```
SHA-1:   BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8
SHA-256: 7F:CF:50:F0:BF:0F:C4:24:EB:99:1A:76:F5:97:4D:00:27:4B:74:D2:AE:A0:E4:D5:40:C5:A6:01:98:46:4F:08
```

## 🚨 AÇÃO NECESSÁRIA

### 1. Acesse o Firebase Console
- URL: https://console.firebase.google.com/project/autocare-platform/settings/general
- Vá para "Seus aplicativos" → Android App

### 2. Verifique se os fingerprints estão listados
- Se **NÃO** estiverem listados, adicione-os:
  - Clique em "Adicionar impressão digital"
  - **SHA-1:** `BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8`
  - **SHA-256:** `7F:CF:50:F0:BF:0F:C4:24:EB:99:1A:76:F5:97:4D:00:27:4B:74:D2:AE:A0:E4:D5:40:C5:A6:01:98:46:4F:08`
  - Salve

### 3. Baixe o novo google-services.json
- Após adicionar o SHA-1, baixe o novo arquivo
- Substitua o arquivo atual em `android/app/google-services.json`

### 4. Rebuild o APK
```bash
./fix-google-signin.sh
```

## 🔧 Por que isso acontece?

1. **Google Sign-In funciona** → Usuário é autenticado no Google
2. **SHA-1 incorreto** → Firebase não reconhece o app como válido
3. **Sincronização falha** → Usuário não é sincronizado com Firebase Auth
4. **App não recebe usuário** → Login falha no app

## 📱 Teste após correção

1. Adicione o SHA-1 no Firebase Console
2. Baixe o novo google-services.json
3. Execute: `./fix-google-signin.sh`
4. Teste o login com Google
5. Verifique os toasts na tela

## 🎯 Resultado esperado

Após adicionar o SHA-1:
- ✅ Login com Google funciona
- ✅ Usuário é sincronizado com Firebase Auth
- ✅ App recebe os dados do usuário
- ✅ Redirecionamento para home funciona

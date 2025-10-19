````markdown
# 🔐 Google Sign-In (Consolidado)

Documentação consolidada de: `GOOGLE-SIGNIN-ANDROID-SETUP.md`, `GOOGLE-SIGNIN-ANDROID-FIX.md`, `GOOGLE-SIGNIN-INTEGRATION.md`.

Checklist rápido

- Verificar SHA-1 no Firebase Console (debug keystore SHA-1): `BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8`
- Verificar OAuth Client IDs no Google Cloud Console
- Habilitar Google Provider no Firebase Authentication
- Sincronizar Capacitor: `npx cap sync android`
- Rebuild: `./scripts/fix-google-signin.sh`

Comandos de debug

```bash
# Ver SHA-1
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Rebuild & install
./scripts/fix-google-signin.sh
./scripts/install-apk.sh
```

---

> Arquivo consolidado para centralizar troubleshooting do Google Sign-In.

````

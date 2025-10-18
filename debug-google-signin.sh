#!/bin/bash

echo "🔍 DEBUG: Google Sign-In Android"
echo "================================="

# Verificar fingerprints
echo "📱 FINGERPRINTS do debug keystore:"
echo "SHA-1:   BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8"
echo "SHA-256: 7F:CF:50:F0:BF:0F:C4:24:EB:99:1A:76:F5:97:4D:00:27:4B:74:D2:AE:A0:E4:D5:40:C5:A6:01:98:46:4F:08"

echo ""
echo "🔧 Configurações do Firebase:"
echo "Project ID: autocare-platform"
echo "Package Name: com.garageminteligente.app"
echo ""

# Verificar se o google-services.json existe
if [ -f "android/app/google-services.json" ]; then
    echo "✅ google-services.json encontrado"
    echo "📋 Client ID do Android:"
    grep -o '"client_id": "[^"]*"' android/app/google-services.json | head -1
else
    echo "❌ google-services.json não encontrado!"
fi

echo ""
echo "🔍 Verificando plugins do Capacitor:"
npx cap sync android 2>&1 | grep -A 10 "Found.*plugins"

echo ""
echo "📱 Para testar:"
echo "1. Rebuild do APK: ./build-android.sh"
echo "2. Instalar: ./install-apk.sh"
echo "3. Verificar logs: adb logcat | grep -E '(Firebase|Google|Auth)'"
echo ""
echo "🔧 Se o problema persistir:"
echo "1. Verifique se os fingerprints estão no Firebase Console:"
echo "   - SHA-1: BE:D0:65:23:C4:A4:B4:03:A7:1C:4A:C9:F7:BC:59:DF:CF:74:01:F8"
echo "   - SHA-256: 7F:CF:50:F0:BF:0F:C4:24:EB:99:1A:76:F5:97:4D:00:27:4B:74:D2:AE:A0:E4:D5:40:C5:A6:01:98:46:4F:08"
echo "2. Verifique se o Google Sign-In está habilitado no Firebase"
echo "3. Verifique se o Google Play Services está atualizado no dispositivo"

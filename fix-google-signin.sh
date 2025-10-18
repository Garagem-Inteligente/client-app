#!/bin/bash

echo "🔧 CORREÇÃO: Google Sign-In Android"
echo "===================================="

# 1. Limpar builds antigas
echo "🧹 Limpando builds antigas..."
rm -rf android/app/build
rm -rf dist

# 2. Rebuild da aplicação
echo "🏗️ Rebuild da aplicação..."
pnpm build

# 3. Sincronizar Capacitor
echo "🔄 Sincronizando Capacitor..."
npx cap sync android

# 4. Build do Android
echo "📱 Build do Android..."
cd android
./gradlew clean
./gradlew assembleDebug
cd ..

# 5. Instalar APK
echo "📲 Instalando APK..."
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    adb install -r android/app/build/outputs/apk/debug/app-debug.apk
    echo "✅ APK instalado com sucesso!"
else
    echo "❌ APK não encontrado!"
    exit 1
fi

echo ""
echo "🎯 Para testar:"
echo "1. Abra o app no dispositivo"
echo "2. Tente fazer login com Google"
echo "3. Verifique os logs: adb logcat | grep -E '(Firebase|Google|Auth)'"
echo ""
echo "🔍 Se ainda houver problemas:"
echo "1. Verifique o SHA-1 no Firebase Console"
echo "2. Verifique se o Google Play Services está atualizado"
echo "3. Execute: ./debug-google-signin.sh"

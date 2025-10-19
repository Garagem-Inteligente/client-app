#!/bin/bash

echo "\ud83d\udd27 CORREÇÃO: Google Sign-In Android"
echo "===================================="

# 1. Limpar builds antigas
echo "\ud83e\uddf9 Limpando builds antigas..."
rm -rf android/app/build
rm -rf dist

# 2. Rebuild da aplicação
echo "\ud83c\udfd7\ufe0f Rebuild da aplicação..."
pnpm build

# 3. Sincronizar Capacitor
echo "\ud83d\udd04 Sincronizando Capacitor..."
npx cap sync android

# 4. Build do Android
echo "\ud83d\udcf1 Build do Android..."
cd android
./gradlew clean
./gradlew assembleDebug
cd ..

# 5. Instalar APK
echo "\ud83d\udcf2 Instalando APK..."
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    adb install -r android/app/build/outputs/apk/debug/app-debug.apk
    echo "\u2705 APK instalado com sucesso!"
else
    echo "\u274c APK não encontrado!"
    exit 1
fi

echo ""
echo "\ud83c\udfaf Para testar:"
echo "1. Abra o app no dispositivo"
echo "2. Tente fazer login com Google"
echo "3. Verifique os logs: adb logcat | grep -E '(Firebase|Google|Auth)'"


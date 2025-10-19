#!/bin/bash

# Google Sign-In Android - Quick Test Guide
# Para testar a correção do login com Google no Android

echo "\ud83d\udd27 Google Sign-In Android - Teste Rápido"
echo "========================================"
echo ""

# Step 1: Build do projeto
echo "\ud83d\udce6 Passo 1: Building projeto..."
pnpm build

if [ $? -ne 0 ]; then
    echo "\u274c Erro no build do projeto!"
    exit 1
fi

# Step 2: Sync Capacitor
echo ""
echo "\ud83d\udd04 Passo 2: Sincronizando Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "\u274c Erro ao sincronizar Capacitor!"
    exit 1
fi

# Step 3: Build Android
echo ""
echo "\ud83e\udd16 Passo 3: Building APK Android..."
cd android
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "\u274c Erro ao compilar APK!"
    cd ..
    exit 1
fi
cd ..

# Step 4: Install no dispositivo
echo ""
echo "\ud83d\udcf1 Passo 4: Instalando no dispositivo..."
adb devices

echo ""
read -p "Dispositivo conectado? (s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    # Desinstalar versão antiga
    echo "\ud83d\uddd1\ufe0f  Removendo versão antiga..."
    adb uninstall com.garageminteligente.app 2>/dev/null
    
    # Instalar nova versão
    echo "\ud83d\udcf2 Instalando nova versão..."
    adb install android/app/build/outputs/apk/debug/app-debug.apk
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "\u2705 APK instalado com sucesso!"
        echo ""
        echo "\ud83e\uddea PASSOS PARA TESTAR:"
        echo "1. Abrir app no dispositivo"
        echo "2. Clicar em 'Entrar com Google'"
        echo "3. Verificar se abre tela NATIVA de seleção de conta"
        echo "4. Selecionar conta Google"
        echo "5. Verificar se retorna ao app (SEM tela branca)"
        echo "6. Confirmar login bem-sucedido"
        echo ""
        echo "\ud83d\udcca Para ver logs:"
        echo "adb logcat | grep -E 'FirebaseAuth|FirebaseAuthentication|Google'"
    else
        echo "\u274c Erro ao instalar APK!"
        exit 1
    fi
else
    echo "\u274c Conecte um dispositivo Android e tente novamente"
    exit 1
fi

#!/bin/bash

# Google Sign-In Android - Quick Test Guide
# Para testar a correção do login com Google no Android

echo "🔧 Google Sign-In Android - Teste Rápido"
echo "========================================"
echo ""

# Step 1: Build do projeto
echo "📦 Passo 1: Building projeto..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do projeto!"
    exit 1
fi

# Step 2: Sync Capacitor
echo ""
echo "🔄 Passo 2: Sincronizando Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Erro ao sincronizar Capacitor!"
    exit 1
fi

# Step 3: Build Android
echo ""
echo "🤖 Passo 3: Building APK Android..."
cd android
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar APK!"
    cd ..
    exit 1
fi
cd ..

# Step 4: Install no dispositivo
echo ""
echo "📱 Passo 4: Instalando no dispositivo..."
adb devices

echo ""
read -p "Dispositivo conectado? (s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    # Desinstalar versão antiga
    echo "🗑️  Removendo versão antiga..."
    adb uninstall com.garageminteligente.app 2>/dev/null
    
    # Instalar nova versão
    echo "📲 Instalando nova versão..."
    adb install android/app/build/outputs/apk/debug/app-debug.apk
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ APK instalado com sucesso!"
        echo ""
        echo "🧪 PASSOS PARA TESTAR:"
        echo "1. Abrir app no dispositivo"
        echo "2. Clicar em 'Entrar com Google'"
        echo "3. Verificar se abre tela NATIVA de seleção de conta"
        echo "4. Selecionar conta Google"
        echo "5. Verificar se retorna ao app (SEM tela branca)"
        echo "6. Confirmar login bem-sucedido"
        echo ""
        echo "📊 Para ver logs:"
        echo "adb logcat | grep -E 'FirebaseAuth|FirebaseAuthentication|Google'"
    else
        echo "❌ Erro ao instalar APK!"
        exit 1
    fi
else
    echo "❌ Conecte um dispositivo Android e tente novamente"
    exit 1
fi

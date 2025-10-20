#!/bin/bash

# Script para gerar Android App Bundle (AAB) assinado
# Para upload no Google Play Console

set -e

echo "=================================================="
echo "  Build Android App Bundle (AAB) - Release"
echo "=================================================="
echo ""

# Verificar se keystore existe
KEYSTORE_FILE="android/app/upload-keystore.jks"
if [ ! -f "$KEYSTORE_FILE" ]; then
    echo "❌ Keystore não encontrado!"
    echo ""
    echo "Execute primeiro: ./scripts/generate-keystore.sh"
    exit 1
fi

# Solicitar informações de assinatura
echo "📝 Informações necessárias para assinar o AAB:"
echo ""
read -p "Alias da chave [upload]: " KEY_ALIAS
KEY_ALIAS=${KEY_ALIAS:-upload}

read -sp "Senha do keystore: " KEYSTORE_PASSWORD
echo ""
read -sp "Senha da chave [$KEY_ALIAS]: " KEY_PASSWORD
echo ""
KEY_PASSWORD=${KEY_PASSWORD:-$KEYSTORE_PASSWORD}

echo ""
echo "🏗️  Iniciando build do AAB..."
echo ""

# 1. Build do projeto web
echo "📦 [1/4] Build do projeto web (Vite)..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build web"
    exit 1
fi

echo "✅ Build web concluído"
echo ""

# 2. Sync com Capacitor
echo "🔄 [2/4] Sincronizando com Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Erro ao sincronizar com Capacitor"
    exit 1
fi

echo "✅ Sincronização concluída"
echo ""

# 3. Limpar builds anteriores
echo "🧹 [3/4] Limpando builds anteriores..."
cd android
./gradlew clean

echo "✅ Limpeza concluída"
echo ""

# 4. Gerar AAB assinado
echo "🔨 [4/4] Gerando Android App Bundle assinado..."
echo ""

./gradlew bundleRelease \
    -Pandroid.injected.signing.store.file="$(pwd)/app/upload-keystore.jks" \
    -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \
    -Pandroid.injected.signing.key.alias="$KEY_ALIAS" \
    -Pandroid.injected.signing.key.password="$KEY_PASSWORD"

if [ $? -eq 0 ]; then
    AAB_FILE="app/build/outputs/bundle/release/app-release.aab"
    
    echo ""
    echo "=================================================="
    echo "  ✅ AAB GERADO COM SUCESSO!"
    echo "=================================================="
    echo ""
    echo "📁 Localização do AAB:"
    echo "   $(pwd)/$AAB_FILE"
    echo ""
    
    # Informações do arquivo
    if [ -f "$AAB_FILE" ]; then
        FILE_SIZE=$(du -h "$AAB_FILE" | cut -f1)
        echo "📊 Tamanho: $FILE_SIZE"
        echo ""
    fi
    
    echo "📤 PRÓXIMOS PASSOS PARA ENVIO AO GOOGLE PLAY:"
    echo ""
    echo "1. Acesse: https://play.google.com/console"
    echo ""
    echo "2. Selecione seu app ou crie um novo"
    echo ""
    echo "3. Vá em: Release > Testing > Internal testing"
    echo "   (ou Closed testing para grupo maior)"
    echo ""
    echo "4. Clique em: Create new release"
    echo ""
    echo "5. Faça upload do arquivo AAB:"
    echo "   android/$AAB_FILE"
    echo ""
    echo "6. Preencha:"
    echo "   - Release name (ex: v1.0 - Build inicial)"
    echo "   - Release notes (descreva as funcionalidades)"
    echo ""
    echo "7. Configure testadores (emails ou grupos do Google)"
    echo ""
    echo "8. Clique em: Review release > Start rollout"
    echo ""
    echo "9. Compartilhe o link de teste com os testadores"
    echo ""
    echo "=================================================="
    echo "  INFORMAÇÕES IMPORTANTES"
    echo "=================================================="
    echo ""
    echo "📋 App ID: com.garageminteligente.app"
    echo "📦 Version Code: 1"
    echo "📱 Version Name: 1.0"
    echo ""
    echo "⚠️  BACKUP: Faça backup do keystore e senhas!"
    echo "   Arquivo: android/app/upload-keystore.jks"
    echo ""
    
    cd ..
    
else
    echo ""
    echo "❌ Erro ao gerar AAB"
    cd ..
    exit 1
fi

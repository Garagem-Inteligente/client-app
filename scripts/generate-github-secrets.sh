#!/bin/bash

# Script para gerar os secrets necessários para GitHub Actions

set -e

echo "=================================================="
echo "  Gerador de Secrets para GitHub Actions"
echo "  Google Play Store Deploy"
echo "=================================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Este script vai gerar os valores dos secrets necessários${NC}"
echo ""
echo "Você precisará adicionar estes valores em:"
echo "  GitHub → Settings → Secrets and variables → Actions"
echo ""
echo "=================================================="
echo ""

# 1. GOOGLE_SERVICES_JSON
echo -e "${GREEN}1. GOOGLE_SERVICES_JSON${NC}"
if [ -f "android/app/google-services.json" ]; then
    echo "Encontrado: android/app/google-services.json"
    echo ""
    echo "Cole este conteúdo no secret GOOGLE_SERVICES_JSON:"
    echo "---------------------------------------------------"
    cat android/app/google-services.json
    echo "---------------------------------------------------"
else
    echo -e "${YELLOW}⚠️  Arquivo não encontrado: android/app/google-services.json${NC}"
    echo "Baixe do Firebase Console e coloque em android/app/"
fi
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 2. ANDROID_KEYSTORE_BASE64
echo -e "${GREEN}2. ANDROID_KEYSTORE_BASE64${NC}"
KEYSTORE_FILE="android/app/upload-keystore.jks"
if [ -f "$KEYSTORE_FILE" ]; then
    echo "Encontrado: $KEYSTORE_FILE"
    echo ""
    echo "Cole este conteúdo no secret ANDROID_KEYSTORE_BASE64:"
    echo "---------------------------------------------------"
    base64 -w 0 "$KEYSTORE_FILE"
    echo ""
    echo "---------------------------------------------------"
else
    echo -e "${YELLOW}⚠️  Arquivo não encontrado: $KEYSTORE_FILE${NC}"
    echo "Execute: ./scripts/generate-keystore.sh"
fi
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 3. ANDROID_KEYSTORE_PASSWORD
echo -e "${GREEN}3. ANDROID_KEYSTORE_PASSWORD${NC}"
read -sp "Digite a senha do keystore: " KEYSTORE_PASSWORD
echo ""
echo "Secret ANDROID_KEYSTORE_PASSWORD: $KEYSTORE_PASSWORD"
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 4. ANDROID_KEY_PASSWORD
echo -e "${GREEN}4. ANDROID_KEY_PASSWORD${NC}"
read -sp "Digite a senha da chave (normalmente igual ao keystore): " KEY_PASSWORD
echo ""
echo "Secret ANDROID_KEY_PASSWORD: $KEY_PASSWORD"
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 5. ANDROID_KEY_ALIAS
echo -e "${GREEN}5. ANDROID_KEY_ALIAS${NC}"
read -p "Digite o alias da chave [upload]: " KEY_ALIAS
KEY_ALIAS=${KEY_ALIAS:-upload}
echo "Secret ANDROID_KEY_ALIAS: $KEY_ALIAS"
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 6. GOOGLE_PLAY_SERVICE_ACCOUNT
echo -e "${GREEN}6. GOOGLE_PLAY_SERVICE_ACCOUNT${NC}"
echo ""
echo "Para gerar este secret, você precisa:"
echo "  1. Criar uma Service Account no Google Cloud Console"
echo "  2. Baixar o arquivo JSON da chave"
echo "  3. Adicionar a Service Account na Play Console"
echo ""
echo "Veja o guia completo em: docs/GOOGLE-PLAY-CI-CD.md"
echo ""
read -p "Se você já tem o arquivo JSON, digite o caminho (ou deixe vazio): " SERVICE_ACCOUNT_FILE

if [ -n "$SERVICE_ACCOUNT_FILE" ] && [ -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo ""
    echo "Cole este conteúdo no secret GOOGLE_PLAY_SERVICE_ACCOUNT:"
    echo "---------------------------------------------------"
    cat "$SERVICE_ACCOUNT_FILE"
    echo "---------------------------------------------------"
else
    echo -e "${YELLOW}⚠️  Arquivo não fornecido ou não encontrado${NC}"
    echo "Siga o guia em docs/GOOGLE-PLAY-CI-CD.md para criar"
fi
echo ""

# Resumo
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Resumo dos Secrets${NC}"
echo "=================================================="
echo ""
echo "Adicione estes secrets no GitHub:"
echo ""
echo "1. GOOGLE_SERVICES_JSON (JSON completo)"
echo "2. ANDROID_KEYSTORE_BASE64 (base64 do keystore)"
echo "3. ANDROID_KEYSTORE_PASSWORD: $KEYSTORE_PASSWORD"
echo "4. ANDROID_KEY_PASSWORD: $KEY_PASSWORD"
echo "5. ANDROID_KEY_ALIAS: $KEY_ALIAS"
echo "6. GOOGLE_PLAY_SERVICE_ACCOUNT (JSON da Service Account)"
echo ""
echo "Local para adicionar:"
echo "  GitHub → Settings → Secrets and variables → Actions"
echo ""
echo "=================================================="
echo ""
echo -e "${BLUE}📖 Guia completo: docs/GOOGLE-PLAY-CI-CD.md${NC}"
echo ""

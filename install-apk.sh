#!/bin/bash

# Script para instalar o APK no dispositivo Android via ADB

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}    📱 Instalador de APK - Garagem Inteligente    ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se o APK existe
APK_PATH="./garagem-inteligente-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}❌ APK não encontrado: $APK_PATH${NC}"
    echo -e "${YELLOW}💡 Execute './build-android.sh' primeiro para gerar o APK${NC}"
    exit 1
fi

echo -e "${GREEN}✅ APK encontrado!${NC}"
APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
echo -e "${YELLOW}📏 Tamanho: ${APK_SIZE}${NC}"
echo ""

# Verificar se ADB está disponível
if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ ADB não encontrado!${NC}"
    echo -e "${YELLOW}💡 Instale o ADB com: sudo apt install android-tools-adb${NC}"
    echo ""
    echo -e "${YELLOW}Ou use uma das opções alternativas:${NC}"
    echo -e "  1️⃣  Copie o APK manualmente para o celular via USB"
    echo -e "  2️⃣  Envie via Google Drive/WhatsApp/Email"
    echo ""
    echo -e "📂 Localização do APK: $(realpath $APK_PATH)"
    exit 1
fi

# Verificar dispositivos conectados
echo -e "${YELLOW}🔍 Procurando dispositivos Android conectados...${NC}"
DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l)

if [ "$DEVICES" -eq 0 ]; then
    echo -e "${RED}❌ Nenhum dispositivo Android detectado!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Siga estes passos:${NC}"
    echo "  1️⃣  Conecte seu celular ao PC via cabo USB"
    echo "  2️⃣  Ative 'Depuração USB' nas Opções do Desenvolvedor"
    echo "  3️⃣  Aceite o prompt de autorização no celular"
    echo "  4️⃣  Execute este script novamente"
    echo ""
    echo -e "${YELLOW}Ou use uma opção alternativa:${NC}"
    echo -e "📂 Localização do APK: $(realpath $APK_PATH)"
    exit 1
fi

echo -e "${GREEN}✅ Dispositivo(s) detectado(s):${NC}"
adb devices
echo ""

# Instalar APK
echo -e "${YELLOW}📲 Instalando APK no dispositivo...${NC}"
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}    🎉 APK INSTALADO COM SUCESSO! 🎉${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}📱 Procure por 'Garagem Inteligente' no seu celular${NC}"
    echo -e "${YELLOW}🚀 O app já está pronto para usar!${NC}"
else
    echo ""
    echo -e "${RED}❌ Erro ao instalar o APK${NC}"
    echo -e "${YELLOW}💡 Tente:${NC}"
    echo "  • Verificar se a 'Depuração USB' está ativada"
    echo "  • Desinstalar versão antiga do app (se houver)"
    echo "  • Reiniciar o dispositivo"
    exit 1
fi


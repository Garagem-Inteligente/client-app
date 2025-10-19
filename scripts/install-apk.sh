#!/bin/bash

# Script para instalar o APK no dispositivo Android via ADB

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}\u2501...${NC}"
echo -e "${GREEN}    \ud83d\udcf1 Instalador de APK - Garagem Inteligente    ${NC}"
echo -e "${GREEN}\u2501...${NC}"
echo ""

# Verificar se o APK existe
APK_PATH="./garagem-inteligente-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}\u274c APK não encontrado: $APK_PATH${NC}"
    echo -e "${YELLOW}\ud83d\udca1 Execute './scripts/build-android.sh' primeiro para gerar o APK${NC}"
    exit 1
fi

echo -e "${GREEN}\u2705 APK encontrado!${NC}"
APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
echo -e "${YELLOW}\ud83d\udccf Tamanho: ${APK_SIZE}${NC}"
echo ""

# Verificar se ADB está disponível
if ! command -v adb &> /dev/null; then
    echo -e "${RED}\u274c ADB não encontrado!${NC}"
    echo -e "${YELLOW}\ud83d\udca1 Instale o ADB com: sudo apt install android-tools-adb${NC}"
    echo ""
    echo -e "${YELLOW}Ou use uma das opções alternativas:${NC}"
    echo -e "  1\ufe0f\u20e3  Copie o APK manualmente para o celular via USB"
    echo -e "  2\ufe0f\u20e3  Envie via Google Drive/WhatsApp/Email"
    echo ""
    echo -e "\ud83d\udcc2 Localização do APK: $(realpath $APK_PATH)"
    exit 1
fi

# Verificar dispositivos conectados
echo -e "${YELLOW}\ud83d\udd0d Procurando dispositivos Android conectados...${NC}"
DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l)

if [ "$DEVICES" -eq 0 ]; then
    echo -e "${RED}\u274c Nenhum dispositivo Android detectado!${NC}"
    echo ""
    echo -e "${YELLOW}\ud83d\udcdd Siga estes passos:${NC}"
    echo "  1\ufe0f\u20e3  Conecte seu celular ao PC via cabo USB"
    echo "  2\ufe0f\u20e3  Ative 'Depuração USB' nas Opções do Desenvolvedor"
    echo "  3\ufe0f\u20e3  Aceite o prompt de autorização no celular"
    echo "  4\ufe0f\u20e3  Execute este script novamente"
    echo ""
    echo -e "${YELLOW}Ou use uma opção alternativa:${NC}"
    echo -e "\ud83d\udcc2 Localização do APK: $(realpath $APK_PATH)"
    exit 1
fi

echo -e "${GREEN}\u2705 Dispositivo(s) detectado(s):${NC}"
adb devices
echo ""

# Instalar APK
echo -e "${YELLOW}\ud83d\udcf2 Instalando APK no dispositivo...${NC}"
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}\u2501...${NC}"
    echo -e "${GREEN}    \ud83c\udf89 APK INSTALADO COM SUCESSO! \ud83c\udf89${NC}"
    echo -e "${GREEN}\u2501...${NC}"
    echo ""
    echo -e "${YELLOW}\ud83d\udcf1 Procure por 'Garagem Inteligente' no seu celular${NC}"
    echo -e "${YELLOW}\ud83d\ude80 O app já está pronto para usar!${NC}"
else
    echo ""
    echo -e "${RED}\u274c Erro ao instalar o APK${NC}"
    echo -e "${YELLOW}\ud83d\udca1 Tente:${NC}"
    echo "  • Verificar se a 'Depuração USB' está ativada"
    echo "  • Desinstalar versão antiga do app (se houver)"
    echo "  • Reiniciar o dispositivo"
    exit 1
fi

#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=================================================="
echo "  Gerador de Keystore para Google Play"
echo "=================================================="
echo ""

# Verificar se keytool está instalado
if ! command -v keytool &> /dev/null; then
    echo -e "${RED}❌ Erro: keytool não encontrado!${NC}"
    echo ""
    echo "Instale o Java JDK:"
    echo "  Ubuntu/Debian: sudo apt install openjdk-17-jdk"
    echo "  macOS: brew install openjdk@17"
    exit 1
fi

# Definir caminho do keystore
KEYSTORE_DIR="android/app"
KEYSTORE_PATH="$KEYSTORE_DIR/upload-keystore.jks"

# Criar diretório se não existir
if [ ! -d "$KEYSTORE_DIR" ]; then
    echo -e "${YELLOW}⚠️  Criando diretório: $KEYSTORE_DIR${NC}"
    mkdir -p "$KEYSTORE_DIR"
fi

# Verificar se já existe
if [ -f "$KEYSTORE_PATH" ]; then
    echo -e "${YELLOW}⚠️  Keystore já existe: $KEYSTORE_PATH${NC}"
    echo ""
    read -p "Deseja sobrescrever? (s/N): " overwrite
    if [[ ! $overwrite =~ ^[Ss]$ ]]; then
        echo -e "${BLUE}ℹ️  Operação cancelada.${NC}"
        exit 0
    fi
    rm "$KEYSTORE_PATH"
fi

echo ""
echo -e "${BLUE}📝 Você precisará fornecer as seguintes informações:${NC}"
echo "   - Senha do keystore (mínimo 6 caracteres)"
echo "   - Alias da chave (sugestão: 'upload')"
echo "   - Nome completo ou da empresa"
echo "   - Unidade organizacional (ex: Desenvolvimento)"
echo "   - Organização (ex: Garagem Inteligente)"
echo "   - Cidade"
echo "   - Estado"
echo "   - Código do país (BR)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Anote a senha e o alias em local seguro!${NC}"
echo "   Você precisará deles para builds futuros."
echo ""
read -p "Pressione ENTER para continuar..."

# Gerar keystore
keytool -genkey -v \
    -keystore "$KEYSTORE_PATH" \
    -alias upload \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000

# Verificar se foi criado com sucesso
if [ -f "$KEYSTORE_PATH" ]; then
    echo ""
    echo -e "${GREEN}✅ Keystore criado com sucesso!${NC}"
    echo ""
    echo "📍 Localização: $KEYSTORE_PATH"
    echo ""
    echo -e "${YELLOW}🔐 IMPORTANTE - Faça backup deste arquivo:${NC}"
    echo "   $KEYSTORE_PATH"
    echo ""
    echo -e "${YELLOW}📝 Anote também:${NC}"
    echo "   - Senha do keystore"
    echo "   - Alias: upload"
    echo ""
    echo -e "${GREEN}🎯 Próximo passo: Execute ./scripts/build-aab.sh${NC}"
else
    echo ""
    echo -e "${RED}❌ Erro ao criar keystore!${NC}"
    echo ""
    echo "Possíveis causas:"
    echo "  - Permissões de escrita no diretório"
    echo "  - Java/keytool não instalado corretamente"
    exit 1
fi
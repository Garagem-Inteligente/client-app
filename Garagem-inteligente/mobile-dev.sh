#!/bin/bash

# 📱 Garagem Inteligente - Script de Desenvolvimento Mobile
# Este script facilita o desenvolvimento mobile

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 Garagem Inteligente - Desenvolvimento Mobile${NC}"
echo ""

# Função para obter IP da máquina
get_local_ip() {
    ip addr show | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}' | cut -d'/' -f1
}

# Função para verificar se porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Função para iniciar PWA
start_pwa() {
    echo -e "${GREEN}🌐 Iniciando PWA para desenvolvimento mobile...${NC}"
    
    cd App-client/app-client
    
    if check_port 5175; then
        echo -e "${YELLOW}⚠️  Porta 5175 já está em uso${NC}"
        echo -e "${BLUE}💡 Tentando porta alternativa...${NC}"
        npm run dev -- --host --port 5176
        PORT=5176
    else
        npm run dev -- --host
        PORT=5175
    fi
    
    LOCAL_IP=$(get_local_ip)
    
    echo ""
    echo -e "${GREEN}✅ PWA iniciado com sucesso!${NC}"
    echo -e "${BLUE}📱 Acesse no seu celular:${NC}"
    echo -e "${PURPLE}   http://${LOCAL_IP}:${PORT}${NC}"
    echo ""
    echo -e "${YELLOW}💡 Instruções:${NC}"
    echo "1. Conecte o celular na mesma rede WiFi"
    echo "2. Abra o navegador (Chrome/Safari)"
    echo "3. Digite o IP acima"
    echo "4. Para instalar como PWA: Menu → 'Adicionar à tela inicial'"
    echo ""
    echo -e "${BLUE}🔄 Para parar: Ctrl + C${NC}"
}

# Função para build Capacitor
build_capacitor() {
    echo -e "${GREEN}🔨 Fazendo build para Capacitor...${NC}"
    
    cd App-client/app-client
    
    echo -e "${BLUE}📦 Instalando dependências...${NC}"
    npm install
    
    echo -e "${BLUE}🏗️  Fazendo build...${NC}"
    npm run build
    
    echo -e "${BLUE}🔄 Sincronizando com Capacitor...${NC}"
    npx cap sync
    
    echo -e "${GREEN}✅ Build concluído!${NC}"
    echo ""
    echo -e "${YELLOW}💡 Próximos passos:${NC}"
    echo "• Android: npx cap run android"
    echo "• iOS: npx cap run ios"
    echo "• Abrir IDE: npx cap open android/ios"
}

# Função para live reload Android
android_live_reload() {
    echo -e "${GREEN}🤖 Iniciando Android com Live Reload...${NC}"
    
    cd App-client/app-client
    
    LOCAL_IP=$(get_local_ip)
    
    echo -e "${BLUE}📱 Configurando live reload para IP: ${LOCAL_IP}${NC}"
    
    npx cap run android --livereload --external --target=${LOCAL_IP}
}

# Função para mostrar status
show_status() {
    echo -e "${BLUE}📊 Status dos Serviços:${NC}"
    echo ""
    
    LOCAL_IP=$(get_local_ip)
    echo -e "${GREEN}🌐 IP da Máquina: ${LOCAL_IP}${NC}"
    echo ""
    
    if check_port 5175; then
        echo -e "${GREEN}✅ PWA rodando em: http://${LOCAL_IP}:5175${NC}"
    else
        echo -e "${RED}❌ PWA não está rodando${NC}"
    fi
    
    if check_port 3000; then
        echo -e "${GREEN}✅ Landing Page rodando em: http://${LOCAL_IP}:3000${NC}"
    else
        echo -e "${RED}❌ Landing Page não está rodando${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}💡 Para iniciar PWA: ./mobile-dev.sh pwa${NC}"
    echo -e "${YELLOW}💡 Para build Capacitor: ./mobile-dev.sh build${NC}"
}

# Menu principal
case "$1" in
    "pwa")
        start_pwa
        ;;
    "build")
        build_capacitor
        ;;
    "android")
        android_live_reload
        ;;
    "status")
        show_status
        ;;
    *)
        echo -e "${BLUE}📱 Garagem Inteligente - Desenvolvimento Mobile${NC}"
        echo ""
        echo -e "${YELLOW}Uso: $0 [comando]${NC}"
        echo ""
        echo -e "${GREEN}Comandos disponíveis:${NC}"
        echo -e "  ${BLUE}pwa${NC}     - Iniciar PWA para desenvolvimento mobile"
        echo -e "  ${BLUE}build${NC}   - Fazer build para Capacitor"
        echo -e "  ${BLUE}android${NC} - Iniciar Android com live reload"
        echo -e "  ${BLUE}status${NC}  - Mostrar status dos serviços"
        echo ""
        echo -e "${YELLOW}Exemplos:${NC}"
        echo -e "  $0 pwa      # Iniciar PWA"
        echo -e "  $0 build    # Build para mobile"
        echo -e "  $0 status   # Ver status"
        echo ""
        echo -e "${PURPLE}💡 Dica: Use '$0 pwa' para desenvolvimento rápido!${NC}"
        ;;
esac


#!/bin/bash

# 🚗 Garagem Inteligente - Script de Inicialização
# Este script inicia todos os projetos da Garagem Inteligente

echo "🚗 Iniciando projetos da Garagem Inteligente..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Porta $1 já está em uso${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Porta $1 disponível${NC}"
        return 0
    fi
}

# Função para iniciar projeto em background
start_project() {
    local project_name=$1
    local project_path=$2
    local port=$3
    local command=$4
    
    echo -e "${BLUE}🚀 Iniciando $project_name...${NC}"
    
    if [ -d "$project_path" ]; then
        cd "$project_path"
        
        if check_port $port; then
            echo -e "${GREEN}✅ Iniciando $project_name na porta $port${NC}"
            nohup $command > /dev/null 2>&1 &
            echo -e "${GREEN}✅ $project_name iniciado em background${NC}"
        else
            echo -e "${YELLOW}⚠️  $project_name não iniciado - porta $port ocupada${NC}"
        fi
    else
        echo -e "${RED}❌ Diretório $project_path não encontrado${NC}"
    fi
    echo ""
}

# Verificar se estamos no diretório correto
if [ ! -d "App-client" ] || [ ! -d "Landing-page-client" ]; then
    echo -e "${RED}❌ Execute este script a partir do diretório Garagem-inteligente${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Status dos Projetos:${NC}"
echo ""

# 1. Landing Page Client (Nuxt)
start_project "Landing Page Client" "Landing-page-client" 3000 "pnpm run dev"

# 2. App Client (Ionic)
start_project "App Client" "App-client/app-client" 8100 "npm run dev"

# 3. Projeto Principal (Vue)
start_project "Projeto Principal" "../../" 5173 "npm run dev"

echo -e "${GREEN}🎉 Inicialização concluída!${NC}"
echo ""
echo -e "${BLUE}📱 URLs dos Projetos:${NC}"
echo -e "${GREEN}• Landing Page Client:${NC} http://localhost:3000"
echo -e "${GREEN}• App Client (Mobile):${NC} http://localhost:8100 (ou porta alternativa)"
echo -e "${GREEN}• Projeto Principal:${NC} http://localhost:5173"
echo ""
echo -e "${YELLOW}💡 Dica: Use 'ps aux | grep -E \"(vite|nuxt|ionic)\"' para ver processos rodando${NC}"
echo -e "${YELLOW}💡 Dica: Use 'pkill -f \"(vite|nuxt|ionic)\"' para parar todos os projetos${NC}"


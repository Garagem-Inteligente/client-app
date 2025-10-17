#!/bin/bash

# Script para iniciar o servidor de desenvolvimento com cache limpo

echo "🧹 Limpando cache e processos..."

# Matar processos do Vite
pkill -f "vite" 2>/dev/null || true

# Limpar cache do Vite
rm -rf node_modules/.vite

echo "✅ Cache limpo!"
echo ""
echo "🚀 Iniciando servidor de desenvolvimento..."
echo ""

# Iniciar servidor
pnpm run dev


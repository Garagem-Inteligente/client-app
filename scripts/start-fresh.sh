#!/bin/bash

# Script para iniciar o servidor de desenvolvimento com cache limpo

echo "\ud83e\uddf9 Limpando cache e processos..."

# Matar processos do Vite
pkill -f "vite" 2>/dev/null || true

# Limpar cache do Vite
rm -rf node_modules/.vite

echo "\u2705 Cache limpo!"
echo ""
echo "\ud83d\ude80 Iniciando servidor de desenvolvimento..."
echo ""

# Iniciar servidor
pnpm run dev

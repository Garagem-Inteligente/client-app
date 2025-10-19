#!/bin/bash

# Script de setup das Firebase Functions
# Garagem Inteligente

echo "🔧 Configurando Firebase Functions..."

# Verificar se está na raiz do projeto
if [ ! -f "firebase.json" ]; then
  echo "❌ Erro: Execute este script da raiz do projeto"
  exit 1
fi

# Entrar no diretório functions
cd functions || exit 1

echo "📦 Instalando dependências..."
npm install

echo "🔨 Compilando TypeScript..."
npm run build

echo ""
echo "✅ Firebase Functions configuradas com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Configure sua SendGrid API Key:"
echo "   firebase functions:config:set sendgrid.key=\"SUA_API_KEY\""
echo ""
echo "2. Para testar localmente:"
echo "   npm run serve"
echo ""
echo "3. Para fazer deploy:"
echo "   cd .. && firebase deploy --only functions"
echo ""
echo "📚 Documentação completa: docs/PASSWORD-CHANGE-SENDGRID.md"

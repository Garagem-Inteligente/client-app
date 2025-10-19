#!/bin/bash

# Script de setup das Firebase Functions
# Garagem Inteligente

echo "Configuring Firebase Functions..."

if [ ! -f "firebase.json" ]; then
  echo "Error: run from project root"
  exit 1
fi

cd functions || exit 1

# Prefer pnpm if available
if command -v pnpm &> /dev/null; then
  pnpm install
else
  npm install
fi

pnpm run build || npm run build

echo "Done. Configure SendGrid key with:"
echo "firebase functions:config:set sendgrid.key=\"SUA_API_KEY\""

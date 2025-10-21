#!/bin/bash

# Script para gerar base64 correto do keystore para GitHub Secrets
# Uso: ./scripts/generate-keystore-base64.sh

set -e

KEYSTORE_PATH="android/app/upload-keystore.jks"

echo "🔐 Gerando ANDROID_KEYSTORE_BASE64 para GitHub Secrets"
echo ""

if [ ! -f "$KEYSTORE_PATH" ]; then
  echo "❌ Erro: Keystore não encontrado em $KEYSTORE_PATH"
  echo ""
  echo "Para criar o keystore:"
  echo "  keytool -genkey -v -keystore $KEYSTORE_PATH -alias upload \\"
  echo "    -keyalg RSA -keysize 2048 -validity 10000"
  exit 1
fi

echo "📦 Keystore encontrado: $KEYSTORE_PATH"
echo ""

# Gera base64 em SINGLE LINE (sem quebras de linha)
BASE64_KEYSTORE=$(base64 -w 0 "$KEYSTORE_PATH")

echo "✅ Base64 gerado com sucesso!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Copie o valor abaixo para o GitHub Secret: ANDROID_KEYSTORE_BASE64"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "$BASE64_KEYSTORE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  1. Copie TODO o texto acima (single line, sem quebras)"
echo "  2. GitHub → Settings → Secrets → Actions → ANDROID_KEYSTORE_BASE64"
echo "  3. Cole o valor SEM adicionar espaços ou quebras de linha"
echo ""

# Teste de decode para validar
echo "🧪 Testando decode..."
echo "$BASE64_KEYSTORE" | base64 -d > /tmp/test-keystore.jks 2>/dev/null

if [ $? -eq 0 ]; then
  ORIGINAL_SIZE=$(stat -c%s "$KEYSTORE_PATH")
  DECODED_SIZE=$(stat -c%s "/tmp/test-keystore.jks")
  
  if [ "$ORIGINAL_SIZE" -eq "$DECODED_SIZE" ]; then
    echo "✅ Decode validado: $DECODED_SIZE bytes"
  else
    echo "⚠️  Tamanhos diferentes: Original=$ORIGINAL_SIZE, Decoded=$DECODED_SIZE"
  fi
  
  rm /tmp/test-keystore.jks
else
  echo "❌ Erro no teste de decode!"
  exit 1
fi

echo ""
echo "🎯 Próximo passo: Atualizar o secret no GitHub"

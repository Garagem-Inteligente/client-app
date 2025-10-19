#!/bin/bash

# Garagem Inteligente - Android Build Script
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Building Android APK...${NC}"

if [ ! -f "capacitor.config.ts" ]; then
    echo -e "${RED}Error: Run from project root${NC}"
    exit 1
fi

pnpm run build
npx cap sync android
cd android
./gradlew assembleDebug
cd ..

APK_SOURCE="android/app/build/outputs/apk/debug/app-debug.apk"
APK_DEST="garagem-inteligente-debug.apk"

if [ -f "$APK_SOURCE" ]; then
  cp "$APK_SOURCE" "$APK_DEST"
  echo -e "${GREEN}APK copied to ./$APK_DEST${NC}"
else
  echo -e "${RED}APK not found at $APK_SOURCE${NC}"
  exit 1
fi

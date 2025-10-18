#!/bin/bash

# 📱 Script para Build Android APK
# Autor: Garagem Inteligente
# Data: Outubro 2025

set -e  # Exit on error

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    📱 Garagem Inteligente - Android Build    ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "capacitor.config.ts" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# 1. Build Vue
echo -e "${YELLOW}🔨 Step 1/4: Building Vue app...${NC}"
pnpm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Vue build completed!${NC}"
else
    echo -e "${RED}❌ Vue build failed!${NC}"
    exit 1
fi
echo ""

# 2. Sync Capacitor
echo -e "${YELLOW}🔄 Step 2/4: Syncing Capacitor...${NC}"
npx cap sync android
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Capacitor synced!${NC}"
else
    echo -e "${RED}❌ Capacitor sync failed!${NC}"
    exit 1
fi
echo ""

# 3. Build APK
echo -e "${YELLOW}📦 Step 3/4: Building APK...${NC}"
cd android
./gradlew assembleDebug
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ APK built successfully!${NC}"
else
    echo -e "${RED}❌ APK build failed!${NC}"
    exit 1
fi
cd ..
echo ""

# 4. Copy APK to root
echo -e "${YELLOW}📋 Step 4/4: Copying APK...${NC}"
APK_SOURCE="android/app/build/outputs/apk/debug/app-debug.apk"
APK_DEST="garagem-inteligente-debug.apk"

if [ -f "$APK_SOURCE" ]; then
    cp "$APK_SOURCE" "$APK_DEST"
    
    # Get APK size
    APK_SIZE=$(du -h "$APK_DEST" | cut -f1)
    
    echo -e "${GREEN}✅ APK copied successfully!${NC}"
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}    ✨ Build Completed Successfully! ✨        ${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📱 APK Location:${NC} ./$APK_DEST"
    echo -e "${BLUE}📊 APK Size:${NC} $APK_SIZE"
    echo ""
    echo -e "${YELLOW}📲 Installation Options:${NC}"
    echo ""
    echo -e "  ${BLUE}Option 1 - Install via ADB:${NC}"
    echo -e "    adb install -r $APK_DEST"
    echo ""
    echo -e "  ${BLUE}Option 2 - Transfer to phone:${NC}"
    echo -e "    Copy the APK to your phone and install manually"
    echo ""
    
    # Optional: Install on device
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    read -p "$(echo -e ${YELLOW}Install on connected device now? \(y/n\)${NC}) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📲 Installing on device...${NC}"
        
        # Check if device is connected
        DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l)
        
        if [ $DEVICES -eq 0 ]; then
            echo -e "${RED}❌ No device found!${NC}"
            echo -e "${YELLOW}💡 Make sure:${NC}"
            echo -e "  1. USB debugging is enabled on your phone"
            echo -e "  2. Phone is connected via USB"
            echo -e "  3. You authorized USB debugging on your phone"
            exit 1
        fi
        
        adb install -r "$APK_DEST"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ App installed successfully!${NC}"
            echo -e "${GREEN}🚀 You can now launch the app on your device!${NC}"
        else
            echo -e "${RED}❌ Installation failed!${NC}"
            exit 1
        fi
    else
        echo -e "${BLUE}ℹ️  APK ready for manual installation${NC}"
    fi
    
else
    echo -e "${RED}❌ APK not found at: $APK_SOURCE${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}         🎉 Process Completed! 🎉              ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""


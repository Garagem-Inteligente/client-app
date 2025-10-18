# 📱 Guia: Gerar APK para Android

## 📋 Pré-requisitos

### 1. Instalar Android Studio
- Download: https://developer.android.com/studio
- Instalar o Android Studio
- Durante a instalação, certifique-se de instalar:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (opcional, para emulador)

### 2. Configurar Variáveis de Ambiente

Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0

# Java (necessário para build Android)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
```

Depois execute:
```bash
source ~/.zshrc  # ou source ~/.bashrc
```

### 3. Verificar Instalações
```bash
java -version        # Deve mostrar Java 11 ou superior
android --version    # Deve mostrar versão do Android SDK
```

---

## 🚀 Passo a Passo: Gerar APK

### 1. Adicionar Plataforma Android ao Capacitor

```bash
cd /home/michel/Documentos/Pessoal/autocare-landing-page/Garagem-inteligente/App-client/app-client

# Instalar dependências do Capacitor (se ainda não instalou)
pnpm add @capacitor/android

# Adicionar plataforma Android
npx cap add android
```

### 2. Build da Aplicação Vue

```bash
# Build de produção
pnpm run build

# Sincronizar com Capacitor
npx cap sync android
```

### 3. Abrir no Android Studio

```bash
npx cap open android
```

Isso abrirá o Android Studio com o projeto Android.

### 4. Gerar APK no Android Studio

**Opção A - APK de Debug (mais rápido, para testes):**
1. No Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Aguarde a build completar
3. Clique em "locate" na notificação ou vá para: `android/app/build/outputs/apk/debug/app-debug.apk`

**Opção B - APK de Release (para produção):**
1. No Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Para APK assinado: `Build > Generate Signed Bundle / APK`

---

## 🔧 Alternativa: Gerar APK pela Linha de Comando

### 1. Build de Debug (Desenvolvimento)

```bash
cd android
./gradlew assembleDebug

# APK gerado em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 2. Build de Release (Produção)

Primeiro, crie um keystore para assinar o APK:

```bash
# Gerar keystore
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Mover para pasta android/app
mv my-release-key.keystore android/app/
```

Crie o arquivo `android/key.properties`:

```properties
storePassword=sua_senha
keyPassword=sua_senha
keyAlias=my-key-alias
storeFile=my-release-key.keystore
```

Edite `android/app/build.gradle` para adicionar configuração de assinatura:

```gradle
android {
    ...
    signingConfigs {
        release {
            def keystorePropertiesFile = rootProject.file("key.properties")
            def keystoreProperties = new Properties()
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

Agora gere o APK de release:

```bash
cd android
./gradlew assembleRelease

# APK gerado em:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 📲 Instalar APK no Android

### Método 1: Via USB (Android Debug Bridge - ADB)

```bash
# Habilitar "Depuração USB" no seu Android:
# Configurações > Sobre o telefone > Toque 7x em "Número da versão"
# Configurações > Opções do desenvolvedor > Depuração USB (ativar)

# Conectar o celular via USB e aceitar depuração USB

# Verificar se o dispositivo foi detectado
adb devices

# Instalar APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ou para forçar reinstalação:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Método 2: Transferir APK e Instalar Manualmente

1. **Copiar APK para o celular:**
   - Conecte o celular via USB
   - Copie o arquivo `app-debug.apk` para a pasta Downloads do celular

2. **Instalar no celular:**
   - Abra o gerenciador de arquivos no Android
   - Navegue até Downloads
   - Toque no arquivo `app-debug.apk`
   - Permita instalação de fontes desconhecidas (se solicitado)
   - Siga as instruções de instalação

### Método 3: Compartilhar via Cloud/Email

1. Suba o APK para Google Drive, Dropbox ou envie por email
2. Abra no celular e faça download
3. Instale conforme Método 2

---

## 🔄 Fluxo de Desenvolvimento Completo

```bash
# 1. Fazer alterações no código Vue
# 2. Build da aplicação
pnpm run build

# 3. Sincronizar com Capacitor
npx cap sync android

# 4. Gerar APK
cd android
./gradlew assembleDebug

# 5. Instalar no dispositivo
adb install -r app/build/outputs/apk/debug/app-debug.apk

# 6. Ou abrir no Android Studio para desenvolvimento
npx cap open android
```

---

## 🛠️ Script Automatizado

Crie um script `build-android.sh`:

```bash
#!/bin/bash

echo "📱 Building Android APK..."

# Build Vue
echo "🔨 Building Vue app..."
pnpm run build

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Build APK
echo "📦 Building APK..."
cd android
./gradlew assembleDebug
cd ..

# Copy to root
echo "📋 Copying APK to root..."
cp android/app/build/outputs/apk/debug/app-debug.apk ./autocare-debug.apk

echo "✅ Done! APK available at: ./autocare-debug.apk"

# Optional: Install on device
read -p "Install on connected device? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    adb install -r ./autocare-debug.apk
    echo "✅ Installed on device!"
fi
```

Tornar executável:
```bash
chmod +x build-android.sh
./build-android.sh
```

---

## 📝 Configurações Importantes

### capacitor.config.ts

Certifique-se de que está configurado corretamente:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.garageminteligente.app',
  appName: 'Garagem Inteligente',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1f2937",
      showSpinner: false
    }
  }
};

export default config;
```

### android/app/src/main/AndroidManifest.xml

Adicionar permissões necessárias:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

---

## 🐛 Troubleshooting

### Erro: "JAVA_HOME not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### Erro: "Android SDK not found"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

### Erro: "Gradle build failed"
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Erro: "Device not found"
```bash
# Verificar se USB debugging está habilitado
adb devices

# Reiniciar ADB server
adb kill-server
adb start-server
```

---

## 📚 Recursos Adicionais

- **Capacitor Docs:** https://capacitorjs.com/docs/android
- **Android Studio:** https://developer.android.com/studio/run
- **Ionic Deploy:** https://ionic.io/docs/appflow/deploy/intro

---

## ✅ Checklist Final

- [ ] Java 11+ instalado
- [ ] Android Studio instalado
- [ ] Android SDK configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Plataforma Android adicionada (`npx cap add android`)
- [ ] Build Vue concluído (`pnpm run build`)
- [ ] Capacitor sincronizado (`npx cap sync android`)
- [ ] APK gerado com sucesso
- [ ] APK instalado no dispositivo
- [ ] App funcionando no Android

---

**Última atualização:** Outubro 2025  
**Versão do Capacitor:** 6.x  
**Versão do Ionic Vue:** 8.x


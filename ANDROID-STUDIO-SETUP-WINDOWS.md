# 📱 Configuração Manual do Android Studio no Windows

## 🎯 Visão Geral
Guia passo a passo para configurar manualmente o Android Studio no Windows e usar o script de build automatizado.

## 📋 Pré-requisitos

### 1. Android Studio
- 📥 **Download**: https://developer.android.com/studio
- 🔧 **Versão recomendada**: Android Studio Iguana ou superior

### 2. Java JDK 17+
- 📥 **Download**: https://adoptium.net/temurin/releases/
- 🔧 **Versão recomendada**: Temurin 17 LTS

## 🚀 Configuração Manual Passo a Passo

### Passo 1: Instalar Android Studio
1. **Execute o instalador** baixado
2. **Siga o assistente padrão**
3. **Não altere os caminhos padrão** (importante para o script)

### Passo 2: Primeira Execução e Configuração do SDK
1. **Abra o Android Studio**
2. **Clique em "More Actions" → "SDK Manager"**
3. **Aba "SDK Platforms":**
   - ✅ Marque "Android API 34" (ou superior)
   - ✅ Clique "Apply" para instalar
4. **Aba "SDK Tools":**
   - ✅ Marque "Android SDK Build-Tools 34.x.x"
   - ✅ Marque "Android SDK Command-line Tools (latest)"
   - ✅ Marque "Android SDK Platform-Tools"
   - ✅ Clique "Apply" para instalar

### Passo 3: Configurar Variáveis de Ambiente
Adicione ao **PATH do sistema** (não do usuário):

```
C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk\platform-tools
C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk\cmdline-tools\latest\bin
```

**Como configurar:**
1. **Win + R** → `sysdm.cpl` → Enter
2. **Aba "Avançado"** → "Variáveis de Ambiente"
3. **Em "Variáveis do sistema"** → Selecione "Path" → "Editar"
4. **Adicione os dois caminhos acima**
5. **Reinicie o terminal/PowerShell**

### Passo 4: Verificar Instalação
Abra um **novo terminal** e execute:
```bash
java -version          # Deve mostrar Java 17+
sdkmanager --version   # Deve funcionar
adb version           # Deve funcionar
```

### Passo 5: Configurar Dispositivo Virtual (Opcional)
1. **No Android Studio: "More Actions" → "AVD Manager"**
2. **"Create Virtual Device"**
3. **Escolha um dispositivo** (ex: Pixel 6)
4. **System Image**: API 34
5. **Finalize a configuração**

## 🏗️ Fazendo o Build

### Script Automatizado
```powershell
# No diretório do projeto (client-app)
PowerShell -ExecutionPolicy Bypass -File build-android.ps1
```

### Scripts Individuais
```bash
# Build APK debug
./scripts/build-android.sh

# Build AAB release
./scripts/build-aab.sh

# Instalar no dispositivo
./scripts/install-apk.sh
```

## 🔍 Troubleshooting

### "JAVA_HOME not set"
```bash
# Configure manualmente
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.x.x"
```

### "Android SDK not found"
- Execute o Android Studio primeiro
- Vá em **File → Settings → Appearance & Behavior → System Settings → Android SDK**
- Anote o caminho e configure `ANDROID_HOME`

### "gradlew command not found"
```bash
cd android
./gradlew --version
```

### Build falha
```bash
# Limpar cache
cd android
./gradlew clean
cd ..
./scripts/build-android.sh
```

## 📱 Testando no Dispositivo

### Conectar Dispositivo Físico
1. **Ative "Developer Options"** no Android
2. **Ative "USB Debugging"**
3. **Conecte via USB**
4. **Aceite a autorização**

### Verificar Conexão
```bash
adb devices  # Deve listar o dispositivo
```

## 🎉 Verificação Final

Após a configuração, execute:
```powershell
PowerShell -ExecutionPolicy Bypass -File build-android.ps1
```

Se gerar `garagem-inteligente-debug.apk` sem erros, está tudo configurado! 🚀

## 📚 Scripts Disponíveis

- **`build-android.ps1`** - Build completo automatizado (PowerShell)
- **`./scripts/build-android.sh`** - Build APK debug (Bash)
- **`./scripts/build-aab.sh`** - Build AAB release (Bash)
- **`./scripts/install-apk.sh`** - Instalar no dispositivo (Bash)
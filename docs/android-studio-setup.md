# 📱 Configuração do Android Studio

Guia passo a passo para configurar o Android Studio e ferramentas de build no Windows.

## 📋 Pré-requisitos

### Android Studio
- **Download**: https://developer.android.com/studio
- **Versão recomendada**: Android Studio Iguana ou superior

### Java JDK
- **Download**: https://adoptium.net/temurin/releases/
- **Versão recomendada**: Temurin 17 LTS ou superior

## 🚀 Configuração Passo a Passo

### Passo 1: Instalar Android Studio
1. Execute o instalador baixado
2. Siga o assistente padrão
3. Não altere os caminhos padrão (necessário para scripts automatizados)

### Passo 2: Configurar SDK

1. **Abra o Android Studio**
2. **Clique em "More Actions" → "SDK Manager"**
3. **Na aba "SDK Platforms":**
   - ✅ Marque "Android API 34" (ou superior)
   - ✅ Clique "Apply" para instalar

4. **Na aba "SDK Tools":**
   - ✅ Marque "Android SDK Build-Tools 34.x.x"
   - ✅ Marque "Android SDK Command-line Tools (latest)"
   - ✅ Marque "Android SDK Platform-Tools"
   - ✅ Clique "Apply" para instalar

### Passo 3: Configurar Variáveis de Ambiente

Adicione ao **PATH do sistema Windows** (não do usuário):

```
C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk\platform-tools
C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk\cmdline-tools\latest\bin
```

**Como fazer:**
1. **Win + R** → `sysdm.cpl` → Enter
2. **Aba "Avançado"** → "Variáveis de Ambiente"
3. **Seção "Variáveis do sistema"** → Selecione "Path" → "Editar"
4. **Clique "Novo"** e adicione os dois caminhos acima
5. **Reinicie PowerShell/Terminal**

### Passo 4: Verificar Instalação

Abra um **novo terminal PowerShell** e execute:

```powershell
java -version          # Deve mostrar Java 17+
sdkmanager --version   # Deve funcionar
adb version           # Deve funcionar
```

### Passo 5: Dispositivo Virtual (Opcional)

Para emular sem dispositivo físico:

1. **No Android Studio**: "More Actions" → "AVD Manager"
2. **"Create Virtual Device"**
3. **Escolha um dispositivo** (ex: Pixel 6)
4. **System Image**: API 34
5. **Finalize a configuração**

## 🏗️ Build Automatizado

### Via PowerShell (Recomendado)

```powershell
cd c:\seu\caminho\client-app
PowerShell -ExecutionPolicy Bypass -File build-android.ps1
```

Isso gera `garagem-inteligente-debug.apk` automaticamente.

### Via Bash Scripts

```bash
# APK Debug
./scripts/build-android.sh

# AAB Release
./scripts/build-aab.sh

# Instalar no dispositivo
./scripts/install-apk.sh
```

## 📱 Testando no Dispositivo

### Dispositivo Físico

1. **Ative "Developer Options"** no Android (Settings → About → Build Number x7)
2. **Ative "USB Debugging"** em Developer Options
3. **Conecte via USB**
4. **Aceite a autorização no device**

### Verificar Conexão

```bash
adb devices  # Deve listar o dispositivo
```

## 🔧 Troubleshooting

### "JAVA_HOME not set"

```powershell
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.x.x"
```

### "Android SDK not found"

1. Execute Android Studio
2. **File → Settings → Appearance & Behavior → System Settings → Android SDK**
3. Anote o caminho
4. Configure `ANDROID_HOME`:
   ```powershell
   setx ANDROID_HOME "C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk"
   ```

### "gradlew command not found"

```powershell
cd android
./gradlew --version
cd ..
```

### Build falha com erro de cache

```powershell
cd android
./gradlew clean
cd ..
.\build-android.ps1
```

### APK muito grande ou outras issues

Veja **[docs/android-build.md](android-build.md)** para troubleshooting detalhado e otimizações.

## ✅ Verificação Final

Após configuração completa:

```powershell
PowerShell -ExecutionPolicy Bypass -File build-android.ps1
```

Se gerar `garagem-inteligente-debug.apk` sem erros, está tudo configurado! 🎉

## 📚 Próximos Passos

- Veja **[docs/android-build.md](android-build.md)** para instruções de build em produção
- Veja **[docs/setup.md](setup.md)** para configuração geral do projeto
- Veja **[docs/ci-cd.md](ci-cd.md)** para deployments automatizados

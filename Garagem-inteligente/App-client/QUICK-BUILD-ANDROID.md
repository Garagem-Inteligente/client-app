# 📱 Guia Rápido: Gerar APK Android

## ⚡ Método Rápido (Recomendado)

### 1 Comando Apenas:

```bash
./build-android.sh
```

Este script automaticamente:
- ✅ Faz build do Vue
- ✅ Sincroniza com Capacitor
- ✅ Gera o APK
- ✅ Copia para raiz do projeto
- ✅ Oferece instalação automática

---

## 📋 Pré-requisitos (Primeira Vez)

### 1. Java 17+
```bash
sudo apt install openjdk-17-jdk
java -version  # Verificar
```

### 2. Android Studio + SDK
1. Download: https://developer.android.com/studio
2. Instalar Android Studio
3. Abrir Android Studio e instalar SDK

### 3. Configurar Variáveis de Ambiente

Adicione ao `~/.zshrc` ou `~/.bashrc`:

```bash
# Android
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Java
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

Depois:
```bash
source ~/.zshrc
```

---

## 📲 Instalar no Celular

### Opção 1: Via USB (ADB)

1. **Habilitar Depuração USB no celular:**
   - Configurações → Sobre o telefone
   - Toque 7x em "Número da versão"
   - Configurações → Opções do desenvolvedor
   - Ative "Depuração USB"

2. **Conectar e Instalar:**
```bash
# Verificar se detectou
adb devices

# Instalar
adb install -r garagem-inteligente-debug.apk
```

### Opção 2: Transferir Manualmente

1. Copie o arquivo `garagem-inteligente-debug.apk` para o celular
2. Abra o gerenciador de arquivos no celular
3. Toque no APK
4. Permita "Instalar de fontes desconhecidas"
5. Instale

---

## 🔄 Workflow de Desenvolvimento

```bash
# 1. Fazer alterações no código

# 2. Gerar novo APK
./build-android.sh

# 3. Instalar automaticamente (se conectado via USB)
# Ou transferir manualmente
```

---

## 🐛 Problemas Comuns

### "Command not found: ./build-android.sh"
```bash
chmod +x build-android.sh
```

### "JAVA_HOME not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### "Android SDK not found"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

### "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
./build-android.sh
```

---

## 📚 Documentação Completa

Para mais detalhes, veja: [BUILD-ANDROID.md](./BUILD-ANDROID.md)

---

## 🎯 Checklist Rápido

- [ ] Java 17+ instalado
- [ ] Android Studio instalado
- [ ] Variáveis de ambiente configuradas
- [ ] Script executável (`chmod +x build-android.sh`)
- [ ] Run `./build-android.sh`
- [ ] APK gerado: `garagem-inteligente-debug.apk`
- [ ] Instalado no celular

---

**Tempo estimado:** 5-10 minutos  
**Plataforma:** Android 5.0+ (API 21+)  
**Tamanho do APK:** ~15-25 MB


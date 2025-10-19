````markdown
# 📱 Android — Build & Quickstart (Consolidado)

Este documento reúne instruções rápidas e completas para gerar e instalar o APK Android do projeto.

Conteúdo consolidado de: `BUILD-ANDROID.md`, `QUICK-BUILD-ANDROID.md`.

Principais comandos

```bash
# Build e sync (recomendado)
./scripts/build-android.sh

# Instalar no dispositivo
./scripts/install-apk.sh
```

Seções importantes (pré-requisitos, variáveis de ambiente, debugging) foram preservadas dos arquivos originais. Para detalhes de troubleshooting e exemplos de comandos, veja as subseções abaixo.

---

## Pré-requisitos

- Java 17+
- Android SDK (Android Studio)
- Variáveis de ambiente: `ANDROID_HOME`, `JAVA_HOME`, PATH para `platform-tools` e `cmdline-tools`

Exemplo (adicionar ao `~/.zshrc`):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

## Quickstart - gerar APK

```bash
./scripts/build-android.sh
```

O script faz: build do app (pnpm run build), npx cap sync android, ./gradlew assembleDebug e copia o APK para a raíz.

## Debug & Troubleshooting

- "Command not found: ./scripts/build-android.sh": `chmod +x scripts/build-android.sh`
- "JAVA_HOME not set": `export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`
- Rebuild: `cd android && ./gradlew clean && cd .. && ./scripts/build-android.sh`

---

> Arquivo criado automaticamente a partir dos guias existentes.

````

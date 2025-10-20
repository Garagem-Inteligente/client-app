# 🚀 Guia Rápido: Gerar AAB e Enviar para Google Play

## ⚡ Execução Rápida (2 comandos)

```bash
# 1️⃣ Gerar keystore (apenas UMA VEZ)
./scripts/generate-keystore.sh

# 2️⃣ Gerar AAB assinado
./scripts/build-aab.sh
```

## 📋 Pré-requisitos

- ✅ Java/keytool instalado
- ✅ Node.js e pnpm instalados
- ✅ Android SDK configurado
- ✅ Conta Google Play Developer ($25)

## 🔑 Passo 1: Gerar Keystore (Execute UMA VEZ)

```bash
cd /home/michel/Documentos/Garagem-Inteligente/client-app
./scripts/generate-keystore.sh
```

**O que você precisa fornecer:**
- Senha do keystore (ANOTE EM LOCAL SEGURO!)
- Informações básicas (nome, organização, etc.)

**⚠️ CRÍTICO:**
- Faça BACKUP do arquivo `android/app/upload-keystore.jks`
- Guarde a senha em gerenciador de senhas
- Sem keystore/senha = impossível atualizar o app no futuro!

## 🏗️ Passo 2: Gerar AAB

```bash
./scripts/build-aab.sh
```

**O script faz automaticamente:**
1. ✅ Build web (Vite)
2. ✅ Sync Capacitor
3. ✅ Clean Android
4. ✅ Gera AAB assinado

**Localização do AAB:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 📤 Passo 3: Upload no Google Play Console

### 3.1 Primeira vez? Criar App

1. Acesse: https://play.google.com/console
2. Clique em **"Create app"**
3. Preencha:
   - Nome: **Garagem Inteligente**
   - Idioma: Português (Brasil)
   - Tipo: App
   - Gratuito: Sim

### 3.2 Upload para Teste Interno

1. Vá em: **Release > Testing > Internal testing**
2. Clique em: **"Create new release"**
3. **Upload AAB**: Arraste `app-release.aab`
4. Preencha:
   - Release name: `v1.0.0 - Build inicial`
   - Release notes: Descreva funcionalidades
5. Configure **Testers** (adicione emails)
6. Clique em: **"Review release"** > **"Start rollout"**
7. Copie e compartilhe o link de teste

### 3.3 Testadores baixam o app

1. Abrem o link compartilhado
2. Fazem opt-in
3. Baixam via Play Store
4. Testam e reportam feedback

## 🔄 Atualizar App (Novas Versões)

### 1. Atualizar versão

```bash
# Editar: android/app/build.gradle
versionCode 2        # incrementar (era 1)
versionName "1.1.0"  # atualizar (era 1.0)
```

### 2. Gerar novo AAB

```bash
./scripts/build-aab.sh
```

### 3. Upload no Console

- Mesmo processo: Create new release > Upload AAB

## 📊 Informações do App

- **Package ID**: com.garageminteligente.app
- **Version Code**: 1
- **Version Name**: 1.0
- **Target SDK**: 34
- **Min SDK**: 22

## 🎯 Checklist Rápido

Antes do primeiro upload:

- [ ] Keystore gerado e backup realizado
- [ ] AAB compilado sem erros
- [ ] Conta Google Play Developer ativa
- [ ] App criado no Play Console
- [ ] Política de Privacidade publicada
- [ ] Screenshots preparados (mínimo 2)
- [ ] Ícone do app pronto (512x512px)

## ⚠️ Problemas Comuns

### "Command not found: keytool"
```bash
# Instalar Java JDK
sudo apt install openjdk-17-jdk  # Ubuntu/Debian
```

### "Build failed"
```bash
# Verificar dependências
pnpm install
npx cap sync android
```

### "Keystore não encontrado"
```bash
# Gerar novamente
./scripts/generate-keystore.sh
```

## 🆘 Suporte

- 📖 Guia completo: `docs/GOOGLE-PLAY-DEPLOY.md`
- 🔧 Scripts: `scripts/` directory
- 📱 Play Console: https://play.google.com/console

---

**🎉 Pronto!** Com esses 2 comandos você gera o AAB e está pronto para enviar ao Google Play!

**Tempo estimado:**
- Primeira vez: ~10 minutos (incluindo keystore)
- Atualizações: ~3 minutos

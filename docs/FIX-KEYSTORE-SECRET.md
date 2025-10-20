# 🔐 Atualizar GitHub Secrets - Passo a Passo

## ⚠️ URGENTE: Corrigir ANDROID_KEYSTORE_BASE64

O workflow está falando porque o secret `ANDROID_KEYSTORE_BASE64` está corrompido ou mal formatado.

### 📋 Passo a Passo

#### 1️⃣ Gerar Base64 Correto

Execute o script helper:

```bash
./scripts/generate-keystore-base64.sh
```

**Output esperado:**

```
🔐 Gerando ANDROID_KEYSTORE_BASE64 para GitHub Secrets

📦 Keystore encontrado: android/app/upload-keystore.jks
✅ Base64 gerado com sucesso!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Copie o valor abaixo para o GitHub Secret: ANDROID_KEYSTORE_BASE64
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MIIKxAIBAzCCCm4GCSqGSIb3DQEHA... (MUITAS LINHAS)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Decode validado: 2760 bytes
```

#### 2️⃣ Copiar Base64 (CRÍTICO)

**⚠️ ATENÇÃO:** O base64 é gerado em **SINGLE LINE** (sem quebras de linha).

**Como copiar corretamente:**

1. Selecione TODO o texto entre as linhas `━━━`
2. Copie com `Ctrl+C` ou clique direito → Copiar
3. **NÃO adicione espaços, quebras de linha ou caracteres extras**
4. **NÃO cole em editor de texto antes** (pode adicionar formatação)

**✅ Exemplo correto:**

```
MIIKxAIBAzCCCm4GCSqGSIb3DQEHAaCCCl8EggpbMIIKVzCCBZ...
```

**❌ Exemplo ERRADO (com quebras):**

```
MIIKxAIBAzCCCm4GCSqGSIb3DQEHA
aCCCl8EggpbMIIKVzCCBZ...
```

#### 3️⃣ Atualizar Secret no GitHub

1. Acesse: https://github.com/Garagem-Inteligente/client-app/settings/secrets/actions

2. Encontre o secret `ANDROID_KEYSTORE_BASE64`

3. Clique em **Update** (ou **New repository secret** se não existir)

4. **Cole o valor** direto do terminal (Ctrl+V)

5. Clique em **Update secret**

6. ✅ **Confirme que o valor foi salvo**

#### 4️⃣ Validar Secret (Opcional)

Execute o workflow manualmente:

1. GitHub → Actions → 🚀 Deploy Android
2. Run workflow → Branch: master
3. Aguarde até o step "🔐 Setup Keystore"
4. Verifique se aparece:
   ```
   ✅ Keystore criado: 2760 bytes
   ```

---

## 📝 Checklist de Secrets

Verifique se TODOS os secrets estão configurados:

### Secrets do Firebase

- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_FIREBASE_MEASUREMENT_ID`

### Secrets do Android

- [ ] `GOOGLE_SERVICES_JSON` - Conteúdo do arquivo `android/app/google-services.json`
- [ ] `ANDROID_KEYSTORE_BASE64` - Base64 do keystore (script acima)
- [ ] `ANDROID_KEYSTORE_PASSWORD` - Senha do keystore
- [ ] `ANDROID_KEY_PASSWORD` - Senha da key
- [ ] `ANDROID_KEY_ALIAS` - Alias da key (geralmente "upload")

### Secrets do Google Play

- [ ] `GOOGLE_PLAY_SERVICE_ACCOUNT` - JSON da Service Account

---

## 🔧 Como Obter Cada Secret

### GOOGLE_SERVICES_JSON

```bash
cat android/app/google-services.json
```

Copie TODO o conteúdo JSON e cole no secret.

### ANDROID_KEYSTORE_BASE64

```bash
./scripts/generate-keystore-base64.sh
```

Copie o output conforme instruções acima.

### ANDROID_KEYSTORE_PASSWORD

A senha que você usou ao criar o keystore:

```bash
# Se você não lembra, verifique em:
cat android/key.properties | grep storePassword
```

### ANDROID_KEY_PASSWORD

A senha da key (geralmente igual à senha do keystore):

```bash
cat android/key.properties | grep keyPassword
```

### ANDROID_KEY_ALIAS

O alias da key (geralmente "upload"):

```bash
cat android/key.properties | grep keyAlias
```

### GOOGLE_PLAY_SERVICE_ACCOUNT

Siga o guia: [docs/GOOGLE-PLAY-CI-CD.md](./GOOGLE-PLAY-CI-CD.md)

1. Google Cloud Console → IAM & Admin → Service Accounts
2. Crie service account com permissões do Play Console
3. Gere chave JSON
4. Copie o conteúdo completo do JSON

---

## 🐛 Troubleshooting

### Erro: `base64: invalid input`

**Causa:** Secret `ANDROID_KEYSTORE_BASE64` corrompido

**Solução:**

1. Regere o base64: `./scripts/generate-keystore-base64.sh`
2. Copie em **SINGLE LINE** (sem quebras)
3. Atualize o secret no GitHub

### Erro: `Keystore size mismatch`

**Causa:** Base64 foi copiado com quebras de linha ou caracteres extras

**Solução:**

1. Delete o secret existente
2. Regere o base64
3. Copie diretamente do terminal (sem passar por editor)
4. Crie novo secret

### Erro: `keystore file not found`

**Causa:** Arquivo `android/app/upload-keystore.jks` não existe localmente

**Solução:**

```bash
# Crie novo keystore
keytool -genkey -v -keystore android/app/upload-keystore.jks \
  -alias upload -keyalg RSA -keysize 2048 -validity 10000

# Depois regere o base64
./scripts/generate-keystore-base64.sh
```

### Erro: `Incorrect password`

**Causa:** Senhas nos secrets não correspondem ao keystore

**Solução:**

1. Verifique as senhas locais: `cat android/key.properties`
2. Atualize os secrets:
   - `ANDROID_KEYSTORE_PASSWORD`
   - `ANDROID_KEY_PASSWORD`
   - `ANDROID_KEY_ALIAS`

---

## ✅ Após Atualizar Secrets

1. **Re-run o workflow que falhou:**

   - GitHub → Actions → Workflow falhado
   - Re-run failed jobs

2. **Ou faça novo push:**

   ```bash
   git commit --allow-empty -m "chore: trigger CI after secrets update"
   git push origin master
   ```

3. **Monitore os logs:**
   - Verifique step "🔐 Setup Keystore"
   - Deve mostrar: `✅ Keystore criado: 2760 bytes`

---

## 📚 Documentação Relacionada

- [Google Play CI/CD Setup](./GOOGLE-PLAY-CI-CD.md)
- [CI/CD Optimization Guide](./CI-CD-OPTIMIZATION.md)
- [Workflows README](../.github/workflows/README.md)

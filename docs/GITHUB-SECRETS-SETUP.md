# 🔐 Configuração de GitHub Secrets

Este documento explica como configurar os secrets necessários no GitHub para o CI/CD funcionar corretamente.

## ⚠️ Problema Resolvido

**Erro anterior:** O build passava no CI mas o app não carregava em produção com erro:
```
Error: Firebase configuration is missing. Please check your .env file...
```

**Causa:** As variáveis de ambiente do Firebase não estavam sendo injetadas durante o build no CI/CD.

**Solução:** Configurar os secrets do GitHub e usar as variáveis de ambiente no workflow.

---

## 📋 Secrets Necessários

Você precisa configurar os seguintes secrets no GitHub:

### 1️⃣ Variáveis do Firebase (OBRIGATÓRIAS)

Essas variáveis vêm do seu projeto Firebase. Você pode encontrá-las em:
- Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

| Secret Name | Exemplo | Onde Encontrar |
|-------------|---------|----------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyC...` | Firebase Console → Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | `seu-projeto.firebaseapp.com` | Firebase Console → Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | `seu-projeto` | Firebase Console → Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | `seu-projeto.firebasestorage.app` | Firebase Console → Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase Console → Project Settings |
| `VITE_FIREBASE_APP_ID` | `1:123456:web:abc123` | Firebase Console → Project Settings |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Firebase Console → Project Settings (Analytics) |

### 2️⃣ Service Account do Firebase (OBRIGATÓRIO)

Para fazer deploy no Firebase Hosting:

| Secret Name | Descrição |
|-------------|-----------|
| `FIREBASE_SERVICE_ACCOUNT` | JSON completo da service account do Firebase |

**Como obter:**
```bash
# No Firebase Console
1. Vá em Project Settings → Service Accounts
2. Clique em "Generate new private key"
3. Salve o arquivo JSON
4. Cole TODO o conteúdo JSON no secret do GitHub
```

---

## 🛠️ Como Configurar os Secrets no GitHub

### Via Interface Web:

1. Vá para o repositório no GitHub
2. Clique em **Settings** (⚙️)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Adicione cada secret da lista acima:
   - **Name**: O nome exato do secret (ex: `VITE_FIREBASE_API_KEY`)
   - **Value**: O valor correspondente
   - Clique em **Add secret**

### Via GitHub CLI:

```bash
# Instale o GitHub CLI: https://cli.github.com/

# Autentique
gh auth login

# Configure cada secret
gh secret set VITE_FIREBASE_API_KEY -b "AIzaSy..."
gh secret set VITE_FIREBASE_AUTH_DOMAIN -b "seu-projeto.firebaseapp.com"
gh secret set VITE_FIREBASE_PROJECT_ID -b "seu-projeto"
gh secret set VITE_FIREBASE_STORAGE_BUCKET -b "seu-projeto.firebasestorage.app"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID -b "123456789"
gh secret set VITE_FIREBASE_APP_ID -b "1:123456:web:abc123"
gh secret set VITE_FIREBASE_MEASUREMENT_ID -b "G-XXXXXXXXXX"

# Service Account (a partir de arquivo)
gh secret set FIREBASE_SERVICE_ACCOUNT < path/to/serviceAccountKey.json
```

---

## ✅ Verificando a Configuração

### 1. Cheque se os secrets foram criados:

```bash
gh secret list
```

Você deve ver todos os 8 secrets listados acima.

### 2. Rode o workflow manualmente:

1. Vá em **Actions** no GitHub
2. Selecione o workflow **"Build & Deploy"** ou **"Deploy Web (Simplified)"**
3. Clique em **Run workflow**
4. Monitore os logs, especialmente o step "🔍 Debug - Check secrets"

### 3. Verifique o build:

O step **"🏗️ Build application"** deve:
- ✅ Completar sem erros
- ✅ Mostrar que as variáveis foram injetadas

### 4. Teste o deploy:

Depois do deploy, acesse:
- https://app.garageminteligente.com.br
- https://app-garageminteligente.web.app

Abra o console do navegador (F12) e verifique:
- ✅ **NENHUM** erro sobre "Firebase configuration is missing"
- ✅ App carrega normalmente
- ✅ Login funciona

---

## 🔒 Segurança

### ⚠️ IMPORTANTE:

1. **Nunca commite o arquivo `.env`** - ele está no `.gitignore` por segurança
2. **Nunca exponha os secrets** em logs ou outputs do GitHub Actions
3. **Use secrets do GitHub** para todas as credenciais sensíveis
4. **Rotacione as credenciais** periodicamente

### Secrets são seguros porque:

- São criptografados no GitHub
- Não aparecem nos logs (são mascarados)
- Só são acessíveis durante a execução do workflow
- Não podem ser lidos via API do GitHub

---

## 🐛 Troubleshooting

### Problema: Build passa mas app não carrega em produção

**Sintoma:**
```
Error: Firebase configuration is missing...
```

**Solução:**
1. Verifique se TODOS os 7 secrets `VITE_FIREBASE_*` estão configurados
2. Rode o workflow novamente
3. Limpe o cache do Firebase Hosting:
   ```bash
   firebase hosting:channel:delete <channel-id>
   firebase deploy --only hosting
   ```

### Problema: Deploy falha com erro de autenticação

**Sintoma:**
```
Error: HTTP Error: 401, Unauthorized
```

**Solução:**
1. Verifique se o secret `FIREBASE_SERVICE_ACCOUNT` está correto
2. Certifique-se de que o JSON está completo e válido
3. Verifique as permissões da service account no Firebase

### Problema: Variável não é injetada no build

**Sintoma:** Variável aparece como `undefined` no app

**Solução:**
1. O nome do secret deve ser EXATAMENTE como está no workflow
2. Secrets diferenciam maiúsculas/minúsculas
3. Verifique que o workflow usa o secret no step de build:
   ```yaml
   env:
     VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
   ```

---

## 📝 Checklist Final

Antes de fazer push para produção:

- [ ] Todos os 7 secrets `VITE_FIREBASE_*` configurados
- [ ] Secret `FIREBASE_SERVICE_ACCOUNT` configurado
- [ ] Workflow atualizado com as variáveis de ambiente
- [ ] Build local funciona: `pnpm build`
- [ ] Workflow passa no GitHub Actions
- [ ] App carrega em produção sem erros
- [ ] Login funciona em produção
- [ ] Firebase Analytics tracking funciona (opcional)

---

## 📚 Referências

- [GitHub Actions - Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase - Get Config Object](https://firebase.google.com/docs/web/setup#config-object)
- [Vite - Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Capacitor - Environment Variables](https://capacitorjs.com/docs/guides/environment-setup)

---

**Última atualização:** 18 de outubro de 2025

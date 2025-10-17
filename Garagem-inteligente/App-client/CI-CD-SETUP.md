# 🚀 CI/CD Setup Guide

## ✅ O que foi configurado

O sistema de CI/CD agora está completamente configurado com:

- ✅ **Verificação de qualidade** automática (type-check + build)
- ✅ **Deploy automático para Firebase Hosting** (branch master/main)
- ✅ **Build automático de APK Android** 
- ✅ **Versionamento automático** com timestamp + git SHA
- ✅ **Releases automáticos** no GitHub com APK anexado
- ✅ **Exibição de versão** na página de perfil

---

## 🔐 Configurar Secrets no GitHub

Para o CI/CD funcionar completamente, você precisa adicionar um secret no GitHub:

### **1. Obter Firebase Service Account Key**

```bash
# No terminal, execute:
firebase login  # Se ainda não estiver logado

# Gerar a service account key
firebase init hosting:github
```

**OU manualmente:**

1. Acesse: https://console.firebase.google.com/project/autocare-platform/settings/serviceaccounts/adminsdk
2. Clique em **"Generate new private key"**
3. Salve o arquivo JSON gerado

### **2. Adicionar Secret no GitHub**

1. Acesse: https://github.com/Mikeofic/garageminteligente-app-client/settings/secrets/actions
2. Clique em **"New repository secret"**
3. **Name:** `FIREBASE_SERVICE_ACCOUNT`
4. **Value:** Cole o conteúdo completo do arquivo JSON
5. Clique em **"Add secret"**

---

## 🔄 Como Funciona o Versionamento

### **Formato da Versão:**
```
v2025.10.17-a1b2c3d #123
```

- `v2025.10.17` - Data do build (AAAA.MM.DD)
- `a1b2c3d` - Primeiros 7 caracteres do Git commit SHA
- `#123` - Número sequencial do build no GitHub Actions

### **Onde a Versão Aparece:**

1. **Página de Perfil** (discreta no rodapé):
   ```
   v2025.10.17-a1b2c3d #123
   17/10/2025 20:26 • a1b2c3d
   ```

2. **Arquivo `src/version.json`** (gerado automaticamente):
   ```json
   {
     "version": "v2025.10.17-a1b2c3d",
     "buildNumber": "123",
     "buildDate": "2025-10-17T23:26:37Z",
     "gitSha": "a1b2c3d4e5f6...",
     "gitRef": "refs/heads/master",
     "platform": "web"
   }
   ```

3. **Nome dos Artifacts** no GitHub:
   ```
   android-apk-v2025.10.17-a1b2c3d
   ```

4. **Tags de Release** no GitHub:
   ```
   v2025.10.17-a1b2c3d
   ```

---

## 🎯 Workflows Configurados

### **1. Quality Check** (sempre executa)
- ✅ Type check com TypeScript
- ✅ Build verification
- ✅ Executa em PRs e pushes

### **2. Deploy Web** (apenas master/main)
- ✅ Gera versão automática
- ✅ Build com variáveis de ambiente
- ✅ Deploy para Firebase Hosting
- ✅ Publica em: https://app-garageminteligente.web.app

### **3. Build Android** (apenas master/main)
- ✅ Gera versão automática
- ✅ Build de APK Debug
- ✅ Upload como artifact
- ✅ Válido por 30 dias

### **4. Create Release** (após deploy + build)
- ✅ Cria tag no GitHub
- ✅ Cria release com changelog
- ✅ Anexa APK Android
- ✅ Links para web app

---

## 📦 Como Fazer um Deploy

### **Automático:**
```bash
# Apenas faça commit e push para master
git add .
git commit -m "feat: nova funcionalidade"
git push origin master

# O CI/CD fará automaticamente:
# 1. Quality check
# 2. Deploy web
# 3. Build Android
# 4. Create release
```

### **Manual (se necessário):**
```bash
# Web only
pnpm run build
firebase deploy --only hosting

# Android only
./build-android.sh
```

---

## 🔍 Monitorar Deploys

### **GitHub Actions:**
- https://github.com/Mikeofic/garageminteligente-app-client/actions

### **Firebase Console:**
- https://console.firebase.google.com/project/autocare-platform/hosting

### **Releases:**
- https://github.com/Mikeofic/garageminteligente-app-client/releases

---

## 📱 Baixar APK

### **Via GitHub Actions (Artifacts):**
1. Acesse: https://github.com/Mikeofic/garageminteligente-app-client/actions
2. Clique no workflow mais recente
3. Role até "Artifacts"
4. Baixe `android-apk-vX.X.X-XXXXXXX`

### **Via Releases:**
1. Acesse: https://github.com/Mikeofic/garageminteligente-app-client/releases
2. Baixe o arquivo `app-debug.apk` da release mais recente

---

## 🛠️ Variáveis de Ambiente

O CI/CD injeta automaticamente:

```env
VITE_APP_VERSION=v2025.10.17-a1b2c3d
VITE_BUILD_NUMBER=123
VITE_BUILD_DATE=2025-10-17T23:26:37Z
```

Estas variáveis podem ser acessadas em qualquer lugar do código:

```typescript
import { useVersion } from '@/composables/useVersion'

const { fullVersionString, buildDate } = useVersion()
```

---

## 🐛 Troubleshooting

### **Deploy falha:**
1. Verifique se o secret `FIREBASE_SERVICE_ACCOUNT` está configurado
2. Verifique logs em: https://github.com/Mikeofic/garageminteligente-app-client/actions

### **Build Android falha:**
1. Verifique se o Java 17 está sendo usado
2. Verifique se `android/` foi sincronizado (`npx cap sync android`)

### **Versão não aparece no perfil:**
1. Verifique se `src/version.json` existe
2. Verifique se o composable foi importado corretamente
3. Limpe cache: `pnpm run clean && pnpm install`

---

## 📊 Status Atual

- ✅ CI/CD configurado
- ✅ Versionamento automático
- ✅ Exibição no perfil
- ⏳ **Aguardando:** Firebase Service Account secret
- ⏳ **Aguardando:** Primeiro deploy automático

---

## 🎉 Próximos Passos

1. **Configurar secret `FIREBASE_SERVICE_ACCOUNT`**
2. **Fazer primeiro push para master**
3. **Verificar deploy automático**
4. **Baixar APK gerado**
5. **Configurar domínio customizado** (app.garageminteligente.com.br)

---

**O sistema está pronto! Basta configurar o secret e fazer push! 🚀**


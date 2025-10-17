# 🔥 Configuração Firebase - Garagem Inteligente

## 📋 Informações do Projeto

**Projeto Firebase:** `autocare-platform`  
**Usuário:** mikeribeirooficial@gmail.com  
**Status:** ✅ Configurado e funcionando

---

## 🔑 Configurações do Firebase

### Configuração Web (SDK v2)

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDtwoXZUnHSgUg_Rr0-BSgrNchn6hk9UgU",
  authDomain: "autocare-platform.firebaseapp.com",
  projectId: "autocare-platform",
  storageBucket: "autocare-platform.firebasestorage.app",
  messagingSenderId: "868408826724",
  appId: "1:868408826724:web:37775191fb1e4b26d57871",
  measurementId: "G-TVZFYH3Z0M"
}
```

---

## 📁 Arquivos de Configuração

### 1. App-client (Ionic Vue)
**Arquivo:** `App-client/app-client/.env`
```env
VITE_FIREBASE_API_KEY=AIzaSyDtwoXZUnHSgUg_Rr0-BSgrNchn6hk9UgU
VITE_FIREBASE_AUTH_DOMAIN=autocare-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=autocare-platform
VITE_FIREBASE_STORAGE_BUCKET=autocare-platform.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=868408826724
VITE_FIREBASE_APP_ID=1:868408826724:web:37775191fb1e4b26d57871
VITE_FIREBASE_MEASUREMENT_ID=G-TVZFYH3Z0M
```

### 2. Landing-page-client (Nuxt)
**Arquivo:** `Landing-page-client/.env`
```env
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDtwoXZUnHSgUg_Rr0-BSgrNchn6hk9UgU
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=autocare-platform.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=autocare-platform
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=autocare-platform.firebasestorage.app
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=868408826724
NUXT_PUBLIC_FIREBASE_APP_ID=1:868408826724:web:37775191fb1e4b26d57871
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-TVZFYH3Z0M
```

---

## 🚀 Como Usar

### Para novos projetos:

1. **Copie o arquivo `.env.example`** para `.env`
2. **Use as configurações acima** (todas são iguais)
3. **Prefixo das variáveis:**
   - **Ionic/Vite:** `VITE_`
   - **Nuxt:** `NUXT_PUBLIC_`
   - **Vue puro:** `VUE_APP_`

### Exemplo de uso no código:

```typescript
// Ionic/Vite
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// Nuxt
const apiKey = process.env.NUXT_PUBLIC_FIREBASE_API_KEY

// Vue puro
const apiKey = process.env.VUE_APP_FIREBASE_API_KEY
```

---

## 🔧 Serviços Firebase Ativos

- ✅ **Authentication** - Login/registro de usuários
- ✅ **Firestore** - Banco de dados NoSQL
- ✅ **Storage** - Upload de arquivos
- ✅ **Hosting** - Deploy de sites
- ✅ **Functions** - Cloud Functions (se necessário)

---

## 📊 Status dos Projetos

| Projeto | Status | URL | Firebase |
|---------|--------|-----|----------|
| **App-client** | ✅ Rodando | http://localhost:5175 | ✅ Configurado |
| **Landing-page-client** | ✅ Rodando | http://localhost:3000 | ✅ Configurado |
| **Projeto Principal** | ✅ Rodando | http://localhost:5173 | ✅ Configurado |

---

## 🛠️ Comandos Úteis

### Verificar configuração Firebase:
```bash
firebase projects:list
firebase use autocare-platform
firebase apps:list
```

### Verificar variáveis de ambiente:
```bash
# App-client
cd App-client/app-client && cat .env

# Landing-page-client  
cd Landing-page-client && cat .env
```

### Reiniciar projetos:
```bash
# Parar todos
pkill -f "(vite|nuxt|ionic)"

# Iniciar todos
./start-projects.sh
```

---

## ⚠️ Troubleshooting

### Erro: "Firebase configuration is missing"
1. Verifique se o arquivo `.env` existe
2. Verifique se as variáveis estão com o prefixo correto
3. Reinicie o servidor de desenvolvimento

### Erro: "Firebase app already initialized"
1. Verifique se não há múltiplas inicializações
2. Use `getApps().length === 0` antes de `initializeApp()`

### Erro: "Permission denied"
1. Verifique as regras do Firestore
2. Verifique se o usuário está autenticado

---

**Última atualização:** 16 de outubro de 2025  
**Configurado por:** MCP Firebase Tools


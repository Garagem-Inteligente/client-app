# 🌐 Configuração do Domínio Customizado

## ✅ Deploy Realizado

A plataforma cliente já está publicada no Firebase Hosting:

- **URL Temporária:** https://app-garageminteligente.web.app
- **Site Firebase:** `app-garageminteligente`
- **Projeto:** `autocare-platform`

---

## 🔧 Como Configurar o Domínio `app.garageminteligente.com.br`

### **Passo 1: Adicionar Domínio no Firebase Console**

1. Acesse o **Firebase Console**: https://console.firebase.google.com/project/autocare-platform/hosting
2. Na seção **Hosting**, localize o site `app-garageminteligente`
3. Clique em **"Add custom domain"** (Adicionar domínio customizado)
4. Digite: `app.garageminteligente.com.br`
5. Clique em **Continue**

---

### **Passo 2: Verificar Propriedade do Domínio** (se necessário)

Se o Firebase solicitar verificação de propriedade:

1. O Firebase fornecerá um registro TXT
2. Adicione este registro TXT no seu provedor de DNS
3. Aguarde a verificação (pode levar alguns minutos)

---

### **Passo 3: Adicionar Registros DNS**

O Firebase fornecerá registros DNS que você precisa adicionar no seu provedor (ex: Registro.br, Cloudflare, etc.):

#### **Tipo A (IPv4):**
```
app  A  <IP fornecido pelo Firebase>
```

**OU**

#### **Tipo CNAME:**
```
app  CNAME  app-garageminteligente.web.app
```

---

### **Passo 4: Aguardar Propagação**

- ⏱️ **Tempo:** 24-48 horas (geralmente algumas horas)
- ✅ **SSL:** Certificado HTTPS será provisionado automaticamente

---

## 🚀 Comandos Úteis

### **Verificar Status do Deploy:**
```bash
firebase hosting:sites:list
```

### **Ver Domínios Configurados:**
```bash
firebase hosting:sites:get app-garageminteligente
```

### **Fazer Novo Deploy:**
```bash
cd /home/michel/Documentos/Pessoal/autocare-landing-page/Garagem-inteligente/App-client
pnpm run build
firebase deploy --only hosting
```

---

## 📋 Checklist

- [x] Build da aplicação concluído
- [x] Site Firebase criado (`app-garageminteligente`)
- [x] Deploy inicial realizado
- [x] URL temporária funcionando (https://app-garageminteligente.web.app)
- [ ] Domínio customizado adicionado no Firebase Console
- [ ] Registros DNS configurados
- [ ] Certificado SSL provisionado
- [ ] Domínio `app.garageminteligente.com.br` acessível

---

## 🌍 Estrutura Final dos Domínios

| Domínio | Tipo | Destino |
|---------|------|---------|
| `garageminteligente.com.br` | Landing Page | Firebase Hosting (site principal) |
| `app.garageminteligente.com.br` | Plataforma Cliente | Firebase Hosting (`app-garageminteligente`) |

---

## 🔗 Links Úteis

- **Firebase Console:** https://console.firebase.google.com/project/autocare-platform/hosting
- **URL Temporária:** https://app-garageminteligente.web.app
- **Documentação:** https://firebase.google.com/docs/hosting/custom-domain

---

## 💡 Dicas

1. **Teste Antes:** Use a URL temporária para testar a aplicação
2. **Cache:** Após configurar o DNS, use `https://dns.google` para verificar propagação
3. **SSL Automático:** O Firebase provisiona certificados SSL automaticamente
4. **Rollback:** Se necessário, você pode reverter para versões anteriores no Console

---

**Aplicação publicada e pronta para receber domínio customizado! 🎉**


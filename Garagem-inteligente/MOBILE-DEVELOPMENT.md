# 📱 Desenvolvimento Mobile - Garagem Inteligente

## 🚀 **Como Testar no Celular Durante o Desenvolvimento**

### **🌐 Opção 1: PWA (Recomendada - Mais Fácil)**

#### **Passo 1: Iniciar Servidor com Acesso de Rede**
```bash
cd App-client/app-client
npm run dev -- --host
```

#### **Passo 2: Descobrir IP da Máquina**
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

#### **Passo 3: Acessar no Celular**
1. **Conecte o celular na mesma rede WiFi**
2. **Abra o navegador** (Chrome/Safari)
3. **Digite o IP:** `http://192.168.2.110:5175`
4. **Instale como PWA:** Menu → "Adicionar à tela inicial"

**✅ Vantagens:**
- Funciona imediatamente
- Atualizações em tempo real
- Não precisa instalar nada
- Funciona em iOS e Android

---

### **📱 Opção 2: Capacitor Live Reload (Avançada)**

#### **Para Android:**

**Passo 1: Build do Projeto**
```bash
cd App-client/app-client
npm run build
npx cap sync
```

**Passo 2: Configurar Live Reload**
```bash
# Configurar IP para live reload
npx cap run android --livereload --external
```

**Passo 3: Instalar no Celular**
- O Android Studio abrirá automaticamente
- Conecte o celular via USB
- Ative "Depuração USB" no celular
- Clique em "Run" no Android Studio

#### **Para iOS (apenas no macOS):**

**Passo 1: Adicionar iOS**
```bash
npx cap add ios
npm run build
npx cap sync
```

**Passo 2: Abrir no Xcode**
```bash
npx cap open ios
```

**Passo 3: Configurar Live Reload**
- No Xcode, vá em "Product" → "Scheme" → "Edit Scheme"
- Adicione argumento: `--livereload --external`

---

### **🔧 Opção 3: Ionic DevApp (Descontinuada)**

A Ionic DevApp foi descontinuada, mas você pode usar:

#### **Ionic Lab (Alternativa)**
```bash
npm install -g @ionic/lab
ionic lab
```

---

## 📋 **Comandos Úteis**

### **Desenvolvimento PWA:**
```bash
# Iniciar com acesso de rede
npm run dev -- --host

# Ver IP da máquina
ip addr show | grep "inet " | grep -v 127.0.0.1

# Parar servidor
Ctrl + C
```

### **Desenvolvimento Capacitor:**
```bash
# Build e sync
npm run build
npx cap sync

# Android
npx cap run android
npx cap run android --livereload --external

# iOS (macOS apenas)
npx cap run ios
npx cap run ios --livereload --external

# Abrir IDEs
npx cap open android
npx cap open ios
```

### **Debugging:**
```bash
# Ver logs Android
npx cap run android --livereload --external --consolelogs

# Ver logs iOS
npx cap run ios --livereload --external --consolelogs
```

---

## 🌐 **Configuração de Rede**

### **Descobrir IP da Máquina:**
```bash
# Linux/macOS
ip addr show | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr "IPv4"
```

### **Configurar Firewall (se necessário):**
```bash
# Ubuntu/Debian
sudo ufw allow 5175

# CentOS/RHEL
sudo firewall-cmd --add-port=5175/tcp --permanent
sudo firewall-cmd --reload
```

---

## 📱 **Testando Funcionalidades**

### **Funcionalidades que Funcionam no PWA:**
- ✅ Navegação entre páginas
- ✅ Autenticação Firebase
- ✅ CRUD de veículos
- ✅ Interface responsiva
- ✅ Notificações (limitadas)

### **Funcionalidades que Precisam do App Nativo:**
- 📷 Câmera (upload de fotos)
- 📍 Geolocalização
- 🔔 Push Notifications
- 📱 Acesso a contatos
- 💾 Armazenamento local

---

## 🛠️ **Troubleshooting**

### **Problema: Não consegue acessar pelo IP**
**Solução:**
1. Verifique se o celular está na mesma rede WiFi
2. Verifique se o firewall não está bloqueando
3. Tente usar `--host 0.0.0.0` ao invés de `--host`

### **Problema: Live reload não funciona**
**Solução:**
1. Verifique se o IP está correto
2. Reinicie o servidor
3. Limpe o cache do app

### **Problema: App não carrega**
**Solução:**
1. Verifique se o Firebase está configurado
2. Verifique o console do navegador
3. Verifique se as variáveis de ambiente estão corretas

---

## 🎯 **Recomendação**

**Para desenvolvimento rápido:** Use a **Opção 1 (PWA)**
- Mais simples
- Funciona imediatamente
- Atualizações em tempo real
- Não precisa configurar Android Studio

**Para testes completos:** Use a **Opção 2 (Capacitor)**
- Testa funcionalidades nativas
- Melhor performance
- Mais próximo da experiência final

---

## 📞 **Suporte**

Se tiver problemas:
1. Verifique se o celular está na mesma rede WiFi
2. Verifique se o IP está correto
3. Verifique se o servidor está rodando
4. Verifique o console do navegador para erros

**IP Atual da Máquina:** `192.168.2.110`  
**URL do App:** `http://192.168.2.110:5175`


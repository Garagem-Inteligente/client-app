# 🔍 VERIFICAÇÃO: Status do OAuth Consent Screen

## 📋 O que verificar na "Visão geral de OAuth":

### 1. **Status do App**
- ✅ **Publicado** = App em produção (funciona para todos)
- ⚠️ **Em teste** = App em modo de teste (só funciona para test users)

### 2. **Se estiver "Em teste":**
- Verifique se seu email está na lista de **"Usuários de teste"**
- Se não estiver, adicione seu email

### 3. **Se estiver "Publicado":**
- O app deve funcionar para qualquer usuário
- Verifique se não há restrições

## 🔧 **Como adicionar Test Users:**

### Opção 1: Via Menu Lateral
1. Na "Visão geral de OAuth", procure no menu lateral:
   - **"Usuários de teste"** ou **"Test users"**
   - **"Público-alvo"** ou **"Audience"**

### Opção 2: Via URL Direta
- https://console.cloud.google.com/apis/credentials/consent?project=autocare-platform&tab=testusers

### Opção 3: Via Configurações
1. Na "Visão geral de OAuth", procure por:
   - **"Configurações"** ou **"Settings"**
   - **"Editar"** ou **"Edit"**

## 🎯 **O que você deve ver:**

### Se o app estiver em modo de teste:
- ✅ Status: "Em teste" ou "Testing"
- ✅ Lista de usuários de teste
- ✅ Seu email deve estar na lista

### Se o app estiver publicado:
- ✅ Status: "Publicado" ou "Published"
- ✅ Funciona para todos os usuários

## 🚨 **Se não conseguir encontrar:**

1. **Tente acessar diretamente:**
   - https://console.cloud.google.com/apis/credentials/consent?project=autocare-platform

2. **Ou navegue pelo menu:**
   - Menu lateral → "Tela de permissão OAuth" → "Usuários de teste"

3. **Ou procure por:**
   - "Test users"
   - "Usuários de teste"
   - "Audience"
   - "Público-alvo"

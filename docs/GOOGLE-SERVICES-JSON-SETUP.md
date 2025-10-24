# 📱 Configuração do google-services.json no GitHub Actions

## Problema

O build do Android no CI/CD está falhando com o erro:

```
Malformed root json at /home/runner/work/client-app/client-app/android/app/google-services.json
```

Isso acontece porque o arquivo `google-services.json` do Firebase não está presente ou está malformado no ambiente do GitHub Actions.

---

## Solução: Configurar Secret no GitHub

### 1. Obter o arquivo google-services.json

O arquivo `google-services.json` está localizado em:

```
android/app/google-services.json
```

**⚠️ IMPORTANTE:** Este arquivo contém configurações do Firebase para seu app Android e **NÃO DEVE** ser commitado no repositório por questões de segurança.

### 2. Preparar o conteúdo para o Secret

Você precisa copiar **TODO o conteúdo** do arquivo `google-services.json`:

```bash
# No terminal, copie o conteúdo do arquivo:
cat android/app/google-services.json
```

Ou abra o arquivo em um editor e copie todo o conteúdo JSON.

**Exemplo do formato esperado:**

```json
{
  "project_info": {
    "project_number": "123456789",
    "firebase_url": "https://seu-projeto.firebaseio.com",
    "project_id": "seu-projeto-id",
    "storage_bucket": "seu-projeto.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:123456789:android:abc123def456",
        "android_client_info": {
          "package_name": "com.garageminteligente.app"
        }
      },
      "oauth_client": [
        {
          "client_id": "...",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "AIza..."
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}
```

### 3. Criar o Secret no GitHub

1. **Vá para o repositório no GitHub**
   - URL: https://github.com/Garagem-Inteligente/client-app

2. **Acesse Settings > Secrets and variables > Actions**
   - Clique em **"Settings"** (no menu superior do repositório)
   - No menu lateral, clique em **"Secrets and variables"**
   - Clique em **"Actions"**

3. **Crie um novo repository secret**
   - Clique em **"New repository secret"**
   - **Name:** `GOOGLE_SERVICES_JSON`
   - **Secret:** Cole TODO o conteúdo do arquivo `google-services.json`
   - Clique em **"Add secret"**

### 4. Validar o Secret

Após configurar o secret:

1. **Abra um Pull Request** ou faça um **push para master/release/android**
2. O workflow do GitHub Actions vai executar automaticamente
3. Verifique o step **"🔧 Configure Firebase"**
4. Deve mostrar: `✅ google-services.json configurado com sucesso!`

---

## Troubleshooting

### ❌ Secret não está configurado

**Erro:**
```
❌ ERRO: Secret GOOGLE_SERVICES_JSON não está configurado!
```

**Solução:**
- Siga os passos acima para criar o secret
- Certifique-se de usar exatamente o nome `GOOGLE_SERVICES_JSON`

### ❌ JSON inválido

**Erro:**
```
❌ ERRO: google-services.json não é um JSON válido!
```

**Causas possíveis:**
1. Copiou o arquivo incorretamente (faltam caracteres)
2. Adicionou espaços ou caracteres extras no início/fim
3. Arquivo corrompido

**Solução:**
1. Abra o arquivo `android/app/google-services.json` localmente
2. Valide se é um JSON válido:
   ```bash
   # Linux/Mac
   jq . android/app/google-services.json
   
   # Ou use um validador online:
   # https://jsonlint.com/
   ```
3. Copie novamente TODO o conteúdo (Ctrl+A, Ctrl+C)
4. Atualize o secret no GitHub

### ❌ Arquivo vazio

**Erro:**
```
❌ ERRO: google-services.json está vazio!
```

**Solução:**
- Certifique-se de ter colado o conteúdo completo do arquivo ao criar o secret
- Remova espaços em branco antes/depois do JSON

### 🔍 Como baixar o google-services.json do Firebase

Se você não tem o arquivo localmente:

1. **Acesse o Firebase Console**
   - URL: https://console.firebase.google.com/

2. **Selecione seu projeto**
   - Clique no projeto **"Garagem Inteligente"** (ou o nome do seu projeto)

3. **Vá para Project Settings**
   - Clique no ícone de engrenagem ⚙️ no menu lateral
   - Clique em **"Project Settings"**

4. **Baixe o arquivo para Android**
   - Role até a seção **"Your apps"**
   - Encontre o app Android (com package `com.garageminteligente.app`)
   - Clique em **"google-services.json"** para baixar

5. **Copie o conteúdo**
   - Abra o arquivo baixado
   - Copie todo o conteúdo JSON
   - Use para criar o secret no GitHub (passo 3 acima)

---

## Verificação Final

Antes de commitar qualquer mudança, verifique:

- [ ] Secret `GOOGLE_SERVICES_JSON` criado no GitHub
- [ ] Conteúdo do secret é um JSON válido completo
- [ ] Arquivo `android/app/google-services.json` existe localmente (para desenvolvimento)
- [ ] Arquivo `android/app/google-services.json` está no `.gitignore` (para não commitar)

**Verificar .gitignore:**

```bash
# Verifique se está ignorado:
grep "google-services.json" .gitignore

# Se não estiver, adicione:
echo "android/app/google-services.json" >> .gitignore
```

---

## Resumo Rápido

```bash
# 1. Copie o arquivo
cat android/app/google-services.json

# 2. Vá para GitHub:
# Settings > Secrets and variables > Actions > New repository secret

# 3. Crie o secret:
# Name: GOOGLE_SERVICES_JSON
# Secret: [cole o conteúdo completo do JSON]

# 4. Teste o workflow:
git push origin feature/sua-branch
```

---

**Última atualização:** Janeiro 2025  
**Referências:**
- [Firebase Console](https://console.firebase.google.com/)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Deploy Optimized Workflow](.github/workflows/deploy-optimized.yml)

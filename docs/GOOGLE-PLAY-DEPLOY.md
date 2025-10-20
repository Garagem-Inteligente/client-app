# Guia: Como Enviar App para Google Play Console

## 📋 Pré-requisitos

1. Conta Google Play Developer (taxa única de $25)
2. Java/Keytool instalado (para gerar keystore)
3. Projeto Android configurado

## 🔑 Passo 1: Gerar Keystore (Execute UMA VEZ)

```bash
cd /home/michel/Documentos/Garagem-Inteligente/client-app
chmod +x scripts/generate-keystore.sh
./scripts/generate-keystore.sh
```

**Informações que você precisará fornecer:**
- Senha do keystore (crie uma senha forte, mínimo 6 caracteres)
- Alias: `upload` (ou outro nome)
- Nome: Seu nome ou "Garagem Inteligente"
- Unidade organizacional: "Desenvolvimento"
- Organização: "Garagem Inteligente"
- Cidade: Sua cidade
- Estado: Seu estado
- País: BR

**⚠️ IMPORTANTE:**
- Anote a senha em local SEGURO (gerenciador de senhas)
- Faça BACKUP do arquivo `android/app/upload-keystore.jks`
- NUNCA commite o keystore no Git (já está no .gitignore)

## 🏗️ Passo 2: Gerar AAB

```bash
chmod +x scripts/build-aab.sh
./scripts/build-aab.sh
```

O script irá:
1. Build do projeto web (Vite)
2. Sincronizar com Capacitor
3. Limpar builds anteriores
4. Gerar AAB assinado

**Localização do AAB gerado:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 📤 Passo 3: Criar App no Google Play Console

### 3.1 Acesso ao Console
1. Acesse: https://play.google.com/console
2. Faça login com sua conta Developer

### 3.2 Criar Novo App
1. Clique em **"Create app"** ou **"Criar app"**
2. Preencha:
   - **App name**: Garagem Inteligente
   - **Default language**: Português (Brasil)
   - **App or game**: App
   - **Free or paid**: Free (Gratuito)
3. Aceite as políticas
4. Clique em **"Create app"**

### 3.3 Preencher Informações Obrigatórias

#### Dashboard > Complete setup tasks

**1. App access** (Acesso ao app)
   - Declare se há restrições de acesso
   - Se requer login, forneça credenciais de teste

**2. Ads** (Anúncios)
   - Declare se contém anúncios (provavelmente "No")

**3. Content rating** (Classificação de conteúdo)
   - Preencha o questionário
   - Para app de veículos: provavelmente classificação livre

**4. Target audience** (Público-alvo)
   - Idade mínima: 18+ (ou conforme seu público)

**5. News app** (App de notícias)
   - Selecione "No"

**6. COVID-19 contact tracing** (Rastreamento COVID)
   - Selecione "No"

**7. Data safety** (Segurança de dados)
   - Declare quais dados coleta
   - Para Garagem Inteligente:
     - ✅ Coleta dados pessoais (nome, email)
     - ✅ Coleta dados de veículos
     - ✅ Usa Firebase Auth e Firestore
   - Preencha conforme sua Política de Privacidade

**8. Government apps** (Apps governamentais)
   - Selecione "No"

**9. Financial features** (Recursos financeiros)
   - Selecione "No" (a menos que processe pagamentos)

**10. App category** (Categoria do app)
   - Selecione: **Auto & Vehicles** ou **Tools**

**11. Store listing** (Listagem na loja)
   - Preencha informações básicas (pode atualizar depois)

**12. Privacy Policy** (Política de Privacidade)
   - URL: Forneça link da sua política
   - Exemplo: `https://garageminteligente.app/privacy-policy`
   - Ou hospede em GitHub Pages

## 🧪 Passo 4: Upload para Internal Testing

### 4.1 Configurar App Signing
1. Vá em: **Release > Setup > App signing**
2. Selecione: **"Use Google-generated key"**
3. Aceite os termos (Google gerenciará a assinatura)
4. Faça upload do **upload certificate**:
   ```bash
   # Extrair certificado do keystore
   cd android/app
   keytool -export -rfc \
     -keystore upload-keystore.jks \
     -alias upload \
     -file upload_certificate.pem
   ```
5. Faça upload do arquivo `.pem` gerado

### 4.2 Criar Release de Teste Interno
1. Vá em: **Release > Testing > Internal testing**
2. Clique em: **Create new release**
3. **Upload AAB**:
   - Arraste o arquivo `app-release.aab`
   - Ou clique para selecionar
4. Aguarde processamento (pode levar alguns minutos)
5. Preencha **Release name**: `v1.0.0 - Build inicial`
6. Preencha **Release notes** (português):
   ```
   Primeira versão de testes internos
   
   Funcionalidades:
   - Cadastro e login de usuários
   - Gerenciamento de veículos
   - Histórico de manutenções
   - Alertas de manutenção
   - Sistema de transferência de veículos
   - Sincronização em tempo real
   ```

### 4.3 Configurar Testadores
1. Na mesma página, vá em **Testers**
2. Crie uma lista de testadores:
   - Adicione emails individuais, ou
   - Crie um Google Group e adicione o grupo
3. Clique em **Save**

### 4.4 Review e Rollout
1. Clique em **Review release**
2. Verifique todos os detalhes
3. Clique em **Start rollout to Internal testing**
4. Confirme

### 4.5 Compartilhar com Testadores
1. Após rollout, copie o **link de teste**
2. Compartilhe com testadores (via email ou Google Group)
3. Testadores devem:
   - Clicar no link
   - Fazer opt-in para teste
   - Baixar app via Play Store

## 📱 Testar o App

1. Abra o link no dispositivo Android
2. Clique em **"Download it on Google Play"**
3. App será instalado normalmente
4. Teste todas as funcionalidades
5. Reporte bugs/feedback

## 🔄 Atualizar o App (Novas Versões)

1. Atualize `versionCode` e `versionName` em:
   ```groovy
   // android/app/build.gradle
   defaultConfig {
       versionCode 2        // incrementar
       versionName "1.1.0"  // atualizar
   }
   ```

2. Gere novo AAB:
   ```bash
   ./scripts/build-aab.sh
   ```

3. No Play Console:
   - Release > Internal testing
   - Create new release
   - Upload novo AAB
   - Preencher release notes
   - Start rollout

## 🚀 Promover para Produção

Após testes internos bem-sucedidos:

1. **Closed testing** (opcional)
   - Para grupo maior de testadores
   - Mesma interface

2. **Open testing** (opcional)
   - Teste público antes do lançamento oficial

3. **Production**
   - Release > Production
   - Create new release
   - Upload AAB (ou promover de testing)
   - Preencher informações completas da loja:
     - Screenshots (mínimo 2, recomendado 8)
     - Feature graphic (1024x500px)
     - App icon (512x512px)
     - Descrição curta (80 caracteres)
     - Descrição completa (4000 caracteres)
     - Video promocional (opcional)
   - Start rollout to Production

## ⚠️ Checklist Pré-Lançamento

- [ ] Todas as tarefas do Dashboard concluídas
- [ ] App testado em múltiplos dispositivos
- [ ] Política de Privacidade publicada
- [ ] Screenshots profissionais preparados
- [ ] Descrição da loja revisada
- [ ] Ícone e assets gráficos prontos
- [ ] Versão de teste estável sem bugs críticos
- [ ] Backup do keystore realizado

## 🆘 Problemas Comuns

### AAB não é aceito
- Verifique versionCode (deve ser maior que versões anteriores)
- Certifique-se que está assinado corretamente

### Erro de assinatura
- Confirme que App Signing está configurado
- Verifique que upload certificate foi enviado

### App não aparece para testadores
- Confirme que testadores fizeram opt-in no link
- Aguarde até 24h para propagação
- Verifique que emails foram adicionados corretamente

### Erro de permissões Firebase
- Verifique google-services.json
- Confirme configuração do Firebase

## 📚 Links Úteis

- Play Console: https://play.google.com/console
- Documentação oficial: https://developer.android.com/distribute
- Requisitos de conteúdo: https://support.google.com/googleplay/android-developer/topic/9877467
- Política de Privacidade: https://support.google.com/googleplay/android-developer/answer/9859455

## 💡 Dicas Finais

1. **Teste extensivamente** antes de lançar em produção
2. **Responda reviews** de usuários rapidamente
3. **Monitore crashes** via Play Console
4. **Atualize regularmente** o app
5. **Mantenha backup** do keystore sempre atualizado
6. **Use versionamento semântico**: MAJOR.MINOR.PATCH
7. **Documente mudanças** em cada release

---

**Pronto!** Após seguir este guia, seu app estará no Google Play para testes e, posteriormente, disponível para o público.

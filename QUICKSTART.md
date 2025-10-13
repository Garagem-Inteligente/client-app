# 🚀 Guia Rápido - Transferência de Veículos

> 🎉 **Novo**: Agora 100% gratuito! Anexos são armazenados como Base64 no Firestore (sem Firebase Storage). Veja [BASE64_MIGRATION.md](BASE64_MIGRATION.md) para detalhes.

## ⚡ Setup Rápido (3 minutos)

### 1. Criar Contas de Teste

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` e crie duas contas:

1. **Dono Atual**
   - Email: `test@autocare.com`
   - Senha: `Test@123`
   - Nome: `Test Owner`

2. **Novo Dono**
   - Email: `test2@autocare.com`
   - Senha: `Test@123`
   - Nome: `New Owner`

### 2. Criar Veículo de Teste

1. Login como `test@autocare.com`
2. Vá para **Veículos** → **Adicionar Veículo**
3. Preencha:
   - Marca: Toyota
   - Modelo: Corolla
   - Ano: 2020
   - Placa: ABC1234
   - Quilometragem: 50.000 km
   - Combustível: Gasolina

## 🎯 Testando Transferência (Manualmente)

### Passo 1: Iniciar Transferência

1. Login como `test@autocare.com` (Dono Atual)
2. Vá para **Veículos** → Clique no veículo criado
3. Clique em **Transferir**
4. Digite email do novo dono: `test2@autocare.com`
5. Clique em **Iniciar Transferência**
6. ✅ Mensagem de sucesso aparece

### Passo 2: Obter Códigos de Confirmação

Abra o **Console do Navegador** (F12):

```
=== CÓDIGOS DE TRANSFERÊNCIA ===
Transfer ID: abc123xyz
Código do dono atual (test@autocare.com): 123456
Código do novo dono (test2@autocare.com): 654321
================================
```

📝 **Anote esses códigos!**

### Passo 3: Confirmar como Dono Atual

1. Vá para **Transferências** (ainda como `test@autocare.com`)
2. Você verá: "Transferindo para test2@autocare.com"
3. Clique em **Inserir Código**
4. Digite o código do dono atual: `123456`
5. Clique em **Confirmar**
6. ✅ "Confirmação registrada! Aguardando confirmação da outra parte."

### Passo 4: Confirmar como Novo Dono

1. **Abra uma aba anônima** ou **outro navegador**
2. Login como `test2@autocare.com` (Novo Dono)
3. Vá para **Transferências**
4. Você verá: "Recebendo de test@autocare.com"
5. Clique em **Inserir Código**
6. Digite o código do novo dono: `654321`
7. Clique em **Confirmar**
8. 🎉 **"Transferência concluída com sucesso!"**

### Passo 5: Verificar Transferência

1. Como **Novo Dono** (`test2@autocare.com`):
   - Vá para **Veículos**
   - O veículo agora aparece na sua lista!

2. Como **Dono Anterior** (`test@autocare.com`):
   - Vá para **Veículos**
   - O veículo não está mais na lista
   - (Em produção, apareceria com badge "Transferido")

## 🧪 Testando com Playwright (Automatizado)

### Executar Todos os Testes

```bash
npm run test:e2e
```

### Executar Só Transferências

```bash
npx playwright test transfers.spec.ts
```

### Modo Interativo (Recomendado)

```bash
npm run test:e2e:ui
```

### Modo Debug (Passo a Passo)

```bash
npm run test:e2e:debug
```

## 📸 Testando Upload de Arquivos

### Manual

1. Vá para **Manutenções** → **Registrar Manutenção**
2. Preencha os campos obrigatórios
3. Na seção **Anexos**:
   - Arraste um PDF ou imagem
   - OU clique para selecionar
4. Arquivo aparece na lista com preview
5. Clique em **Salvar**
6. ✅ Manutenção criada com anexo

### Verificar Anexo

1. Na lista de manutenções, veja a seção **Anexos (1)**
2. Clique no arquivo para visualizar
3. Abre em nova aba
4. Clique no ❌ para excluir

## 🐛 Troubleshooting

### "Firebase Storage has not been set up"

```bash
# Ative no console e depois:
firebase deploy --only storage:rules
```

### "Veículo não encontrado"

- Certifique-se de ter criado pelo menos um veículo
- Faça logout/login para recarregar dados

### Códigos de confirmação não aparecem

- Verifique o **Console** do navegador (F12)
- Os códigos são logados após iniciar transferência

### "Usuário não autenticado"

- Faça logout e login novamente
- Verifique se as contas existem no Firebase Authentication

### Testes Playwright falhando

```bash
# Reinstalar browsers
npx playwright install

# Executar com logs
DEBUG=pw:api npm run test:e2e
```

## 📊 Checklist Completo

- [ ] Contas de teste criadas (`test@autocare.com` e `test2@autocare.com`)
- [ ] Firebase Storage ativado
- [ ] Storage rules deployed
- [ ] Veículo de teste criado
- [ ] Transferência manual testada com sucesso
- [ ] Upload de arquivo testado
- [ ] Testes Playwright executados
- [ ] Todos os testes passando ✅

## 🎓 Próximos Passos

### Para Produção

1. **Implementar envio de emails reais**
   - Configurar Firebase Functions
   - Usar SendGrid ou Mailgun
   - Template de email profissional

2. **Mapear emails para UIDs**
   ```typescript
   // Criar collection 'users'
   const usersRef = collection(db, 'users')
   await setDoc(doc(usersRef, user.uid), {
     uid: user.uid,
     email: user.email,
     name: user.name
   })
   ```

3. **Transferir histórico de manutenção**
   ```typescript
   // Atualizar todos os registros de manutenção
   const maintenanceQuery = query(
     collection(db, 'maintenance'),
     where('vehicleId', '==', vehicleId)
   )
   // Batch update...
   ```

4. **Notificações em tempo real**
   - Firebase Cloud Messaging
   - Notificar ambas as partes sobre confirmações

5. **Auditoria completa**
   ```typescript
   // Criar log de transferência
   await addDoc(collection(db, 'transfer_logs'), {
     vehicleId,
     from: currentOwnerId,
     to: newOwnerId,
     timestamp: serverTimestamp(),
     status: 'completed'
   })
   ```

## 📚 Documentação Completa

- **Detalhes técnicos**: Ver `TESTING.md`
- **Arquitetura**: Ver `.github/copilot-instructions.md`
- **API Firebase**: Ver documentação em `src/stores/transfer.ts`

---

**Pronto para testar!** 🚀

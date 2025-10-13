# Instruções de Deploy - Correção de Erros do Firebase

## 📋 Resumo das Mudanças

### 1. Criação do Utilitário de Tradução de Erros
**Arquivo:** `src/utils/errorMessages.ts`

Utilitário centralizado que traduz automaticamente todos os erros do Firebase (Authentication e Firestore) para mensagens amigáveis em português.

**Erros traduzidos incluem:**
- ✅ Erros de autenticação (email inválido, senha fraca, usuário não encontrado, etc.)
- ✅ Erros do Firestore (permissão negada, não autenticado, registro não encontrado, etc.)
- ✅ Erros de rede (conexão falhou, serviço indisponível, timeout, etc.)
- ✅ Erros de validação (argumento inválido, dados inválidos, etc.)

### 2. Atualização dos Stores
**Arquivos modificados:**
- `src/stores/vehicles.ts` - Todas as operações CRUD agora usam `translateFirebaseError()`
- `src/stores/auth.ts` - Simplificado para usar a função centralizada

**Antes:**
```typescript
catch (err) {
  error.value = err instanceof Error ? err.message : 'Falha ao adicionar manutenção'
}
```

**Depois:**
```typescript
catch (err) {
  error.value = translateFirebaseError(err, 'Falha ao adicionar manutenção')
}
```

### 2.1. Correção Crítica na Query de Manutenções ⚠️
**Problema identificado:**
A função `fetchMaintenanceRecords()` estava tentando buscar **todas as manutenções** do banco e depois filtrar no cliente, mas as regras do Firestore bloqueiam esse tipo de query.

**Solução aplicada:**
- Agora faz uma query **específica por veículo** usando `where('vehicleId', '==', vehicle.id)`
- Respeita as regras de segurança do Firestore
- Manutenções são ordenadas por data depois de carregadas
- Retorna array vazio se o usuário não tiver veículos cadastrados

### 3. Correção das Regras do Firestore ⚠️ **REQUER DEPLOY**
**Arquivo:** `firestore.rules`

**Problema identificado:**
A regra de criação de manutenções estava **muito restritiva**, exigindo apenas os campos obrigatórios e rejeitando campos opcionais como `nextDueDate`, `nextDueMileage`, `serviceProvider` e `notes`.

**Solução aplicada:**
- Adicionada função `hasRequiredFields()` que valida apenas os campos obrigatórios
- Campos opcionais agora são aceitos sem erro
- Mantida a segurança: ainda verifica se o veículo pertence ao usuário autenticado

**Campos obrigatórios:**
- vehicleId
- type
- description
- cost
- mileage
- date
- createdAt

**Campos opcionais (agora aceitos):**
- nextDueDate
- nextDueMileage
- serviceProvider
- notes

---

## 🚀 Como Fazer o Deploy das Regras do Firestore

### Opção 1: Via Console do Firebase (Recomendado para Teste)

**Deploy das Regras:**
1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto AutoCare
3. No menu lateral, vá em **Firestore Database**
4. Clique na aba **Regras** (Rules)
5. Copie todo o conteúdo do arquivo `firestore.rules` deste projeto
6. Cole no editor do console
7. Clique em **Publicar** (Publish)

**Deploy dos Índices:**
1. Ainda em **Firestore Database**, clique na aba **Índices** (Indexes)
2. Se você tentar usar a aplicação e receber um erro sobre índice ausente, o Firebase mostrará um link para criar o índice automaticamente
3. **OU** clique em **Adicionar índice** e configure:
   - Coleção: `maintenance`
   - Campo 1: `vehicleId` (Crescente)
   - Campo 2: `date` (Decrescente)
   - Status da consulta: Coleção
4. Clique em **Criar**

### Opção 2: Via Firebase CLI (Recomendado para Produção)

Se você ainda não tem o Firebase CLI instalado:

```bash
npm install -g firebase-tools
```

Faça login no Firebase:

```bash
firebase login
```

Inicialize o Firebase no projeto (se ainda não foi feito):

```bash
firebase init firestore
```
- Selecione o projeto AutoCare
- Aceite o arquivo `firestore.rules` existente

Faça o deploy das regras E índices (recomendado):

```bash
firebase deploy --only firestore
```

Ou faça o deploy separadamente:

```bash
# Deploy apenas das regras
firebase deploy --only firestore:rules

# Deploy apenas dos índices
firebase deploy --only firestore:indexes
```

---

## ✅ Verificação Pós-Deploy

Após fazer o deploy das regras, teste a criação de uma manutenção:

1. Faça login na plataforma
2. Vá para o Dashboard
3. Clique em **Registrar Manutenção** nas Ações Rápidas
4. Preencha o formulário com dados de uma manutenção
5. Clique em **Salvar**

**Resultado esperado:**
- ✅ Manutenção criada com sucesso
- ✅ Se houver erro, você verá uma mensagem em português amigável
- ❌ Não verá mais "Missing or insufficient permissions"

---

## 🔍 Testando Outros Erros Traduzidos

Para verificar se as traduções estão funcionando:

### Teste 1: Erro de Permissão (simulado)
- Tente acessar um veículo que não é seu (se tiver outro usuário)
- Mensagem esperada: **"Você não tem permissão para realizar esta ação."**

### Teste 2: Erro de Rede
- Desligue sua internet
- Tente criar uma manutenção
- Mensagem esperada: **"Erro de conexão. Verifique sua internet."** ou **"Serviço temporariamente indisponível. Tente novamente."**

### Teste 3: Erro de Autenticação
- Faça logout
- Tente fazer login com senha errada
- Mensagem esperada: **"Senha incorreta."**
- Tente com email inválido
- Mensagem esperada: **"E-mail inválido."**

### Teste 4: Erro de Validação
- Tente criar um veículo/manutenção com dados faltando
- Mensagem esperada: **"Dados inválidos fornecidos."** (se o Firebase validar)

---

## 📝 Próximos Passos Sugeridos

1. **Deploy das regras do Firestore** ⚠️ **URGENTE**
2. Testar criação de manutenções
3. Verificar se todas as operações CRUD funcionam
4. Considerar adicionar mais mensagens customizadas no `errorMessages.ts` se necessário
5. Implementar sistema de toast/notificação para exibir erros de forma mais elegante

---

## 🛠️ Arquivos Modificados

```
src/
├── utils/
│   └── errorMessages.ts          [NOVO] Utilitário de tradução
├── stores/
│   ├── auth.ts                   [MODIFICADO] Usando translateFirebaseError()
│   └── vehicles.ts               [MODIFICADO] Query corrigida + traduções
├── firestore.rules               [MODIFICADO] Regras flexíveis ⚠️ REQUER DEPLOY
└── firestore.indexes.json        [NOVO] Índice composto ⚠️ REQUER DEPLOY
```

---

## ⚡ Status do Build

```
✅ Build passou com sucesso
✅ 114 módulos transformados
✅ Nenhum erro de TypeScript
✅ Pronto para produção
```

---

## 💡 Dicas

- Sempre que adicionar novos erros do Firebase, atualize o arquivo `errorMessages.ts`
- Mantenha as regras do Firestore sincronizadas entre o arquivo local e o console
- Use `firebase deploy --only firestore:rules` para deploys rápidos de regras
- Monitore os logs do Firestore no console para identificar novos erros

---

**Criado em:** 2024
**Versão:** 1.0.0
**Última atualização:** Deploy de traduções de erro

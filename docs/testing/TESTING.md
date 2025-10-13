# Testes E2E com Playwright

Este projeto utiliza Playwright para testes end-to-end (E2E) completos.

## 🚀 Configuração

### Pré-requisitos

```bash
# Instalar dependências (já feito)
npm install

# Instalar browsers do Playwright (já feito)
npx playwright install
```

### Contas de Teste Necessárias

Para rodar todos os testes, você precisa ter duas contas no Firebase:

1. **Dono Atual**: `test@autocare.com` / `Test@123`
2. **Novo Dono**: `test2@autocare.com` / `Test@123`

Crie essas contas manualmente no Firebase Authentication ou através do registro na aplicação.

## 🧪 Executando Testes

### Todos os testes (headless)
```bash
npm run test:e2e
```

### Com interface gráfica (headed mode)
```bash
npm run test:e2e:headed
```

### Com UI interativa do Playwright
```bash
npm run test:e2e:ui
```

### Modo debug (passo a passo)
```bash
npm run test:e2e:debug
```

### Ver relatório de testes
```bash
npm run test:e2e:report
```

## 📝 Suítes de Teste

### 1. Authentication (`auth.spec.ts`)
- ✅ Exibição da landing page
- ✅ Navegação para login/registro
- ✅ Validação de formulários
- ✅ Registro de novo usuário
- ✅ Login de usuário existente

### 2. Vehicle Management (`vehicles.spec.ts`)
- ✅ Navegação para página de veículos
- ✅ Abertura do formulário de adição
- ✅ Criação de novo veículo
- ✅ Visualização de detalhes do veículo
- ✅ Exclusão de veículo

### 3. Maintenance Records (`maintenance.spec.ts`)
- ✅ Navegação para página de manutenções
- ✅ Abertura do formulário de registro
- ✅ Criação de manutenção com anexo (PDF/imagem)
- ✅ Filtro por veículo
- ✅ Visualização de anexos
- ✅ Exclusão de registro

### 4. Vehicle Transfers (`transfers.spec.ts`) 🎯 **NOVO**
- ✅ Iniciação de transferência
- ✅ Visualização de transferência pendente (ambos usuários)
- ✅ Confirmação pelo dono atual (com código)
- ✅ Confirmação pelo novo dono (com código)
- ✅ Verificação de transferência completa
- ✅ Cancelamento de transferência

## 🔍 Fluxo de Transferência Testado

```
Dono Atual                          Novo Dono
     |                                   |
     |--- Inicia transferência --------->|
     |                                   |
     |<-- Ambos recebem códigos -------->|
     |                                   |
     |--- Confirma com código ---------->|
     |                                   |
     |<-- Confirma com código -----------|
     |                                   |
     |<== Transferência concluída! ====>|
```

## 📊 Estrutura de Testes

```
tests/
└── e2e/
    ├── auth.spec.ts          # Autenticação
    ├── vehicles.spec.ts      # Gestão de veículos
    ├── maintenance.spec.ts   # Registros de manutenção
    └── transfers.spec.ts     # Transferências de veículos
```

## 🎯 Pontos de Atenção

### 1. Códigos de Confirmação

No ambiente de teste, os códigos são exibidos no console do navegador (linha 168-172 em `transfer.ts`):

```typescript
console.log('=== CÓDIGOS DE TRANSFERÊNCIA ===')
console.log(`Transfer ID: ${transferRef.id}`)
console.log(`Código do dono atual: ${currentOwnerCode}`)
console.log(`Código do novo dono: ${newOwnerCode}`)
```

**Em produção**, esses códigos devem ser enviados por email via Firebase Functions.

### 2. Mapeamento Email → UID

A transferência completa requer mapear o email do novo dono para seu UID do Firebase. Atualmente, isso é simplificado. Para produção, implemente:

```typescript
// Criar collection 'users' com mapeamento email->uid
const usersRef = collection(db, 'users')
const userQuery = query(usersRef, where('email', '==', newOwnerEmail))
const userSnapshot = await getDocs(userQuery)
const newOwnerId = userSnapshot.docs[0].data().uid
```

### 3. Upload de Arquivos

Os testes criam arquivos mock para testar uploads:

```typescript
const fileContent = Buffer.from('Test invoice content')
await page.setInputFiles('input[type="file"]', {
  name: 'nota-fiscal.pdf',
  mimeType: 'application/pdf',
  buffer: fileContent
})
```

### 4. Firebase Storage

⚠️ **IMPORTANTE**: Antes de rodar testes de upload, ative o Firebase Storage:
1. Acesse: https://console.firebase.google.com/project/autocare-platform/storage
2. Clique em "Get Started"
3. Deploy regras: `firebase deploy --only storage:rules`

## 🐛 Debugging

### Ver traces de testes falhados
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Capturar screenshots
Configurado para capturar automaticamente em falhas (`screenshot: 'only-on-failure'`).

### Logs detalhados
```bash
DEBUG=pw:api npm run test:e2e
```

## 📈 Métricas

- **Cobertura**: 4 suítes de teste
- **Casos de teste**: ~25 testes
- **Tempo médio**: ~2-5 minutos (completo)
- **Browsers**: Chromium, Firefox, WebKit

## 🚦 CI/CD

Para integração contínua, adicione ao `.github/workflows/test.yml`:

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 🔐 Variáveis de Ambiente

Para testes em diferentes ambientes:

```env
# .env.test
VITE_FIREBASE_API_KEY=your-test-api-key
VITE_FIREBASE_PROJECT_ID=autocare-test
# ... outros configs
```

Execute com:
```bash
ENV_FILE=.env.test npm run test:e2e
```

## 📚 Recursos

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

**Última atualização**: 13 de outubro de 2025

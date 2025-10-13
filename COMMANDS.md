# 🛠️ Comandos Úteis - AutoCare

## 📦 NPM Scripts

### Desenvolvimento
```bash
npm run dev              # Inicia servidor de desenvolvimento (http://localhost:5173)
npm run build            # Build de produção
npm run preview          # Preview do build localmente
```

### Testes E2E
```bash
npm run test:e2e         # Executar todos os testes (headless)
npm run test:e2e:headed  # Executar com interface gráfica
npm run test:e2e:ui      # UI interativa do Playwright (recomendado)
npm run test:e2e:debug   # Modo debug (passo a passo)
npm run test:e2e:report  # Ver relatório HTML de testes
```

## 🔥 Firebase

### Autenticação
```bash
firebase login                  # Login no Firebase CLI
firebase logout                 # Logout
firebase login:list             # Listar contas logadas
```

### Deploy
```bash
firebase deploy                             # Deploy completo
firebase deploy --only hosting              # Apenas hosting
firebase deploy --only firestore:rules      # Apenas regras Firestore
firebase deploy --only storage:rules        # Apenas regras Storage
firebase deploy --only functions            # Apenas functions
```

### Firestore
```bash
# Ver documentos
firebase firestore:get vehicles --limit 10
firebase firestore:get maintenance --limit 10
firebase firestore:get vehicle_transfers --limit 10

# Deletar documento
firebase firestore:delete vehicles/DOC_ID

# Backup
firebase firestore:export gs://autocare-platform.appspot.com/backups/$(date +%Y%m%d)

# Importar
firebase firestore:import gs://autocare-platform.appspot.com/backups/20251013
```

### Storage
```bash
# Listar arquivos
firebase storage:list

# Upload arquivo
firebase storage:upload local.pdf gs://autocare-platform.appspot.com/test/file.pdf

# Download arquivo
firebase storage:download gs://autocare-platform.appspot.com/test/file.pdf local.pdf

# Deletar arquivo
firebase storage:delete gs://autocare-platform.appspot.com/test/file.pdf
```

### Logs
```bash
firebase functions:log                      # Ver todos os logs
firebase functions:log --only functionName  # Logs de função específica
firebase functions:log -n 50               # Últimas 50 linhas
firebase functions:log --since 1h          # Logs da última hora
```

### Emulators (Desenvolvimento Local)
```bash
firebase emulators:start                    # Iniciar todos
firebase emulators:start --only firestore   # Apenas Firestore
firebase emulators:start --only auth        # Apenas Auth
firebase emulators:start --import=./data    # Com dados importados
firebase emulators:export ./data            # Exportar dados
```

## 🎭 Playwright

### Executar Testes
```bash
npx playwright test                         # Todos os testes
npx playwright test auth.spec.ts           # Suite específica
npx playwright test --headed                # Com navegador visível
npx playwright test --debug                 # Modo debug
npx playwright test --ui                    # UI interativa
npx playwright test --project=chromium      # Navegador específico
npx playwright test --grep "transfer"       # Por palavra-chave
```

### Relatórios
```bash
npx playwright show-report                  # Mostrar último relatório
npx playwright show-trace test-results/.../trace.zip  # Ver trace
```

### Codegen (Gerar testes)
```bash
npx playwright codegen http://localhost:5173        # Gerar código de teste
npx playwright codegen --target javascript          # Em JavaScript
npx playwright codegen --save-storage=auth.json     # Salvar estado
npx playwright codegen --load-storage=auth.json     # Carregar estado
```

### Screenshots e Vídeos
```bash
npx playwright test --screenshot=on         # Screenshots sempre
npx playwright test --video=on              # Vídeos sempre
npx playwright test --trace=on              # Traces sempre
```

## 🐛 Debug

### TypeScript
```bash
npx vue-tsc --noEmit                        # Verificar erros TS
npx vue-tsc -b                              # Build apenas TS
```

### Vite
```bash
npm run dev -- --debug                      # Vite em modo debug
npm run dev -- --host                       # Expor na rede local
npm run dev -- --port 3000                  # Mudar porta
```

### Limpeza
```bash
rm -rf node_modules package-lock.json && npm install  # Reinstalar deps
rm -rf dist && npm run build                          # Build limpo
rm -rf .firebase && firebase deploy                   # Deploy limpo
rm -rf test-results playwright-report                 # Limpar testes
```

## 📊 Análise

### Bundle Size
```bash
npm run build                               # Ver tamanho dos chunks
npx vite-bundle-visualizer                  # Visualizar bundle (instalar primeiro)
```

### Dependências
```bash
npm outdated                                # Ver pacotes desatualizados
npm audit                                   # Verificar vulnerabilidades
npm audit fix                               # Corrigir vulnerabilidades
npm list --depth=0                          # Listar deps diretas
```

## 🔍 Busca e Navegação

### Grep
```bash
# Buscar em arquivos
grep -r "searchTerm" src/
grep -r "TODO" src/ --include="*.vue"
grep -r "FIXME" src/ --include="*.ts"

# Contar ocorrências
grep -r "TODO" src/ | wc -l
```

### Find
```bash
# Encontrar arquivos
find src/ -name "*.vue"
find src/ -name "*transfer*"
find . -name "*.spec.ts"
```

## 🚀 Git

### Commits Úteis
```bash
git add .
git commit -m "feat: implementar transferência de veículos"
git commit -m "fix: corrigir upload de arquivos"
git commit -m "test: adicionar testes E2E"
git commit -m "docs: atualizar documentação"
```

### Branches
```bash
git checkout -b feature/vehicle-transfer
git checkout -b feature/file-upload
git checkout -b test/e2e-setup
```

### Stash
```bash
git stash                                   # Salvar mudanças
git stash list                              # Listar stashes
git stash pop                               # Aplicar último stash
git stash apply stash@{0}                   # Aplicar stash específico
```

## 🎯 Atalhos Úteis

### VS Code
```bash
code .                                      # Abrir VS Code
code . --disable-extensions                 # Sem extensões
code --list-extensions                      # Listar extensões
```

### Abrir URLs
```bash
# Console Firebase
open https://console.firebase.google.com/project/autocare-platform

# Localhost
open http://localhost:5173

# Relatório Playwright
open playwright-report/index.html
```

## 📝 Criar Arquivos de Teste

### Usuário de Teste
```typescript
// No console do navegador (após criar conta)
const user = {
  email: 'test@autocare.com',
  password: 'Test@123',
  name: 'Test Owner'
}
localStorage.setItem('test_user', JSON.stringify(user))
```

### Mock Data
```typescript
// Veículo de teste
const vehicle = {
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  plate: 'ABC1234',
  mileage: 50000,
  fuelType: 'gasoline'
}

// Manutenção de teste
const maintenance = {
  type: 'oil_change',
  description: 'Troca de óleo',
  cost: 150.00,
  mileage: 50000,
  date: new Date()
}
```

## 🔐 Variáveis de Ambiente

### .env.local (criar)
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=autocare-platform
VITE_FIREBASE_STORAGE_BUCKET=autocare-platform.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Usar no código
```typescript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
```

## 📱 Mobile (Capacitor)

```bash
# Adicionar plataforma
npx cap add android
npx cap add ios

# Build e sync
npm run build
npx cap sync

# Abrir IDE
npx cap open android
npx cap open ios

# Run no dispositivo
npx cap run android
npx cap run ios
```

## 🎨 Tailwind

### Gerar config
```bash
npx tailwindcss init -p
```

### Build CSS
```bash
npx tailwindcss -i ./src/style.css -o ./dist/output.css
```

## 📊 Performance

### Lighthouse
```bash
npm run build
npm run preview
# Abrir DevTools > Lighthouse > Generate Report
```

### Chrome DevTools
```bash
# Performance
chrome://tracing

# Memory
chrome://heap-profiler
```

---

## 🆘 Troubleshooting Rápido

### Build falha
```bash
rm -rf node_modules dist && npm install && npm run build
```

### Testes falhando
```bash
npx playwright install --with-deps
npm run test:e2e:debug
```

### Firebase errors
```bash
firebase logout && firebase login
firebase use autocare-platform
```

### TypeScript errors
```bash
rm -rf node_modules/.cache
npx vue-tsc --noEmit
```

---

**Última atualização**: 13 de outubro de 2025

# Correções Pendentes Antes do Git Commit

## ❌ Erros de Tipagem Restantes

### 1. `stores/vehicles.ts` - insuranceExpiryDate
**Problema:** VehicleInput aceita `Date | string` mas Vehicle e operações Firebase esperam apenas `Date`

**Solução:**
- Converter string para Date antes de salvar no Firestore
- Linhas 249, 253, 283, 289

```typescript
// Adicionar helper no início da função
const insuranceDate = vehicleData.insuranceExpiryDate 
  ? (typeof vehicleData.insuranceExpiryDate === 'string' 
      ? new Date(vehicleData.insuranceExpiryDate) 
      : vehicleData.insuranceExpiryDate)
  : undefined
```

### 2. `RegisterPage.vue` - Variável success no template
**Problema:** Template usa `{{ success }}` mas variável foi renomeada para `successMessage`

**Solução:**
- Buscar e substituir `success` por `successMessage` no template (linhas 88, 90)

### 3. `VehicleFormPage.vue` - Ícone motorcycle
**Problema:** Template usa `motorcycle` mas foi importado como `bicycle`

**Solução:**
- Linha 32: Substituir `motorcycle` por `bicycle`

### 4. `VehicleFormPage.vue` - insuranceExpiryDate tipo
**Problema:** ion-datetime retorna string mas form espera Date

**Solução:**
- Já corrigido no VehicleInput aceitar `Date | string`
- Linha 180: Manter como está

### 5. `VehiclesPage.vue` - motorcycle não definido
**Problema:** Template usa `motorcycle` mas foi importado como `bicycle`

**Solução:**
- Linha 150: Substituir `motorcycle` por `bicycle`

---

## ✅ Já Corrigido

- ✅ Erros de lint (imports não usados)
- ✅ VehicleDetailPage - declaração de deleteVehicle
- ✅ VehicleFormPage - maxlength como number
- ✅ RegisterPage - variável successMessage no script

---

## 📋 Checklist Final

- [ ] Corrigir todos os 5 erros de tipagem acima
- [ ] Executar `pnpm run type-check` e garantir 0 erros
- [ ] Executar `pnpm run lint` e garantir 0 erros
- [ ] Executar `pnpm run build` e garantir build bem-sucedido
- [ ] Inicializar git no diretório App-client/app-client
- [ ] Criar repositório privado no GitHub
- [ ] Configurar CI/CD (já criado em `.github/workflows/ci.yml`)
- [ ] Adicionar secrets do Firebase no GitHub
- [ ] Fazer commit inicial
- [ ] Push para master

---

## 🚀 Comandos para Executar

```bash
cd /home/michel/Documentos/Pessoal/autocare-landing-page/Garagem-inteligente/App-client/app-client

# Corrigir erros (fazer manualmente ou com script)

# Verificar
pnpm run lint
pnpm run type-check
pnpm run build

# Git init e commit
git init
git add .
git commit -m "feat: Initial commit - Garagem Inteligente App Client

- Dashboard completo com dark theme
- Integração Firebase (Auth, Firestore)
- Store de veículos e manutenções
- Utils completos (masks, validators, fileUtils)
- Rotas e navegação configuradas
- CI/CD configurado com GitHub Actions
- TypeScript sem erros
- ESLint configurado"

# Criar repo no GitHub (usar gh cli)
gh repo create garageminteligente-app-client --private --source=. --remote=origin

# Push
git branch -M master
git push -u origin master
```


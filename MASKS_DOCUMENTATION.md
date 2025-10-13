# Máscaras de Input Implementadas

## 📝 Resumo

Implementado sistema completo de máscaras automáticas para todos os inputs da aplicação, melhorando significativamente a experiência do usuário ao digitar valores.

---

## 🎭 Máscaras Disponíveis

### 1. **Máscara de Moeda (currency)**
- **Formato**: `R$ 1.234,56`
- **Aplicação**: Campos de custo e valores monetários
- **Funcionamento**: 
  - Formata automaticamente enquanto digita
  - Adiciona centavos automaticamente
  - Ex: Digita "12345" → Exibe "R$ 123,45"

**Uso:**
```vue
<Input
  v-model="formData.cost"
  mask="currency"
  placeholder="R$ 0,00"
/>
```

---

### 2. **Máscara de Quilometragem (mileage)**
- **Formato**: `123.456`
- **Aplicação**: Campos de quilometragem
- **Funcionamento**:
  - Adiciona pontos de milhar automaticamente
  - Remove caracteres não numéricos
  - Ex: Digita "50000" → Exibe "50.000"

**Uso:**
```vue
<Input
  v-model="formData.mileage"
  mask="mileage"
  placeholder="Ex: 50.000 km"
/>
```

---

### 3. **Máscara de Placa (plate)**
- **Formato**: `ABC-1234` (antigo) ou `ABC1D23` (Mercosul)
- **Aplicação**: Campo de placa de veículo
- **Funcionamento**:
  - Detecta automaticamente formato antigo ou Mercosul
  - Converte para maiúsculas
  - Adiciona hífen automaticamente (formato antigo)
  - Ex: Digita "abc1234" → Exibe "ABC-1234"

**Uso:**
```vue
<Input
  v-model="formData.plate"
  mask="plate"
  placeholder="Ex: ABC-1234"
/>
```

---

### 4. **Máscara de Data (date)**
- **Formato**: `DD/MM/AAAA`
- **Aplicação**: Campos de data
- **Funcionamento**:
  - Adiciona barras automaticamente
  - Remove caracteres não numéricos
  - Ex: Digita "25122024" → Exibe "25/12/2024"

**Uso:**
```vue
<Input
  v-model="formData.date"
  mask="date"
  placeholder="DD/MM/AAAA"
/>
```

---

### 5. **Máscara de Telefone (phone)**
- **Formato**: `(11) 98765-4321`
- **Aplicação**: Campos de telefone
- **Funcionamento**:
  - Adiciona parênteses e hífen automaticamente
  - Suporta celular (9 dígitos) e fixo (8 dígitos)
  - Ex: Digita "11987654321" → Exibe "(11) 98765-4321"

**Uso:**
```vue
<Input
  v-model="formData.phone"
  mask="phone"
  placeholder="(00) 00000-0000"
/>
```

---

### 6. **Máscara de Ano (year)**
- **Formato**: `YYYY`
- **Aplicação**: Campo de ano
- **Funcionamento**:
  - Limita a 4 dígitos
  - Remove caracteres não numéricos
  - Ex: Digita "2024" → Exibe "2024"

**Uso:**
```vue
<Input
  v-model="formData.year"
  mask="year"
  placeholder="Ex: 2024"
/>
```

---

## 📂 Arquivos Criados/Modificados

### Novos Arquivos:
1. **`src/utils/masks.ts`** - Utilitário com todas as funções de máscara
   - Funções de aplicação de máscara (maskCurrency, maskMileage, etc.)
   - Funções de remoção de máscara (unmaskCurrency, unmaskMileage, etc.)
   - Funções auxiliares (formatDate, parseDate, isValidDate)

### Arquivos Modificados:
2. **`src/components/Input.vue`** - Componente de input atualizado
   - Suporte a prop `mask`
   - Lógica de aplicação automática de máscara
   - Handler de input customizado

3. **`src/components/VehicleForm.vue`** - Formulário de veículo
   - Placa com máscara `plate`
   - Quilometragem com máscara `mileage`
   - Ano com máscara `year`

4. **`src/views/Maintenance.vue`** - Formulário de manutenção
   - Custo com máscara `currency`
   - Quilometragem com máscara `mileage`
   - Próxima quilometragem com máscara `mileage`

---

## 🎯 Componentes Que Usam Máscaras

### VehicleForm.vue
- ✅ Placa → `mask="plate"`
- ✅ Quilometragem → `mask="mileage"`
- ✅ Ano → `mask="year"`

### Maintenance.vue
- ✅ Custo → `mask="currency"`
- ✅ Quilometragem → `mask="mileage"`
- ✅ Próxima Quilometragem → `mask="mileage"`

---

## 💡 Como Funciona

### Fluxo de Dados:

1. **Usuário digita** → `"12345"`
2. **Máscara aplica formatação** → `"R$ 123,45"` (exibido no input)
3. **Valor real armazenado** → `123.45` (número sem formatação)
4. **Salvo no banco** → Valor numérico puro

### Vantagens:

- ✅ **UX Melhorada**: Usuário vê formatação em tempo real
- ✅ **Dados Limpos**: Valores salvos sem formatação no banco
- ✅ **Validação Visual**: Usuário entende o formato esperado
- ✅ **Menos Erros**: Formatação automática reduz erros de digitação

---

## 🔧 Funções Utilitárias Disponíveis

### Aplicar Máscaras:
```typescript
import { maskCurrency, maskMileage, maskPlate, maskDate, maskPhone, maskYear } from '@/utils/masks'

const formattedValue = maskCurrency('12345') // "R$ 123,45"
const formattedMileage = maskMileage('50000') // "50.000"
```

### Remover Máscaras:
```typescript
import { unmaskCurrency, unmaskMileage } from '@/utils/masks'

const rawValue = unmaskCurrency('R$ 123,45') // 123.45
const rawMileage = unmaskMileage('50.000') // 50000
```

### Formatar/Parsear Datas:
```typescript
import { formatDate, parseDate, isValidDate } from '@/utils/masks'

const formatted = formatDate(new Date()) // "25/12/2024"
const date = parseDate('25/12/2024') // Date object
const valid = isValidDate('25/12/2024') // true
```

---

## 🚀 Próximos Passos (Opcional)

- [ ] Adicionar máscara de CPF/CNPJ se necessário
- [ ] Adicionar máscara de CEP para endereços
- [ ] Adicionar validação em tempo real (ex: data inválida)
- [ ] Adicionar feedback visual de erro nas máscaras

---

## ✅ Status

- ✅ Máscaras implementadas
- ✅ Componente Input atualizado
- ✅ Formulário de veículo atualizado
- ✅ Formulário de manutenção atualizado
- ✅ Build passando sem erros
- ✅ TypeScript sem erros

---

**Criado em:** 12 de outubro de 2025  
**Versão:** 1.0.0  
**Última atualização:** Implementação completa de máscaras

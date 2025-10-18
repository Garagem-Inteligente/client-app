# 🧪 Guia de Teste - Página de Detalhes do Veículo

## ✅ Correção Aplicada

### 🐛 Problema:
- Ao clicar no card do veículo, a página de detalhes não abria
- O evento `@click` no `ion-card` não estava funcionando corretamente

### ✅ Solução:
- Criado método `handleViewDetails(vehicleId)` para navegação explícita
- Atualizado template para usar o método ao invés de `$router.push` inline
- Adicionado `console.log` para debug

---

## 🧪 Como Testar

### 1. **Iniciar o Servidor**
```bash
cd Garagem-inteligente/App-client/app-client
pnpm run dev
```

### 2. **Abrir no Navegador**
```
http://localhost:5173
```

### 3. **Fazer Login**
- Email e senha do usuário teste

### 4. **Testar Navegação para Detalhes**

#### **Opção A: Pela Página de Veículos**
1. Clicar na tab "Veículos" (barra inferior)
2. Clicar em qualquer card de veículo
3. ✅ **Deve abrir a página de detalhes**
4. Verificar console do navegador (F12) - deve aparecer: `Navigating to vehicle: [id]`

#### **Opção B: Pelo Dashboard**
1. Na home/dashboard
2. Rolar até "Meus Veículos"
3. Clicar em um veículo da lista
4. ✅ **Deve abrir a página de detalhes**

---

## 📋 Checklist de Verificação

### ✅ Página de Detalhes Deve Exibir:

**Header:**
- [ ] Botão voltar (←)
- [ ] Título "Detalhes do Veículo"
- [ ] Botão editar (✏️)
- [ ] Botão excluir (🗑️)

**Informações do Veículo:**
- [ ] Marca e Modelo em destaque
- [ ] Badge com tipo de combustível
- [ ] Ano, Placa, Cor
- [ ] Botão "Nova Manutenção"

**5 Tabs:**
- [ ] **📋 Informações** - Default ativa
  - [ ] 4 Cards de estatísticas (quilometragem, manutenções, custos, próxima)
  - [ ] Card "Informações do Veículo"
  - [ ] Card "Seguro" (clicável)
  - [ ] Card "Próximas Manutenções"

- [ ] **🔧 Manutenções**
  - [ ] Botão "Registrar Manutenção"
  - [ ] Histórico completo de manutenções
  - [ ] Cards com data, km, custo
  - [ ] Empty state se não houver

- [ ] **📊 Estatísticas**
  - [ ] Gráfico de linha (custos mensais)
  - [ ] Gráfico de donut (custos por tipo)
  - [ ] Gráfico de barras (preventiva vs corretiva)
  - [ ] Resumo estatístico
  - [ ] Tab desabilitada se não houver dados

- [ ] **📄 Documentos**
  - [ ] Seção CRLV
  - [ ] Seção Apólice de Seguro
  - [ ] Botão "Adicionar" se vazio
  - [ ] Preview e ações se existir

- [ ] **🛡️ Seguro**
  - [ ] Status colorido (vencido/em dia/renovar)
  - [ ] Todas informações do seguro
  - [ ] Botão "Editar Informações"

**Tab Bar (Barra Inferior):**
- [ ] Persistente em todas as tabs
- [ ] Navegação funcional

---

## 🐛 Se Ainda Não Funcionar

### **1. Limpar Cache do Navegador**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### **2. Verificar Console do Navegador**
- Abrir DevTools (F12)
- Ir para Console
- Procurar por erros em vermelho
- Procurar por: `Navigating to vehicle: [id]`

**Se aparecer o log:**
- ✅ O clique está funcionando
- ❌ Pode ser problema na rota

**Se NÃO aparecer o log:**
- ❌ O clique não está funcionando
- Verificar se há erro JavaScript

### **3. Verificar a Rota no Router**
```typescript
// src/router/index.ts
{
  path: 'vehicle/:id',
  component: () => import('@/views/VehicleDetailPage.vue')
}
```

### **4. Verificar se há Veículos Cadastrados**
- A página de veículos deve mostrar cards
- Se não houver, cadastrar um veículo novo

### **5. Hard Reload do Servidor**
```bash
# Parar o servidor (Ctrl+C)
cd Garagem-inteligente/App-client/app-client
pnpm run dev
```

### **6. Rebuild Completo**
```bash
cd Garagem-inteligente/App-client/app-client
rm -rf node_modules dist
pnpm install
pnpm run dev
```

---

## 🔍 Debug Avançado

### **1. Verificar IDs dos Veículos**
No console do navegador:
```javascript
// Na página de veículos, executar:
console.log('Vehicles:', JSON.parse(JSON.stringify(vehiclesStore.vehicles)))
```

### **2. Verificar Store**
```javascript
// Verificar se os veículos estão carregados
console.log('Vehicle count:', vehiclesStore.vehicleCount)
console.log('All vehicles:', vehiclesStore.vehicles)
```

### **3. Testar Navegação Manual**
No console do navegador:
```javascript
// Substituir 'ID_DO_VEICULO' pelo ID real
router.push('/tabs/vehicle/ID_DO_VEICULO')
```

### **4. Verificar Build**
```bash
cd Garagem-inteligente/App-client/app-client
pnpm run build
# Deve completar sem erros
```

---

## ✅ Resultado Esperado

Ao clicar em um card de veículo:

1. **Console deve mostrar:**
   ```
   Navigating to vehicle: abc123def456
   ```

2. **URL deve mudar para:**
   ```
   http://localhost:5173/tabs/vehicle/[ID]
   ```

3. **Página deve exibir:**
   - Header com informações do veículo
   - 5 Tabs disponíveis
   - Tab "Informações" ativa por padrão
   - Todos os dados do veículo

4. **Tab Bar deve:**
   - Permanecer visível na parte inferior
   - Continuar funcional (pode navegar para outras seções)

---

## 📱 Teste em Dispositivo Móvel

### **Opção 1: Ionic DevApp**
```bash
pnpm run dev --host
# Abrir Ionic DevApp no celular
# Conectar ao servidor
```

### **Opção 2: Browser do Celular**
```bash
# 1. Descobrir IP do PC
ip addr show | grep inet

# 2. Rodar com host
pnpm run dev --host

# 3. No celular, acessar
http://[SEU_IP]:5173
```

### **Opção 3: Build Nativo (Android)**
```bash
pnpm run build
npx cap sync android
npx cap open android
# Rodar no Android Studio
```

---

## 🎯 Sucesso!

Se você conseguiu:
- ✅ Clicar no card do veículo
- ✅ Ver a página de detalhes
- ✅ Ver o console.log com o ID
- ✅ Navegar entre as tabs
- ✅ Ver os gráficos (se houver dados)
- ✅ Tab bar continua funcionando

**🎉 Tudo está funcionando perfeitamente!**

---

## 📞 Próximos Passos

Se tudo estiver funcionando:
1. ✅ Testar todas as funcionalidades de cada tab
2. ✅ Testar upload de documentos
3. ✅ Testar edição de veículo
4. ✅ Testar exclusão de veículo
5. ✅ Testar navegação para nova manutenção
6. ✅ Testar em dispositivo móvel real


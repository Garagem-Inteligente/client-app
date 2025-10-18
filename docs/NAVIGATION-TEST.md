# 🧪 Guia de Teste - Navegação para Cadastro de Veículos

## ✅ Status: Todas as Rotas Funcionando

### 📍 Caminhos para Adicionar Veículo

#### 1. **HomePage (Dashboard)**
```
Caminho: /tabs/home
Botões:
  - "Adicionar Veículo" (Quick Action Card)
  - "Adicionar primeiro veículo" (Empty State)

Destino: /tabs/vehicle/new
```

#### 2. **VehiclesPage (Lista de Veículos)**
```
Caminho: /tabs/vehicles
Botões:
  - "+" no header (canto superior direito)
  - "Adicionar primeiro veículo" (Empty State)
  - "Adicionar Veículo" (Empty State alternativo)

Destino: /tabs/vehicle/new
```

#### 3. **Editar Veículo Existente**
```
Caminho: /tabs/vehicles
Ação: Clicar no card do veículo → Clicar em "Editar"

Destino: /tabs/vehicle/:id
```

---

## 🔍 Como Testar

### 1. **Iniciar o Servidor de Desenvolvimento**
```bash
cd Garagem-inteligente/App-client/app-client
pnpm run dev
```

### 2. **Abrir no Navegador**
```
http://localhost:5173
```

### 3. **Testar Fluxos**

#### ✅ Fluxo 1: Dashboard → Adicionar
1. Login na aplicação
2. Ir para Dashboard (`/tabs/home`)
3. Clicar em "Adicionar Veículo" (card azul)
4. ✅ Deve abrir o formulário de cadastro

#### ✅ Fluxo 2: Lista de Veículos → Adicionar
1. Ir para "Meus Veículos" (`/tabs/vehicles`)
2. Clicar no botão "+" no header
3. ✅ Deve abrir o formulário de cadastro

#### ✅ Fluxo 3: Empty State → Adicionar
1. Se não houver veículos cadastrados
2. Clicar em "Adicionar primeiro veículo"
3. ✅ Deve abrir o formulário de cadastro

#### ✅ Fluxo 4: Editar Veículo
1. Na lista de veículos, clicar em um card
2. Clicar em "Editar"
3. ✅ Deve abrir o formulário em modo edição

---

## 🐛 Troubleshooting

### Problema: "Botão não responde"

**Possíveis Causas:**
1. Cache do navegador desatualizado
2. Hot reload não funcionou
3. Erro de JavaScript no console

**Soluções:**
```bash
# 1. Limpar cache e recarregar
Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

# 2. Parar e reiniciar o servidor
Ctrl+C
pnpm run dev

# 3. Limpar node_modules e reinstalar
rm -rf node_modules
pnpm install
pnpm run dev

# 4. Verificar console do navegador (F12)
# Procurar por erros em vermelho
```

### Problema: "Página em branco"

**Verificar:**
1. Abrir DevTools (F12)
2. Ir para Console
3. Verificar erros de importação ou sintaxe

**Se houver erro de importação:**
```bash
# Rebuild completo
pnpm run build
pnpm run dev
```

---

## 📋 Checklist de Verificação

### Antes de Testar
- [ ] Servidor rodando (`pnpm run dev`)
- [ ] Navegador aberto em `localhost:5173`
- [ ] Usuário logado na aplicação
- [ ] Console do navegador aberto (F12)

### Durante o Teste
- [ ] Dashboard carrega corretamente
- [ ] Lista de veículos carrega
- [ ] Botão "+" está visível
- [ ] Quick Actions estão visíveis
- [ ] Não há erros no console

### Ao Clicar no Botão
- [ ] URL muda para `/tabs/vehicle/new`
- [ ] Formulário aparece na tela
- [ ] Campo "Marca" está visível
- [ ] Alert azul "Use os campos de busca..." aparece
- [ ] Tab bar (barra inferior) está visível
- [ ] Botão voltar funciona

---

## 🎯 Resultado Esperado

### Formulário de Cadastro Deve Exibir:

```
┌─────────────────────────────────────┐
│ ← Adicionar Veículo                 │
├─────────────────────────────────────┤
│                                     │
│ ℹ️ Use os campos de busca abaixo   │
│    para encontrar seu veículo na    │
│    tabela FIPE                      │
│                                     │
│ Marca *                             │
│ [Digite para buscar a marca...]     │
│                                     │
│ Modelo *                            │
│ [Selecione primeiro a marca...]     │
│                                     │
│ Ano *                               │
│ [Selecione primeiro o modelo...]    │
│                                     │
│ Placa *                             │
│ [ABC-1234]                          │
│                                     │
│ ... (mais campos)                   │
│                                     │
│ [Cancelar] [Adicionar]              │
│                                     │
├─────────────────────────────────────┤
│ 🏠 Veículos Serviços Perfil        │
└─────────────────────────────────────┘
```

---

## 🔧 Configuração das Rotas

### Router Configuration
```typescript
// src/router/index.ts
{
  path: '/tabs/',
  component: TabsPage,
  children: [
    { path: 'home', component: HomePage },
    { path: 'vehicles', component: VehiclesPage },
    { path: 'vehicle/new', component: VehicleFormPage }, // ← CRIAR
    { path: 'vehicle/:id', component: VehicleFormPage }, // ← EDITAR
  ]
}
```

### VehicleFormPage Logic
```typescript
const isEdit = computed(() => 
  !!route.params.id && route.params.id !== 'new'
)

// route = /tabs/vehicle/new → isEdit = false ✅
// route = /tabs/vehicle/123 → isEdit = true ✅
```

---

## 📱 Teste em Dispositivo Móvel

### Opção 1: Ionic DevApp (Mais Fácil)
```bash
# 1. Instalar Ionic DevApp no celular
# iOS: App Store
# Android: Play Store

# 2. Garantir que PC e celular estão na mesma rede

# 3. Rodar o servidor
pnpm run dev

# 4. Abrir Ionic DevApp e conectar
```

### Opção 2: Browser no Celular
```bash
# 1. Descobrir IP do PC
ip addr show | grep inet

# 2. Rodar servidor com host
pnpm run dev --host

# 3. No celular, acessar
http://192.168.x.x:5173
```

### Opção 3: Capacitor (Nativo)
```bash
# Android
pnpm run build
npx cap sync android
npx cap open android

# iOS (requer Mac)
pnpm run build
npx cap sync ios
npx cap open ios
```

---

## ✅ Sucesso!

Se você conseguiu:
- ✅ Clicar no botão "Adicionar Veículo"
- ✅ Ver o formulário aparecer
- ✅ Campos de busca FIPE funcionando
- ✅ Tab bar visível
- ✅ Botão voltar funcionando

**🎉 Tudo está funcionando corretamente!**

---

## 📞 Suporte

Se ainda estiver com problemas:
1. Verificar console do navegador (F12)
2. Copiar mensagem de erro
3. Verificar se o servidor está rodando
4. Tentar em modo anônimo (Ctrl+Shift+N)
5. Limpar cache e cookies


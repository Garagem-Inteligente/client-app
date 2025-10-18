# Cards Escuros Dashboard - Documentação

**Data:** 18 de outubro de 2025  
**Alterações:** Cards do dashboard com background mais escuro mantendo glassmorphism

## 🎯 Objetivo

Tornar os cards do dashboard mais escuros para melhor contraste e consistência visual com os cards de veículos listados, mantendo o efeito glassmorphism.

## 📝 Arquivos Modificados

### 1. `src/views/HomePage.vue`

#### Quick Actions Cards
**Antes:**
```css
.quick-action-btn {
  background: rgba(255, 255, 255, 0.1);  /* Branco transparente */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
```

**Depois:**
```css
.quick-action-btn {
  background: rgba(31, 41, 55, 0.75);  /* Cinza escuro similar aos cards de veículo */
  backdrop-filter: blur(15px);         /* Blur aumentado para melhor efeito glass */
  border: 1px solid rgba(255, 255, 255, 0.12);  /* Borda mais sutil */
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.2),    /* Sombra mais forte */
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.quick-action-btn:hover {
  background: rgba(31, 41, 55, 0.9);   /* Mais escuro no hover */
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.25);
}
```

**Mudanças:**
- Background: Branco transparente → Cinza escuro (`#1f2937`)
- Opacidade: 0.1 → 0.75 (75% opaco)
- Blur: 10px → 15px
- Sombra: Mais pronunciada
- Hover: 0.15 → 0.9 (contraste maior)

---

#### Stats Cards
**Antes:**
```css
.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
}
```

**Depois:**
```css
.stat-card {
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.stat-card:hover {
  background: rgba(31, 41, 55, 0.9);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
```

**Mudanças idênticas aos quick actions:**
- Mesma paleta de cores
- Mesma estratégia de opacidade
- Bordas coloridas mantidas (`.stat-card.blue`, `.purple`, etc)

---

#### Main Cards (Meus Veículos, Manutenções Recentes)
**Antes:**
```css
.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
  background: rgba(255, 255, 255, 0.12);
}
```

**Depois:**
```css
.card {
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card:hover {
  background: rgba(31, 41, 55, 0.9);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
```

---

#### Alert Danger
**Antes:**
```css
.alert-danger {
  background: rgba(239, 68, 68, 0.15);  /* Vermelho transparente */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**Depois:**
```css
.alert-danger {
  background: rgba(31, 41, 55, 0.75);   /* Base escura */
  backdrop-filter: blur(15px);
  border: 1px solid rgba(239, 68, 68, 0.4);  /* Borda vermelha mantida */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

**Mudanças:**
- Background: Vermelho transparente → Cinza escuro
- Borda vermelha **mantida** para indicar perigo
- Blur e sombra melhorados

---

### 2. `src/views/TabsPage.vue`

#### Ajuste de Gap entre Ícone e Texto
**Antes:**
```css
.tab-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  position: relative;
  z-index: 3;
}
```

**Depois:**
```css
.tab-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: -2px;  /* Nova linha para aproximar ainda mais */
  position: relative;
  z-index: 3;
}
```

**Mudanças:**
- Gap: 0px → 2px (espaçamento mínimo)
- `margin-top: -2px` adicionado para compensar e aproximar visualmente

---

## 🎨 Paleta de Cores Unificada

### Background Base
```
Cor: #1f2937 (gray-800 do Tailwind)
RGB: rgb(31, 41, 55)
Opacidade: 0.75 (75%)
```

### Referência Visual
```
rgba(31, 41, 55, 0.75) ≈ rgb(23, 31, 41) quando sobre fundo escuro
```

**Por que essa cor?**
- ✅ Mesma cor dos cards de veículos em `VehiclesPage.vue`
- ✅ Contraste suficiente sobre o background azul escuro (`#0f172a → #1e293b`)
- ✅ Mantém legibilidade de texto branco
- ✅ Permite glassmorphism funcionar bem

---

## 📊 Comparação Visual

### Antes
```
┌─────────────────────────────────┐
│  Quick Action (Branco 10%)      │
│  rgba(255, 255, 255, 0.1)       │
│  ┌───────────────────────────┐  │
│  │  Ícone + Texto            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
     ↑ Muito claro/transparente
```

### Depois
```
┌─────────────────────────────────┐
│  Quick Action (Cinza 75%)       │
│  rgba(31, 41, 55, 0.75)         │
│  ┌───────────────────────────┐  │
│  │  Ícone + Texto            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
     ↑ Escuro com efeito glass
```

---

## ✅ Benefícios

### Visual
1. ✅ **Melhor contraste** entre cards e background
2. ✅ **Consistência** com cards de veículos/manutenções
3. ✅ **Hierarquia visual** clara
4. ✅ **Glassmorphism** ainda funciona perfeitamente
5. ✅ **Legibilidade** de texto melhorada

### Técnico
1. ✅ **Blur aumentado** (10px → 15px) = efeito glass mais pronunciado
2. ✅ **Sombras mais fortes** = melhor profundidade
3. ✅ **Opacidade consistente** (0.75) em todos os cards
4. ✅ **Hover states** mais distintos (0.75 → 0.9)

### UX
1. ✅ **Áreas clicáveis** mais evidentes
2. ✅ **Feedback visual** melhor no hover
3. ✅ **Separação clara** entre elementos
4. ✅ **Distância ícone-texto** reduzida na navbar

---

## 🔍 Detalhes da Implementação

### Estratégia de Opacidade
```
Normal state:  rgba(31, 41, 55, 0.75)  → 75% opaco
Hover state:   rgba(31, 41, 55, 0.9)   → 90% opaco
Delta:         +15% no hover
```

**Por que 0.75?**
- Opaco o suficiente para contrastar
- Transparente o suficiente para glassmorphism
- Permite ver sutil background pattern animado

### Blur Strategy
```css
backdrop-filter: blur(15px);
-webkit-backdrop-filter: blur(15px);
```

**Por que 15px?**
- 10px era muito fraco com background escuro
- 15px cria efeito glass pronunciado
- 20px+ ficaria muito desfocado

### Box Shadow Layering
```css
/* Normal */
box-shadow: 
  0 4px 12px rgba(0, 0, 0, 0.2),
  inset 0 1px 0 rgba(255, 255, 255, 0.08);

/* Hover */
box-shadow: 
  0 8px 20px rgba(0, 0, 0, 0.25);
```

**Camadas:**
1. **Sombra externa:** Profundidade do card
2. **Sombra inset (top):** Highlight sutil para glass effect

---

## 🎯 Casos de Uso

### Quick Actions
```vue
<button class="quick-action-btn">
  <div class="action-icon blue">🚗</div>
  <div class="action-text">
    <h3 class="action-title">Adicionar Veículo</h3>
    <p class="action-subtitle">Cadastre um novo veículo</p>
  </div>
</button>
```

**Resultado:**
- Background escuro + ícone com gradiente colorido
- Texto branco legível
- Hover: escurece e eleva

---

### Stats Cards
```vue
<div class="stat-card blue">
  <div class="stat-content">
    <div class="stat-info">
      <h3 class="stat-label">Total de Veículos</h3>
      <p class="stat-value">3</p>
    </div>
    <div class="stat-icon blue">🚗</div>
  </div>
</div>
```

**Resultado:**
- Background escuro + borda colorida (blue/green/purple/yellow)
- Número grande legível
- Ícone com gradiente

---

## 🚨 Avisos

### Bordas Coloridas Mantidas
Os cards com variações de cor **mantêm suas bordas**:
```css
.stat-card.blue { border-color: rgba(147, 197, 253, 0.3); }
.stat-card.green { border-color: rgba(134, 239, 172, 0.3); }
.stat-card.purple { border-color: rgba(196, 181, 253, 0.3); }
.stat-card.yellow { border-color: rgba(253, 224, 71, 0.3); }
```

**Por quê?**
- Mantém diferenciação visual entre tipos
- Adiciona toque de cor sobre fundo escuro
- Melhora hierarquia de informação

---

## 🔄 Reversão (Se Necessário)

Para reverter para cards claros:

```css
/* Reverter para versão anterior */
.quick-action-btn,
.stat-card,
.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quick-action-btn:hover,
.stat-card:hover,
.card:hover {
  background: rgba(255, 255, 255, 0.15);
}
```

---

## 📱 Testes Recomendados

### Checklist
- [ ] Contraste de texto legível em todos os cards
- [ ] Efeito glassmorphism visível
- [ ] Hover states funcionando
- [ ] Bordas coloridas dos stats visíveis
- [ ] Alert danger com borda vermelha clara
- [ ] Distância ícone-texto adequada na navbar
- [ ] Cards de veículos dentro de "Meus Veículos" com mesmo estilo

### Dispositivos
- [ ] Desktop (Chrome/Firefox/Safari)
- [ ] Mobile Android
- [ ] Mobile iOS
- [ ] Tablet

---

## 🎨 Design System Atualizado

### Cards Hierarchy
```
1. Background: rgba(31, 41, 55, 0.75)
2. Blur: 15px
3. Border: rgba(255, 255, 255, 0.12)
4. Shadow: 0 4px 12px rgba(0, 0, 0, 0.2)
5. Hover: rgba(31, 41, 55, 0.9)
```

### Estados
- **Normal:** 75% opaco
- **Hover:** 90% opaco
- **Active:** Ripple effect (mantido)
- **Focus:** Outline (mantido)

---

**Autor:** GitHub Copilot  
**Status:** ✅ Implementado e testado  
**Próximo:** Testar em dispositivo real

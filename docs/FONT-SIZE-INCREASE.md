# Aumento Global de Font-Size - Documentação

**Data:** 18 de outubro de 2025  
**Alterações:** Font-size base aumentado de 16px para 18px (+2px) em todo o projeto

## 🎯 Objetivo

Melhorar a legibilidade aumentando o tamanho das fontes em todo o aplicativo de forma consistente e proporcional.

## 📝 Arquivo Modificado

### `src/theme/variables.css`

## 🔧 Implementação

### 1. Font-Size Base Global

**Adicionado no início do arquivo:**

```css
/** Global Font Size Configuration **/
html {
  /* Base font size - increased by 2px (16px -> 18px) */
  font-size: 18px;
}

body {
  font-size: 18px;
}
```

**Impacto:**
- Toda a aplicação agora usa **18px como base** ao invés de 16px
- Todos os valores em **rem** são calculados a partir de 18px
- Percentuais e valores relativos também seguem essa base

---

### 2. Variáveis de Font-Size Customizadas

**Adicionadas ao `:root`:**

```css
/** Custom Font Sizes - Base increased by 2px (16px -> 18px) **/
--font-size-xs: 0.75rem;      /* 13.5px (was 12px) */
--font-size-sm: 0.875rem;     /* 15.75px (was 14px) */
--font-size-base: 1rem;       /* 18px (was 16px) */
--font-size-md: 1.125rem;     /* 20.25px (was 18px) */
--font-size-lg: 1.25rem;      /* 22.5px (was 20px) */
--font-size-xl: 1.5rem;       /* 27px (was 24px) */
--font-size-2xl: 1.875rem;    /* 33.75px (was 30px) */
--font-size-3xl: 2.25rem;     /* 40.5px (was 36px) */
```

**Como usar nas páginas:**
```css
.my-component {
  font-size: var(--font-size-md); /* 20.25px */
}
```

---

### 3. Aplicação Global em Componentes Ionic

**Adicionado no final do arquivo:**

```css
/* Apply increased font size to Ionic components */
ion-app,
ion-page,
ion-content,
ion-header,
ion-toolbar,
ion-title,
ion-button,
ion-label,
ion-item,
ion-card,
ion-card-header,
ion-card-title,
ion-card-subtitle,
ion-card-content,
ion-list,
ion-list-header,
ion-note,
ion-text,
ion-badge,
ion-chip {
  font-size: inherit;
}

/* Ensure all text inherits the base 18px */
p, span, div, a, button, input, textarea, select, label {
  font-size: inherit;
}
```

**Resultado:**
- Todos os componentes do Ionic herdam o font-size base
- Consistência entre componentes nativos e customizados
- Sem necessidade de override manual

---

### 4. Ajustes Específicos

#### Tab Bar Labels
```css
ion-tab-button ion-label {
  font-size: 0.75rem; /* 13.5px - slightly larger than before (12px) */
}
```

**Antes:** 12px  
**Depois:** 13.5px (+1.5px)

#### Placeholders
```css
::placeholder {
  font-size: inherit;
  opacity: 0.7;
}
```

---

## 📊 Comparação de Tamanhos

| Uso | Valor rem | Antes (16px base) | Depois (18px base) | Aumento |
|-----|-----------|-------------------|---------------------|---------|
| **Extra Small** | 0.75rem | 12px | 13.5px | +1.5px |
| **Small** | 0.875rem | 14px | 15.75px | +1.75px |
| **Base** | 1rem | 16px | **18px** | **+2px** |
| **Medium** | 1.125rem | 18px | 20.25px | +2.25px |
| **Large** | 1.25rem | 20px | 22.5px | +2.5px |
| **Extra Large** | 1.5rem | 24px | 27px | +3px |
| **2XL** | 1.875rem | 30px | 33.75px | +3.75px |
| **3XL** | 2.25rem | 36px | 40.5px | +4.5px |

**Padrão de aumento:**
- Textos pequenos: +1.5px a +2px
- Textos médios: +2px a +2.5px
- Textos grandes: +3px a +4.5px

**Proporção mantida:** ✅ O aumento é proporcional, mantendo a hierarquia visual

---

## 🎨 Impacto Visual por Componente

### Dashboard (HomePage)

#### Antes:
```css
.welcome-text { font-size: 1.125rem; }  /* 18px */
.section-title { font-size: 1rem; }     /* 16px */
.action-title { font-size: 0.8125rem; } /* 13px */
.stat-value { font-size: 1.625rem; }    /* 26px */
```

#### Depois:
```css
.welcome-text { font-size: 1.125rem; }  /* 20.25px - +2.25px */
.section-title { font-size: 1rem; }     /* 18px - +2px */
.action-title { font-size: 0.8125rem; } /* 14.6px - +1.6px */
.stat-value { font-size: 1.625rem; }    /* 29.25px - +3.25px */
```

---

### Navbar (TabsPage)

#### Antes:
```css
ion-tab-button ion-label { font-size: 12px; }
```

#### Depois:
```css
ion-tab-button ion-label { font-size: 0.75rem; } /* 13.5px - +1.5px */
```

---

### Cards de Veículos (VehiclesPage)

#### Antes:
```css
.vehicle-title { font-size: 1.125rem; }    /* 18px */
.vehicle-label { font-size: 0.875rem; }    /* 14px */
```

#### Depois:
```css
.vehicle-title { font-size: 1.125rem; }    /* 20.25px - +2.25px */
.vehicle-label { font-size: 0.875rem; }    /* 15.75px - +1.75px */
```

---

### Login/Register (Auth Pages)

#### Antes:
```css
.brand-title { font-size: 2rem; }          /* 32px */
.brand-subtitle { font-size: 0.938rem; }   /* 15px */
.form-label { font-size: 0.875rem; }       /* 14px */
```

#### Depois:
```css
.brand-title { font-size: 2rem; }          /* 36px - +4px */
.brand-subtitle { font-size: 0.938rem; }   /* 16.9px - +1.9px */
.form-label { font-size: 0.875rem; }       /* 15.75px - +1.75px */
```

---

## ✅ Benefícios

### Legibilidade
1. ✅ **Texto mais legível** em dispositivos móveis
2. ✅ **Menos esforço visual** para leitura prolongada
3. ✅ **Melhor acessibilidade** para usuários com dificuldades visuais
4. ✅ **Contraste mantido** entre níveis de hierarquia

### Consistência
1. ✅ **Base única** (18px) para toda a aplicação
2. ✅ **Proporções mantidas** - hierarquia visual preservada
3. ✅ **Variáveis CSS** para fácil manutenção
4. ✅ **Componentes Ionic** seguem o padrão

### Técnico
1. ✅ **Valores em rem** - escaláveis e acessíveis
2. ✅ **Herança CSS** - menos código duplicado
3. ✅ **Variáveis customizadas** - fácil ajuste futuro
4. ✅ **Sem breaking changes** - tudo ajusta automaticamente

---

## 🔍 Como Funciona a Herança

### Fluxo de Font-Size

```
html (18px base)
  ↓
body (18px)
  ↓
ion-app (inherit = 18px)
  ↓
ion-page (inherit = 18px)
  ↓
ion-content (inherit = 18px)
    ↓
  .dashboard-container (inherit = 18px)
      ↓
    .card (inherit = 18px)
        ↓
      p { font-size: 1rem } → 18px
      h2 { font-size: 1.5rem } → 27px
      small { font-size: 0.875rem } → 15.75px
```

**Todos os valores rem são multiplicados por 18px ao invés de 16px**

---

## 🚨 Casos Especiais

### Componentes com Font-Size Fixo

Alguns componentes podem ter font-size em **px** fixo. Exemplo:

```css
/* ANTES - Não escala */
.my-component {
  font-size: 14px; /* Sempre 14px */
}

/* DEPOIS - Escala com base */
.my-component {
  font-size: 0.875rem; /* 15.75px com base 18px */
}
```

**Recomendação:** Sempre usar **rem** para font-size

---

### Ícones

Ícones geralmente têm tamanhos específicos e não devem escalar automaticamente:

```css
/* Ícones mantêm tamanho específico */
.icon {
  width: 24px;
  height: 24px;
  font-size: 24px; /* Não usa rem */
}
```

---

### Inputs e Placeholders

```css
ion-input,
ion-textarea {
  font-size: inherit; /* Herda 18px */
}

::placeholder {
  font-size: inherit; /* Herda 18px */
  opacity: 0.7;
}
```

**Resultado:** Inputs agora têm texto mais legível

---

## 🔄 Reversão (Se Necessário)

Para voltar ao tamanho padrão (16px):

```css
/* Reverter em variables.css */
html {
  font-size: 16px; /* Volta ao padrão do navegador */
}

body {
  font-size: 16px;
}
```

**Ou simplesmente remover essas linhas** (navegador usa 16px por padrão)

---

## 📱 Testes Recomendados

### Checklist Visual
- [ ] Textos legíveis em todas as páginas
- [ ] Hierarquia visual mantida (títulos > texto > labels)
- [ ] Botões com texto legível
- [ ] Inputs e placeholders claros
- [ ] Cards não quebrados
- [ ] Navbar proporcional
- [ ] Modals e alerts legíveis

### Páginas para Testar
- [ ] **HomePage** - Dashboard com stats e quick actions
- [ ] **LoginPage** - Formulário de login
- [ ] **RegisterPage** - Formulário de cadastro
- [ ] **VehiclesPage** - Lista de veículos
- [ ] **VehicleFormPage** - Formulário de veículo
- [ ] **VehicleDetailPage** - Detalhes do veículo
- [ ] **MaintenancePage** - Lista de manutenções
- [ ] **MaintenanceFormPage** - Formulário de manutenção
- [ ] **ProfilePage** - Perfil do usuário
- [ ] **TabsPage** - Navbar inferior

### Dispositivos
- [ ] **Desktop** - Chrome, Firefox, Safari
- [ ] **Mobile** - Android (Chrome)
- [ ] **Mobile** - iOS (Safari)
- [ ] **Tablet** - iPad, Android tablet

---

## 🎯 Ajustes Futuros

Se precisar ajustar novamente, basta alterar uma linha:

```css
html {
  font-size: 17px;  /* Para +1px ao invés de +2px */
  /* ou */
  font-size: 19px;  /* Para +3px */
  /* ou */
  font-size: 20px;  /* Para +4px */
}
```

**Toda a aplicação ajusta automaticamente!**

---

## 📐 Design System Atualizado

### Typography Scale
```
3XL:  2.25rem  = 40.5px   - Hero titles
2XL:  1.875rem = 33.75px  - Page titles
XL:   1.5rem   = 27px     - Section headers
LG:   1.25rem  = 22.5px   - Card titles
MD:   1.125rem = 20.25px  - Subheadings
BASE: 1rem     = 18px     - Body text ⭐
SM:   0.875rem = 15.75px  - Small text
XS:   0.75rem  = 13.5px   - Captions, labels
```

### Uso Recomendado
- **Hero titles:** `font-size: var(--font-size-3xl)`
- **Page titles:** `font-size: var(--font-size-2xl)`
- **Section headers:** `font-size: var(--font-size-xl)`
- **Card titles:** `font-size: var(--font-size-lg)`
- **Body text:** `font-size: var(--font-size-base)` ou apenas `font-size: 1rem`
- **Small text:** `font-size: var(--font-size-sm)`
- **Labels/captions:** `font-size: var(--font-size-xs)`

---

## 🔗 Arquivos Relacionados

### Modificados
- ✅ `src/theme/variables.css` - Font-size base e variáveis

### Impactados Automaticamente
- ✅ Todas as páginas `.vue` que usam `rem`
- ✅ Todos os componentes do Ionic
- ✅ Todos os estilos globais
- ✅ Cards, botões, inputs, labels
- ✅ Modals, alerts, toasts

### Não Impactados (por design)
- ❌ Ícones com tamanho fixo em `px`
- ❌ Espaçamentos (`padding`, `margin`) em `px`
- ❌ Bordas (`border-width`) em `px`
- ❌ Sombras (`box-shadow`) - usa `px`

---

**Autor:** GitHub Copilot  
**Status:** ✅ Implementado com sucesso  
**Base anterior:** 16px  
**Base atual:** 18px (+2px / +12.5%)  
**Método:** Escalamento proporcional via `rem`

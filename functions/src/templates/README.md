# 📧 Email Templates - AutoCare

Templates HTML responsivos e compatíveis com todos os principais clientes de email.

## 🎨 Templates Disponíveis

### 1. **Welcome Email** - Email de Boas-Vindas
📄 `welcomeEmail.ts`

**Quando enviar:** Imediatamente após registro do usuário

**Objetivo:** Apresentar a plataforma e suas funcionalidades

**Elementos:**
- Cabeçalho azul com gradiente
- Lista de funcionalidades principais
- CTA para Dashboard
- Dica de início rápido
- Links de suporte

---

### 2. **Transfer Owner Email** - Transferência (Proprietário)
📄 `transferOwnerEmail.ts`

**Quando enviar:** Quando usuário inicia transferência de veículo

**Objetivo:** Fornecer código de transferência para compartilhar

**Elementos:**
- Código de 6 dígitos em destaque
- Instruções passo-a-passo
- Alerta de expiração (24h)
- Tabela com detalhes do veículo
- Link para acompanhar status

**Dados necessários:**
```typescript
{
  ownerName: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  transferCode: string
}
```

---

### 3. **Transfer Receiver Email** - Transferência (Receptor)
📄 `transferReceiverEmail.ts`

**Quando enviar:** Quando receptor recebe transferência

**Objetivo:** Instruir como aceitar o veículo

**Elementos:**
- Cabeçalho verde (positivo)
- Código em destaque para aceitar
- Instruções de aceitação
- Informações sobre histórico incluído
- Opção de recusar/reportar

**Dados necessários:**
```typescript
{
  ownerName: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  transferCode: string
}
```

---

### 4. **Maintenance Due Email** - Manutenção Próxima
📄 `maintenanceDueEmail.ts`

**Quando enviar:** 7 dias antes da data de manutenção

**Objetivo:** Lembrar usuário de agendar manutenção

**Elementos:**
- Cabeçalho laranja (aviso)
- Contador de dias restantes
- Benefícios da manutenção preventiva
- CTA para ver detalhes
- Link para gerenciar notificações

**Dados necessários:**
```typescript
{
  userName: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  maintenanceType: string
  dueDate: string
  daysUntilDue: number
}
```

---

### 5. **Maintenance Overdue Email** - Manutenção Atrasada
📄 `maintenanceOverdueEmail.ts`

**Quando enviar:** Quando manutenção não é feita na data

**Objetivo:** Alertar urgência de manutenção atrasada

**Elementos:**
- Cabeçalho vermelho (urgente)
- Contador de dias de atraso
- Consequências de adiar
- CTA urgente para agendar
- Links para oficinas

**Dados necessários:**
```typescript
{
  userName: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  maintenanceType: string
  dueDate: string
  daysOverdue: number
}
```

---

## 🎯 Design System

### Cores
```css
/* Primary */
--blue-600: #2563eb    /* Primary CTA, links */
--blue-700: #1d4ed8    /* Primary hover */

/* Success */
--green-600: #10b981   /* Transfer receiver, success */
--green-700: #059669   /* Success hover */

/* Warning */
--orange-500: #f59e0b  /* Maintenance due */
--orange-600: #d97706  /* Warning hover */

/* Danger */
--red-500: #ef4444     /* Maintenance overdue, alerts */
--red-600: #dc2626     /* Danger hover */

/* Neutrals */
--gray-50: #f9fafb     /* Background light */
--gray-100: #f3f4f6    /* Background */
--gray-600: #4b5563    /* Text secondary */
--gray-900: #1f2937    /* Text primary */
```

### Typography
```css
/* Headings */
h1: 28-32px, bold, color-primary
h2: 22-24px, bold, color-gray-900
h3: 16-18px, semibold, color-context

/* Body */
p: 14-16px, regular, color-gray-600
line-height: 1.6 (160%)

/* Code/Numbers */
font-family: 'Courier New', monospace
letter-spacing: 2-8px
```

### Spacing
```css
/* Container */
max-width: 600px
padding: 40px

/* Sections */
margin-bottom: 30-40px

/* Elements */
padding: 12-20px
```

### Components

#### CTA Button
```html
<a style="
  display: inline-block;
  background-color: #2563eb;
  color: #ffffff;
  padding: 16px 32px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
">
  Texto do Botão
</a>
```

#### Alert Box (Info)
```html
<div style="
  background-color: #eff6ff;
  border-left: 4px solid #2563eb;
  padding: 20px;
  border-radius: 4px;
">
  Conteúdo
</div>
```

#### Code Display
```html
<h1 style="
  color: #2563eb;
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 8px;
  font-family: 'Courier New', monospace;
">
  ABC123
</h1>
```

---

## 🧪 Testes

### Clientes de Email Testados
- ✅ Gmail (Web, iOS, Android)
- ✅ Outlook (Web, Desktop)
- ✅ Apple Mail (macOS, iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail

### Dispositivos
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

### Dark Mode
- ⚠️ Suporte parcial (depende do cliente)
- Cores escolhidas funcionam bem em ambos os modos

---

## 📝 Boas Práticas

### ✅ FAZER
- Usar tables para layout (padrão email HTML)
- Inline CSS em todos os elementos
- Testar em múltiplos clientes
- Incluir alt text em imagens
- Usar role="presentation" em tables
- Manter largura máxima 600px
- Fornecer plain text alternativo
- Incluir opt-out nos footers

### ❌ NÃO FAZER
- Usar CSS externo ou `<style>` tags
- Usar Flexbox ou Grid
- JavaScript ou formulários
- Vídeos ou áudios embutidos
- Fontes customizadas não-web-safe
- Backgrounds complexos
- Imagens muito grandes (>1MB)
- Links sem HTTPS

---

## 🔄 Atualização dos Templates

Para atualizar um template:

1. Editar arquivo `.ts` correspondente
2. Testar em https://putsmail.com ou similar
3. Verificar em múltiplos clientes
4. Fazer build: `npm run build`
5. Deploy: `firebase deploy --only functions`

---

## 📊 Métricas Recomendadas

### Email Tracking
- Taxa de entrega (>95%)
- Taxa de abertura (>20%)
- Taxa de cliques (>3%)
- Taxa de bounce (<5%)
- Taxa de unsubscribe (<0.5%)

### SendGrid Analytics
Acesse: https://app.sendgrid.com/statistics

---

## 🌍 Internacionalização

Atualmente apenas PT-BR. Para adicionar outros idiomas:

1. Criar pasta `templates/en/`
2. Duplicar templates com traduções
3. Adicionar parâmetro `locale` nas functions
4. Carregar template baseado no locale do usuário

---

## 🔗 Recursos Úteis

- [Email on Acid](https://www.emailonacid.com/) - Testes de compatibilidade
- [Litmus](https://www.litmus.com/) - Testes de email
- [Can I Email](https://www.caniemail.com/) - Suporte CSS
- [Really Good Emails](https://reallygoodemails.com/) - Inspiração
- [MJML](https://mjml.io/) - Framework alternativo
- [SendGrid Templates](https://sendgrid.com/solutions/email-templates/) - Exemplos oficiais

---

## 📞 Suporte

Problemas com templates? Verifique:

1. **Código quebrado**: Validar HTML
2. **Renderização**: Testar em clientes principais
3. **Links não funcionam**: Verificar URLs
4. **Imagens**: Confirmar hospedagem
5. **Spam**: Evitar palavras-gatilho

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0  
**Autor:** AutoCare Team

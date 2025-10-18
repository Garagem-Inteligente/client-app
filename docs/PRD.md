# 📱 PRD - Garagem Inteligente App Mobile

## 📋 Informações do Projeto

**Produto:** Garagem Inteligente - App Mobile  
**Versão:** 1.0.0  
**Data:** 16 de outubro de 2025  
**Tipo:** Aplicativo Mobile (iOS/Android/PWA)  
**Stack:** Ionic Vue + Capacitor + Firebase + TypeScript

---

## 🎯 Visão Geral

O **Garagem Inteligente App** é um aplicativo mobile completo para gestão inteligente de veículos, permitindo que usuários registrem, acompanhem e gerenciem suas manutenções, custos e documentos de forma digital e organizada.

### Problema que Resolve
- Falta de organização no histórico de manutenções
- Perda de documentos e notas fiscais
- Dificuldade em acompanhar custos
- Esquecimento de manutenções preventivas
- Perda de valor na revenda por falta de histórico

### Solução Proposta
Aplicativo mobile nativo com sincronização em nuvem, alertas inteligentes, gestão completa de veículos e histórico transferível.

---

## 👥 Personas

### Persona 1: Carlos - O Organizado
- **Idade:** 35 anos
- **Perfil:** Possui 2 carros, gosta de manter tudo organizado
- **Objetivo:** Ter histórico completo para aumentar valor de revenda
- **Dores:** Perde notas fiscais, esquece manutenções
- **Comportamento:** Usa apps diariamente, valoriza organização

### Persona 2: Maria - A Prática
- **Idade:** 28 anos  
- **Perfil:** Primeiro carro, pouca experiência com manutenção
- **Objetivo:** Ser lembrada das manutenções necessárias
- **Dores:** Não sabe quando fazer manutenções, gastos inesperados
- **Comportamento:** Busca soluções simples e intuitivas

---

## 🎨 Funcionalidades Principais

### 1. Autenticação e Perfil
- **Login/Registro** com email e senha
- **Recuperação de senha** via email
- **Perfil do usuário** com foto e dados
- **Configurações** de notificações e privacidade

### 2. Gestão de Veículos
- **Cadastro completo** de veículos
  - Foto do veículo (câmera/galeria)
  - Dados básicos (marca, modelo, ano, placa)
  - Quilometragem atual
  - Tipo de combustível
  - Cor e observações
  
- **Integração FIPE**
  - Busca automática de marca/modelo
  - Sugestões inteligentes
  - Valor de mercado

- **Dados do Seguro**
  - Seguradora e apólice
  - Data de vencimento
  - Valor do seguro
  - Telefone da seguradora

- **Edição e Exclusão**
  - Atualização de dados
  - Histórico de alterações
  - Confirmação de exclusão

### 3. Manutenções e Serviços
- **Registro de Manutenções**
  - Tipo de serviço (óleo, pneus, freios, etc)
  - Data e quilometragem
  - Custo total (peças + mão de obra)
  - Prestador de serviço
  - Observações

- **Anexos e Documentos**
  - Upload de notas fiscais (Base64)
  - Fotos antes/depois
  - Documentos PDF
  - Garantias

- **Histórico Completo**
  - Timeline de manutenções
  - Filtros por veículo/tipo/período
  - Exportação de relatórios
  - Gráficos de gastos

- **Alertas Inteligentes**
  - Próxima manutenção por data
  - Próxima manutenção por KM
  - Vencimento de seguro
  - Notificações push

### 4. Dashboard e Estatísticas
- **Visão Geral**
  - Total de veículos
  - Manutenções pendentes
  - Gastos do mês/ano
  - Próximas manutenções

- **Ações Rápidas**
  - Registrar manutenção
  - Adicionar veículo
  - Ver histórico
  - Atualizar quilometragem

- **Cards Informativos**
  - Status dos veículos
  - Alertas importantes
  - Resumo financeiro
  - Dicas de manutenção

### 5. Transferência de Veículos
- **Histórico Transferível**
  - QR Code para transferência
  - Manutenção do histórico completo
  - Aceite do novo proprietário
  - Dados anônimos do vendedor

- **Valor de Revenda**
  - Histórico aumenta o valor
  - Transparência com comprador
  - Relatório completo
  - Comprovação digital

### 6. Notificações
- **Push Notifications**
  - Manutenções próximas
  - Vencimento de seguro
  - Atualizações de quilometragem
  - Lembretes personalizados

- **Preferências**
  - Ativar/desativar por tipo
  - Frequência de notificações
  - Horário preferido
  - Canais (push/email)

---

## 🎨 Design e UX

### Princípios de Design
1. **Mobile First** - Otimizado para celulares
2. **Dark Mode** - Interface escura por padrão
3. **Gestos Intuitivos** - Swipe, pull-to-refresh
4. **Feedback Visual** - Loading states, animações
5. **Acessibilidade** - Contraste, tamanhos, leitores

### Paleta de Cores
```scss
// Primary (Verde)
$primary: #22c55e;
$primary-dark: #16a34a;
$primary-light: #4ade80;

// Secondary (Cinza)
$secondary: #64748b;
$secondary-dark: #334155;
$secondary-light: #94a3b8;

// Background
$bg-primary: #0f172a;   // Fundo principal
$bg-secondary: #1e293b; // Cards
$bg-tertiary: #334155;  // Hover

// Status
$success: #22c55e;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;
```

### Componentes Ionic
- **IonContent** - Container principal
- **IonCard** - Cards de informação
- **IonButton** - Botões de ação
- **IonInput** - Campos de entrada
- **IonItem** - Itens de lista
- **IonModal** - Modais e overlays
- **IonToast** - Notificações temporárias
- **IonAlert** - Confirmações
- **IonTabs** - Navegação principal
- **IonFab** - Floating action button

### Navegação
```
TabsPage (Bottom Navigation)
├── HomePage (Tab 1)
├── VehiclesPage (Tab 2)
├── OrdersPage (Tab 3)
└── ProfilePage (Tab 4)

Modals/Pages
├── LoginPage
├── RegisterPage
├── VehicleFormPage
├── VehicleDetailPage
├── MaintenanceFormPage
├── MaintenanceDetailPage
└── SettingsPage
```

---

## 🔧 Arquitetura Técnica

### Stack Tecnológico
```yaml
Framework: Ionic Vue 8.0.0
Runtime: Capacitor 7.4.3
Frontend: Vue 3.5.22 + TypeScript 5.6.2
State: Pinia 3.0.3
Styling: Tailwind CSS 3.4.0 + SCSS
Backend: Firebase 12.4.0
  - Authentication
  - Firestore
  - Storage
  - Cloud Functions (futuro)
Build: Vite 5.2.14
Testing: Playwright + Vitest
Package Manager: pnpm
```

### Estrutura de Pastas
```
src/
├── assets/              # Assets estáticos
│   ├── images/
│   └── styles/
│       ├── variables.scss
│       └── global.scss
├── components/          # Componentes reutilizáveis
│   ├── atoms/          # Componentes básicos
│   ├── molecules/      # Combinações
│   ├── organisms/      # Seções complexas
│   └── templates/      # Layouts
├── composables/        # Composables Vue
│   ├── useCamera.ts
│   ├── useGeolocation.ts
│   └── useNotifications.ts
├── firebase/           # Configuração Firebase
│   └── config.ts
├── router/             # Rotas
│   └── index.ts
├── stores/             # Pinia Stores
│   ├── auth.ts
│   ├── vehicles.ts
│   ├── maintenance.ts
│   └── notifications.ts
├── types/              # TypeScript types
│   ├── vehicle.ts
│   ├── maintenance.ts
│   └── user.ts
├── utils/              # Utilitários
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── views/              # Páginas
│   ├── auth/
│   ├── vehicles/
│   ├── maintenance/
│   └── profile/
├── App.vue
└── main.ts
```

### Stores (Pinia)
```typescript
// auth.ts
- user: User | null
- loading: boolean
- login(email, password)
- register(email, password, name)
- logout()
- updateProfile(data)

// vehicles.ts
- vehicles: Vehicle[]
- loading: boolean
- fetchVehicles()
- addVehicle(data)
- updateVehicle(id, data)
- deleteVehicle(id)
- getVehicleById(id)

// maintenance.ts
- records: MaintenanceRecord[]
- loading: boolean
- fetchRecords(vehicleId?)
- addRecord(data)
- updateRecord(id, data)
- deleteRecord(id)
- getUpcomingMaintenance()
- getOverdueMaintenance()
```

---

## 📊 Modelos de Dados

### User
```typescript
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  userType: 'user' | 'workshop'
  createdAt: Date
  updatedAt: Date
}
```

### Vehicle
```typescript
interface Vehicle {
  id: string
  userId: string
  vehicleType: 'car' | 'motorcycle' | 'van' | 'truck'
  make: string
  model: string
  year: number
  plate: string
  color?: string
  mileage: number
  fuelType: 'flex' | 'gasoline' | 'ethanol' | 'diesel' | 'electric' | 'hybrid'
  imageUrl?: string // Base64
  // Seguro
  insuranceCompany?: string
  insurancePhone?: string
  insurancePolicyNumber?: string
  insuranceExpiryDate?: Date
  insuranceValue?: number
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### MaintenanceRecord
```typescript
interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: MaintenanceType
  description: string
  cost: number
  partsCost?: number
  laborCost?: number
  mileage: number
  date: Date
  nextDueDate?: Date
  nextDueMileage?: number
  serviceProvider?: string
  notes?: string
  attachments?: MaintenanceAttachment[]
  beforePhoto?: string // Base64
  afterPhoto?: string // Base64
  createdAt: Date
  updatedAt: Date
}

type MaintenanceType = 
  | 'oil_change'
  | 'tire_rotation'
  | 'brake_service'
  | 'general_inspection'
  | 'battery'
  | 'filters'
  | 'other'
```

---

## 🔐 Segurança

### Firebase Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - read próprio, write próprio
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Vehicles - read próprio, write próprio
    match /vehicles/{vehicleId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == request.resource.data.userId;
    }
    
    // Maintenance Records - read próprio, write próprio
    match /maintenance/{recordId} {
      allow read: if request.auth.uid == get(/databases/$(database)/documents/vehicles/$(resource.data.vehicleId)).data.userId;
      allow write: if request.auth.uid == get(/databases/$(database)/documents/vehicles/$(request.resource.data.vehicleId)).data.userId;
    }
  }
}
```

### Validações
- Tamanho máximo de arquivos: 2MB
- Formatos aceitos: JPEG, PNG, PDF
- Validação de campos obrigatórios
- Sanitização de inputs
- Rate limiting nas APIs

---

## 🚀 Roadmap

### Fase 1: MVP (Atual)
- ✅ Autenticação completa
- ✅ CRUD de veículos
- ✅ Gestão de manutenções
- ✅ Dashboard básico
- ✅ Notificações locais

### Fase 2: Expansão (Q1 2026)
- 🔄 Integração com oficinas
- 🔄 Chat em tempo real
- 🔄 Agendamento de serviços
- 🔄 Pagamento integrado
- 🔄 Avaliações e reviews

### Fase 3: Premium (Q2 2026)
- 📅 Análise preditiva de custos
- 📅 Integração OBD-II
- 📅 Monitoramento em tempo real
- 📅 Relatórios avançados
- 📅 API para terceiros

### Fase 4: Expansão (Q3 2026)
- 📅 Marketplace de peças
- 📅 Seguro integrado
- 📅 Financiamento de manutenções
- 📅 Programa de fidelidade
- 📅 App para oficinas

---

## 📈 Métricas de Sucesso

### KPIs Principais
- **DAU** (Daily Active Users): >10k em 6 meses
- **Retention Rate**: >40% após 30 dias
- **Session Duration**: >5 minutos
- **Feature Adoption**: >60% usam registro de manutenção
- **NPS**: >50

### Métricas Técnicas
- **App Size**: <50MB
- **Load Time**: <2s
- **Crash Rate**: <1%
- **API Response**: <500ms
- **Battery Usage**: <5% por hora

---

## 🧪 Testes

### Testes E2E (Playwright)
- Fluxo de registro
- Fluxo de login
- Cadastro de veículo
- Registro de manutenção
- Navegação entre telas
- Upload de arquivos

### Testes Unitários (Vitest)
- Stores Pinia
- Composables
- Utilitários
- Validators
- Formatters

### Testes Manuais
- Usabilidade
- Acessibilidade
- Performance
- Compatibilidade
- Offline mode

---

## 📝 Notas Técnicas

### Armazenamento
- **Base64** para imagens (limite 2MB)
- **Firestore** para dados estruturados
- **Local Storage** para cache
- **IndexedDB** para offline

### Performance
- Lazy loading de páginas
- Image optimization
- Bundle splitting
- Service Workers
- Cache strategies

### Acessibilidade
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode
- Font sizing

---

**Última Atualização:** 16 de outubro de 2025  
**Autor:** Michel Santos (@Mikeofic)  
**Status:** ✅ Aprovado para Desenvolvimento


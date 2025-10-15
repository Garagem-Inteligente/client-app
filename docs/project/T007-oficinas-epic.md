# 🔧 T007 - Plataforma de Oficinas (Épico)

## 📋 Visão Geral

**Status**: 🔄 Em Progresso  
**Prioridade**: 🔴 Alta - Feature Principal Futura  
**Estimativa Total**: 40-50 horas  
**Data de Início**: 14/10/2025

### Objetivo
Criar plataforma B2B2C completa para oficinas parceiras gerenciarem clientes e manutenções, expandindo o ecossistema AutoCare.

### Progresso Atual
**✅ Fase 0: Esqueleto Básico (Concluída - 14/10/2025)**
- [x] Store Pinia `workshops.ts` com interfaces e stubs
- [x] View placeholder `Workshops.vue` com layout básico
- [x] Rota protegida `/workshops` configurada
- [x] Link "Oficinas" no Navbar
- [x] Build validado sem erros

---

## 📦 Subtarefas Detalhadas

### 🏗️ Fase 1: Infraestrutura Base (6-8h)

#### T007.1 - Coleções Firestore para Oficinas
- **Estimativa**: 2h
- **Descrição**: Criar estrutura de dados no Firestore
- **Critérios**:
  - [ ] Collection `workshops`:
    - `id`, `name`, `cnpj`, `email`, `phone`, `address`
    - `ownerId` (userId que criou), `verified` (boolean)
    - `specialties` (array), `workHours`, `photos` (urls)
    - `rating` (computed), `totalReviews`
    - `createdAt`, `updatedAt`
  - [ ] Collection `workshops/{id}/job_orders`:
    - `id`, `workshopId`, `vehicleId`, `customerId`
    - `status` (draft/open/in-progress/awaiting-approval/completed/cancelled)
    - `services` (array de ServiceItem)
    - `totalLabor`, `totalParts`, `totalCost`
    - `notes`, `photos` (before/after)
    - `createdAt`, `updatedAt`, `completedAt`
  - [ ] Collection `workshop_reviews`:
    - `workshopId`, `userId`, `rating` (1-5), `comment`
    - `createdAt`
  - [ ] Security Rules para permissões corretas
  - [ ] Índices compostos necessários

#### T007.2 - Store Pinia Completo
- **Estimativa**: 3h
- **Descrição**: Implementar lógica de negócio no store
- **Critérios**:
  - [ ] `fetchWorkshops()` - Buscar todas oficinas (com filtros opcionais)
  - [ ] `fetchWorkshopById(id)` - Buscar oficina específica
  - [ ] `createWorkshop(data)` - Criar nova oficina
  - [ ] `updateWorkshop(id, data)` - Atualizar dados
  - [ ] `fetchJobOrders(workshopId)` - Buscar ordens de serviço
  - [ ] `createJobOrder(data)` - Criar nova OS
  - [ ] `updateJobOrderStatus(id, status)` - Atualizar status
  - [ ] `fetchReviews(workshopId)` - Buscar avaliações
  - [ ] `createReview(data)` - Criar avaliação
  - [ ] Computed: `myWorkshops`, `workshopById`, `averageRating`
  - [ ] Error handling e loading states

#### T007.3 - Tipos de Usuário (Workshop vs User)
- **Estimativa**: 2h
- **Descrição**: Adicionar suporte a diferentes tipos de usuário
- **Critérios**:
  - [ ] Campo `userType` em auth.ts ('user' | 'workshop')
  - [ ] Registro diferenciado para oficinas
  - [ ] Guards de rota baseados em userType
  - [ ] Navbar adapta itens conforme tipo
  - [ ] Dashboard diferente para workshop vs user

---

### 🎨 Fase 2: Interface de Oficina (8-10h)

#### T007.4 - Página de Cadastro de Oficina
- **Estimativa**: 3h
- **Descrição**: Formulário completo de registro de oficina
- **Critérios**:
  - [ ] View `/workshops/register`
  - [ ] Formulário com validação:
    - Nome, CNPJ (com validação), Email, Telefone
    - Endereço completo, Especialidades (select múltiplo)
    - Horário de funcionamento, Upload de fotos
  - [ ] Integração com store
  - [ ] Feedback de sucesso/erro
  - [ ] Redirect para dashboard após registro

#### T007.5 - Dashboard da Oficina
- **Estimativa**: 4h
- **Descrição**: Dashboard específico para oficinas
- **Critérios**:
  - [ ] View `/workshop/dashboard`
  - [ ] Cards de estatísticas:
    - Total de clientes atendidos
    - Ordens de serviço (pendentes/em progresso/concluídas)
    - Receita total (mensal/anual)
    - Avaliação média
  - [ ] Lista de OS recentes
  - [ ] Gráfico de receita mensal
  - [ ] Acesso rápido a criar nova OS

#### T007.6 - Listagem de Ordens de Serviço
- **Estimativa**: 3h
- **Descrição**: Visualizar e gerenciar todas as OS
- **Critérios**:
  - [ ] View `/workshop/job-orders`
  - [ ] Tabela com filtros (status, data, cliente)
  - [ ] Busca por placa ou cliente
  - [ ] Badge de status colorido
  - [ ] Botão para editar/visualizar OS
  - [ ] Paginação

---

### 🚗 Fase 3: Cadastro de Manutenção pela Oficina (8-10h)

#### T007.7 - Formulário de Criação de OS
- **Estimativa**: 4h
- **Descrição**: Oficina cadastra nova ordem de serviço
- **Critérios**:
  - [ ] View `/workshop/job-orders/new`
  - [ ] Campo de busca por placa (verifica se existe na plataforma)
  - [ ] Se placa não existe: campos para dados do cliente
  - [ ] Lista de serviços com add/remove dinâmico
  - [ ] Para cada serviço: nome, descrição, qtd, preço unitário
  - [ ] Campos: custos peças, custos mão de obra
  - [ ] Upload de fotos antes/depois
  - [ ] Campo de observações
  - [ ] Botão "Salvar como Rascunho" e "Enviar para Aprovação"

#### T007.8 - Cloud Function: Verificar Placa
- **Estimativa**: 2h
- **Descrição**: Função para verificar se placa existe e retornar owner
- **Critérios**:
  - [ ] Callable function `verifyVehiclePlate(plate)`
  - [ ] Busca em collection `vehicles`
  - [ ] Retorna: `{ exists: boolean, userId?: string, vehicleId?: string }`
  - [ ] Valida formato de placa
  - [ ] Logs adequados

#### T007.9 - Sistema de Aprovação de Manutenção
- **Estimativa**: 3h
- **Descrição**: Cliente aprova ou rejeita manutenção cadastrada pela oficina
- **Critérios**:
  - [ ] Notificação para cliente quando oficina cadastra OS
  - [ ] Modal/página de aprovação com detalhes da OS
  - [ ] Botões "Aprovar" e "Rejeitar" com confirmação
  - [ ] Campo de comentário em caso de rejeição
  - [ ] Atualização de status no Firestore
  - [ ] Notificação para oficina sobre decisão
  - [ ] Se aprovada: adiciona manutenção ao histórico do veículo

---

### 👥 Fase 4: Integração Cliente-Oficina (6-8h)

#### T007.10 - Tab "Manutenções de Oficinas" no Veículo
- **Estimativa**: 2h
- **Descrição**: Separar manutenções próprias de manutenções de oficinas
- **Critérios**:
  - [ ] VehicleDetails.vue: duas tabs ("Minhas Manutenções" e "Manutenções de Oficinas")
  - [ ] Badge diferenciado em MaintenanceRecord mostrando oficina responsável
  - [ ] Cliente pode apenas visualizar (não editar) manutenções de oficina
  - [ ] Cliente pode adicionar comentário/reclamação
  - [ ] Link para perfil da oficina

#### T007.11 - Sistema de Avaliações
- **Estimativa**: 3h
- **Descrição**: Cliente avalia oficina após manutenção
- **Critérios**:
  - [ ] Modal de avaliação (1-5 estrelas + comentário)
  - [ ] Aparece após manutenção ser marcada como concluída
  - [ ] Store de reviews integrado
  - [ ] View de reviews no perfil da oficina
  - [ ] Cálculo de média de avaliações
  - [ ] Impedir múltiplas avaliações por OS

#### T007.12 - Lista de Clientes da Oficina
- **Estimativa**: 2h
- **Descrição**: Oficina visualiza todos os clientes que atendeu
- **Critérios**:
  - [ ] View `/workshop/clients`
  - [ ] Tabela com: Nome, Email, Veículos atendidos, Total gasto, Última OS
  - [ ] Busca e filtros
  - [ ] Link para histórico completo do cliente
  - [ ] Estatísticas de recorrência

---

### 🔍 Fase 5: Busca e Descoberta de Oficinas (5-6h)

#### T007.13 - Página de Busca de Oficinas
- **Estimativa**: 3h
- **Descrição**: Cliente busca oficinas disponíveis
- **Critérios**:
  - [ ] View `/workshops` pública ou semi-pública
  - [ ] Busca por localização (cidade/estado)
  - [ ] Filtros: especialidade, avaliação (>4 estrelas), preço médio
  - [ ] Cards com: nome, foto, avaliação, especialidades, distância
  - [ ] Link para perfil público da oficina

#### T007.14 - Perfil Público da Oficina
- **Estimativa**: 2h
- **Descrição**: Página de perfil com informações e avaliações
- **Critérios**:
  - [ ] View `/workshops/:id`
  - [ ] Informações: nome, endereço, telefone, horário, especialidades
  - [ ] Galeria de fotos
  - [ ] Lista de avaliações (com paginação)
  - [ ] Estatísticas: avaliação média, total de avaliações
  - [ ] Botão "Solicitar Agendamento"

---

### 📅 Fase 6: Agendamento (6-8h)

#### T007.15 - Sistema de Agendamento
- **Estimativa**: 4h
- **Descrição**: Cliente solicita agendamento com oficina
- **Critérios**:
  - [ ] Collection `appointments`:
    - `workshopId`, `userId`, `vehicleId`
    - `requestedDate`, `confirmedDate`
    - `status` (pending/confirmed/rejected/completed/cancelled)
    - `serviceDescription`, `notes`
  - [ ] Modal de solicitação de agendamento
  - [ ] Seleção de data/hora
  - [ ] Descrição do serviço desejado
  - [ ] Notificação para oficina
  - [ ] Oficina pode aceitar/rejeitar/propor nova data

#### T007.16 - Cloud Functions de Agendamento
- **Estimativa**: 2h
- **Descrição**: Funções para notificações de agendamento
- **Critérios**:
  - [ ] Email template: solicitação de agendamento (para oficina)
  - [ ] Email template: confirmação de agendamento (para cliente)
  - [ ] Email template: lembrete 24h antes (para cliente)
  - [ ] Callable function `requestAppointment`
  - [ ] Callable function `confirmAppointment`
  - [ ] Callable function `cancelAppointment`

---

### 🔐 Fase 7: Permissões e Segurança (3-4h)

#### T007.17 - Security Rules Completas
- **Estimativa**: 2h
- **Descrição**: Regras de segurança para todas as coleções
- **Critérios**:
  - [ ] Workshops: apenas owner pode editar
  - [ ] JobOrders: oficina pode CRUD próprias, cliente pode ler
  - [ ] Reviews: apenas cliente que recebeu serviço pode criar
  - [ ] Appointments: cliente e oficina envolvidos podem ler
  - [ ] Testes de segurança (Firestore Emulator)

#### T007.18 - Guards e Validações
- **Estimativa**: 2h
- **Descrição**: Proteger rotas e ações sensíveis
- **Critérios**:
  - [ ] Guard `/workshop/*` só para userType='workshop'
  - [ ] Validações no frontend antes de chamar Functions
  - [ ] Mensagens de erro específicas
  - [ ] Testes E2E de permissões

---

## 📊 Resumo de Entregas

| Fase | Tarefas | Estimativa | Status |
|------|---------|-----------|--------|
| **0. Esqueleto** | T007.0 | 1h | ✅ Concluída |
| **1. Infraestrutura** | T007.1-3 | 6-8h | ⏳ Pendente |
| **2. Interface Oficina** | T007.4-6 | 8-10h | ⏳ Pendente |
| **3. Cadastro OS** | T007.7-9 | 8-10h | ⏳ Pendente |
| **4. Integração** | T007.10-12 | 6-8h | ⏳ Pendente |
| **5. Busca** | T007.13-14 | 5-6h | ⏳ Pendente |
| **6. Agendamento** | T007.15-16 | 6-8h | ⏳ Pendente |
| **7. Segurança** | T007.17-18 | 3-4h | ⏳ Pendente |
| **TOTAL** | 18 subtarefas | **43-55h** | 1/18 ✅ |

---

## 🎯 Ordem de Execução Sugerida

1. **Semana 1**: Fase 1 (Infraestrutura) - Base de dados e store
2. **Semana 2**: Fase 2 (Interface) + Fase 7 (Segurança) - Dashboard e permissões básicas
3. **Semana 3**: Fase 3 (Cadastro OS) - Funcionalidade core
4. **Semana 4**: Fase 4 (Integração) - Experiência do cliente
5. **Semana 5**: Fase 5 (Busca) + Fase 6 (Agendamento) - Funcionalidades avançadas

---

## 🚀 Próxima Tarefa

**T007.1 - Coleções Firestore para Oficinas** (2h)
- Criar estrutura de dados completa
- Implementar security rules básicas
- Validar com emulador local

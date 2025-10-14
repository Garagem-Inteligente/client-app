# 📋 Lista de Tarefas - AutoCare Platform

## 🎯 Sobre Este Documento

Esta é a **lista de execução** do projeto. Todas as tarefas aqui são acionáveis e derivadas das ideias em `ideia-expandida.md`. 

**Status possíveis:**
- ⏳ **Pendente**: Não iniciada
- 🔄 **Em Progresso**: Sendo trabalhada atualmente
- ✅ **Concluída**: Finalizada e testada
- 🚫 **Bloqueada**: Aguardando dependência
- ❌ **Cancelada**: Descartada

---

## 🔥 Tarefas em Progresso

> Nenhuma tarefa em progresso no momento.

---

## 📌 SPRINT 0: Melhorias de Robustez (PRIORIDADE MÁXIMA)

> **Contexto**: Antes de avançar com novas funcionalidades, precisamos solidificar o que já existe.
> Estas melhorias foram identificadas como críticas para UX e usabilidade.

### T-R01 - Revisar Copy para Português Brasileiro Natural
- **Descrição**: Revisar toda interface para usar português brasileiro coloquial e natural
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 14/10/2025
- **Melhorias Aplicadas**:
  - ✅ Capitalização consistente de títulos e botões
  - ✅ Pontuação adequada em mensagens de feedback
  - ✅ Textos explicativos expandidos e mais claros
  - ✅ Placeholders padronizados e naturais
  - ✅ Tom amigável e profissional mantido
- **Critérios de Aceitação**:
  - [x] Auditoria completa de todos os textos da interface
  - [x] Documento copy-review.md criado com antes/depois
  - [x] 8 páginas principais revisadas (Login, Register, Profile, Dashboard, Vehicles, VehicleDetails, Maintenance, Support)
  - [x] Todos os textos já estavam em português natural - apenas refinamentos aplicados
- **Complexidade**: Média (2-3 horas)
- **Dependências**: Nenhuma
- **Implementação**: `docs/project/copy-review.md` com documentação completa

---

### T-R02 - Tornar Cards do Dashboard Clicáveis
- **Descrição**: Cards de estatísticas devem navegar para páginas de detalhes
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Implementações**:
  - ✅ "Total de Veículos" → `/vehicles`
  - ✅ "Manutenções" → `/maintenance`
  - ✅ "Custo Total" → `/maintenance?view=costs`
  - ✅ "Agendadas" → `/maintenance?view=upcoming`
- **Critérios de Aceitação**:
  - [x] Todos os StatCards são clicáveis (cursor pointer)
  - [x] Navegação correta para cada tipo de estatística
  - [x] Views de filtro implementadas em Maintenance.vue
  - [x] Animação de hover nos cards (scale-[1.02])
  - [x] Router-link wrappers implementados
- **Complexidade**: Média (2-3 horas)
- **Dependências**: Nenhuma
- **Implementação**: `src/views/Dashboard.vue` linhas 230-349

---

### T-R03 - Adicionar Tipos de Veículos Brasileiros
- **Descrição**: Expandir tipos de veículos para refletir realidade brasileira
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Tipos Implementados**:
  - ✅ Carro (padrão)
  - ✅ Moto
  - ✅ Van
  - ✅ Caminhão
  - ✅ Ônibus
  - ✅ Caminhonete
- **Critérios de Aceitação**:
  - [x] Interface Vehicle atualizada com campo `vehicleType`
  - [x] VEHICLE_TYPE_LABELS com nomes em português
  - [x] VEHICLE_TYPE_OPTIONS para select dropdown
  - [x] VEHICLE_TYPE_ICONS com mapeamento de ícones
  - [x] Migração de dados existentes (padrão: "car")
  - [x] Type definition: `'car' | 'motorcycle' | 'van' | 'truck' | 'bus' | 'pickup'`
- **Complexidade**: Baixa (1-2 horas)
- **Dependências**: Nenhuma
- **Implementação**: 
  - `src/constants/vehicles.ts` linhas 4-54
  - `src/stores/vehicles.ts` linhas 20, 28, 211

---

### T-R04 - Seção "Últimas Manutenções" no Dashboard
- **Descrição**: Adicionar card com as 5 últimas manutenções realizadas
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Critérios de Aceitação**:
  - [x] Novo computed `recentMaintenance` na store
  - [x] Card "🔧 Últimas Manutenções" no Dashboard ao lado de "📅 Próximas"
  - [x] Exibe 5 registros mais recentes (ordem: date DESC, slice(0,5))
  - [x] Cada item mostra: veículo, tipo (Badge), data, custo
  - [x] Botão "Ver histórico completo" navega para /maintenance
  - [x] Estado vazio amigável com ícone e botão de ação
  - [x] Grid responsivo: 1 coluna mobile, 2 colunas desktop (lg:grid-cols-2)
- **Complexidade**: Baixa (1 hora)
- **Dependências**: Nenhuma
- **Implementação**:
  - `src/stores/vehicles.ts` linhas 155-163 (computed recentMaintenance)
  - `src/views/Dashboard.vue` linhas 403-460 (Card Últimas Manutenções)

---

### T-R05 - Atualizar Tipos de Combustíveis Brasileiros
- **Descrição**: Substituir tipos genéricos por combustíveis reais do Brasil
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Tipos Implementados**:
  - ✅ Flex (Gasolina/Etanol)
  - ✅ Gasolina
  - ✅ Álcool (Etanol)
  - ✅ Diesel
  - ✅ Elétrico
  - ✅ Híbrido Plugin
  - ✅ Híbrido Leve
  - ✅ GNV (Gás Natural)
- **Critérios de Aceitação**:
  - [x] Interface Vehicle atualizada com novos tipos
  - [x] FUEL_TYPE_LABELS com nomes completos em português
  - [x] FUEL_TYPE_OPTIONS para select dropdown
  - [x] Type definition: `'flex' | 'gasoline' | 'ethanol' | 'diesel' | 'electric' | 'hybrid-plugin' | 'hybrid-mild' | 'gnv'`
  - [x] Labels descritivos e naturais
  - [x] Sistema de badges com variantes por tipo
- **Complexidade**: Baixa (1 hora)
- **Dependências**: Nenhuma
- **Implementação**: `src/constants/vehicles.ts` linhas 14-43

---

### T-R06 - Modais de Confirmação para Ações Críticas
- **Descrição**: Criar componente ConfirmModal.vue e adicionar em todas ações destrutivas
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Ações Implementadas**:
  - ✅ Excluir veículo (Vehicles.vue)
  - ✅ Excluir conta (Profile.vue)
  - ⏳ Excluir manutenção (pendente)
  - ⏳ Cancelar transferência (pendente)
- **Critérios de Aceitação**:
  - [x] Componente ConfirmModal.vue criado
  - [x] Props: title, message, confirmText, cancelText, variant
  - [x] Emits: confirm, cancel
  - [x] Aplicado em excluir veículo e excluir conta
  - [x] Design com overlay escuro e animações
  - [x] Botões com variantes danger/outline
- **Complexidade**: Média (2-3 horas)
- **Dependências**: Nenhuma
- **Implementação**: 
  - `src/components/ConfirmModal.vue` (componente)
  - `src/views/Vehicles.vue` linhas 23-26, uso do modal
  - `src/views/Profile.vue` (uso para excluir conta)

---

### T-R07 - Upload de Imagem do Veículo
- **Descrição**: Permitir que usuário adicione foto do veículo
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Critérios de Aceitação**:
  - [x] Campo `imageUrl` (Base64) adicionado em Vehicle interface
  - [x] Input file com validação em Vehicles.vue
  - [x] Preview da imagem no formulário (linhas 579-599)
  - [x] Validação: apenas imagens, máximo 2MB
  - [x] Conversão para Base64 com FileReader API
  - [x] Botão remover imagem no preview
  - [x] Exibição da imagem em cards (altura 160px, object-cover)
  - [x] Store persiste imageUrl no Firestore
- **Complexidade**: Média (2-3 horas)
- **Dependências**: T-R03 (tipos de veículos) ✅
- **Implementação**:
  - `src/stores/vehicles.ts` linha 36 (campo imageUrl)
  - `src/views/Vehicles.vue` linhas 48, 63-93 (upload e validação)
  - `src/views/Vehicles.vue` linhas 739-746 (exibição em cards)

---

### T-R08 - Página de Perfil do Usuário
- **Descrição**: Criar área completa de gerenciamento de perfil
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 14/10/2025
- **Funcionalidades Implementadas**:
  - ✅ Upload de foto de perfil (Base64) com preview
  - ✅ Editar display name (nome completo)
  - ✅ Exibição do email (read-only)
  - ✅ Trocar senha com verificação de senha atual
  - ✅ Excluir conta com ConfirmModal
  - ✅ Campo de telefone com máscara brasileira (11) 98765-4321
  - ✅ Endereço completo (CEP, rua, número, complemento, bairro, cidade, estado)
  - ✅ Integração com ViaCEP para busca automática de endereço
  - ✅ Select com todos os 27 estados brasileiros
- **Critérios de Aceitação**:
  - [x] View Profile.vue criada
  - [x] Rota `/profile` adicionada
  - [x] Store `auth.ts` gerencia perfil
  - [x] Seção de foto com file input
  - [x] Seção de informações pessoais expandida
  - [x] Campo telefone com formatação automática
  - [x] Campos de endereço com grid responsivo
  - [x] Busca automática de CEP via ViaCEP API
  - [x] Seção de alteração de senha
  - [x] Seção de exclusão de conta
  - [x] Firebase updateProfile e updatePassword implementados
  - [x] Validações de campo e máscaras
- **Complexidade**: Alta (4-5 horas)
- **Dependências**: T-R06 (modal de confirmação) ✅
- **Implementação**: `src/views/Profile.vue` (563 linhas, 100% completa)

---

### T-R09 - Configurar Firebase Functions + SendGrid
- **Descrição**: Implementar envio real de emails com Cloud Functions
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Critérios de Aceitação**:
  - [x] Firebase Functions v2 inicializado (`functions/` folder)
  - [x] SendGrid instalado: `@sendgrid/mail` v8.1.4
  - [x] Secrets configurados: SENDGRID_API_KEY, SENDGRID_FROM_EMAIL
  - [x] Função `sendTransferEmail` implementada (linhas 48-156)
  - [x] Função `sendMaintenanceAlert` implementada (linhas 160-244)
  - [x] Função `sendWelcomeEmail` implementada (linhas 247-315)
  - [x] Todas funções deployed em us-central1
  - [x] Logs de sucesso/erro implementados
  - [x] Tratamento de erros com try/catch
  - [x] Import correto: default import (não namespace)
- **Complexidade**: Alta (5-6 horas)
- **Dependências**: Nenhuma
- **Implementação**: `functions/src/index.ts`
- **Correção Aplicada**: Commit 7e198ea - Fix import SendGrid (linha 9)

---

### T-R10 - Templates HTML de Email
- **Descrição**: Criar templates bonitos e responsivos para todos emails
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Templates Implementados**:
  - ✅ transferEmail.ts - Email de código de transferência
  - ✅ maintenanceAlertEmail.ts - Email de alerta de manutenção
  - ✅ welcomeEmail.ts - Email de boas-vindas
  - ✅ ownerTransferEmail.ts - Email para dono atual
  - ✅ newOwnerTransferEmail.ts - Email para novo dono
- **Critérios de Aceitação**:
  - [x] 5 templates HTML em `functions/src/templates/`
  - [x] CSS inline para compatibilidade (style attributes)
  - [x] Design com cores da plataforma (purple, blue)
  - [x] Header com logo e branding AutoCare
  - [x] Seções com ícones e conteúdo estruturado
  - [x] Responsivo com meta viewport
  - [x] Variáveis dinâmicas (userName, transferCode, vehiclePlate, etc)
  - [x] Botões de CTA com links
  - [x] Footer com copyright e links úteis
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T-R09 ✅
- **Implementação**: `functions/src/templates/*.ts` (5 arquivos)

---

### T-R11 - Click no Card do Veículo Abre Detalhes
- **Descrição**: Clicar em qualquer parte do card deve navegar para detalhes
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Critérios de Aceitação**:
  - [x] Card de veículo totalmente clicável via @click
  - [x] Cursor pointer com classe `cursor-pointer`
  - [x] Navegação para `/vehicles/${vehicle.id}`
  - [x] Botões de ação (Editar, Excluir) com @click.stop
  - [x] Animação de hover: `group-hover:opacity-90`
  - [x] Classes CSS: `hover:border-gray-600 transition-all cursor-pointer group`
- **Complexidade**: Baixa (30 minutos)
- **Dependências**: T-R12 (página de detalhes) ✅
- **Implementação**: `src/views/Vehicles.vue` linha 738 (@click no Card)

---

### T-R12 - Página Detalhada do Veículo
- **Descrição**: Melhorar VehicleDetails.vue com seções organizadas
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🔴 Alta
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Seções Implementadas**:
  1. ✅ Header com imagem e dados principais
  2. ✅ Sistema de Tabs com 5 abas funcionais
  3. ✅ Tab Informações: dados editáveis inline (linhas 409-540)
  4. ✅ Tab Manutenções: histórico completo com badges (linhas 674-730)
  5. ✅ Tab Estatísticas: cards de métricas + 3 gráficos (linhas 731-840)
  6. ✅ Tab Documentos: upload CRLV e Apólice (linhas 843-1050)
  7. ✅ Tab Seguro: dados apólice + alertas vencimento (linhas 1053-1173)
- **Critérios de Aceitação**:
  - [x] Layout com tabs funcionais (TabPanel components)
  - [x] Cada seção implementada e funcional
  - [x] Design responsivo (grid adaptativo mobile/desktop)
  - [x] Loading states em uploads
  - [x] Badges indicadores em cada tab
  - [x] Stats cards com métricas calculadas
  - [x] Botões de ação contextuais por seção
- **Complexidade**: Alta (6-8 horas)
- **Dependências**: T-R07 ✅, T-R13 ✅
- **Implementação**: `src/views/VehicleDetails.vue` (1173 linhas)

---

### T-R13 - Gráficos de Gastos e Consumo
- **Descrição**: Implementar visualizações gráficas com Chart.js
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ✅ Concluída
- **Data de Conclusão**: 2025-01-14
- **Gráficos Implementados**:
  1. ✅ MonthlyCostsChart.vue - Evolução custos mensais (linha, últimos 6 meses)
  2. ✅ CostsByTypeChart.vue - Custos por tipo de manutenção (barra horizontal)
  3. ✅ PreventiveVsCorrectiveChart.vue - Preventiva vs Corretiva (pizza)
- **Critérios de Aceitação**:
  - [x] Chart.js + vue-chartjs instalados
  - [x] 3 componentes criados em `src/components/charts/`
  - [x] Registros do Chart.js (CategoryScale, LinearScale, etc)
  - [x] Gráficos integrados em VehicleDetails.vue Tab Estatísticas
  - [x] Tooltips com formatação de moeda (R$)
  - [x] Cores consistentes: purple, blue, green gradients
  - [x] Grid responsivo: 1 coluna mobile, 2 colunas desktop
  - [x] Placeholder quando não há dados
  - [x] Props recebem maintenanceHistory array
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T-R12 ✅
- **Implementação**: 
  - `src/components/charts/MonthlyCostsChart.vue`
  - `src/components/charts/CostsByTypeChart.vue`
  - `src/components/charts/PreventiveVsCorrectiveChart.vue`
  - Integração: `src/views/VehicleDetails.vue` linhas 805-824

---

### T-R14 - Botão Registrar Manutenção na Página do Veículo
- **Descrição**: Adicionar atalho para criar manutenção direto da página do veículo
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ✅ Concluída
- **Data de Conclusão**: 14/10/2025
- **Implementação**:
  - ✅ Botão "Registrar Manutenção" adicionado na tab Manutenções
  - ✅ Navegação para `/maintenance?vehicleId=${vehicleId}&action=new`
  - ✅ Query parameters já tratados em Maintenance.vue (onMounted)
  - ✅ Formulário pré-preenche vehicleId automaticamente
  - ✅ Ícone de "+" no botão com SVG
  - ✅ Variant primary para destaque
  - ✅ Posicionado no topo da seção, alinhado à direita
- **Critérios de Aceitação**:
  - [x] Botão no header da seção de Manutenções
  - [x] Click navega para página de manutenção
  - [x] vehicleId já pré-preenchido via query params
  - [x] Integração perfeita com fluxo existente
  - [x] Design com ícone e texto descritivo
- **Complexidade**: Baixa (1 hora) → Executado em 30 minutos
- **Dependências**: T-R12 ✅
- **Implementação**: `src/views/VehicleDetails.vue` linhas 677-687

---

### T-R15 - Expandir Tipos de Manutenção
- **Descrição**: Adicionar mais opções pré-cadastradas e campo customizado
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Tipos Atuais**: oil_change, tire_rotation, brake_service, general_inspection, other
- **Novos Tipos a Adicionar**:
  - Alinhamento e Balanceamento
  - Suspensão
  - Ar-condicionado
  - Bateria
  - Sistema Elétrico
  - Embreagem
  - Transmissão
  - Filtros (óleo, ar, combustível, cabine)
  - Correia Dentada
  - Velas de Ignição
  - Limpeza de Bicos Injetores
  - Revisão Geral
  - Outros (customizado)
- **Critérios de Aceitação**:
  - [ ] Interface MaintenanceRecord atualizada com novos tipos
  - [ ] Select no formulário com todos os tipos
  - [ ] Campo `customName` para quando type = "other"
  - [ ] Exibir customName quando disponível
  - [ ] Labels em português claro
- **Complexidade**: Baixa (1 hora)
- **Dependências**: Nenhuma

---

### T-R16 - Fotos de Peças (Antes/Depois)
- **Descrição**: Permitir upload de fotos das peças trocadas
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Campos `beforePhotos` e `afterPhotos` em MaintenanceRecord
  - [ ] Seção no formulário de manutenção para upload
  - [ ] Limite: 5 fotos antes + 5 fotos depois
  - [ ] Preview em grid
  - [ ] Compressão automática (max 1MB por foto)
  - [ ] Galeria de fotos na visualização da manutenção
  - [ ] Lightbox para visualizar fotos em tamanho maior
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T-R07 (componente de upload de imagem)

---

### T-R17 - Separar Custos (Mão de Obra + Peças)
- **Descrição**: Dividir campo cost em laborCost e partsCost
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Interface MaintenanceRecord atualizada: `laborCost`, `partsCost`
  - [ ] Computed `totalCost` = laborCost + partsCost
  - [ ] Formulário com dois campos separados
  - [ ] Migração de dados existentes (cost → partsCost, laborCost = 0)
  - [ ] Gráficos mostram breakdown de custos
  - [ ] Estatísticas separadas por tipo de custo
- **Complexidade**: Média (2-3 horas)
- **Dependências**: T-R13 (gráficos)

---

### T-R18 - Dados do Seguro no Veículo
- **Descrição**: Adicionar campos relacionados ao seguro do veículo
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Campos a Adicionar**:
  - `insuranceCompany` (string)
  - `insurancePhone` (string com máscara)
  - `insurancePolicyNumber` (string)
  - `insuranceExpiryDate` (Date)
  - `insuranceValue` (number)
- **Critérios de Aceitação**:
  - [ ] Interface Vehicle atualizada
  - [ ] Seção "Seguro" no formulário de veículo
  - [ ] Todos os campos opcionais
  - [ ] Máscara de telefone brasileiro
  - [ ] Alerta se seguro próximo de vencer (30 dias)
  - [ ] Validação de data de vencimento
- **Complexidade**: Baixa (1-2 horas)
- **Dependências**: Nenhuma

---

### T-R19 - Botão Click-to-Call Seguro
- **Descrição**: Adicionar botão para ligar diretamente para seguro
- **Origem**: Feedback do usuário - melhorias de robustez
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Botão "Ligar para Seguro" em VehicleDetails (seção Seguro)
  - [ ] Usa `tel:` link com número cadastrado
  - [ ] Ícone de telefone + número formatado
  - [ ] Apenas exibido se insurancePhone estiver preenchido
  - [ ] Botão também no header da página (acesso rápido)
  - [ ] Confirmação antes de discar (opcional)
- **Complexidade**: Baixa (30 minutos)
- **Dependências**: T-R18, T-R12

---

## 📊 Resumo Sprint 0

**Total de Tarefas**: 19
**Prioridade Alta**: 8 tarefas
**Prioridade Média**: 9 tarefas
**Prioridade Baixa**: 2 tarefas
**Estimativa Total**: 45-55 horas

**Ordem Sugerida de Implementação**:
1. T-R05 (Combustíveis) - 1h - Setup rápido
2. T-R03 (Tipos de Veículos) - 1-2h - Foundation
3. T-R01 (Copy PT-BR) - 2-3h - UX crítico
4. T-R06 (Modais Confirmação) - 2-3h - Segurança
5. T-R18 (Dados Seguro) - 1-2h - Setup
6. T-R04 (Últimas Manutenções) - 1h - Feature rápida
7. T-R02 (Cards Clicáveis) - 2-3h - Navegação
8. T-R11 (Click Card Veículo) - 0.5h - UX
9. T-R07 (Imagem Veículo) - 2-3h - Visual
10. T-R15 (Tipos Manutenção) - 1h - Dados
11. T-R17 (Separar Custos) - 2-3h - Estrutura
12. T-R12 (Página Detalhada) - 6-8h - Core feature
13. T-R13 (Gráficos) - 3-4h - Analytics
14. T-R14 (Botão Registrar) - 1h - UX
15. T-R08 (Perfil) - 4-5h - Feature completa
16. T-R09 (Firebase Functions) - 5-6h - Infraestrutura
17. T-R10 (Templates Email) - 3-4h - Design
18. T-R16 (Fotos Peças) - 3-4h - Feature adicional
19. T-R19 (Click-to-Call) - 0.5h - Final touch

---

## 📌 Backlog - Sprint 1: Sistema de Notificações

### T001 - Configurar Firebase Cloud Functions
- **Descrição**: Inicializar Firebase Functions no projeto para envio de emails
- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email
- **Prioridade**: 🔴 Alta
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Firebase Functions instalado (`firebase-tools`)
  - [ ] Pasta `functions/` criada com estrutura TypeScript
  - [ ] Deploy de função "hello world" funcionando
  - [ ] Documentação de setup em `docs/setup/`
- **Complexidade**: Média (2-3 horas)
- **Dependências**: Nenhuma

---

### T002 - Integrar SendGrid para Envio de Emails
- **Descrição**: Configurar SendGrid e criar templates de email
- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email
- **Prioridade**: 🔴 Alta
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Conta SendGrid criada e API key em variáveis de ambiente
  - [ ] Template de email para código de transferência
  - [ ] Template de email para manutenção próxima
  - [ ] Template de email para manutenção vencida
  - [ ] Função Firebase para enviar email genérico
  - [ ] Testes unitários das funções de email
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T001

---

### T003 - Implementar Envio de Emails em Transferências
- **Descrição**: Modificar store de transferências para chamar Cloud Function de envio de email
- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email
- **Prioridade**: 🔴 Alta
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Store `transfer.ts` chama função de email ao criar transferência
  - [ ] Email enviado para dono atual com código
  - [ ] Email enviado para novo dono com código
  - [ ] Tratamento de erros de envio
  - [ ] Logs de emails enviados
  - [ ] Testes E2E atualizados
- **Complexidade**: Baixa (1-2 horas)
- **Dependências**: T002

---

### T004 - Sistema de Alertas de Manutenção por Email
- **Descrição**: Cloud Function agendada para verificar manutenções próximas/vencidas e enviar emails
- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Firebase Scheduler configurado (cron job diário)
  - [ ] Função busca manutenções próximas (7 dias)
  - [ ] Função busca manutenções vencidas
  - [ ] Envia email para usuários com alertas
  - [ ] Log de emails enviados no Firestore
  - [ ] Opção de desativar emails no perfil do usuário
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T002

---

### T005 - Página de Configurações de Notificações
- **Descrição**: UI para usuário escolher tipos e canais de notificação
- **Origem**: ideia-expandida.md → #16 Sistema de Lembretes Personalizados
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Nova view `Settings.vue` criada
  - [ ] Rota `/settings` adicionada
  - [ ] Seção de notificações com toggles
  - [ ] Opções: email manutenções, email transferências, frequência
  - [ ] Store Pinia `settings.ts` criada
  - [ ] Dados salvos em `users/{userId}/settings`
  - [ ] Design responsivo
- **Complexidade**: Média (2-3 horas)
- **Dependências**: T004

---

## 📌 Backlog - Sprint 2: Documentação e Exportação

### T006 - Biblioteca de Geração de PDF
- **Descrição**: Integrar biblioteca para gerar PDFs de relatórios
- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Biblioteca escolhida (jsPDF ou pdfmake)
  - [ ] Instalada e configurada no projeto
  - [ ] Utilitário `generatePDF()` criado em `src/utils/`
  - [ ] Template base de PDF com logo e header
  - [ ] Exemplo de PDF gerado com dados mockados
- **Complexidade**: Baixa (1-2 horas)
- **Dependências**: Nenhuma

---

### T007 - Exportar Histórico de Veículo em PDF
- **Descrição**: Botão para gerar PDF com histórico completo de um veículo
- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Botão "Exportar PDF" em `VehicleDetails.vue`
  - [ ] PDF contém: dados do veículo, histórico de manutenções, gráfico de custos
  - [ ] Anexos renderizados (miniaturas de imagens/PDFs)
  - [ ] Formatação profissional (tabelas, cores)
  - [ ] Download automático do arquivo
  - [ ] Loading state durante geração
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T006

---

### T008 - Exportar Dados em Excel/CSV
- **Descrição**: Exportar tabelas de manutenções em formato Excel/CSV
- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Biblioteca escolhida (xlsx ou papaparse)
  - [ ] Botão "Exportar Excel" em `Maintenance.vue`
  - [ ] Arquivo contém todas as colunas relevantes
  - [ ] Formatação de datas e moeda
  - [ ] Nome do arquivo: `autocare-manutencoes-{vehicle}-{date}.xlsx`
  - [ ] Opção de exportar todos os veículos ou apenas um
- **Complexidade**: Baixa (2 horas)
- **Dependências**: Nenhuma

---

### T009 - Base de Conhecimento - Estrutura Inicial
- **Descrição**: Criar página de artigos/tutoriais sobre manutenção
- **Origem**: ideia-expandida.md → #19 Base de Conhecimento e Tutoriais
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Nova view `Knowledge.vue` criada
  - [ ] Rota `/knowledge` adicionada
  - [ ] Collection `articles` no Firestore
  - [ ] 5 artigos iniciais escritos (ex: trocar óleo, calibrar pneus)
  - [ ] Sistema de categorias (mecânica, elétrica, pneus, etc)
  - [ ] Busca por palavra-chave
  - [ ] Design de card de artigo responsivo
- **Complexidade**: Média (4-5 horas)
- **Dependências**: Nenhuma

---

### T010 - Adicionar Vídeos e Imagens em Artigos
- **Descrição**: Suporte a mídia rica nos artigos da base de conhecimento
- **Origem**: ideia-expandida.md → #19 Base de Conhecimento e Tutoriais
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Artigos suportam embed de YouTube
  - [ ] Imagens inline nos artigos
  - [ ] Markdown ou editor WYSIWYG para criar artigos
  - [ ] Preview de artigo antes de publicar
  - [ ] Admin panel para gerenciar artigos (futuro: CMS)
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T009

---

## 📌 Backlog - Sprint 3: Features de Engajamento

### T011 - Controle de Abastecimento
- **Descrição**: Funcionalidade para registrar abastecimentos e calcular consumo
- **Origem**: ideia-expandida.md → #14 Controle de Consumo de Combustível
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Interface `FuelRecord` criada
  - [ ] Collection `fuel_records` no Firestore
  - [ ] Store Pinia `fuel.ts` criada
  - [ ] Componente `FuelForm.vue` para registrar abastecimento
  - [ ] Campos: litros, preço total, km, data, tipo de combustível
  - [ ] Cálculo automático de km/l ou km/kWh
  - [ ] Listagem de abastecimentos por veículo
- **Complexidade**: Média (3-4 horas)
- **Dependências**: Nenhuma

---

### T012 - Gráficos de Consumo de Combustível
- **Descrição**: Visualização gráfica da evolução do consumo
- **Origem**: ideia-expandida.md → #14 Controle de Consumo de Combustível
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Biblioteca de gráficos instalada (Chart.js ou ApexCharts)
  - [ ] Gráfico de linha: consumo ao longo do tempo
  - [ ] Gráfico de barras: custo por mês
  - [ ] Indicador de consumo médio vs último abastecimento
  - [ ] Alertas visuais se consumo aumentar >15%
  - [ ] Página dedicada de estatísticas de combustível
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T011

---

### T013 - Checklist de Manutenção Preventiva
- **Descrição**: Criar checklist semanal/mensal de itens a verificar
- **Origem**: ideia-expandida.md → #15 Checklist de Manutenção Preventiva
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Interface `ChecklistItem` criada
  - [ ] Collection `checklists` no Firestore
  - [ ] Checklist padrão: pneus, óleo, luzes, freios, bateria, etc
  - [ ] Componente `Checklist.vue` com checkboxes
  - [ ] Histórico de checklists realizados
  - [ ] Frequência configurável (semanal, mensal)
  - [ ] Notificação para fazer checklist
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T004 (notificações)

---

### T014 - Dicas de Manutenção Preventiva por Item
- **Descrição**: Ao marcar item do checklist, mostrar dica contextual
- **Origem**: ideia-expandida.md → #15 Checklist de Manutenção Preventiva
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Cada item do checklist tem campo `tip` (string)
  - [ ] Tooltip ou modal com dica ao clicar no item
  - [ ] Dicas escritas para todos os itens padrão
  - [ ] Link para artigo relacionado na base de conhecimento (se houver)
- **Complexidade**: Baixa (1-2 horas)
- **Dependências**: T013, T009

---

## 📌 Backlog - Sprint 4: Integrações Externas

### T015 - Integração com Google Calendar (OAuth)
- **Descrição**: Conectar app com Google Calendar para criar eventos de manutenção
- **Origem**: ideia-expandida.md → #11 Integração com Calendário
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Google Calendar API habilitada no projeto
  - [ ] OAuth 2.0 configurado (credentials)
  - [ ] Fluxo de autenticação Google no frontend
  - [ ] Token de acesso salvo em Firestore (criptografado)
  - [ ] Botão "Conectar Google Calendar" na página de settings
  - [ ] Desconexão de calendário
- **Complexidade**: Alta (5-6 horas)
- **Dependências**: T005 (página de settings)

---

### T016 - Criar Eventos de Manutenção no Calendário
- **Descrição**: Ao agendar manutenção, criar evento automaticamente no Google Calendar
- **Origem**: ideia-expandida.md → #11 Integração com Calendário
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Ao salvar manutenção com `nextDueDate`, criar evento no calendário
  - [ ] Evento contém: título, descrição, data, lembrete (1 dia antes)
  - [ ] Se manutenção for editada, atualizar evento
  - [ ] Se manutenção for excluída, deletar evento
  - [ ] Tratamento de erros (ex: token expirado)
  - [ ] Opção de desativar sincronização automática
- **Complexidade**: Alta (4-5 horas)
- **Dependências**: T015

---

### T017 - Estrutura de Dados de Oficinas
- **Descrição**: Criar collection e interfaces para oficinas parceiras
- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Interface `ServiceProvider` criada
  - [ ] Collection `service_providers` no Firestore
  - [ ] Campos: nome, endereço, telefone, especialidades, horário, website
  - [ ] Campo `ratings` (array de avaliações)
  - [ ] Campo `location` (GeoPoint para busca por proximidade)
  - [ ] Seed de 10 oficinas mockadas para testes
  - [ ] Firestore rules para leitura pública, escrita apenas admin
- **Complexidade**: Baixa (2 horas)
- **Dependências**: Nenhuma

---

### T018 - Página de Diretório de Oficinas
- **Descrição**: Listar oficinas com filtros e busca
- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Nova view `ServiceProviders.vue` criada
  - [ ] Rota `/oficinas` adicionada
  - [ ] Listagem de oficinas em cards
  - [ ] Filtros: especialidade, avaliação, distância
  - [ ] Busca por nome ou cidade
  - [ ] Click no card abre modal com detalhes completos
  - [ ] Botão "Como Chegar" (link Google Maps)
  - [ ] Botão "Solicitar Orçamento" (futuro: T019)
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T017

---

### T019 - Integração com Google Maps
- **Descrição**: Mostrar oficinas em mapa e calcular distância
- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Google Maps API habilitada
  - [ ] Componente `MapView.vue` criado
  - [ ] Mapa mostra marcadores de oficinas próximas
  - [ ] Marcador da localização do usuário (se permitir geolocalização)
  - [ ] Cálculo de distância em km
  - [ ] Ordenação por proximidade
  - [ ] Rota até a oficina (link para Google Maps)
- **Complexidade**: Alta (5-6 horas)
- **Dependências**: T018

---

### T020 - Sistema de Avaliações de Oficinas
- **Descrição**: Usuários podem avaliar oficinas após serviço
- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Subcollection `ratings` em `service_providers/{id}/ratings`
  - [ ] Modal para adicionar avaliação (estrelas + comentário)
  - [ ] Validação: apenas 1 avaliação por usuário por oficina
  - [ ] Exibição de avaliações na página da oficina
  - [ ] Cálculo de média de estrelas
  - [ ] Moderação de comentários (flag de denúncia)
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T018

---

## 📌 Backlog - Sprint 5: Monetização e Gamificação

### T021 - Estrutura de Planos e Stripe
- **Descrição**: Integrar Stripe para pagamentos recorrentes
- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium
- **Prioridade**: 🔴 Alta (monetização)
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Stripe account criado e configurado
  - [ ] 3 produtos criados no Stripe (Free, Pro, Business)
  - [ ] Preços definidos (ex: R$0, R$19.90, R$99.90/mês)
  - [ ] Stripe SDK instalado no frontend
  - [ ] Firebase Extension "Run Payments with Stripe" instalada
  - [ ] Webhook de pagamento configurado
  - [ ] Campo `subscriptionStatus` em `users`
- **Complexidade**: Alta (6-8 horas)
- **Dependências**: Nenhuma

---

### T022 - Página de Pricing com Checkout
- **Descrição**: Landing page de preços com botão de assinar
- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium
- **Prioridade**: 🔴 Alta
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] View `Pricing.vue` atualizada com planos reais
  - [ ] Botão "Assinar" redireciona para Stripe Checkout
  - [ ] Após pagamento, usuário retorna ao app
  - [ ] Status de assinatura atualizado no Firestore
  - [ ] Badge "Pro" ou "Business" no navbar
  - [ ] Trial de 30 dias para novos usuários
- **Complexidade**: Média (4-5 horas)
- **Dependências**: T021

---

### T023 - Controle de Acesso por Plano
- **Descrição**: Restringir funcionalidades baseado no plano do usuário
- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium
- **Prioridade**: 🔴 Alta
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Middleware de verificação de plano
  - [ ] Free: máximo 2 veículos
  - [ ] Pro: veículos ilimitados, relatórios PDF
  - [ ] Business: API, dashboard avançado, suporte prioritário
  - [ ] Modais de upsell quando usuário atinge limite
  - [ ] Testes E2E para cada plano
- **Complexidade**: Média (3-4 horas)
- **Dependências**: T022

---

### T024 - Sistema de Pontos e Badges
- **Descrição**: Gamificação com pontos por ações realizadas
- **Origem**: ideia-expandida.md → #17 Gamificação e Conquistas
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Interface `Achievement` criada
  - [ ] Collection `achievements` no Firestore
  - [ ] Pontos ganhos por: registrar manutenção, fazer checklist, não atrasar
  - [ ] 10 badges iniciais criados (ex: "Primeira Manutenção", "3 Meses Sem Atraso")
  - [ ] Store `gamification.ts` criada
  - [ ] Componente `AchievementBadge.vue` para exibir badges
  - [ ] Página de perfil mostra badges conquistados
- **Complexidade**: Média (4-5 horas)
- **Dependências**: Nenhuma

---

### T025 - Ranking e Leaderboard (Opcional)
- **Descrição**: Ranking público de usuários mais organizados
- **Origem**: ideia-expandida.md → #17 Gamificação e Conquistas
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Critérios de Aceitação**:
  - [ ] Nova view `Leaderboard.vue` criada
  - [ ] Rota `/ranking` adicionada
  - [ ] Top 100 usuários por pontos
  - [ ] Usuário pode optar por aparecer ou não no ranking
  - [ ] Filtro por período (mensal, anual, all-time)
  - [ ] Avatar e nickname anônimo (privacidade)
- **Complexidade**: Média (3 horas)
- **Dependências**: T024

---

## 📌 Backlog - Futuro (Sem Sprint Definida)

### T026 - Internacionalização (i18n)
- **Descrição**: Suporte a múltiplos idiomas (PT, EN, ES)
- **Origem**: ideia-expandida.md → #21 Internacionalização
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Complexidade**: Alta (8-10 horas)

---

### T027 - Sugestões Inteligentes por IA
- **Descrição**: Machine Learning para prever problemas e sugerir manutenções
- **Origem**: ideia-expandida.md → #18 Sugestões Inteligentes por IA
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Complexidade**: Muito Alta (20+ horas + treinamento de modelo)

---

### T028 - Controle de Garantias Detalhado
- **Descrição**: Sistema completo de gestão de garantias de peças e serviços
- **Origem**: ideia-expandida.md → #20 Controle de Garantias Detalhado
- **Prioridade**: 🟡 Média
- **Status**: ⏳ Pendente
- **Complexidade**: Média (4-5 horas)

---

### T029 - API REST para Integração Externa
- **Descrição**: Expor API REST para integração com sistemas de frotas
- **Origem**: Planejado para plano Business
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Complexidade**: Alta (12-15 horas)

---

### T030 - Aplicativo Mobile Nativo
- **Descrição**: Versão mobile nativa (React Native ou Flutter)
- **Origem**: Expansão futura
- **Prioridade**: 🟢 Baixa
- **Status**: ⏳ Pendente
- **Complexidade**: Muito Alta (60+ horas)

---

## ✅ Tarefas Concluídas

### ✔️ T000 - Sistema Base Completo
- **Descrição**: Landing page, autenticação, CRUD de veículos, manutenções, transferências
- **Origem**: ideia-base.md
- **Status**: ✅ Concluída
- **Concluído em**: Dezembro 2024
- **Aprendizados**:
  - Armazenamento Base64 mais econômico que Firebase Storage
  - Testes E2E essenciais para confiabilidade
  - Design responsivo deve ser mobile-first desde o início

---

## 📊 Estatísticas do Backlog

- **Total de Tarefas**: 31
- **Concluídas**: 1 (3.2%)
- **Em Progresso**: 0
- **Pendentes**: 30 (96.8%)
- **Bloqueadas**: 0
- **Canceladas**: 0

**Distribuição por Prioridade**:
- 🔴 Alta: 6 tarefas
- 🟡 Média: 15 tarefas
- 🟢 Baixa: 10 tarefas

**Distribuição por Sprint**:
- Sprint 1 (Notificações): 5 tarefas
- Sprint 2 (Documentação): 5 tarefas
- Sprint 3 (Engajamento): 4 tarefas
- Sprint 4 (Integrações): 6 tarefas
- Sprint 5 (Monetização): 5 tarefas
- Futuro: 6 tarefas

---

## 📝 Convenções

- **IDs de Tarefa**: T001, T002, ... (sequencial)
- **Ao completar**: Mover para seção "Concluídas" com data e aprendizados
- **Bloqueios**: Documentar o que está impedindo a tarefa
- **Critérios de Aceitação**: Devem ser testáveis e mensuráveis
- **Referências**: Sempre linkar de volta para `ideia-expandida.md`

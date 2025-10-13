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

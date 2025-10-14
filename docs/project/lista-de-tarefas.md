# 📋 Lista de Tarefas - AutoCare Platform

## 🎯 Sobre Este Documento

Esta é a **lista de execução** do projeto. Contém apenas as tarefas **pendentes** e **em progresso**. 

**📜 Tarefas concluídas**: Veja `historico-tarefas.md`

**Status possíveis:**
- ⏳ **Pendente**: Não iniciada
- � **Em Progresso**: Sendo trabalhada atualmente
- � **Bloqueada**: Aguardando dependência
- ❌ **Cancelada**: Descartada

---

## � Tarefas em Progresso

> Nenhuma tarefa em progresso no momento.

---

## � SPRINT 0: Refinamentos Finais

> **Status Sprint 0**: ✅ 100% COMPLETO (14/10/2025)
> 
> Todas as 14 tarefas do Sprint 0 foram finalizadas com sucesso!
> Ver detalhes completos em `historico-tarefas.md`

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

## 🆕 Melhorias Pendentes do Sprint 0 (Refinamentos Opcionais)

As tarefas a seguir foram identificadas durante o Sprint 0 mas não eram críticas para lançamento.
Podem ser implementadas quando necessário.

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

## 📊 Estatísticas do Roadmap

**Status Atual**:
- **Sprint 0**: ✅ 100% completo (14 tarefas) - Ver `historico-tarefas.md`
- **Refinamentos Opcionais**: 5 tarefas
- **Sprint 1-5 + Futuro**: 26 tarefas

**Total de Tarefas Pendentes**: 31

**Distribuição por Prioridade**:
- 🔴 Alta: 6 tarefas (19%)
- 🟡 Média: 15 tarefas (48%)
- 🟢 Baixa: 10 tarefas (33%)

**Distribuição por Sprint**:
- **Refinamentos Opcionais**: 5 tarefas
- **Sprint 1** (Notificações): 5 tarefas
- **Sprint 2** (Documentação): 5 tarefas
- **Sprint 3** (Engajamento): 4 tarefas
- **Sprint 4** (Integrações): 6 tarefas
- **Sprint 5** (Monetização): 5 tarefas
- **Futuro**: 6 tarefas

---

## 📝 Convenções

- **IDs de Tarefa**: T001, T002, ... (sequencial)
- **Ao completar**: Mover para seção "Concluídas" com data e aprendizados
- **Bloqueios**: Documentar o que está impedindo a tarefa
- **Critérios de Aceitação**: Devem ser testáveis e mensuráveis
- **Referências**: Sempre linkar de volta para `ideia-expandida.md`

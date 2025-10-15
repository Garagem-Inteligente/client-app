# 📋 Lista de Tarefas - AutoCare Platform# 📋 Lista de Tarefas - AutoCare Platform



## 🎯 Sobre Este Documento## 🎯 Sobre Este Documento



Esta é a **lista de execução** do projeto. Contém apenas as tarefas **pendentes** e **em progresso**. Esta é a **lista de execução** do projeto. Contém apenas as tarefas **pendentes** e **em progresso**. 



**📜 Tarefas concluídas**: Veja `historico-tarefas.md`**📜 Tarefas concluídas**: Veja `historico-tarefas.md`



**Status possíveis:****Status possíveis:**

- ⏳ **Pendente**: Não iniciada- ⏳ **Pendente**: Não iniciada

- 🔄 **Em Progresso**: Sendo trabalhada atualmente- � **Em Progresso**: Sendo trabalhada atualmente

- 🚫 **Bloqueada**: Aguardando dependência- � **Bloqueada**: Aguardando dependência

- ❌ **Cancelada**: Descartada- ❌ **Cancelada**: Descartada



------



## 🔥 Tarefas em Progresso## � Tarefas em Progresso



> Nenhuma tarefa em progresso no momento.> Nenhuma tarefa em progresso no momento.



------



## 📌 SPRINT 0: Status## � SPRINT 0: Refinamentos Finais



> **Status Sprint 0**: ✅ 100% COMPLETO (14/10/2025)> **Status Sprint 0**: ✅ 100% COMPLETO (14/10/2025)

> > 

> **Concluídas**: 16 tarefas> Todas as 14 tarefas do Sprint 0 foram finalizadas com sucesso!

> - T-R01 a T-R14 (Sprint 0 original)> Ver detalhes completos em `historico-tarefas.md`

> - T-R18 e T-R19 (dados de seguro - implementadas adicionalmente)

> ---

> Ver detalhes completos em `historico-tarefas.md`

### T-R15 - Expandir Tipos de Manutenção

---- **Descrição**: Adicionar mais opções pré-cadastradas e campo customizado

- **Origem**: Feedback do usuário - melhorias de robustez

## 🆕 Refinamentos Opcionais (Features Adicionais)- **Prioridade**: 🟡 Média

- **Status**: ⏳ Pendente

As tarefas a seguir são melhorias identificadas mas não críticas para operação.- **Tipos Atuais**: oil_change, tire_rotation, brake_service, general_inspection, other

Podem ser implementadas quando houver necessidade/demanda.- **Novos Tipos a Adicionar**:

  - Alinhamento e Balanceamento

---  - Suspensão

  - Ar-condicionado

### T-R15 - Expandir Tipos de Manutenção  - Bateria

- **Descrição**: Adicionar mais opções pré-cadastradas e campo customizado  - Sistema Elétrico

- **Origem**: Feedback do usuário - melhorias de robustez  - Embreagem

- **Prioridade**: 🟡 Média  - Transmissão

- **Status**: ⏳ Pendente  - Filtros (óleo, ar, combustível, cabine)

- **Tipos Atuais**: oil_change, tire_rotation, brake_service, general_inspection, other  - Correia Dentada

- **Novos Tipos a Adicionar**:  - Velas de Ignição

  - Alinhamento e Balanceamento  - Limpeza de Bicos Injetores

  - Suspensão  - Revisão Geral

  - Ar-condicionado  - Outros (customizado)

  - Bateria- **Critérios de Aceitação**:

  - Sistema Elétrico  - [ ] Interface MaintenanceRecord atualizada com novos tipos

  - Embreagem  - [ ] Select no formulário com todos os tipos

  - Transmissão  - [ ] Campo `customName` para quando type = "other"

  - Filtros (óleo, ar, combustível, cabine)  - [ ] Exibir customName quando disponível

  - Correia Dentada  - [ ] Labels em português claro

  - Velas de Ignição- **Complexidade**: Baixa (1 hora)

  - Limpeza de Bicos Injetores- **Dependências**: Nenhuma

  - Revisão Geral

  - Outros (customizado)---

- **Critérios de Aceitação**:

  - [ ] Interface MaintenanceRecord atualizada com novos tipos### T-R16 - Fotos de Peças (Antes/Depois)

  - [ ] Select no formulário com todos os tipos- **Descrição**: Permitir upload de fotos das peças trocadas

  - [ ] Campo `customName` para quando type = "other"- **Origem**: Feedback do usuário - melhorias de robustez

  - [ ] Exibir customName quando disponível- **Prioridade**: 🟢 Baixa

  - [ ] Labels em português claro- **Status**: ⏳ Pendente

- **Complexidade**: Baixa (1 hora)- **Critérios de Aceitação**:

- **Dependências**: Nenhuma  - [ ] Campos `beforePhotos` e `afterPhotos` em MaintenanceRecord

  - [ ] Seção no formulário de manutenção para upload

---  - [ ] Limite: 5 fotos antes + 5 fotos depois

  - [ ] Preview em grid

### T-R16 - Fotos de Peças (Antes/Depois)  - [ ] Compressão automática (max 1MB por foto)

- **Descrição**: Permitir upload de fotos das peças trocadas  - [ ] Galeria de fotos na visualização da manutenção

- **Origem**: Feedback do usuário - melhorias de robustez  - [ ] Lightbox para visualizar fotos em tamanho maior

- **Prioridade**: 🟢 Baixa- **Complexidade**: Média (3-4 horas)

- **Status**: ⏳ Pendente- **Dependências**: T-R07 (componente de upload de imagem)

- **Critérios de Aceitação**:

  - [ ] Campos `beforePhotos` e `afterPhotos` em MaintenanceRecord---

  - [ ] Seção no formulário de manutenção para upload

  - [ ] Limite: 5 fotos antes + 5 fotos depois### T-R17 - Separar Custos (Mão de Obra + Peças)

  - [ ] Preview em grid- **Descrição**: Dividir campo cost em laborCost e partsCost

  - [ ] Compressão automática (max 1MB por foto)- **Origem**: Feedback do usuário - melhorias de robustez

  - [ ] Galeria de fotos na visualização da manutenção- **Prioridade**: 🟡 Média

  - [ ] Lightbox para visualizar fotos em tamanho maior- **Status**: ⏳ Pendente

- **Complexidade**: Média (3-4 horas)- **Critérios de Aceitação**:

- **Dependências**: Nenhuma (sistema de upload já existe)  - [ ] Interface MaintenanceRecord atualizada: `laborCost`, `partsCost`

  - [ ] Computed `totalCost` = laborCost + partsCost

---  - [ ] Formulário com dois campos separados

  - [ ] Migração de dados existentes (cost → partsCost, laborCost = 0)

### T-R17 - Separar Custos (Mão de Obra + Peças)  - [ ] Gráficos mostram breakdown de custos

- **Descrição**: Dividir campo cost em laborCost e partsCost  - [ ] Estatísticas separadas por tipo de custo

- **Origem**: Feedback do usuário - melhorias de robustez- **Complexidade**: Média (2-3 horas)

- **Prioridade**: 🟡 Média- **Dependências**: T-R13 (gráficos)

- **Status**: ⏳ Pendente

- **Critérios de Aceitação**:---

  - [ ] Interface MaintenanceRecord atualizada: `laborCost`, `partsCost`

  - [ ] Computed `totalCost` = laborCost + partsCost### T-R18 - Dados do Seguro no Veículo

  - [ ] Formulário com dois campos separados- **Descrição**: Adicionar campos relacionados ao seguro do veículo

  - [ ] Migração de dados existentes (cost → partsCost, laborCost = 0)- **Origem**: Feedback do usuário - melhorias de robustez

  - [ ] Gráficos mostram breakdown de custos- **Prioridade**: 🟡 Média

  - [ ] Estatísticas separadas por tipo de custo- **Status**: ⏳ Pendente

- **Complexidade**: Média (2-3 horas)- **Campos a Adicionar**:

- **Dependências**: Nenhuma (gráficos já existem)  - `insuranceCompany` (string)

  - `insurancePhone` (string com máscara)

---  - `insurancePolicyNumber` (string)

  - `insuranceExpiryDate` (Date)

## 📌 Backlog - Sprint 1: Sistema de Notificações Avançadas  - `insuranceValue` (number)

- **Critérios de Aceitação**:

> **Nota Importante**: Firebase Functions e SendGrid **JÁ ESTÃO** configurados! ✅  - [ ] Interface Vehicle atualizada

>   - [ ] Seção "Seguro" no formulário de veículo

> **Implementado no Sprint 0** (ver `historico-tarefas.md`):  - [ ] Todos os campos opcionais

> - ✅ T-R09: Firebase Functions v2 com 3 Cloud Functions  - [ ] Máscara de telefone brasileiro

> - ✅ T-R10: 5 templates HTML de email  - [ ] Alerta se seguro próximo de vencer (30 dias)

> - ✅ SendGrid integrado com API Keys em secrets  - [ ] Validação de data de vencimento

> - ✅ Funções: sendTransferEmail, sendMaintenanceAlert, sendWelcomeEmail- **Complexidade**: Baixa (1-2 horas)

>- **Dependências**: Nenhuma

> As tarefas abaixo são **funcionalidades adicionais** de notificação.

---

---

### T-R19 - Botão Click-to-Call Seguro

### T004 - Sistema de Alertas de Manutenção Agendado- **Descrição**: Adicionar botão para ligar diretamente para seguro

- **Descrição**: Cloud Function agendada para verificar manutenções próximas/vencidas automaticamente- **Origem**: Feedback do usuário - melhorias de robustez

- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email- **Prioridade**: 🟢 Baixa

- **Prioridade**: 🟡 Média- **Status**: ⏳ Pendente

- **Status**: ⏳ Pendente- **Critérios de Aceitação**:

- **Nota**: Função de envio já existe (sendMaintenanceAlert), falta apenas configurar o scheduler  - [ ] Botão "Ligar para Seguro" em VehicleDetails (seção Seguro)

- **Critérios de Aceitação**:  - [ ] Usa `tel:` link com número cadastrado

  - [ ] Firebase Scheduler configurado (cron job diário - ex: 8h da manhã)  - [ ] Ícone de telefone + número formatado

  - [ ] Função busca manutenções próximas (próximos 7 dias)  - [ ] Apenas exibido se insurancePhone estiver preenchido

  - [ ] Função busca manutenções vencidas (atrasadas)  - [ ] Botão também no header da página (acesso rápido)

  - [ ] Envia email automático usando função sendMaintenanceAlert existente  - [ ] Confirmação antes de discar (opcional)

  - [ ] Log de emails enviados no Firestore- **Complexidade**: Baixa (30 minutos)

  - [ ] Opção de desativar emails no perfil do usuário- **Dependências**: T-R18, T-R12

- **Complexidade**: Baixa (1-2 horas) - infraestrutura já existe

- **Dependências**: Nenhuma (SendGrid já configurado)---



---## 🆕 Melhorias Pendentes do Sprint 0 (Refinamentos Opcionais)



### T005 - Página de Configurações de NotificaçõesAs tarefas a seguir foram identificadas durante o Sprint 0 mas não eram críticas para lançamento.

- **Descrição**: UI para usuário escolher tipos e canais de notificaçãoPodem ser implementadas quando necessário.

- **Origem**: ideia-expandida.md → #16 Sistema de Lembretes Personalizados

- **Prioridade**: 🟡 Média---

- **Status**: ⏳ Pendente

- **Critérios de Aceitação**:## 📌 Backlog - Sprint 1: Sistema de Notificações

  - [ ] Nova view `Settings.vue` criada

  - [ ] Rota `/settings` adicionada no router### T001 - Configurar Firebase Cloud Functions

  - [ ] Seção de notificações com toggles (switches)- **Descrição**: Inicializar Firebase Functions no projeto para envio de emails

  - [ ] Opções: receber email de manutenções, email de transferências, frequência de lembretes- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email

  - [ ] Store Pinia `settings.ts` criada- **Prioridade**: 🔴 Alta

  - [ ] Dados salvos em `users/{userId}/settings` no Firestore- **Status**: ⏳ Pendente

  - [ ] Design responsivo com layout de configurações- **Critérios de Aceitação**:

- **Complexidade**: Média (2-3 horas)  - [ ] Firebase Functions instalado (`firebase-tools`)

- **Dependências**: Nenhuma  - [ ] Pasta `functions/` criada com estrutura TypeScript

  - [ ] Deploy de função "hello world" funcionando

---  - [ ] Documentação de setup em `docs/setup/`

- **Complexidade**: Média (2-3 horas)

- **Dependências**: Nenhuma

---

### T006 - Melhorar Lógica de Transferência de Veículos �
- **Descrição**: Sistema inteligente de pré-cadastro para transferências
- **Origem**: Feedback do usuário - experiência de transferência
- **Prioridade**: 🔴 **ALTA - PRIORIDADE MÁXIMA**
- **Status**: ⏳ Pendente
- **Motivação**: Transferência atual requer que destinatário já esteja cadastrado, criando atrito.
- **Solução Proposta**:
  1. Verificar se email do destinatário existe na plataforma
  2. Se não existir, criar pré-cadastro automático
  3. Enviar email com credenciais temporárias + código de transferência
  4. Destinatário loga, define senha definitiva, informa código
  5. Sistema valida código e finaliza transferência com histórico completo
  6. Veículo transferido aparece na nova conta
  7. Conta do antigo dono mostra seção "Veículos Transferidos"
- **Critérios de Aceitação**:
  - [ ] Função `checkUserExists(email)` em auth.ts
  - [ ] Função `createPreRegistration(email, vehicleData)` com senha temporária
  - [ ] Email template "transfer-with-credentials.html" com credenciais e código
  - [ ] Campo "código de transferência" na tela de login
  - [ ] Validação de código em Cloud Function
  - [ ] Seção "Veículos Transferidos" no dashboard do antigo dono
  - [ ] Mostrar histórico de transferências (data, destinatário, veículo)
  - [ ] Status do pré-cadastro (pendente, aceito, expirado)
  - [ ] Expiração de código após 7 dias
  - [ ] Notificação quando transferência for aceita
- **Complexidade**: Alta (6-8 horas)
- **Dependências**: T-R09 (Firebase Functions), T-R10 (SendGrid)

---

### T007 - Plataforma para Oficinas Mecânicas 🚀
- **Descrição**: Sistema completo B2B2C para oficinas gerenciarem clientes e manutenções
- **Origem**: Expansão estratégica do produto
- **Prioridade**: 🔴 **ALTA - FEATURE PRINCIPAL FUTURA**
- **Status**: 🔄 **EM PROGRESSO** (Esqueleto inicial criado em 14/10/2025)
- **Motivação**: Expandir plataforma para oficinas parceiras, criando ecossistema completo.

**✅ Implementado até agora**:
- [x] Store Pinia `workshops.ts` com interfaces e stubs de ações
- [x] View placeholder `Workshops.vue` com layout básico
- [x] Rota protegida `/workshops` configurada
- [x] Link "Oficinas" adicionado ao Navbar
- [x] Build validado sem erros

**🎯 Próximos passos**:
- [ ] Implementar coleções Firestore (`workshops`, `job_orders`)
- [ ] UI de cadastro de oficina
- [ ] UI de listagem de ordens de serviço
- [ ] Sistema de aprovação de manutenções

- **Módulos**:

  **1. Cadastro e Perfil de Oficina**
  - Oficinas se cadastram como tipo "workshop" (vs "user")
  - Dados: nome, CNPJ, endereço, especialidades, horário
  - Fotos da oficina, certificações
  - Verificação de CNPJ via API (opcional)

  **2. Cadastro de Manutenção pela Oficina**
  - Oficina informa placa do veículo
  - Sistema verifica se placa existe na plataforma
  - Se existir: envia notificação para o proprietário aprovar
  - Se não existir: solicita dados básicos do cliente
  - Oficina preenche: descrição, tipo, custos (peças + mão de obra), garantias
  - Upload de fotos antes/depois
  - Proprietário aprova ou rejeita via notificação

  **3. Dashboard da Oficina**
  - Lista de clientes (com histórico de manutenções)
  - Manutenções pendentes de aprovação
  - Manutenções realizadas (por período)
  - Estatísticas: receita, tipos de serviço mais comuns
  - Avaliações recebidas

  **4. Permissões e Restrições**
  - Oficina **edita** manutenção que cadastrou
  - Cliente **apenas visualiza** manutenção de oficina
  - Cliente pode adicionar comentário/reclamação
  - Tab separada "Manutenções de Oficinas" com badge
  - Badge visual diferenciando manutenção própria vs oficina

  **5. Avaliação e Busca de Oficinas**
  - Cliente pode avaliar oficina após manutenção (1-5 estrelas + comentário)
  - Página de busca de oficinas por localização
  - Filtros: especialidade, avaliação, preço médio
  - Perfil público da oficina com avaliações

  **6. Agendamento de Manutenção**
  - Cliente solicita agendamento com oficina
  - Oficina aceita ou propõe novo horário
  - Sistema de confirmação bidirecional
  - Notificações de lembrete 24h antes
  - Cliente pode cancelar até 12h antes

- **Critérios de Aceitação**:
  - [ ] Novo tipo de usuário: "workshop" em auth
  - [ ] Formulário de cadastro diferenciado para oficinas
  - [ ] Dashboard `/workshop/dashboard` com estatísticas
  - [ ] Função Cloud `verifyVehiclePlate(plate)` retorna userId ou null
  - [ ] Sistema de aprovação de manutenção (pending → approved → completed)
  - [ ] Notificações para cliente quando oficina cadastra manutenção
  - [ ] Tab "Minhas Manutenções" vs "Manutenções de Oficinas" em Vehicles
  - [ ] Badge "Registrado por [Nome Oficina]" em MaintenanceRecord
  - [ ] Sistema de avaliações (collection `workshop_reviews`)
  - [ ] View `/workshops` para busca e listagem
  - [ ] Sistema de agendamento (collection `appointments`)
  - [ ] Email templates para agendamento (solicitação, confirmação, lembrete)
  - [ ] Permissões: oficina não pode editar veículo, apenas manutenções próprias
  - [ ] Lista de clientes da oficina (veículos que atendeu)
  - [ ] Histórico completo de interações oficina-cliente
- **Complexidade**: Muito Alta (40-50 horas) - **ÉPICO, dividir em subtarefas**
- **Dependências**: T-R03 (autenticação), T-R09 (Functions), sistema de notificações completo
- **Nota**: Este é um **épico** que deve ser quebrado em 15-20 tarefas menores no futuro

---

## 📌 Backlog - Sprint 2: Documentação e Exportação



### T006 - Biblioteca de Geração de PDF---

- **Descrição**: Integrar biblioteca para gerar PDFs de relatórios

- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados### T002 - Integrar SendGrid para Envio de Emails

- **Prioridade**: 🟡 Média- **Descrição**: Configurar SendGrid e criar templates de email

- **Status**: ⏳ Pendente- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email

- **Critérios de Aceitação**:- **Prioridade**: 🔴 Alta

  - [ ] Biblioteca escolhida (jsPDF ou pdfmake)- **Status**: ⏳ Pendente

  - [ ] Instalada e configurada no projeto (`npm install`)- **Critérios de Aceitação**:

  - [ ] Utilitário `generatePDF()` criado em `src/utils/pdf.ts`  - [ ] Conta SendGrid criada e API key em variáveis de ambiente

  - [ ] Template base de PDF com logo e header AutoCare  - [ ] Template de email para código de transferência

  - [ ] Exemplo de PDF gerado com dados mockados para teste  - [ ] Template de email para manutenção próxima

- **Complexidade**: Baixa (1-2 horas)  - [ ] Template de email para manutenção vencida

- **Dependências**: Nenhuma  - [ ] Função Firebase para enviar email genérico

  - [ ] Testes unitários das funções de email

---- **Complexidade**: Média (3-4 horas)

- **Dependências**: T001

### T007 - Exportar Histórico de Veículo em PDF

- **Descrição**: Botão para gerar PDF com histórico completo de um veículo---

- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados

- **Prioridade**: 🟡 Média### T003 - Implementar Envio de Emails em Transferências

- **Status**: ⏳ Pendente- **Descrição**: Modificar store de transferências para chamar Cloud Function de envio de email

- **Critérios de Aceitação**:- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email

  - [ ] Botão "Exportar PDF" em `VehicleDetails.vue` (Tab Manutenções)- **Prioridade**: 🔴 Alta

  - [ ] PDF contém: dados do veículo, histórico completo de manutenções, gráfico de custos- **Status**: ⏳ Pendente

  - [ ] Anexos renderizados como miniaturas (imagens/PDFs)- **Critérios de Aceitação**:

  - [ ] Formatação profissional (tabelas, cores, tipografia)  - [ ] Store `transfer.ts` chama função de email ao criar transferência

  - [ ] Download automático do arquivo com nome `autocare-{placa}-{data}.pdf`  - [ ] Email enviado para dono atual com código

  - [ ] Loading state durante geração do PDF  - [ ] Email enviado para novo dono com código

- **Complexidade**: Média (3-4 horas)  - [ ] Tratamento de erros de envio

- **Dependências**: T006  - [ ] Logs de emails enviados

  - [ ] Testes E2E atualizados

---- **Complexidade**: Baixa (1-2 horas)

- **Dependências**: T002

### T008 - Exportar Dados em Excel/CSV

- **Descrição**: Exportar tabelas de manutenções em formato Excel/CSV---

- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados

- **Prioridade**: 🟢 Baixa### T004 - Sistema de Alertas de Manutenção por Email

- **Status**: ⏳ Pendente- **Descrição**: Cloud Function agendada para verificar manutenções próximas/vencidas e enviar emails

- **Critérios de Aceitação**:- **Origem**: ideia-expandida.md → #10 Sistema de Notificações por Email

  - [ ] Biblioteca escolhida (xlsx ou papaparse para CSV)- **Prioridade**: 🟡 Média

  - [ ] Botão "Exportar Excel" em `Maintenance.vue`- **Status**: ⏳ Pendente

  - [ ] Arquivo contém todas as colunas: data, tipo, custo, km, próxima manutenção- **Critérios de Aceitação**:

  - [ ] Formatação correta de datas (DD/MM/YYYY) e moeda (R$ 0,00)  - [ ] Firebase Scheduler configurado (cron job diário)

  - [ ] Nome do arquivo: `autocare-manutencoes-{vehicle}-{date}.xlsx`  - [ ] Função busca manutenções próximas (7 dias)

  - [ ] Opção de exportar todos os veículos ou apenas um selecionado  - [ ] Função busca manutenções vencidas

- **Complexidade**: Baixa (2 horas)  - [ ] Envia email para usuários com alertas

- **Dependências**: Nenhuma  - [ ] Log de emails enviados no Firestore

  - [ ] Opção de desativar emails no perfil do usuário

---- **Complexidade**: Média (3-4 horas)

- **Dependências**: T002

### T009 - Base de Conhecimento - Estrutura Inicial

- **Descrição**: Criar página de artigos/tutoriais sobre manutenção---

- **Origem**: ideia-expandida.md → #19 Base de Conhecimento e Tutoriais

- **Prioridade**: 🟢 Baixa### T005 - Página de Configurações de Notificações

- **Status**: ⏳ Pendente- **Descrição**: UI para usuário escolher tipos e canais de notificação

- **Critérios de Aceitação**:- **Origem**: ideia-expandida.md → #16 Sistema de Lembretes Personalizados

  - [ ] Nova view `Knowledge.vue` criada- **Prioridade**: 🟡 Média

  - [ ] Rota `/knowledge` adicionada- **Status**: ⏳ Pendente

  - [ ] Collection `articles` no Firestore com estrutura definida- **Critérios de Aceitação**:

  - [ ] 5 artigos iniciais escritos (ex: trocar óleo, calibrar pneus, trocar filtro)  - [ ] Nova view `Settings.vue` criada

  - [ ] Sistema de categorias (mecânica, elétrica, pneus, etc)  - [ ] Rota `/settings` adicionada

  - [ ] Busca por palavra-chave/título  - [ ] Seção de notificações com toggles

  - [ ] Design de card de artigo responsivo  - [ ] Opções: email manutenções, email transferências, frequência

- **Complexidade**: Média (4-5 horas)  - [ ] Store Pinia `settings.ts` criada

- **Dependências**: Nenhuma  - [ ] Dados salvos em `users/{userId}/settings`

  - [ ] Design responsivo

---- **Complexidade**: Média (2-3 horas)

- **Dependências**: T004

### T010 - Adicionar Vídeos e Imagens em Artigos

- **Descrição**: Suporte a mídia rica nos artigos da base de conhecimento---

- **Origem**: ideia-expandida.md → #19 Base de Conhecimento e Tutoriais

- **Prioridade**: 🟢 Baixa## 📌 Backlog - Sprint 2: Documentação e Exportação

- **Status**: ⏳ Pendente

- **Critérios de Aceitação**:### T006 - Biblioteca de Geração de PDF

  - [ ] Artigos suportam embed de YouTube (iframe)- **Descrição**: Integrar biblioteca para gerar PDFs de relatórios

  - [ ] Imagens inline nos artigos (upload Base64)- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados

  - [ ] Markdown ou editor WYSIWYG para criar artigos- **Prioridade**: 🟡 Média

  - [ ] Preview de artigo antes de publicar- **Status**: ⏳ Pendente

  - [ ] Admin panel simples para gerenciar artigos (futuro: CMS completo)- **Critérios de Aceitação**:

- **Complexidade**: Média (3-4 horas)  - [ ] Biblioteca escolhida (jsPDF ou pdfmake)

- **Dependências**: T009  - [ ] Instalada e configurada no projeto

  - [ ] Utilitário `generatePDF()` criado em `src/utils/`

---  - [ ] Template base de PDF com logo e header

  - [ ] Exemplo de PDF gerado com dados mockados

## 📌 Backlog - Sprint 3: Features de Engajamento- **Complexidade**: Baixa (1-2 horas)

- **Dependências**: Nenhuma

### T011 - Controle de Abastecimento

- **Descrição**: Funcionalidade para registrar abastecimentos e calcular consumo---

- **Origem**: ideia-expandida.md → #14 Controle de Consumo de Combustível

- **Prioridade**: 🟡 Média### T007 - Exportar Histórico de Veículo em PDF

- **Status**: ⏳ Pendente- **Descrição**: Botão para gerar PDF com histórico completo de um veículo

- **Critérios de Aceitação**:- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados

  - [ ] Interface `FuelRecord` criada (tipo TypeScript)- **Prioridade**: 🟡 Média

  - [ ] Collection `fuel_records` no Firestore- **Status**: ⏳ Pendente

  - [ ] Store Pinia `fuel.ts` criada para gerenciar abastecimentos- **Critérios de Aceitação**:

  - [ ] Componente `FuelForm.vue` para registrar abastecimento  - [ ] Botão "Exportar PDF" em `VehicleDetails.vue`

  - [ ] Campos: litros, preço total, km atual, data, tipo de combustível  - [ ] PDF contém: dados do veículo, histórico de manutenções, gráfico de custos

  - [ ] Cálculo automático de km/l (gasolina/etanol) ou km/kWh (elétrico)  - [ ] Anexos renderizados (miniaturas de imagens/PDFs)

  - [ ] Listagem de abastecimentos por veículo com histórico  - [ ] Formatação profissional (tabelas, cores)

- **Complexidade**: Média (3-4 horas)  - [ ] Download automático do arquivo

- **Dependências**: Nenhuma  - [ ] Loading state durante geração

- **Complexidade**: Média (3-4 horas)

---- **Dependências**: T006



### T012 - Gráficos de Consumo de Combustível---

- **Descrição**: Visualização gráfica da evolução do consumo

- **Origem**: ideia-expandida.md → #14 Controle de Consumo de Combustível### T008 - Exportar Dados em Excel/CSV

- **Prioridade**: 🟢 Baixa- **Descrição**: Exportar tabelas de manutenções em formato Excel/CSV

- **Status**: ⏳ Pendente- **Origem**: ideia-expandida.md → #13 Relatórios e Exportação de Dados

- **Nota**: Chart.js já está instalado e funcional (3 gráficos de manutenção existentes)- **Prioridade**: 🟢 Baixa

- **Critérios de Aceitação**:- **Status**: ⏳ Pendente

  - [ ] Gráfico de linha: consumo (km/l ou km/kWh) ao longo do tempo- **Critérios de Aceitação**:

  - [ ] Gráfico de barras: custo de combustível por mês  - [ ] Biblioteca escolhida (xlsx ou papaparse)

  - [ ] Indicador de consumo médio vs último abastecimento  - [ ] Botão "Exportar Excel" em `Maintenance.vue`

  - [ ] Alertas visuais se consumo aumentar >15% (possível problema)  - [ ] Arquivo contém todas as colunas relevantes

  - [ ] Página dedicada ou seção em VehicleDetails para estatísticas de combustível  - [ ] Formatação de datas e moeda

- **Complexidade**: Baixa (2-3 horas) - biblioteca já instalada  - [ ] Nome do arquivo: `autocare-manutencoes-{vehicle}-{date}.xlsx`

- **Dependências**: T011  - [ ] Opção de exportar todos os veículos ou apenas um

- **Complexidade**: Baixa (2 horas)

---- **Dependências**: Nenhuma



### T013 - Checklist de Manutenção Preventiva---

- **Descrição**: Criar checklist semanal/mensal de itens a verificar

- **Origem**: ideia-expandida.md → #15 Checklist de Manutenção Preventiva### T009 - Base de Conhecimento - Estrutura Inicial

- **Prioridade**: 🟡 Média- **Descrição**: Criar página de artigos/tutoriais sobre manutenção

- **Status**: ⏳ Pendente- **Origem**: ideia-expandida.md → #19 Base de Conhecimento e Tutoriais

- **Critérios de Aceitação**:- **Prioridade**: 🟢 Baixa

  - [ ] Interface `ChecklistItem` criada- **Status**: ⏳ Pendente

  - [ ] Collection `checklists` no Firestore- **Critérios de Aceitação**:

  - [ ] Checklist padrão: pneus, óleo, luzes, freios, bateria, limpador, etc  - [ ] Nova view `Knowledge.vue` criada

  - [ ] Componente `Checklist.vue` com checkboxes interativos  - [ ] Rota `/knowledge` adicionada

  - [ ] Histórico de checklists realizados (data + itens verificados)  - [ ] Collection `articles` no Firestore

  - [ ] Frequência configurável (semanal, quinzenal, mensal)  - [ ] 5 artigos iniciais escritos (ex: trocar óleo, calibrar pneus)

  - [ ] Notificação para fazer checklist (integra com T004)  - [ ] Sistema de categorias (mecânica, elétrica, pneus, etc)

- **Complexidade**: Média (3-4 horas)  - [ ] Busca por palavra-chave

- **Dependências**: T004 (notificações agendadas)  - [ ] Design de card de artigo responsivo

- **Complexidade**: Média (4-5 horas)

---- **Dependências**: Nenhuma



### T014 - Dicas de Manutenção Preventiva por Item---

- **Descrição**: Ao marcar item do checklist, mostrar dica contextual

- **Origem**: ideia-expandida.md → #15 Checklist de Manutenção Preventiva### T010 - Adicionar Vídeos e Imagens em Artigos

- **Prioridade**: 🟢 Baixa- **Descrição**: Suporte a mídia rica nos artigos da base de conhecimento

- **Status**: ⏳ Pendente- **Origem**: ideia-expandida.md → #19 Base de Conhecimento e Tutoriais

- **Critérios de Aceitação**:- **Prioridade**: 🟢 Baixa

  - [ ] Cada item do checklist tem campo `tip` (string com dica)- **Status**: ⏳ Pendente

  - [ ] Tooltip ou modal com dica ao clicar no ícone de informação- **Critérios de Aceitação**:

  - [ ] Dicas escritas para todos os itens padrão (conteúdo educacional)  - [ ] Artigos suportam embed de YouTube

  - [ ] Link para artigo relacionado na base de conhecimento (se houver - T009)  - [ ] Imagens inline nos artigos

- **Complexidade**: Baixa (1-2 horas)  - [ ] Markdown ou editor WYSIWYG para criar artigos

- **Dependências**: T013, T009  - [ ] Preview de artigo antes de publicar

  - [ ] Admin panel para gerenciar artigos (futuro: CMS)

---- **Complexidade**: Média (3-4 horas)

- **Dependências**: T009

## 📌 Backlog - Sprint 4: Integrações Externas

---

### T015 - Integração com Google Calendar (OAuth)

- **Descrição**: Conectar app com Google Calendar para criar eventos de manutenção## 📌 Backlog - Sprint 3: Features de Engajamento

- **Origem**: ideia-expandida.md → #11 Integração com Calendário

- **Prioridade**: 🟡 Média### T011 - Controle de Abastecimento

- **Status**: ⏳ Pendente- **Descrição**: Funcionalidade para registrar abastecimentos e calcular consumo

- **Critérios de Aceitação**:- **Origem**: ideia-expandida.md → #14 Controle de Consumo de Combustível

  - [ ] Google Calendar API habilitada no projeto Firebase/Google Cloud- **Prioridade**: 🟡 Média

  - [ ] OAuth 2.0 configurado (client ID e secret)- **Status**: ⏳ Pendente

  - [ ] Fluxo de autenticação Google no frontend (pop-up ou redirect)- **Critérios de Aceitação**:

  - [ ] Token de acesso salvo em Firestore de forma segura (criptografado)  - [ ] Interface `FuelRecord` criada

  - [ ] Botão "Conectar Google Calendar" na página de settings (T005)  - [ ] Collection `fuel_records` no Firestore

  - [ ] Funcionalidade de desconexão de calendário  - [ ] Store Pinia `fuel.ts` criada

- **Complexidade**: Alta (5-6 horas)  - [ ] Componente `FuelForm.vue` para registrar abastecimento

- **Dependências**: T005 (página de settings)  - [ ] Campos: litros, preço total, km, data, tipo de combustível

  - [ ] Cálculo automático de km/l ou km/kWh

---  - [ ] Listagem de abastecimentos por veículo

- **Complexidade**: Média (3-4 horas)

### T016 - Criar Eventos de Manutenção no Calendário- **Dependências**: Nenhuma

- **Descrição**: Ao agendar manutenção, criar evento automaticamente no Google Calendar

- **Origem**: ideia-expandida.md → #11 Integração com Calendário---

- **Prioridade**: 🟡 Média

- **Status**: ⏳ Pendente### T012 - Gráficos de Consumo de Combustível

- **Critérios de Aceitação**:- **Descrição**: Visualização gráfica da evolução do consumo

  - [ ] Ao salvar manutenção com `nextDueDate`, criar evento no Google Calendar- **Origem**: ideia-expandida.md → #14 Controle de Consumo de Combustível

  - [ ] Evento contém: título (tipo + veículo), descrição, data, lembrete (1 dia antes)- **Prioridade**: 🟢 Baixa

  - [ ] Se manutenção for editada, atualizar evento existente- **Status**: ⏳ Pendente

  - [ ] Se manutenção for excluída, deletar evento do calendário- **Critérios de Aceitação**:

  - [ ] Tratamento de erros (ex: token expirado, reconectar)  - [ ] Biblioteca de gráficos instalada (Chart.js ou ApexCharts)

  - [ ] Opção de desativar sincronização automática nas settings  - [ ] Gráfico de linha: consumo ao longo do tempo

- **Complexidade**: Alta (4-5 horas)  - [ ] Gráfico de barras: custo por mês

- **Dependências**: T015  - [ ] Indicador de consumo médio vs último abastecimento

  - [ ] Alertas visuais se consumo aumentar >15%

---  - [ ] Página dedicada de estatísticas de combustível

- **Complexidade**: Média (3-4 horas)

### T017 - Estrutura de Dados de Oficinas- **Dependências**: T011

- **Descrição**: Criar collection e interfaces para oficinas parceiras

- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras---

- **Prioridade**: 🟡 Média

- **Status**: ⏳ Pendente### T013 - Checklist de Manutenção Preventiva

- **Critérios de Aceitação**:- **Descrição**: Criar checklist semanal/mensal de itens a verificar

  - [ ] Interface `ServiceProvider` criada (TypeScript)- **Origem**: ideia-expandida.md → #15 Checklist de Manutenção Preventiva

  - [ ] Collection `service_providers` no Firestore- **Prioridade**: 🟡 Média

  - [ ] Campos: nome, endereço, telefone, especialidades, horário, website, fotos- **Status**: ⏳ Pendente

  - [ ] Campo `ratings` (array de avaliações com média)- **Critérios de Aceitação**:

  - [ ] Campo `location` (GeoPoint para busca por proximidade)  - [ ] Interface `ChecklistItem` criada

  - [ ] Seed de 10 oficinas mockadas para testes (dados brasileiros)  - [ ] Collection `checklists` no Firestore

  - [ ] Firestore rules: leitura pública, escrita apenas admin  - [ ] Checklist padrão: pneus, óleo, luzes, freios, bateria, etc

- **Complexidade**: Baixa (2 horas)  - [ ] Componente `Checklist.vue` com checkboxes

- **Dependências**: Nenhuma  - [ ] Histórico de checklists realizados

  - [ ] Frequência configurável (semanal, mensal)

---  - [ ] Notificação para fazer checklist

- **Complexidade**: Média (3-4 horas)

### T018 - Página de Diretório de Oficinas- **Dependências**: T004 (notificações)

- **Descrição**: Listar oficinas com filtros e busca

- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras---

- **Prioridade**: 🟡 Média

- **Status**: ⏳ Pendente### T014 - Dicas de Manutenção Preventiva por Item

- **Critérios de Aceitação**:- **Descrição**: Ao marcar item do checklist, mostrar dica contextual

  - [ ] Nova view `ServiceProviders.vue` criada- **Origem**: ideia-expandida.md → #15 Checklist de Manutenção Preventiva

  - [ ] Rota `/oficinas` adicionada no router- **Prioridade**: 🟢 Baixa

  - [ ] Listagem de oficinas em cards com foto, nome, avaliação- **Status**: ⏳ Pendente

  - [ ] Filtros: especialidade, avaliação mínima, distância (se geolocalização ativada)- **Critérios de Aceitação**:

  - [ ] Busca por nome ou cidade  - [ ] Cada item do checklist tem campo `tip` (string)

  - [ ] Click no card abre modal com detalhes completos da oficina  - [ ] Tooltip ou modal com dica ao clicar no item

  - [ ] Botão "Como Chegar" (link Google Maps com coordenadas)  - [ ] Dicas escritas para todos os itens padrão

  - [ ] Botão "Solicitar Orçamento" (futuro: formulário de contato)  - [ ] Link para artigo relacionado na base de conhecimento (se houver)

- **Complexidade**: Média (3-4 horas)- **Complexidade**: Baixa (1-2 horas)

- **Dependências**: T017- **Dependências**: T013, T009



------



### T019 - Integração com Google Maps## 📌 Backlog - Sprint 4: Integrações Externas

- **Descrição**: Mostrar oficinas em mapa e calcular distância

- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras### T015 - Integração com Google Calendar (OAuth)

- **Prioridade**: 🟢 Baixa- **Descrição**: Conectar app com Google Calendar para criar eventos de manutenção

- **Status**: ⏳ Pendente- **Origem**: ideia-expandida.md → #11 Integração com Calendário

- **Critérios de Aceitação**:- **Prioridade**: 🟡 Média

  - [ ] Google Maps API habilitada no projeto- **Status**: ⏳ Pendente

  - [ ] Componente `MapView.vue` criado com mapa interativo- **Critérios de Aceitação**:

  - [ ] Mapa mostra marcadores de oficinas próximas  - [ ] Google Calendar API habilitada no projeto

  - [ ] Marcador da localização do usuário (se permitir geolocalização)  - [ ] OAuth 2.0 configurado (credentials)

  - [ ] Cálculo de distância em km entre usuário e oficina  - [ ] Fluxo de autenticação Google no frontend

  - [ ] Ordenação de oficinas por proximidade  - [ ] Token de acesso salvo em Firestore (criptografado)

  - [ ] Link para rota até a oficina no Google Maps (mobile-friendly)  - [ ] Botão "Conectar Google Calendar" na página de settings

- **Complexidade**: Alta (5-6 horas)  - [ ] Desconexão de calendário

- **Dependências**: T018- **Complexidade**: Alta (5-6 horas)

- **Dependências**: T005 (página de settings)

---

---

### T020 - Sistema de Avaliações de Oficinas

- **Descrição**: Usuários podem avaliar oficinas após serviço### T016 - Criar Eventos de Manutenção no Calendário

- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras- **Descrição**: Ao agendar manutenção, criar evento automaticamente no Google Calendar

- **Prioridade**: 🟢 Baixa- **Origem**: ideia-expandida.md → #11 Integração com Calendário

- **Status**: ⏳ Pendente- **Prioridade**: 🟡 Média

- **Critérios de Aceitação**:- **Status**: ⏳ Pendente

  - [ ] Subcollection `ratings` em `service_providers/{id}/ratings`- **Critérios de Aceitação**:

  - [ ] Modal para adicionar avaliação (1-5 estrelas + comentário)  - [ ] Ao salvar manutenção com `nextDueDate`, criar evento no calendário

  - [ ] Validação: apenas 1 avaliação por usuário por oficina  - [ ] Evento contém: título, descrição, data, lembrete (1 dia antes)

  - [ ] Exibição de todas as avaliações na página da oficina  - [ ] Se manutenção for editada, atualizar evento

  - [ ] Cálculo automático de média de estrelas  - [ ] Se manutenção for excluída, deletar evento

  - [ ] Sistema de moderação: flag de denúncia para comentários inadequados  - [ ] Tratamento de erros (ex: token expirado)

- **Complexidade**: Média (3-4 horas)  - [ ] Opção de desativar sincronização automática

- **Dependências**: T018- **Complexidade**: Alta (4-5 horas)

- **Dependências**: T015

---

---

## 📌 Backlog - Sprint 5: Monetização e Gamificação

### T017 - Estrutura de Dados de Oficinas

### T021 - Estrutura de Planos e Stripe- **Descrição**: Criar collection e interfaces para oficinas parceiras

- **Descrição**: Integrar Stripe para pagamentos recorrentes- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras

- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium- **Prioridade**: 🟡 Média

- **Prioridade**: 🔴 Alta (monetização)- **Status**: ⏳ Pendente

- **Status**: ⏳ Pendente- **Critérios de Aceitação**:

- **Critérios de Aceitação**:  - [ ] Interface `ServiceProvider` criada

  - [ ] Stripe account criado e configurado  - [ ] Collection `service_providers` no Firestore

  - [ ] 3 produtos criados no Stripe Dashboard (Free, Pro, Business)  - [ ] Campos: nome, endereço, telefone, especialidades, horário, website

  - [ ] Preços definidos (ex: R$0, R$19.90/mês, R$99.90/mês)  - [ ] Campo `ratings` (array de avaliações)

  - [ ] Stripe SDK instalado no frontend (`@stripe/stripe-js`)  - [ ] Campo `location` (GeoPoint para busca por proximidade)

  - [ ] Firebase Extension "Run Payments with Stripe" instalada  - [ ] Seed de 10 oficinas mockadas para testes

  - [ ] Webhook de pagamento configurado para atualizar status  - [ ] Firestore rules para leitura pública, escrita apenas admin

  - [ ] Campo `subscriptionStatus` e `subscriptionPlan` em `users`- **Complexidade**: Baixa (2 horas)

- **Complexidade**: Alta (6-8 horas)- **Dependências**: Nenhuma

- **Dependências**: Nenhuma

---

---

### T018 - Página de Diretório de Oficinas

### T022 - Página de Pricing com Checkout- **Descrição**: Listar oficinas com filtros e busca

- **Descrição**: Landing page de preços com botão de assinar- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras

- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium- **Prioridade**: 🟡 Média

- **Prioridade**: 🔴 Alta- **Status**: ⏳ Pendente

- **Status**: ⏳ Pendente- **Critérios de Aceitação**:

- **Nota**: Página Pricing.vue já existe, precisa apenas integrar com Stripe real  - [ ] Nova view `ServiceProviders.vue` criada

- **Critérios de Aceitação**:  - [ ] Rota `/oficinas` adicionada

  - [ ] View `Pricing.vue` atualizada com planos reais e preços  - [ ] Listagem de oficinas em cards

  - [ ] Botão "Assinar Agora" redireciona para Stripe Checkout (hosted)  - [ ] Filtros: especialidade, avaliação, distância

  - [ ] Após pagamento bem-sucedido, usuário retorna ao app com status atualizado  - [ ] Busca por nome ou cidade

  - [ ] Status de assinatura atualizado automaticamente no Firestore via webhook  - [ ] Click no card abre modal com detalhes completos

  - [ ] Badge "Pro" ou "Business" exibido no navbar/perfil  - [ ] Botão "Como Chegar" (link Google Maps)

  - [ ] Trial gratuito de 30 dias para novos usuários (opcional)  - [ ] Botão "Solicitar Orçamento" (futuro: T019)

- **Complexidade**: Média (4-5 horas)- **Complexidade**: Média (3-4 horas)

- **Dependências**: T021- **Dependências**: T017



------



### T023 - Controle de Acesso por Plano### T019 - Integração com Google Maps

- **Descrição**: Restringir funcionalidades baseado no plano do usuário- **Descrição**: Mostrar oficinas em mapa e calcular distância

- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras

- **Prioridade**: 🔴 Alta- **Prioridade**: 🟢 Baixa

- **Status**: ⏳ Pendente- **Status**: ⏳ Pendente

- **Critérios de Aceitação**:- **Critérios de Aceitação**:

  - [ ] Middleware/composable de verificação de plano criado  - [ ] Google Maps API habilitada

  - [ ] Free: máximo 2 veículos cadastrados  - [ ] Componente `MapView.vue` criado

  - [ ] Pro: veículos ilimitados, relatórios PDF (T007), gráficos avançados  - [ ] Mapa mostra marcadores de oficinas próximas

  - [ ] Business: tudo do Pro + API access, dashboard avançado, suporte prioritário  - [ ] Marcador da localização do usuário (se permitir geolocalização)

  - [ ] Modais de upsell quando usuário Free atinge limite  - [ ] Cálculo de distância em km

  - [ ] Testes E2E cobrindo comportamento de cada plano  - [ ] Ordenação por proximidade

- **Complexidade**: Média (3-4 horas)  - [ ] Rota até a oficina (link para Google Maps)

- **Dependências**: T022- **Complexidade**: Alta (5-6 horas)

- **Dependências**: T018

---

---

### T024 - Sistema de Pontos e Badges

- **Descrição**: Gamificação com pontos por ações realizadas### T020 - Sistema de Avaliações de Oficinas

- **Origem**: ideia-expandida.md → #17 Gamificação e Conquistas- **Descrição**: Usuários podem avaliar oficinas após serviço

- **Prioridade**: 🟡 Média- **Origem**: ideia-expandida.md → #12 Diretório de Oficinas Parceiras

- **Status**: ⏳ Pendente- **Prioridade**: 🟢 Baixa

- **Critérios de Aceitação**:- **Status**: ⏳ Pendente

  - [ ] Interface `Achievement` criada (TypeScript)- **Critérios de Aceitação**:

  - [ ] Collection `achievements` no Firestore com lista de badges disponíveis  - [ ] Subcollection `ratings` em `service_providers/{id}/ratings`

  - [ ] Pontos ganhos por: registrar manutenção (+10pts), fazer checklist (+5pts), não atrasar manutenção (+20pts)  - [ ] Modal para adicionar avaliação (estrelas + comentário)

  - [ ] 10 badges iniciais criados (ex: "Primeira Manutenção", "3 Meses Sem Atraso", "Organizador Bronze/Prata/Ouro")  - [ ] Validação: apenas 1 avaliação por usuário por oficina

  - [ ] Store `gamification.ts` criada para gerenciar pontos  - [ ] Exibição de avaliações na página da oficina

  - [ ] Componente `AchievementBadge.vue` para exibir badges  - [ ] Cálculo de média de estrelas

  - [ ] Página de perfil mostra badges conquistados + progresso  - [ ] Moderação de comentários (flag de denúncia)

- **Complexidade**: Média (4-5 horas)- **Complexidade**: Média (3-4 horas)

- **Dependências**: Nenhuma- **Dependências**: T018



------



### T025 - Ranking e Leaderboard (Opcional)## 📌 Backlog - Sprint 5: Monetização e Gamificação

- **Descrição**: Ranking público de usuários mais organizados

- **Origem**: ideia-expandida.md → #17 Gamificação e Conquistas### T021 - Estrutura de Planos e Stripe

- **Prioridade**: 🟢 Baixa- **Descrição**: Integrar Stripe para pagamentos recorrentes

- **Status**: ⏳ Pendente- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium

- **Critérios de Aceitação**:- **Prioridade**: 🔴 Alta (monetização)

  - [ ] Nova view `Leaderboard.vue` criada- **Status**: ⏳ Pendente

  - [ ] Rota `/ranking` adicionada- **Critérios de Aceitação**:

  - [ ] Top 100 usuários por pontos totais  - [ ] Stripe account criado e configurado

  - [ ] Usuário pode optar por aparecer ou não no ranking (privacidade)  - [ ] 3 produtos criados no Stripe (Free, Pro, Business)

  - [ ] Filtro por período (ranking mensal, anual, all-time)  - [ ] Preços definidos (ex: R$0, R$19.90, R$99.90/mês)

  - [ ] Avatar e nickname anônimo para preservar privacidade  - [ ] Stripe SDK instalado no frontend

- **Complexidade**: Média (3 horas)  - [ ] Firebase Extension "Run Payments with Stripe" instalada

- **Dependências**: T024  - [ ] Webhook de pagamento configurado

  - [ ] Campo `subscriptionStatus` em `users`

---- **Complexidade**: Alta (6-8 horas)

- **Dependências**: Nenhuma

## 📌 Backlog - Futuro (Sem Sprint Definida)

---

### T026 - Internacionalização (i18n)

- **Descrição**: Suporte a múltiplos idiomas (PT, EN, ES)### T022 - Página de Pricing com Checkout

- **Origem**: ideia-expandida.md → #21 Internacionalização- **Descrição**: Landing page de preços com botão de assinar

- **Prioridade**: 🟢 Baixa- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium

- **Status**: ⏳ Pendente- **Prioridade**: 🔴 Alta

- **Complexidade**: Alta (8-10 horas)- **Status**: ⏳ Pendente

- **Nota**: Requer biblioteca vue-i18n e tradução de todos os textos- **Critérios de Aceitação**:

  - [ ] View `Pricing.vue` atualizada com planos reais

---  - [ ] Botão "Assinar" redireciona para Stripe Checkout

  - [ ] Após pagamento, usuário retorna ao app

### T027 - Sugestões Inteligentes por IA  - [ ] Status de assinatura atualizado no Firestore

- **Descrição**: Machine Learning para prever problemas e sugerir manutenções  - [ ] Badge "Pro" ou "Business" no navbar

- **Origem**: ideia-expandida.md → #18 Sugestões Inteligentes por IA  - [ ] Trial de 30 dias para novos usuários

- **Prioridade**: 🟢 Baixa- **Complexidade**: Média (4-5 horas)

- **Status**: ⏳ Pendente- **Dependências**: T021

- **Complexidade**: Muito Alta (20+ horas + treinamento de modelo)

- **Nota**: Requer dataset grande de manutenções e modelo ML treinado---



---### T023 - Controle de Acesso por Plano

- **Descrição**: Restringir funcionalidades baseado no plano do usuário

### T028 - Controle de Garantias Detalhado- **Origem**: ideia-expandida.md → #22 Sistema de Planos Premium

- **Descrição**: Sistema completo de gestão de garantias de peças e serviços- **Prioridade**: 🔴 Alta

- **Origem**: ideia-expandida.md → #20 Controle de Garantias Detalhado- **Status**: ⏳ Pendente

- **Prioridade**: 🟡 Média- **Critérios de Aceitação**:

- **Status**: ⏳ Pendente  - [ ] Middleware de verificação de plano

- **Complexidade**: Média (4-5 horas)  - [ ] Free: máximo 2 veículos

- **Nota**: Vincular peças a manutenções com data de validade de garantia  - [ ] Pro: veículos ilimitados, relatórios PDF

  - [ ] Business: API, dashboard avançado, suporte prioritário

---  - [ ] Modais de upsell quando usuário atinge limite

  - [ ] Testes E2E para cada plano

### T029 - API REST para Integração Externa- **Complexidade**: Média (3-4 horas)

- **Descrição**: Expor API REST para integração com sistemas de frotas- **Dependências**: T022

- **Origem**: Planejado para plano Business

- **Prioridade**: 🟢 Baixa---

- **Status**: ⏳ Pendente

- **Complexidade**: Alta (12-15 horas)### T024 - Sistema de Pontos e Badges

- **Nota**: Requer autenticação via API keys, documentação Swagger/OpenAPI- **Descrição**: Gamificação com pontos por ações realizadas

- **Origem**: ideia-expandida.md → #17 Gamificação e Conquistas

---- **Prioridade**: 🟡 Média

- **Status**: ⏳ Pendente

### T030 - Aplicativo Mobile Nativo- **Critérios de Aceitação**:

- **Descrição**: Versão mobile nativa (React Native ou Flutter)  - [ ] Interface `Achievement` criada

- **Origem**: Expansão futura  - [ ] Collection `achievements` no Firestore

- **Prioridade**: 🟢 Baixa  - [ ] Pontos ganhos por: registrar manutenção, fazer checklist, não atrasar

- **Status**: ⏳ Pendente  - [ ] 10 badges iniciais criados (ex: "Primeira Manutenção", "3 Meses Sem Atraso")

- **Complexidade**: Muito Alta (60+ horas)  - [ ] Store `gamification.ts` criada

- **Nota**: Reutilizar lógica do Firebase, reconstruir UI para mobile  - [ ] Componente `AchievementBadge.vue` para exibir badges

  - [ ] Página de perfil mostra badges conquistados

---- **Complexidade**: Média (4-5 horas)

- **Dependências**: Nenhuma

## 📊 Estatísticas do Roadmap

---

**Status Atual do Projeto**:

- **Sprint 0**: ✅ 100% completo (16 tarefas) → Ver `historico-tarefas.md`### T025 - Ranking e Leaderboard (Opcional)

- **Refinamentos Opcionais**: 3 tarefas pendentes- **Descrição**: Ranking público de usuários mais organizados

- **Sprints 1-5 + Futuro**: 25 tarefas pendentes- **Origem**: ideia-expandida.md → #17 Gamificação e Conquistas

- **Prioridade**: 🟢 Baixa

**Total de Tarefas Pendentes**: 28 tarefas- **Status**: ⏳ Pendente

- **Critérios de Aceitação**:

**Distribuição por Prioridade**:  - [ ] Nova view `Leaderboard.vue` criada

- 🔴 Alta: 3 tarefas (11%) - Monetização (Stripe)  - [ ] Rota `/ranking` adicionada

- 🟡 Média: 14 tarefas (50%) - Features principais  - [ ] Top 100 usuários por pontos

- 🟢 Baixa: 11 tarefas (39%) - Melhorias e expansões  - [ ] Usuário pode optar por aparecer ou não no ranking

  - [ ] Filtro por período (mensal, anual, all-time)

**Distribuição por Sprint**:  - [ ] Avatar e nickname anônimo (privacidade)

- **Refinamentos Opcionais**: 3 tarefas (tipos de manutenção, fotos, custos separados)- **Complexidade**: Média (3 horas)

- **Sprint 1** (Notificações Avançadas): 2 tarefas- **Dependências**: T024

- **Sprint 2** (Documentação/Exportação): 5 tarefas

- **Sprint 3** (Engajamento): 4 tarefas---

- **Sprint 4** (Integrações Externas): 6 tarefas

- **Sprint 5** (Monetização/Gamificação): 5 tarefas## 📌 Backlog - Futuro (Sem Sprint Definida)

- **Futuro** (Long-term): 5 tarefas

### T026 - Internacionalização (i18n)

**Nota Importante sobre Sprint 1**:- **Descrição**: Suporte a múltiplos idiomas (PT, EN, ES)

Firebase Functions e SendGrid foram completamente implementados no Sprint 0 (T-R09, T-R10), reduzindo o Sprint 1 para apenas 2 tarefas focadas em funcionalidades avançadas.- **Origem**: ideia-expandida.md → #21 Internacionalização

- **Prioridade**: 🟢 Baixa

---- **Status**: ⏳ Pendente

- **Complexidade**: Alta (8-10 horas)

## 🎯 Próximos Passos Recomendados

---

1. **Curto Prazo** (1-2 semanas): Refinamentos Opcionais (T-R15, T-R16, T-R17)

2. **Médio Prazo** (1 mês): Sprint 1 + Sprint 2 (Notificações + Exportação)### T027 - Sugestões Inteligentes por IA

3. **Longo Prazo** (3 meses): Sprints 3, 4, 5 (Features de crescimento)- **Descrição**: Machine Learning para prever problemas e sugerir manutenções

4. **Futuro** (6+ meses): Internacionalização, IA, Mobile- **Origem**: ideia-expandida.md → #18 Sugestões Inteligentes por IA

- **Prioridade**: 🟢 Baixa

---- **Status**: ⏳ Pendente

- **Complexidade**: Muito Alta (20+ horas + treinamento de modelo)

## 📝 Convenções

---

- **IDs de Tarefa**: T###, T-R## (R = Refinamento/Robustez)

- **Ao completar**: Mover para `historico-tarefas.md` com data, aprendizados e métricas### T028 - Controle de Garantias Detalhado

- **Bloqueios**: Documentar claramente o que está impedindo progresso- **Descrição**: Sistema completo de gestão de garantias de peças e serviços

- **Critérios de Aceitação**: Checkboxes devem ser testáveis e mensuráveis- **Origem**: ideia-expandida.md → #20 Controle de Garantias Detalhado

- **Referências**: Sempre linkar para `ideia-expandida.md` quando aplicável- **Prioridade**: 🟡 Média

- **Status**: ⏳ Pendente

---- **Complexidade**: Média (4-5 horas)



_Última atualização: 14/10/2025 - Revisão completa pós-Sprint 0_---

_Arquivo reorganizado para conter **APENAS** tarefas pendentes_

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

# Script para corrigir e detalhar documentação de páginas

# Mapa detalhado de cada página
$pagesDocumentation = @{
    "login-page" = @{
        title = "Login"
        description = "Pagina de autenticacao do usuario com email e senha"
        prd = "Permitir que usuarios facam login com email e senha. Validar credenciais contra Firebase Authentication. Manter sessao persistente e segura."
        happyPath = @(
            "1. Usuario abre a aplicacao"
            "2. Sistema exibe campos de email e senha"
            "3. Usuario preenche credenciais validas"
            "4. Usuario clica em 'Entrar'"
            "5. Sistema autentica no Firebase Authentication"
            "6. Sessao criada e persistida localmente"
            "7. Usuario redirecionado para Dashboard (home-page)"
        )
        criticalFlows = @(
            "Autenticacao Firebase SEMPRE deve funcionar ou mostrar erro claro"
            "Dados inseridos nao devem ser perdidos em caso de erro de conexao"
            "Token de sessao deve ser mantido mesmo apos fechar e reabrir app"
            "Falha de autenticacao deve mostrar mensagem especifica (email invalido, senha incorreta, etc)"
        )
        components = @(
            "LogoSection - Exibe logo da aplicacao"
            "AuthCard - Card de login com campos de email/senha e botao de login"
            "AuthFooter - Rodape com link para registro"
            "PageLayout - Layout padrao de paginas"
        )
        stores = @(
            "Auth Store (useAuthStore) - Gerencia estado de autenticacao"
        )
        composables = @(
            "useAuthNavigation - Navegacao relacionada a autenticacao"
        )
    }

    "home-page" = @{
        title = "Dashboard - Home"
        description = "Pagina inicial com resumo de dados e acesso rapido aos recursos"
        prd = "Exibir resumo visual de veiculos, manutencoes recentes, lembretes proximos e estatisticas. Permitir acesso rapido aos principais recursos."
        happyPath = @(
            "1. Usuario autenticado abre app"
            "2. Sistema carrega dados do Firestore (veiculos, manutencoes)"
            "3. Dashboard exibe graficos e estatisticas"
            "4. Usuario ve resumo de veiculos e proximas manutencoes"
            "5. Usuario pode clicar em veiculos para detalhes ou adicionar novo"
        )
        criticalFlows = @(
            "Dados devem carregar do cache local se offline"
            "Falha ao carregar dados nao deve travar interface"
            "Sincronizacao com Firebase deve ser automatica em background"
            "Estatisticas devem ser calculadas corretamente"
            "Lembretes de manutencao devem estar precisos"
        )
        components = @(
            "ModernHeader - Header com titulo e opcoes"
            "Chart components - Graficos de dados"
            "VehicleCard - Cards de veiculos resumidos"
        )
        stores = @(
            "Vehicles Store (useVehiclesStore) - Dados de veiculos e manutencoes"
            "Auth Store (useAuthStore) - Dados do usuario autenticado"
        )
        composables = @(
            "useVehicles - Logica de veiculos"
        )
    }

    "vehicles-page" = @{
        title = "Meus Veiculos"
        description = "Lista completa de todos os veiculos cadastrados do usuario"
        prd = "Listar todos os veiculos com informacoes essenciais (placa, marca, modelo). Permitir busca, filtro e acesso rapido aos detalhes ou adicionar novo veiculos."
        happyPath = @(
            "1. Usuario navega para a secao Veiculos"
            "2. Sistema carrega lista completa do Firestore"
            "3. Cada veiculo exibe placa, marca, modelo e ano"
            "4. Usuario pode clicar em veiculo para ver detalhes"
            "5. Usuario pode clicar em '+' para adicionar novo veiculo"
        )
        criticalFlows = @(
            "Lista SEMPRE deve carregar com dados em cache local"
            "Adicionar novo veiculo deve sincronizar imediatamente"
            "Deletar veiculo deve pedir confirmacao e sincronizar"
            "Busca e filtros devem funcionar em tempo real"
            "Atualizacoes devem refletir imediatamente"
        )
        components = @(
            "ModernHeader - Header com titulo e opcoes"
            "VehicleCard - Card individual de veiculo"
            "SearchInput - Input para buscar veiculos"
            "FAB - Botao flutuante para adicionar"
        )
        stores = @(
            "Vehicles Store - Gerencia lista de veiculos"
        )
        composables = @(
            "useVehicles - Logica de busca e filtro"
        )
    }

    "vehicle-form-page" = @{
        title = "Formulario de Veiculo"
        description = "Formulario para criar ou editar informacoes de um veiculo"
        prd = "Permitir criacao e edicao de informacoes de veiculo com validacao em tempo real. Suportar fotos, documentos e dados tecnicos."
        happyPath = @(
            "1. Usuario acessa formulario (novo ou edicao)"
            "2. Sistema pre-carrega dados se for edicao"
            "3. Usuario preenche campos obrigatorios (marca, modelo, placa)"
            "4. Usuario faz upload de fotos/documentos se desejar"
            "5. Sistema valida dados em tempo real"
            "6. Usuario clica em Salvar"
            "7. Sistema sincroniza com Firebase"
            "8. Redireciona para lista de veiculos"
        )
        criticalFlows = @(
            "Validacao deve prevenir envio de dados invalidos"
            "Placa deve ser unica por usuario"
            "Fotos devem ser comprimidas antes de enviar"
            "Documentos devem ser validados (tipos e tamanhos)"
            "Erro de conexao deve permitir retry automatico"
            "Dados parciais nao devem ser perdidos"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "VehicleFormFields - Campos do formulario"
            "ImageUploadField - Campo para upload de fotos"
            "DocumentUploadField - Campo para documentos"
        )
        stores = @(
            "Vehicles Store - Salvamento de veiculo"
        )
        composables = @(
            "useVehicleForm - Validacao e submissao"
        )
    }

    "vehicle-detail-page" = @{
        title = "Detalhes do Veiculo"
        description = "Visualizacao completa de um veiculo com historico e opcoes"
        prd = "Exibir todas as informacoes do veiculo, historico de manutencoes, opcoes de transferencia e editar/deletar."
        happyPath = @(
            "1. Usuario clica em veiculo da lista"
            "2. Sistema carrega dados completos do Firestore"
            "3. Exibe informacoes, fotos e documentos"
            "4. Mostra historico de manutencoes cronologico"
            "5. Exibe opcoes de editar, transferir ou deletar"
        )
        criticalFlows = @(
            "Imagens devem carregar corretamente mesmo offline"
            "Dados de manutencao devem ser precisos e ordenados"
            "Transferencia deve estar visivel apenas se veiculo elegivel"
            "Deletar veiculo deve pedir confirmacao dupla"
            "Edicao deve voltar ao formulario com todos os dados"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "VehicleInfoCard - Informacoes tecnicas"
            "MaintenanceList - Lista de manutencoes"
            "ActionButtons - Opcoes de acao"
        )
        stores = @(
            "Vehicles Store - Dados do veiculo"
        )
        composables = @(
            "useVehicleDetail - Logica de detalhes"
        )
    }

    "maintenance-page" = @{
        title = "Historico de Manutencoes"
        description = "Lista completa de manutencoes realizadas em todos os veiculos"
        prd = "Listar manutencoes com filtros avancados por tipo, data, veiculo e custo. Exibir graficos e estatisticas de gastos."
        happyPath = @(
            "1. Usuario navega para secao Manutencoes"
            "2. Sistema carrega lista de manutencoes do Firestore"
            "3. Exibe filtros avancados (tipo, periodo, veiculo)"
            "4. Mostra graficos de custos e frequencia"
            "5. Usuario pode clicar em manutencao para detalhes"
        )
        criticalFlows = @(
            "Filtros devem funcionar rapidamente em lista grande"
            "Calculos de custos devem ser 100% precisos"
            "Dados offline devem estar disponiveis em cache"
            "Ordenacao por data deve ser correta"
            "Graficos devem atualizar em tempo real"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "FilterBar - Filtros avancados"
            "MaintenanceCard - Card de manutencao"
            "ChartComponent - Graficos de custos"
        )
        stores = @(
            "Vehicles Store - Dados de manutencoes"
        )
        composables = @(
            "useMaintenanceFilter - Logica de filtros"
        )
    }

    "maintenance-form-page" = @{
        title = "Adicionar/Editar Manutencao"
        description = "Formulario para registrar nova manutencao ou editar existente"
        prd = "Permitir registro de manutencao com validacao. Vincular a veiculo correto, tipo, data, custo e notas."
        happyPath = @(
            "1. Usuario acessa formulario de manutencao"
            "2. Seleciona veiculo (ou vem pre-selecionado)"
            "3. Escolhe tipo de manutencao da lista"
            "4. Preenche data, custo, km/hora e notas"
            "5. Sistema valida dados"
            "6. Usuario salva"
            "7. Sincroniza com Firebase"
            "8. Retorna para lista"
        )
        criticalFlows = @(
            "Tipo de manutencao e veiculo sao obrigatorios"
            "Data nao pode ser futura"
            "Custo deve ser validado numericamente e positivo"
            "Km/hora deve ser positivo se preenchido"
            "Dados parciais nao devem ser perdidos"
        )
        components = @(
            "ModernHeader - Header"
            "VehicleSelector - Seletor de veiculo"
            "MaintenanceTypeSelect - Seletor de tipo"
            "FormFields - Campos de entrada"
        )
        stores = @(
            "Vehicles Store - Manutencoes"
        )
        composables = @(
            "useMaintenanceForm - Validacao"
        )
    }

    "maintenance-detail-page" = @{
        title = "Detalhes da Manutencao"
        description = "Visualizacao completa de uma manutencao"
        prd = "Exibir detalhes completos da manutencao, veiculo relacionado e opcoes de editar ou deletar."
        happyPath = @(
            "1. Usuario clica em manutencao"
            "2. Sistema carrega todos os detalhes"
            "3. Exibe tipo, data, custo, veiculo, km/hora e notas"
            "4. Botoes de editar/deletar disponiveis"
            "5. Usuario pode voltar ou editar"
        )
        criticalFlows = @(
            "Dados devem ser precisos e atualizados sempre"
            "Deletar deve pedir confirmacao antes de executar"
            "Edicao deve voltar ao formulario com TODOS os dados"
            "Veiculo relacionado deve ser acessivel"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "DetailCard - Card com informacoes"
            "ActionButtons - Botoes de acao"
        )
        stores = @(
            "Vehicles Store - Dados"
        )
        composables = @(
            "useMaintenanceDetail - Logica"
        )
    }

    "profile-page" = @{
        title = "Meu Perfil"
        description = "Pagina de configuracoes e dados pessoais do usuario"
        prd = "Exibir e permitir edicao de dados do usuario. Gerenciar preferencias, foto de perfil e opcoes de logout/deletar conta."
        happyPath = @(
            "1. Usuario acessa sua conta/perfil"
            "2. Vê dados pessoais (nome, email, foto)"
            "3. Pode editar informacoes"
            "4. Salva mudancas"
            "5. Sincroniza com Firebase"
            "6. Ou faz logout seguro"
        )
        criticalFlows = @(
            "Email nao deve ser editavel (vem do Firebase Auth)"
            "Foto deve ser comprimida antes de enviar"
            "Logout deve limpar sessao, cache e fechar todas as abas"
            "Deletar conta deve pedir confirmacao dupla"
            "Alteracoes devem sincronizar imediatamente"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "ProfilePhotoUpload - Upload de foto"
            "ProfileForm - Formulario de dados"
            "LogoutButton - Botao de logout"
        )
        stores = @(
            "Auth Store - Dados do usuario"
        )
        composables = @(
            "useProfile - Edicao de perfil"
        )
    }

    "register-page" = @{
        title = "Criar Conta"
        description = "Pagina de registro de novo usuario"
        prd = "Permitir registro de novo usuario com email, senha e dados basicos. Validar e criar conta no Firebase Auth."
        happyPath = @(
            "1. Usuario acessa pagina de registro"
            "2. Preenche email, senha, confirmar senha e nome"
            "3. Sistema valida em tempo real"
            "4. Usuario clica em Registrar"
            "5. Sistema cria conta no Firebase Auth"
            "6. Usuario automaticamente autenticado"
            "7. Redireciona para onboarding ou dashboard"
        )
        criticalFlows = @(
            "Email nao deve estar duplicado ou invalido"
            "Senha deve ter minimo de 8 caracteres"
            "Senhas devem ser iguais (confirmacao)"
            "Nome eh obrigatorio"
            "Todos os campos devem ser validados"
            "Erro de registro deve ser claro (email usado, conexao, etc)"
        )
        components = @(
            "LogoSection - Logo da aplicacao"
            "RegistrationForm - Formulario completo"
            "AuthFooter - Link para login"
        )
        stores = @(
            "Auth Store - Criacao de usuario"
        )
        composables = @(
            "useAuthNavigation - Navegacao apos registro"
        )
    }

    "onboarding-page" = @{
        title = "Bem-vindo (Onboarding)"
        description = "Fluxo de boas-vindas interativo para novos usuarios"
        prd = "Guiar novo usuario atraves das etapas iniciais: completar perfil, adicionar primeiro veiculo, entender recursos."
        happyPath = @(
            "1. Novo usuario conclui registro"
            "2. Sistema exibe tour interativo"
            "3. Usuario completa etapas passo a passo"
            "4. Adiciona primeiro veiculo se desejar"
            "5. Completa onboarding"
            "6. Tem acesso ao dashboard completo"
        )
        criticalFlows = @(
            "Onboarding nao deve forcar (permitir skip)"
            "Dados inseridos nao devem ser perdidos"
            "Deve ser possivel voltar e editar dados"
            "Progressao deve ser salva em caso de interrupcao"
            "Must-haves devem ser obrigatorios (perfil minimo)"
        )
        components = @(
            "OnboardingSteps - Passos interativos"
            "StepIndicator - Indicador de progresso"
            "ActionButtons - Botoes de navegacao"
        )
        stores = @(
            "Vehicles Store"
            "Auth Store"
        )
        composables = @(
            "useOnboarding - Logica de etapas"
        )
    }

    "privacy-policy-page" = @{
        title = "Politica de Privacidade"
        description = "Exibicao dos termos de privacidade da aplicacao"
        prd = "Exibir termos de privacidade de forma legivel, estruturada. Permitir aceitar para continuar se necessario."
        happyPath = @(
            "1. Usuario navega para politica de privacidade"
            "2. Vê conteudo formatado em secoes"
            "3. Pode ler e scrollar conteudo"
            "4. Botoes para voltar ou aceitar se necessario"
        )
        criticalFlows = @(
            "Conteudo deve estar SEMPRE atualizado"
            "Links externos devem estar funcionais"
            "Estrutura deve ser legivel e bem organizada"
            "Deve ser acessivel em qualquer hora"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "MarkdownContent - Conteudo formatado"
        )
        stores = @()
        composables = @()
    }

    "tabs-page" = @{
        title = "Navegacao Principal (Tabs)"
        description = "Container de navegacao com abas principais da aplicacao"
        prd = "Estrutura de navegacao com 3-4 abas principais para Home, Veiculos, Manutencoes e Perfil."
        happyPath = @(
            "1. Usuario autenticado ve interface com abas"
            "2. Pode clicar em qualquer aba para navegar"
            "3. Estado de cada aba eh mantido"
            "4. Icones e labels claros indicam secoes"
            "5. Aba ativa eh visualmente destacada"
        )
        criticalFlows = @(
            "Estado das abas deve ser preservado ao alternar"
            "Navegacao deve ser rapida e responsiva"
            "Icones devem indicar claramente secao ativa"
            "Scroll position deve ser mantido por aba"
        )
        components = @(
            "IonTabs - Container de abas Ionic"
            "Tab1Page, Tab2Page, Tab3Page - Conteudo de abas"
        )
        stores = @()
        composables = @()
    }

    "tab1-page" = @{
        title = "Aba 1 - Dashboard"
        description = "Conteudo da primeira aba de navegacao"
        prd = "Exibir resumo e dados principais do dashboard"
        happyPath = @(
            "1. Usuario clica na aba 1"
            "2. Dashboard carrega com dados"
            "3. Exibe estatisticas e resumo de veiculos"
        )
        criticalFlows = @(
            "Deve carregar rapidamente"
            "Dados devem estar atualizados"
        )
        components = @(
            "Dashboard content"
        )
        stores = @()
        composables = @()
    }

    "tab2-page" = @{
        title = "Aba 2 - Veiculos"
        description = "Conteudo da segunda aba de navegacao"
        prd = "Exibir lista de veiculos do usuario"
        happyPath = @(
            "1. Usuario clica na aba 2"
            "2. Lista de veiculos carrega"
            "3. Pode clicar em veiculo para detalhes"
        )
        criticalFlows = @(
            "Lista deve estar sincronizada"
        )
        components = @(
            "Vehicles list content"
        )
        stores = @()
        composables = @()
    }

    "tab3-page" = @{
        title = "Aba 3 - Mais"
        description = "Conteudo da terceira aba com menu adicional"
        prd = "Menu adicional com outras opcoes"
        happyPath = @(
            "1. Usuario clica na aba 3"
            "2. Menu carrega com opcoes"
        )
        criticalFlows = @(
            "Opcoes devem estar organizadas"
        )
        components = @(
            "Menu content"
        )
        stores = @()
        composables = @()
    }

    "orders-page" = @{
        title = "Ordens de Servico"
        description = "Lista de ordens de servico ou pedidos"
        prd = "Exibir ordens de servico com status, detalhes e historico"
        happyPath = @(
            "1. Usuario acessa secao Ordens"
            "2. Lista de ordens carrega"
            "3. Pode filtrar por status"
            "4. Clica em ordem para detalhes completos"
        )
        criticalFlows = @(
            "Status deve estar SEMPRE atualizado em tempo real"
            "Filtros devem funcionar corretamente"
            "Nova ordem deve aparecer imediatamente"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "OrderCard - Card de ordem"
            "StatusFilter - Filtro de status"
        )
        stores = @(
            "Orders Store (se existir) ou Vehicles Store"
        )
        composables = @(
            "useOrders - Logica de ordens"
        )
    }

    "order-detail-page" = @{
        title = "Detalhes da Ordem"
        description = "Visualizacao completa de uma ordem de servico"
        prd = "Exibir informacoes completas da ordem, historico e acoes possiveis"
        happyPath = @(
            "1. Usuario clica em ordem"
            "2. Detalhes carregam completamente"
            "3. Ve status, veiculo, servicos e valor"
            "4. Pode executar acoes permitidas (cancelar, editar)"
        )
        criticalFlows = @(
            "Dados devem ser completos e precisos"
            "Acoes devem sincronizar com backend imediatamente"
            "Historico deve estar correto e cronologico"
        )
        components = @(
            "ModernHeader - Header"
            "OrderInfoCard - Informacoes"
            "ActionButtons - Acoes"
        )
        stores = @(
            "Orders Store"
        )
        composables = @()
    }

    "vehicle-transfer-page" = @{
        title = "Transferir Veiculo"
        description = "Fluxo para transferir veiculo para outro usuario"
        prd = "Permitir transferencia segura de veiculo entre usuarios com validacao, confirmacao e historico."
        happyPath = @(
            "1. Usuario seleciona veiculo para transferir"
            "2. Preenche email do destinatario"
            "3. Sistema valida email"
            "4. Usuario confirma acao"
            "5. Convite enviado ao destinatario via email"
            "6. Destinatario recebet e aceita na app"
            "7. Veiculo transferido com sucesso"
            "8. Historico registrado"
        )
        criticalFlows = @(
            "Destinatario deve ter email valido e conta ativa"
            "Confirmacao em DUAS etapas eh obrigatoria"
            "Historico de transferencia deve ser mantido imutavel"
            "Veiculo deve desaparecer da lista do remetente"
            "Notificacao deve ser enviada ao destinatario"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "VehicleSelector - Seletor de veiculo"
            "EmailInput - Input para email destinatario"
            "ConfirmationModal - Modal de confirmacao"
        )
        stores = @(
            "Vehicles Store - Transferencias"
        )
        composables = @(
            "useVehicleTransfer - Logica de transferencia"
        )
    }

    "transfer-confirm-page" = @{
        title = "Confirmar Transferencia"
        description = "Pagina para receptor confirmar ou rejeitar transferencia"
        prd = "Permitir que receptor confirme ou rejeite transferencia de veiculo com informacoes claras."
        happyPath = @(
            "1. Usuario recebe email com link de transferencia"
            "2. Clica no link ou acessa page automaticamente"
            "3. Ve detalhes completos do veiculo"
            "4. Ve quem esta transferindo"
            "5. Clica em Aceitar ou Rejeitar"
            "6. Acao sincroniza imediatamente"
        )
        criticalFlows = @(
            "Confirmacao eh FINAL e irreversivel"
            "Dados do veiculo devem ser MUITO claros"
            "Rejeicao deve ser permitida ate confirmacao"
            "Usuario que enviou deve ser notificado do resultado"
        )
        components = @(
            "ModernHeader - Header"
            "VehicleInfoDisplay - Exibicao de dados"
            "ConfirmButtons - Aceitar/Rejeitar"
        )
        stores = @(
            "Vehicles Store"
        )
        composables = @(
            "useTransferConfirm - Logica de confirmacao"
        )
    }

    "transferred-vehicles-page" = @{
        title = "Veiculos Transferidos"
        description = "Historico de veiculos transferidos para outros usuarios"
        prd = "Exibir lista historica de veiculos que foram transferidos, com datas e para quem."
        happyPath = @(
            "1. Usuario acessa secao Historico de Transferencias"
            "2. Ve lista de veiculos transferidos"
            "3. Cada entrada mostra veiculo, data e destinatario"
            "4. Pode clicar para ver detalhes completos da transferencia"
        )
        criticalFlows = @(
            "Dados devem ser precisos e completos"
            "Historico deve ser IMUTAVEL (read-only)"
            "Datas devem ser registradas corretamente"
            "Informacoes do destinatario devem estar precisas"
        )
        components = @(
            "ModernHeader - Header com titulo"
            "TransferHistoryCard - Card de transferencia"
            "DateDisplay - Exibicao de data"
        )
        stores = @(
            "Vehicles Store - Historico"
        )
        composables = @(
            "useTransferHistory - Logica"
        )
    }
}

Write-Host "Atualizando arquivos de documentacao com detalhes..." -ForegroundColor Cyan
Write-Host ""

$updatedCount = 0

foreach ($pageName in $pagesDocumentation.Keys) {
    $data = $pagesDocumentation[$pageName]
    $readmePath = "src\views\$pageName\docs\README.md"
    
    # Construir conteudo detalhado
    $happyPathFormatted = $data.happyPath -join "`n"
    $criticalFlowsFormatted = $data.criticalFlows | ForEach-Object { "- $_" } | Join-String -Separator "`n"
    $componentsFormatted = $data.components | ForEach-Object { "- $_" } | Join-String -Separator "`n"
    $storesFormatted = if ($data.stores.Count -gt 0) { 
        $data.stores | ForEach-Object { "- $_" } | Join-String -Separator "`n"
    } else {
        "Nenhuma store utilizada"
    }
    $composablesFormatted = if ($data.composables.Count -gt 0) { 
        $data.composables | ForEach-Object { "- $_" } | Join-String -Separator "`n"
    } else {
        "Nenhum composable"
    }
    
    $content = @"
# $($data.title)

**Descricao**: $($data.description)

## PRD (Product Requirements Document)

$($data.prd)

## Fluxo Feliz (Happy Path)

O fluxo que NUNCA pode falhar:

``````
$happyPathFormatted
``````

## Fluxos Criticos

Estes fluxos DEVEM ser testados e sempre funcionar sem falhas:

$criticalFlowsFormatted

## Componentes Utilizados

$componentsFormatted

## Dependencias

### Stores
$storesFormatted

### Composables
$composablesFormatted

## Notas de Desenvolvimento

- Manter validacoes em tempo real quando possivel
- Sempre sincronizar com Firebase apos acoes do usuario
- Mostrar feedback visual (toasts, spinners) para acoes asincronas
- Implementar cache local para melhor performance offline
- Testar fluxos criticos em conexoes lentas

---

**Ultima atualizacao**: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
**Status**: Documentacao completa com detalhes de implementacao

"@
    
    # Escrever arquivo
    $content | Out-File -FilePath $readmePath -Encoding UTF8 -Force
    $updatedCount++
    
    Write-Host "[OK] Atualizado: $pageName" -ForegroundColor Green
}

Write-Host ""
Write-Host "$updatedCount arquivos atualizados com sucesso!" -ForegroundColor Cyan

# Script para criar documentação de páginas

$pagesData = @{
    "login-page" = @{
        title = "Login"
        description = "Página de autenticação do usuário"
        prd = "Permitir que usuários façam login com email e senha. Validar credenciais contra Firebase Authentication. Manter sessão persistente."
        happyPath = "1. Usuário abre a página
2. Sistema exibe campos de email e senha
3. Usuário preenche credenciais válidas
4. Usuário clica em 'Entrar'
5. Sistema autentica no Firebase
6. Sessão criada e persistida
7. Usuário redirecionado ao dashboard"
        criticalFlows = @(
            "Autenticação Firebase deve sempre funcionar"
            "Erro de conexão não deve perder dados inseridos"
            "Token de sessão deve ser mantido mesmo após fechar app"
        )
    }
    "home-page" = @{
        title = "Home/Dashboard"
        description = "Página inicial com visão geral dos dados do usuário"
        prd = "Exibir resumo de veículos, manutenção recente e lembretes próximos. Permitir rápido acesso aos recursos principais."
        happyPath = "1. Usuário autenticado abre app
2. Sistema carrega dados do Firestore
3. Dashboard exibe estatísticas
4. Usuário vê resumo de veículos e manutenção
5. Usuário pode navegar para detalhes ou adicionar novo"
        criticalFlows = @(
            "Dados devem carregar offline se em cache"
            "Falha ao carregar dados não deve travar interface"
            "Sincronização com Firebase deve ser automática"
        )
    }
    "vehicles-page" = @{
        title = "Meus Veículos"
        description = "Lista todos os veículos do usuário"
        prd = "Listar todos os veículos cadastrados com informações essenciais. Permitir filtro, busca e acesso rápido aos detalhes."
        happyPath = "1. Usuário navega para Meus Veículos
2. Sistema carrega lista de veículos do Firestore
3. Cada veículo exibe placa, marca, modelo e status
4. Usuário pode clicar em um veículo para ver detalhes
5. Ou clicar em '+' para adicionar novo"
        criticalFlows = @(
            "Lista sempre deve carregar com cache local"
            "Adição de veículo novo deve sincronizar imediatamente"
            "Deletar veículo deve pedir confirmação"
        )
    }
    "vehicle-form-page" = @{
        title = "Adicionar/Editar Veículo"
        description = "Formulário para cadastro ou edição de veículo"
        prd = "Permitir criação e edição de informações de veículo. Validar dados e sincronizar com Firebase."
        happyPath = "1. Usuário acessa formulário (novo ou edição)
2. Sistema pré-carrega dados se edição
3. Usuário preenche campos obrigatórios
4. Valida dados em tempo real
5. Usuário salva
6. Sistema sincroniza com Firebase
7. Redireciona para lista de veículos"
        criticalFlows = @(
            "Validação deve prevenir envio inválido"
            "Foto/documento deve comprimir antes de enviar"
            "Erro de conexão deve permitir retry"
        )
    }
    "vehicle-detail-page" = @{
        title = "Detalhes do Veículo"
        description = "Visualiza informações completas de um veículo específico"
        prd = "Exibir todas as informações do veículo, histórico de manutenção e opções de transferência."
        happyPath = "1. Usuário clica em veículo
2. Sistema carrega dados do veículo
3. Exibe informações, fotos e documentos
4. Mostra histórico de manutenção
5. Opções de editar ou transferir disponíveis"
        criticalFlows = @(
            "Imagens devem carregar corretamente mesmo offline"
            "Dados de manutenção devem ser precisos"
            "Transferência deve estar visível apenas se elegível"
        )
    }
    "maintenance-page" = @{
        title = "Manutenções"
        description = "Lista todas as manutenções dos veículos"
        prd = "Listar manutenções com filtros por tipo, data e veículo. Exibir estatísticas e custos totais."
        happyPath = "1. Usuário navega para Manutenções
2. Sistema carrega lista de manutenções
3. Exibe filtros (tipo, período, veículo)
4. Mostra estatísticas de custos
5. Usuário pode clicar em manutenção para detalhes"
        criticalFlows = @(
            "Filtros devem funcionar rapidamente"
            "Cálculos de custos devem ser precisos"
            "Dados offline devem estar disponíveis"
        )
    }
    "maintenance-form-page" = @{
        title = "Adicionar/Editar Manutenção"
        description = "Formulário para registro de nova manutenção"
        prd = "Permitir registro de manutenção com tipo, data, custo e notas. Vincular à veículo correto."
        happyPath = "1. Usuário acessa formulário de manutenção
2. Seleciona veículo (ou vem pré-selecionado)
3. Escolhe tipo de manutenção
4. Preenche data, custo e notas
5. Salva
6. Sincroniza com Firebase
7. Retorna à lista"
        criticalFlows = @(
            "Tipo de manutenção é obrigatório"
            "Data não pode ser futura"
            "Custo deve ser validado numericamente"
        )
    }
    "maintenance-detail-page" = @{
        title = "Detalhes da Manutenção"
        description = "Visualiza informações completas de uma manutenção"
        prd = "Exibir detalhes da manutenção, veículo relacionado e opções de edição/exclusão."
        happyPath = "1. Usuário clica em manutenção
2. Sistema carrega todos os detalhes
3. Exibe tipo, data, custo, veículo e notas
4. Botões de editar/deletar disponíveis
5. Usuário pode voltar ou editar"
        criticalFlows = @(
            "Dados devem ser precisos e atualizados"
            "Deletar deve pedir confirmação"
            "Edição deve voltar ao formulário com dados"
        )
    }
    "profile-page" = @{
        title = "Perfil"
        description = "Página de configurações e dados do usuário"
        prd = "Exibir e permitir edição de dados do usuário. Gerenciar preferências e logout."
        happyPath = "1. Usuário acessa Perfil
2. Vê dados pessoais e foto
3. Pode editar informações
4. Salva mudanças
5. Sincroniza com Firebase
6. Ou faz logout"
        criticalFlows = @(
            "Email não deve ser editável (vem do Auth)"
            "Foto deve ser comprimida antes de enviar"
            "Logout deve limpar sessão e cache local"
        )
    }
    "register-page" = @{
        title = "Registro"
        description = "Página de criação de nova conta"
        prd = "Permitir registro de novo usuário com email, senha e dados básicos. Validar e criar conta no Firebase."
        happyPath = "1. Usuário acessa página de registro
2. Preenche email, senha e dados
3. Valida em tempo real
4. Clica em Registrar
5. Cria conta no Firebase
6. Usuário é autenticado
7. Redireciona ao dashboard"
        criticalFlows = @(
            "Email não deve estar duplicado"
            "Senha deve ter mínimo requerido"
            "Dados obrigatórios devem ser preenchidos"
        )
    }
    "onboarding-page" = @{
        title = "Onboarding"
        description = "Fluxo de boas-vindas para novos usuários"
        prd = "Guiar novo usuário através dos passos iniciais: completar perfil, adicionar primeiro veículo."
        happyPath = "1. Novo usuário conclui registro
2. Sistema exibe guia interativo
3. Usuário completa etapas
4. Adiciona primeiro veículo
5. Completa onboarding
6. Acessa dashboard completo"
        criticalFlows = @(
            "Onboarding não deve forçar (permitir skip)"
            "Dados inseridos não devem ser perdidos"
            "Deve ser possível voltar e editar"
        )
    }
    "tabs-page" = @{
        title = "Navegação Principal"
        description = "Container de navegação com abas principais"
        prd = "Estrutura de navegação com abas para Home, Veículos, Manutenção e Perfil."
        happyPath = "1. Usuário autenticado vê abas
2. Pode navegar entre seções
3. Estado de cada aba é mantido
4. Ícones e labels claros para cada seção"
        criticalFlows = @(
            "Estado das abas deve ser preservado"
            "Navegação deve ser rápida e responsiva"
            "Ícones devem indicar seção ativa"
        )
    }
    "tab1-page" = @{
        title = "Aba 1 - Dashboard"
        description = "Conteúdo da primeira aba"
        prd = "Exibir resumo e dados principais do dashboard."
        happyPath = "1. Usuário clica na aba 1
2. Dashboard carrega
3. Exibe estatísticas e resumo"
        criticalFlows = @(
            "Deve carregar rapidamente"
            "Dados devem ser atualizados"
        )
    }
    "tab2-page" = @{
        title = "Aba 2 - Veículos"
        description = "Conteúdo da segunda aba"
        prd = "Exibir lista de veículos."
        happyPath = "1. Usuário clica na aba 2
2. Lista de veículos carrega"
        criticalFlows = @(
            "Lista deve estar sincronizada"
        )
    }
    "tab3-page" = @{
        title = "Aba 3 - Mais"
        description = "Conteúdo da terceira aba"
        prd = "Menu adicional com outras opções."
        happyPath = "1. Usuário clica na aba 3
2. Menu carrega"
        criticalFlows = @(
            "Opções devem estar organizadas"
        )
    }
    "orders-page" = @{
        title = "Pedidos/Ordens de Serviço"
        description = "Lista de ordens de serviço ou pedidos"
        prd = "Exibir ordens de serviço com status e detalhes."
        happyPath = "1. Usuário acessa Ordens
2. Lista de ordens carrega
3. Pode filtrar por status
4. Clica em ordem para detalhes"
        criticalFlows = @(
            "Status deve estar sempre atualizado"
            "Filtros devem funcionar corretamente"
        )
    }
    "order-detail-page" = @{
        title = "Detalhes da Ordem"
        description = "Visualiza detalhes de uma ordem de serviço"
        prd = "Exibir informações completas da ordem, histórico e ações possíveis."
        happyPath = "1. Usuário clica em ordem
2. Detalhes carregam
3. Vê todo contexto da ordem
4. Pode executar ações"
        criticalFlows = @(
            "Dados devem ser completos"
            "Ações devem sincronizar com backend"
        )
    }
    "vehicle-transfer-page" = @{
        title = "Transferir Veículo"
        description = "Fluxo para transferir veículo para outro usuário"
        prd = "Permitir transferência segura de veículo entre usuários com validação e confirmação."
        happyPath = "1. Usuário inicia transferência
2. Seleciona destinatário
3. Confirma ação
4. Enviado convite ao destinatário
5. Destinatário aceita
6. Veículo transferido"
        criticalFlows = @(
            "Destinatário deve ser email válido"
            "Confirmação em duas etapas é obrigatória"
            "Histórico de transferência deve ser mantido"
        )
    }
    "transfer-confirm-page" = @{
        title = "Confirmar Transferência"
        description = "Confirmação de transferência de veículo"
        prd = "Permitir que receptor confirme ou rejeite transferência de veículo."
        happyPath = "1. Usuário recebe convite de transferência
2. Acessa página de confirmação
3. Vê detalhes do veículo
4. Aceita ou rejeita
5. Transferência completa ou rejeitada"
        criticalFlows = @(
            "Confirmação é final e irreversível"
            "Dados do veículo devem ser claros"
            "Rejeição deve ser permitida"
        )
    }
    "transferred-vehicles-page" = @{
        title = "Veículos Transferidos"
        description = "Histórico de veículos transferidos"
        prd = "Exibir lista de veículos que foram transferidos para outros usuários."
        happyPath = "1. Usuário acessa histórico
2. Vê veículos transferidos
3. Pode ver detalhes de cada transferência
4. Data e para quem foi transferido"
        criticalFlows = @(
            "Dados devem ser precisos"
            "Histórico deve ser imutável"
        )
    }
    "privacy-policy-page" = @{
        title = "Política de Privacidade"
        description = "Exibição da política de privacidade"
        prd = "Exibir termos de privacidade de forma legível. Permitir aceitar para continuar (se necessário)."
        happyPath = "1. Usuário navega para política
2. Vê conteúdo formatado
3. Pode ler em seções
4. Volta ou confirma"
        criticalFlows = @(
            "Conteúdo deve estar sempre atualizado"
            "Links devem estar funcionais"
            "Estrutura deve ser legível"
        )
    }
}

Write-Host "Criando documentacao para paginas..." -ForegroundColor Cyan
Write-Host ""

$createdCount = 0

foreach ($pageName in $pagesData.Keys) {
    $data = $pagesData[$pageName]
    $docsPath = "src\views\$pageName\docs"
    $readmePath = "$docsPath\README.md"
    
    # Criar pasta docs se não existir
    if (-not (Test-Path $docsPath)) {
        New-Item -ItemType Directory -Path $docsPath -Force | Out-Null
    }
    
    # Criar conteúdo do README
    $content = @"
# $($data.title)

**Descrição**: $($data.description)

## PRD (Product Requirements Document)

$($data.prd)

## Fluxo Feliz (Happy Path)

O fluxo que NUNCA pode falhar:

``````
$($data.happyPath)
``````

## Fluxos Críticos

Estes fluxos DEVEM ser testados e funcionam sem falhas:

``````
$($data.criticalFlows | ForEach-Object { "- $_" })
``````

## Componentes Utilizados

_Adicione aqui os componentes principais usados nesta página_

## Dependências

_Adicione aqui as stores, composables e utilidades usadas_

## Notas de Desenvolvimento

_Adicione aqui qualquer observação importante para desenvolvedores_

---

**Última atualização**: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")

"@
    
    # Escrever arquivo
    $content | Out-File -FilePath $readmePath -Encoding UTF8 -Force
    $createdCount++
    
    Write-Host "[OK] Documentacao criada: $pageName/docs/README.md" -ForegroundColor Green
}

Write-Host ""
Write-Host "$createdCount arquivos de documentacao criados com sucesso!" -ForegroundColor Cyan

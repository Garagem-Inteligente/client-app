# Script para encontrar componentes usados em apenas uma pagina

Write-Host "Analisando componentes utilizados em cada pagina..." -ForegroundColor Cyan
Write-Host ""

$viewsDir = "src\views"
$componentsDir = "src\components"
$componentsUsage = @{}

# Primeiro, listar todos os componentes
$allComponents = @{}
Get-ChildItem -Path $componentsDir -Recurse -Filter "*.vue" -File | ForEach-Object {
    $allComponents[$_.Name -replace "\.vue$", ""] = $_
}

Write-Host "Total de componentes encontrados: $($allComponents.Count)" -ForegroundColor Gray
Write-Host ""

# Para cada pagina, verificar quais componentes ela importa
Get-ChildItem -Path $viewsDir -Directory | ForEach-Object {
    $pageFolder = $_
    $pageName = $pageFolder.Name
    $pageVueFile = Join-Path $pageFolder.FullName "$pageName.vue"
    
    if (Test-Path $pageVueFile) {
        $content = Get-Content $pageVueFile -Raw
        
        # Procurar por linhas com "import ... from"
        $lines = $content -split "`n"
        foreach ($line in $lines) {
            if ($line -match "from\s+['\"]@/components") {
                # Extrair nome do componente
                if ($line -match "import\s+\{?([^}]+)\}?\s+from") {
                    $imports = $Matches[1]
                    $componentNames = $imports -split "," | ForEach-Object { $_.Trim() }
                    
                    foreach ($compName in $componentNames) {
                        if (-not $componentsUsage.ContainsKey($compName)) {
                            $componentsUsage[$compName] = @()
                        }
                        if ($componentsUsage[$compName] -notcontains $pageName) {
                            $componentsUsage[$compName] += $pageName
                        }
                    }
                }
            }
        }
    }
}

Write-Host "Componentes usados em apenas UMA pagina:" -ForegroundColor Yellow
Write-Host ""

$pageSpecific = @{}

foreach ($component in $componentsUsage.Keys | Sort-Object) {
    $pages = $componentsUsage[$component]
    
    if ($pages.Count -eq 1) {
        $page = $pages[0]
        if (-not $pageSpecific.ContainsKey($page)) {
            $pageSpecific[$page] = @()
        }
        $pageSpecific[$page] += $component
        
        Write-Host "[MOVER] $component -> PAGINA: $page" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Resumo por pagina:" -ForegroundColor Cyan
Write-Host ""

foreach ($page in $pageSpecific.Keys | Sort-Object) {
    $components = $pageSpecific[$page]
    if ($components.Count -gt 0) {
        Write-Host "$page ($($components.Count) componente(s) para mover):" -ForegroundColor White
        $components | ForEach-Object {
            Write-Host "  - $_"
        }
        Write-Host ""
    }
}

if ($pageSpecific.Keys.Count -eq 0) {
    Write-Host "Nenhum componente especifico de pagina encontrado!" -ForegroundColor Yellow
    Write-Host "Todos os componentes sao reutilizaveis entre multiplas paginas." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Componentes reutilizaveis (usados em 2 ou mais paginas):" -ForegroundColor Cyan
Write-Host ""

$reusable = 0
foreach ($component in $componentsUsage.Keys | Sort-Object) {
    $pages = $componentsUsage[$component]
    if ($pages.Count -gt 1) {
        $reusable++
        $pagesList = $pages -join ', '
        Write-Host "$component ($($pages.Count) paginas): $pagesList" -ForegroundColor Blue
    }
}

if ($reusable -eq 0) {
    Write-Host "Nenhum componente reutilizavel encontrado!"
}

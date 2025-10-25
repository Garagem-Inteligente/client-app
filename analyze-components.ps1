# Script para analisar quais componentes são usados em apenas uma página

Write-Host "Analisando componentes específicos de páginas..." -ForegroundColor Cyan

$componentsDir = "src/components"
$viewsDir = "src/views"

# Pegar todos os componentes
$allComponents = @{}
Get-ChildItem -Path $componentsDir -Recurse -Filter "*.vue" -File | ForEach-Object {
    $allComponents[$_.Name] = $_.FullName
}

# Rastrear uso de cada componente
$componentUsage = @{}

Get-ChildItem -Path $viewsDir -Directory | ForEach-Object {
    $pageFolder = $_
    $pageVueFile = Join-Path $pageFolder "$($pageFolder.Name).vue"
    
    if (Test-Path $pageVueFile) {
        $content = Get-Content $pageVueFile -Raw
        
        foreach ($componentName in $allComponents.Keys) {
            $componentBaseName = $componentName -replace "\.vue$", ""
            
            # Procurar importações e uso do componente
            if ($content -match $componentBaseName) {
                if (-not $componentUsage.ContainsKey($componentName)) {
                    $componentUsage[$componentName] = @()
                }
                $componentUsage[$componentName] += $pageFolder.Name
            }
        }
    }
}

Write-Host ""
Write-Host "Componentes usados em apenas UMA pagina:" -ForegroundColor Yellow
Write-Host ""

$pageSpecificComponents = @{}

foreach ($component in $componentUsage.Keys) {
    $usageCount = @($componentUsage[$component]).Count
    $uniquePages = @($componentUsage[$component] | Select-Object -Unique).Count
    
    if ($uniquePages -eq 1) {
        $pageName = $componentUsage[$component][0]
        if (-not $pageSpecificComponents.ContainsKey($pageName)) {
            $pageSpecificComponents[$pageName] = @()
        }
        $pageSpecificComponents[$pageName] += $component
        
        Write-Host "[OK] $component -> PAGINA: $pageName" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Resumo por página:" -ForegroundColor Cyan
Write-Host ""

$pageSpecificComponents.Keys | Sort-Object | ForEach-Object {
    $page = $_
    $components = $pageSpecificComponents[$page]
    Write-Host "$page ($($components.Count) componente(s)):" -ForegroundColor White
    $components | ForEach-Object {
        Write-Host "  - $_"
    }
    Write-Host ""
}

# Script para refatorar todas as pages da pasta views

$viewsPath = "c:\Users\Miker\OneDrive\Documentos\Projetos\Garagem Inteligente\client-app\src\views"

# Lista de pages a refatorar (excluindo HomePage que será feito depois e LoginPage que já foi feito)
$pages = @(
    "MaintenanceDetailPage.vue",
    "MaintenanceFormPage.vue",
    "MaintenancePage.vue",
    "OnboardingPage.vue",
    "OrderDetailPage.vue",
    "OrdersPage.vue",
    "PrivacyPolicyPage.vue",
    "ProfilePage.vue",
    "RegisterPage.vue",
    "Tab1Page.vue",
    "Tab2Page.vue",
    "Tab3Page.vue",
    "TabsPage.vue",
    "TransferConfirmPage.vue",
    "TransferredVehiclesPage.vue",
    "VehicleDetailPage.vue",
    "VehicleFormPage.vue",
    "VehiclesPage.vue",
    "VehicleTransferPage.vue"
)

foreach ($page in $pages) {
    # Converter de PascalCase para kebab-case
    $pageName = $page -replace "Page\.vue$", ""
    
    # Converter PascalCase para kebab-case corretamente
    $kebabName = ""
    for ($i = 0; $i -lt $pageName.Length; $i++) {
        $char = $pageName[$i]
        if ([char]::IsUpper($char) -and $i -gt 0) {
            $kebabName += "-" + $char.ToString().ToLower()
        } else {
            $kebabName += $char.ToString().ToLower()
        }
    }
    
    $folderName = "$viewsPath\$kebabName-page"
    $componentFileName = "$kebabName-page.vue"
    
    # Criar pasta
    New-Item -ItemType Directory -Path "$folderName\components" -Force | Out-Null
    New-Item -ItemType Directory -Path "$folderName\tests" -Force | Out-Null
    New-Item -ItemType Directory -Path "$folderName\docs" -Force | Out-Null
    
    # Mover arquivo
    $source = "$viewsPath\$page"
    $destination = "$folderName\$componentFileName"
    
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $destination -Force
        Remove-Item -Path $source -Force
        Write-Host "✅ $page → $kebabName-page/$componentFileName"
    }
}

Write-Host "`n✅ Refatoração de estrutura de pastas completa!"

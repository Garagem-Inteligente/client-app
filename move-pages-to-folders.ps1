# Script para mover os arquivos .vue para suas respectivas pastas em kebab-case

$viewsPath = "src/views"
$pageMappings = @{
    "TabsPage.vue" = "tabs-page"
    "OnboardingPage.vue" = "onboarding-page"
    "RegisterPage.vue" = "register-page"
    "PrivacyPolicyPage.vue" = "privacy-policy-page"
    "VehiclesPage.vue" = "vehicles-page"
    "OrdersPage.vue" = "orders-page"
    "ProfilePage.vue" = "profile-page"
    "MaintenancePage.vue" = "maintenance-page"
    "MaintenanceFormPage.vue" = "maintenance-form-page"
    "MaintenanceDetailPage.vue" = "maintenance-detail-page"
    "VehicleFormPage.vue" = "vehicle-form-page"
    "VehicleDetailPage.vue" = "vehicle-detail-page"
    "OrderDetailPage.vue" = "order-detail-page"
    "VehicleTransferPage.vue" = "vehicle-transfer-page"
    "TransferConfirmPage.vue" = "transfer-confirm-page"
    "TransferredVehiclesPage.vue" = "transferred-vehicles-page"
    "Tab1Page.vue" = "tab1-page"
    "Tab2Page.vue" = "tab2-page"
    "Tab3Page.vue" = "tab3-page"
}

Write-Host "Iniciando movimento de arquivos para suas pastas..." -ForegroundColor Cyan

$successCount = 0
$errorCount = 0

foreach ($oldName in $pageMappings.Keys) {
    $newFolder = $pageMappings[$oldName]
    $sourceFile = "$viewsPath\$oldName"
    $destFile = "$viewsPath\$newFolder\$newFolder.vue"
    
    if (Test-Path $sourceFile) {
        try {
            Move-Item -Path $sourceFile -Destination $destFile -Force
            Write-Host "[OK] Movido: $oldName para $newFolder/$newFolder.vue" -ForegroundColor Green
            $successCount++
        }
        catch {
            Write-Host "[ERRO] Falha ao mover $oldName" -ForegroundColor Red
            $errorCount++
        }
    }
    else {
        Write-Host "[AVISO] Arquivo nao encontrado: $sourceFile" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Resultado: $successCount movidos com sucesso, $errorCount erros" -ForegroundColor Cyan

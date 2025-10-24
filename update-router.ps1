# Script para atualizar imports no router

$routerPath = "c:\Users\Miker\OneDrive\Documentos\Projetos\Garagem Inteligente\client-app\src\router\index.ts"
$routerContent = Get-Content $routerPath -Raw

# Mapeamento de conversões PascalCase para kebab-case
$replacements = @(
    @{ old = "import TabsPage from '../views/TabsPage.vue'"; new = "import TabsPage from '../views/tabs-page/tabs-page.vue'" },
    @{ old = "'@/views/OnboardingPage.vue'"; new = "'@/views/onboarding-page/onboarding-page.vue'" },
    @{ old = "'@/views/RegisterPage.vue'"; new = "'@/views/register-page/register-page.vue'" },
    @{ old = "'@/views/PrivacyPolicyPage.vue'"; new = "'@/views/privacy-policy-page/privacy-policy-page.vue'" },
    @{ old = "'@/views/HomePage.vue'"; new = "'@/views/home-page/home-page.vue'" },
    @{ old = "'@/views/VehiclesPage.vue'"; new = "'@/views/vehicles-page/vehicles-page.vue'" },
    @{ old = "'@/views/OrdersPage.vue'"; new = "'@/views/orders-page/orders-page.vue'" },
    @{ old = "'@/views/ProfilePage.vue'"; new = "'@/views/profile-page/profile-page.vue'" },
    @{ old = "'@/views/MaintenancePage.vue'"; new = "'@/views/maintenance-page/maintenance-page.vue'" },
    @{ old = "'@/views/MaintenanceFormPage.vue'"; new = "'@/views/maintenance-form-page/maintenance-form-page.vue'" },
    @{ old = "'@/views/MaintenanceDetailPage.vue'"; new = "'@/views/maintenance-detail-page/maintenance-detail-page.vue'" },
    @{ old = "'@/views/VehicleFormPage.vue'"; new = "'@/views/vehicle-form-page/vehicle-form-page.vue'" },
    @{ old = "'@/views/VehicleDetailPage.vue'"; new = "'@/views/vehicle-detail-page/vehicle-detail-page.vue'" },
    @{ old = "'@/views/OrderDetailPage.vue'"; new = "'@/views/order-detail-page/order-detail-page.vue'" },
    @{ old = "'@/views/VehicleTransferPage.vue'"; new = "'@/views/vehicle-transfer-page/vehicle-transfer-page.vue'" },
    @{ old = "'@/views/TransferConfirmPage.vue'"; new = "'@/views/transfer-confirm-page/transfer-confirm-page.vue'" },
    @{ old = "'@/views/TransferredVehiclesPage.vue'"; new = "'@/views/transferred-vehicles-page/transferred-vehicles-page.vue'" }
)

foreach ($replacement in $replacements) {
    $routerContent = $routerContent -replace [regex]::Escape($replacement.old), $replacement.new
    Write-Host "✅ Atualizado: $($replacement.old) → $($replacement.new)"
}

Set-Content -Path $routerPath -Value $routerContent
Write-Host "`n✅ Router atualizado com sucesso!"

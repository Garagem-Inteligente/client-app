# Script de Build Android - Garagem Inteligente
# Execute apos configurar o Android Studio manualmente

Write-Host "Building Android APK..." -ForegroundColor Blue

# Verificar pre-requisitos
Write-Host "Verificando pre-requisitos..." -ForegroundColor Yellow

# Verificar se esta no diretorio correto
if (!(Test-Path "capacitor.config.ts")) {
    Write-Host "ERRO: Execute este script da raiz do projeto (client-app)" -ForegroundColor Red
    exit 1
}

# Verificar Java
try {
    $javaVersion = java -version 2>&1
    Write-Host "Java encontrado" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Java nao encontrado. Instale JDK 17+" -ForegroundColor Red
    Write-Host "Download: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

# Verificar Android SDK
$androidHome = $env:ANDROID_HOME
if (!$androidHome -or !(Test-Path $androidHome)) {
    Write-Host "ERRO: ANDROID_HOME nao configurado ou SDK nao encontrado" -ForegroundColor Red
    Write-Host "Configure ANDROID_HOME nas variaveis de ambiente" -ForegroundColor Yellow
    exit 1
}

# Verificar adb
try {
    $adb = adb version 2>&1
    Write-Host "ADB encontrado" -ForegroundColor Green
} catch {
    Write-Host "ERRO: ADB nao encontrado. Verifique se platform-tools esta no PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Todos os pre-requisitos atendidos!" -ForegroundColor Green

# Build do projeto
Write-Host "Fazendo build do projeto..." -ForegroundColor Blue
try {
    pnpm run build
    Write-Host "Build do projeto concluido" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Falha no build do projeto" -ForegroundColor Red
    exit 1
}

# Sync com Capacitor
Write-Host "Sincronizando com Capacitor..." -ForegroundColor Blue
try {
    npx cap sync android
    Write-Host "Sync concluido" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Falha no sync com Capacitor" -ForegroundColor Red
    exit 1
}

# Build do APK
Write-Host "Gerando APK..." -ForegroundColor Blue
try {
    Set-Location android
    ./gradlew assembleDebug
    Set-Location ..
    Write-Host "APK gerado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Falha na geracao do APK" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Copiar APK
$apkSource = "android/app/build/outputs/apk/debug/app-debug.apk"
$apkDest = "garagem-inteligente-debug.apk"

if (Test-Path $apkSource) {
    Copy-Item $apkSource $apkDest -Force
    Write-Host "APK copiado para: ./$apkDest" -ForegroundColor Green
    Write-Host ""
    Write-Host "Build concluido com sucesso!" -ForegroundColor Green
    Write-Host "Para instalar: adb install $apkDest" -ForegroundColor Cyan
} else {
    Write-Host "ERRO: APK nao encontrado em $apkSource" -ForegroundColor Red
    exit 1
}

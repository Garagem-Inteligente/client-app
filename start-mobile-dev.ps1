# Desenvolvimento Mobile - Garagem Inteligente
# Script simplificado para iniciar desenvolvimento com emulador

Write-Host "Iniciando desenvolvimento mobile..." -ForegroundColor Yellow

# Verifica se servidor já está rodando
$viteProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*vite*" -or $_.CommandLine -like "*pnpm dev*"
}

if (-not $viteProcess) {
    Write-Host "Iniciando servidor Vite..." -ForegroundColor Cyan
    # Usa cmd para executar pnpm
    cmd /c "pnpm dev --host 0.0.0.0"
    Start-Sleep -Seconds 5
    Write-Host "Servidor iniciado em http://192.168.2.113:5173" -ForegroundColor Green
} else {
    Write-Host "Servidor Vite ja esta rodando" -ForegroundColor Green
}

# Configura Capacitor se necessário
$capConfigPath = Join-Path $PSScriptRoot "capacitor.config.ts"
$capConfigContent = Get-Content $capConfigPath -Raw

if ($capConfigContent -notmatch "server:\s*{") {
    Write-Host "Configurando Capacitor para desenvolvimento..." -ForegroundColor Cyan
    $serverConfig = "  server: {
    androidScheme: 'https',
    url: 'http://192.168.2.113:5173',
    cleartext: true
  },
"
    $capConfigContent = $capConfigContent -replace "  webDir: 'dist',", "  webDir: 'dist',$serverConfig"
    Set-Content -Path $capConfigPath -Value $capConfigContent
    Write-Host "Capacitor configurado" -ForegroundColor Green
}

# Sync e executa
Write-Host "Sincronizando e executando no emulador..." -ForegroundColor Cyan
cmd /c "pnpm cap sync android"
cmd /c "pnpm cap run android"

Write-Host "Desenvolvimento iniciado! Hot reload ativo no emulador." -ForegroundColor Green
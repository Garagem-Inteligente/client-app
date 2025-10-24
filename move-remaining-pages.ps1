# Script para mover arquivos .vue dos diretórios para as subpastas

$viewsPath = "c:\Users\Miker\OneDrive\Documentos\Projetos\Garagem Inteligente\client-app\src\views"

# Obter todas as pastas
$folders = Get-ChildItem $viewsPath -Directory

foreach ($folder in $folders) {
    $folderName = $folder.Name
    # Reconverter kebab-case para PascalCase para encontrar arquivo original
    $words = $folderName -replace "-page$", "" -split "-"
    $pascalName = ($words | ForEach-Object { [char]::ToUpper($_[0]) + $_.Substring(1) }) -join ""
    $originalFileName = "$pascalName" + "Page.vue"
    
    $sourceFile = "$viewsPath\$originalFileName"
    $destFile = "$viewsPath\$folderName\$folderName.vue"
    
    if (Test-Path $sourceFile) {
        Write-Host "Movendo $originalFileName para $folderName\"
        Move-Item -Path $sourceFile -Destination $destFile -Force
    } else {
        # Já foi movido
        $kebabFileName = $folderName -replace "-page$", "" | ForEach-Object {
            $_ -replace "([a-z])([A-Z])", '$1-$2' | ForEach-Object { $_.ToLower() }
        }
        $expectedFile = "$viewsPath\$folderName\$kebabFileName-page.vue"
        if (Test-Path $expectedFile) {
            Write-Host "✅ $folderName está correto"
        } else {
            Write-Host "⚠️ Arquivo não encontrado em $folderName"
        }
    }
}

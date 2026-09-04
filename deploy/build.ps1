# Construye frontend + publica LoginApi para IIS en Windows.
# Uso (PowerShell, desde la raíz del repo o deploy/):
#   powershell -ExecutionPolicy Bypass -File deploy/build.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root 'frontend'
$apiDir   = Join-Path $root 'login-api\LoginApi'
$wwwroot  = Join-Path $apiDir 'wwwroot'
$publish  = Join-Path $root 'publish'

Write-Host '[1/4] Build frontend (Vite)...'
Push-Location $frontend
try {
  npm ci
  npm run build
} finally {
  Pop-Location
}

Write-Host '[2/4] Copiando frontend\dist a LoginApi\wwwroot...'
if (Test-Path $wwwroot) { Remove-Item $wwwroot -Recurse -Force }
New-Item -ItemType Directory -Path $wwwroot -Force | Out-Null
Copy-Item (Join-Path $frontend 'dist\*') $wwwroot -Recurse

Write-Host '[3/4] Publicando LoginApi (Release)...'
dotnet publish (Join-Path $apiDir 'LoginApi.csproj') -c Release -o $publish

Write-Host '[4/4] Listo.'
Write-Host "  Publicación: $publish"
Write-Host "  En IIS: sitio web -> esa carpeta, App Pool 'Sin código administrado'."
Write-Host '  Pasos completos: deploy/README.md'

# Opcional — deploy con Netlify CLI (requiere login y SITE_ID).
# Flujo principal: conectar el repo en Netlify (ver NETLIFY.md).

param(
    [string]$SiteId = $env:NETLIFY_SITE_ID
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$projectDir = Join-Path $repoRoot "vite-project"

if (-not $SiteId) {
    Write-Error "Defina NETLIFY_SITE_ID o pase -SiteId. Ver NETLIFY-SECRETS.md"
}

Push-Location $projectDir
try {
    Write-Host "Build desde repo..." -ForegroundColor Cyan
    npm install
    npm run build

    Write-Host "Deploy a Netlify (site $SiteId)..." -ForegroundColor Cyan
    npx --yes netlify-cli@23.4.3 deploy --prod --dir=dist --site=$SiteId
    Write-Host "Listo." -ForegroundColor Green
}
finally {
    Pop-Location
}

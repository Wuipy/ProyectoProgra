param(
    [string]$SiteId = $env:NETLIFY_SITE_ID,
    [switch]$SoloZip
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$projectDir = Join-Path $repoRoot "vite-project"
$distDir = Join-Path $projectDir "dist"
$zipPath = Join-Path $projectDir "netlify-deploy.zip"

Push-Location $projectDir
try {
    Write-Host "Build SIGASJ frontend..." -ForegroundColor Cyan
    if (Test-Path "package-lock.json") {
        npm ci
    } else {
        npm install
    }
    npm run build

    foreach ($required in @("index.html", "404.html", "_redirects")) {
        if (-not (Test-Path (Join-Path $distDir $required))) {
            throw "Falta $required en dist/. Revise vite.config.js y public/_redirects."
        }
    }

    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    Compress-Archive -Path (Join-Path $distDir "*") -DestinationPath $zipPath
    Write-Host "ZIP listo: $zipPath" -ForegroundColor Green

    if ($SoloZip) {
        Write-Host ""
        Write-Host "Subir en Netlify -> Deploys -> Deploy manually -> arrastrar netlify-deploy.zip"
        return
    }

    if (-not $SiteId) {
        Write-Host ""
        Write-Host "Sin NETLIFY_SITE_ID. Opciones:" -ForegroundColor Yellow
        Write-Host "1) Subir netlify-deploy.zip manualmente en Netlify"
        Write-Host "2) netlify login && `$env:NETLIFY_SITE_ID='...' .\scripts\deploy-netlify.ps1"
        return
    }

    Write-Host "Desplegando a Netlify (site $SiteId)..." -ForegroundColor Cyan
    npx --yes netlify-cli@23.4.3 deploy --prod --dir=dist --site=$SiteId
    Write-Host "Deploy completado." -ForegroundColor Green
}
finally {
    Pop-Location
}

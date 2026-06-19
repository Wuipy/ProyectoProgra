# Netlify — secrets para GitHub Actions

Repo: **Wuipy/ProyectoProgra** → Settings → Secrets and variables → Actions

| Secret | Como obtenerlo |
|--------|----------------|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens → New token |
| `NETLIFY_SITE_ID` | Netlify → sitio **sigasjiv** → Site configuration → General → **Site ID** |

Con esos dos secrets, cada push a `main` despliega automaticamente via `.github/workflows/deploy-netlify.yml`.

Tambien se puede ejecutar manualmente: **Actions → Deploy frontend to Netlify → Run workflow**.

## Deploy manual (sin secrets)

```powershell
cd ProyectoProgra
.\scripts\deploy-netlify.ps1 -SoloZip
```

Subir `vite-project/netlify-deploy.zip` en Netlify → Deploys → Deploy manually.

## Configuracion del sitio en Netlify

Si conecta GitHub al sitio, dejar **vacios** Base directory, Build command y Publish directory.
El archivo `netlify.toml` en la raiz del repo define todo.

No agregar `VITE_API_BASE_URL` — el proxy `/api` apunta a MonsterASP.

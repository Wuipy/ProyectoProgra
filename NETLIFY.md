# Netlify — SIGASJ Frontend

Sitio: **sigasjiv** · Repo: `github.com/Wuipy/ProyectoProgra` · Rama: `main`

## Problema comun

Si la raiz da **404**, el sitio Netlify esta vacio o apunta a la carpeta incorrecta.
El build correcto vive en `vite-project/dist/` (no subir `vite-project` entero).

---

## Opcion A — Script automatico (recomendada en PC de Wuipy)

```powershell
cd ProyectoProgra
# Una sola vez: npx netlify-cli login
# Site ID: Netlify -> Site configuration -> General -> Site ID
$env:NETLIFY_SITE_ID = "PEGAR-SITE-ID-AQUI"
.\scripts\deploy-netlify.ps1
```

## Opcion B — Subir ZIP manual

```powershell
cd ProyectoProgra
.\scripts\deploy-netlify.ps1 -SoloZip
```

Luego en Netlify: **Deploys → Deploy manually →** arrastrar `vite-project/netlify-deploy.zip`

## Opcion C — GitHub conectado

En Netlify **borrar** Base directory, Build command y Publish directory (dejar vacios).
Netlify usara `netlify.toml` de la raiz del repo.

| Campo | Valor |
|-------|--------|
| Branch | `main` |
| Base / Build / Publish | *(vacios)* |

No definir `VITE_API_BASE_URL`. El proxy `/api` va al backend MonsterASP.

---

## Verificar despues del deploy

- `/` — landing SIGASJ
- `/login` — pagina de login (no 404)
- `/api/health` — respuesta JSON del backend

En Deploy file browser deben existir: `index.html`, `404.html`, `_redirects`

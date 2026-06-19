# GitHub Actions → Netlify (opcional)

Solo si **no** usan el build nativo de Netlify con repo conectado.

## Secrets en GitHub

**ProyectoProgra → Settings → Secrets and variables → Actions**

| Secret | Donde obtenerlo |
|--------|-----------------|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID` | Netlify → sigasjiv → Site configuration → General → Site ID |

## Ejecutar

Push a `main` (si cambia `vite-project/` o `netlify.toml`) **o**

**Actions → Deploy frontend to Netlify → Run workflow**

El workflow compila desde el repo y publica `vite-project/dist` — sin ZIP.

## Backend

El frontend en Netlify llama al API via proxy en `netlify.toml`:

```
/api/*  →  http://sigasj.runasp.net/api/*
```

No hace falta `VITE_API_BASE_URL` en Netlify.

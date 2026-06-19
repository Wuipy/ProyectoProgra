# Netlify + GitHub + MonsterASP — SIGASJ

Frontend en **Netlify** (desde el repo) · Backend en **MonsterASP** · Repo: `Wuipy/ProyectoProgra` · Rama: `main`

---

## Paso 1 — Conectar el repo en Netlify (Wuipy, una sola vez)

1. [app.netlify.com](https://app.netlify.com) → sitio **sigasjiv**
2. **Site configuration → Build & deploy → Continuous deployment**
3. **Link repository** → GitHub → `Wuipy/ProyectoProgra`
4. Rama de produccion: **`main`**

## Paso 2 — Limpiar settings manuales (importante)

**Site configuration → Build & deploy → Build settings → Edit**

| Campo | Valor |
|-------|--------|
| Base directory | *(vacío)* |
| Build command | *(vacío)* |
| Publish directory | *(vacío)* |

Netlify debe leer **`netlify.toml`** en la raiz del repo. Si hay valores manuales, los ignora o falla.

## Paso 3 — Variables de entorno

**No agregar** `VITE_API_BASE_URL`.

El archivo `netlify.toml` ya envia `/api/*` al backend:

```
http://sigasj.runasp.net/api/*
```

## Paso 4 — Deploy

Cada **push a `main`** dispara un build automatico.

O manual: **Deploys → Trigger deploy → Deploy site**

---

## Verificar

| URL | Esperado |
|-----|----------|
| `/` | Landing SIGASJ |
| `/login` | Login admin (no 404) |
| `/api/health` | `{"status":"ok",...}` desde MonsterASP |

En el deploy log debe verse `npm install && npm run build` dentro de `vite-project`.

En **Deploy file browser**: `index.html`, `404.html`, `_redirects`.

---

## Backend MonsterASP (CORS)

El backend debe permitir el origen de Netlify. En MonsterASP o GitHub Secrets:

```
Cors__AllowedOrigins__0 = https://sigasjiv.netlify.app
```

Health del backend: `http://sigasj.runasp.net/api/health`

---

## Alternativa: GitHub Actions

Si prefieren deploy via Actions en lugar del build nativo de Netlify, ver **NETLIFY-SECRETS.md** (requiere `NETLIFY_AUTH_TOKEN` y `NETLIFY_SITE_ID`).

Usar **una** opcion: build nativo de Netlify **o** GitHub Actions, no ambas a la vez.

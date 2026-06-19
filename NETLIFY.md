# Netlify + GitHub + MonsterASP — SIGASJ

Frontend en **Netlify** (desde el repo) · Backend en **MonsterASP** · Repo: `Wuipy/ProyectoProgra` · Rama: `main`

---

## Paso 1 — Conectar el repo en Netlify (Wuipy, una sola vez)

1. [app.netlify.com](https://app.netlify.com) → sitio **sigasjiv**
2. **Site configuration → Build & deploy → Continuous deployment**
3. **Link repository** → GitHub → `Wuipy/ProyectoProgra`
4. Rama de produccion: **`main`**

## Paso 2 — Build settings (elegir UNA opcion)

**Site configuration → Build & deploy → Build settings**

### Opcion A — Base directory vacio (recomendada)

| Campo | Valor |
|-------|--------|
| Base directory | *(vacío)* |
| Build command | *(vacío)* |
| Publish directory | *(vacío)* |

Netlify usa `netlify.toml` en la **raiz** del repo (con `base = "vite-project"`).

### Opcion B — Base directory = vite-project

| Campo | Valor |
|-------|--------|
| Base directory | `vite-project` |
| Build command | *(vacío)* |
| Publish directory | *(vacío)* |

Netlify usa `vite-project/netlify.toml` (sin `base` duplicado).

**Error comun:** Base directory = `vite-project` **y** ademas valores manuales en Build/Publish, o `base` duplicado → build falla o publica carpeta vacia.

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

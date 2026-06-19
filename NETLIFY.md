# Despliegue en Netlify — SIGASJ Frontend

Repo: `github.com/Wuipy/ProyectoProgra` · Rama: **`main`**

## Configuracion obligatoria en Netlify

**Site settings → Build & deploy → Build settings → Edit settings**

| Campo | Valor |
|-------|--------|
| **Branch to deploy** | `main` |
| **Base directory** | *(dejar vacio — lo define `netlify.toml` en la raiz)* |
| **Build command** | *(dejar vacio — lo define `netlify.toml`)* |
| **Publish directory** | *(dejar vacio — lo define `netlify.toml`)* |

Si hay valores manuales en esos campos, **borrarlos** para que Netlify use el archivo `netlify.toml` de la raiz del repo.

## Variables de entorno

No definir `VITE_API_BASE_URL` apuntando a MonsterASP.

El proxy en `netlify.toml` envia `/api/*` al backend:

```
http://sigasj.runasp.net/api/*
```

## Despues de cada push a main

1. Netlify → **Deploys** → verificar que arranco un deploy nuevo
2. Si no arranca solo: **Trigger deploy → Deploy site**
3. Probar:
   - `https://sigasj.netlify.app/` — landing
   - `https://sigasj.netlify.app/login` — login admin
   - `https://sigasj.netlify.app/api/health` — proxy al backend

## Si sigue "Page not found"

1. Confirmar que el deploy es desde **GitHub** (no drag-and-drop manual de una carpeta vieja)
2. En el deploy log, buscar: `npm run build` dentro de `vite-project`
3. En **Deploy file browser**, verificar que existen:
   - `_redirects`
   - `404.html`
   - `index.html`

## Estructura del repo

```
ProyectoProgra/
  netlify.toml          ← Netlify lee ESTE archivo
  vite-project/         ← app React + Vite
    dist/               ← salida del build (no commitear)
```

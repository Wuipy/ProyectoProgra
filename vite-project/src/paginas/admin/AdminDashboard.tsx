import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_ADMIN, ModuloInterno } from '../../config/navegacionInterna'

export function AdminDashboard() {
  return (
    <LayoutPanelInterno
      rol="admin"
      tituloPanel="Panel administrativo"
      modulos={MODULOS_ADMIN}
      rutaDashboard="/admin/dashboard"
    >
      <section className="dashboard-interno">
        <div className="dashboard-interno-encabezado">
          <p className="etiqueta">Dashboard administrativo</p>
          <h1>Bienvenida al panel de gestion</h1>
          <p>
            Acceda a los modulos administrativos de SIGASJ. Cada seccion concentra las herramientas
            de supervision y control interno de la ASADA.
          </p>
        </div>

        {MODULOS_ADMIN.reduce<{ seccion?: string; items: ModuloInterno[] }[]>((grupos, modulo) => {
          const ultimo = grupos[grupos.length - 1]
          if (ultimo && ultimo.seccion === modulo.seccion) {
            ultimo.items.push(modulo)
          } else {
            grupos.push({ seccion: modulo.seccion, items: [modulo] })
          }
          return grupos
        }, []).map((grupo) => (
          <div key={grupo.seccion ?? grupo.items[0]?.id} className="dashboard-grupo-modulos">
            {grupo.seccion && <h2 className="dashboard-grupo-titulo">{grupo.seccion}</h2>}
            <div className="grilla-modulos-dashboard">
              {grupo.items.map((modulo) => (
                <article key={modulo.id} className="tarjeta-modulo-dashboard">
                  <span className="tarjeta-modulo-etiqueta">
                    {modulo.disponible ? 'Disponible' : 'En desarrollo'}
                  </span>
                  <h3>{modulo.titulo}</h3>
                  <p>{modulo.descripcion}</p>
                  {modulo.disponible ? (
                    <a className="boton primario" href={modulo.ruta}>
                      Abrir modulo
                    </a>
                  ) : (
                    <span className="boton secundario deshabilitado" aria-disabled="true">
                      Proximamente
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </LayoutPanelInterno>
  )
}

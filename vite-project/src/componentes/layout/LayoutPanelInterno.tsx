import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoAsada from '../../assets/logo-asada.svg'
import { ModuloInterno } from '../../config/navegacionInterna'
import { cerrarSesionAdmin, esAdmin, obtenerNombreUsuario, RolUsuario } from '../../lib/auth'

type LayoutPanelInternoProps = {
  rol: RolUsuario
  tituloPanel: string
  modulos: ModuloInterno[]
  rutaDashboard: string
  children: ReactNode
}

export function LayoutPanelInterno({
  rol,
  tituloPanel,
  modulos,
  rutaDashboard,
  children,
}: LayoutPanelInternoProps) {
  const { pathname: rutaActual } = useLocation()
  const navigate = useNavigate()
  const nombreUsuario = obtenerNombreUsuario()
  const etiquetaRol = esAdmin() ? 'Administradora' : 'Fontanero'

  const cerrarSesion = () => {
    cerrarSesionAdmin()
    navigate('/')
  }

  return (
    <div className={`pagina pagina-admin pagina-panel-interno pagina-${rol}`}>
      <header className="encabezado-admin">
        <nav className="contenedor barra-admin" aria-label={`Navegacion ${tituloPanel}`}>
          <Link className="marca" to={rutaDashboard} aria-label={`Ir al dashboard ${tituloPanel}`}>
            <img src={logoAsada} alt="Logo ASADA San Juan" />
            <span className="marca-copy">
              <strong>SIGASJ</strong>
              <small>ASADA San Juan de Santa Cruz</small>
            </span>
          </Link>

          <div className="acciones-admin">
            <span className="badge-rol-usuario" aria-label={`Rol: ${etiquetaRol}`}>
              {etiquetaRol}
            </span>
            {nombreUsuario && (
              <span className="badge-usuario-interno" aria-label={`Usuario: ${nombreUsuario}`}>
                {nombreUsuario}
              </span>
            )}
            <button className="boton-login boton-cerrar-sesion" type="button" onClick={cerrarSesion}>
              Cerrar sesion
            </button>
          </div>
        </nav>
      </header>

      <div className="contenedor panel-interno-layout">
        <aside className="sidebar-panel" aria-label={`Menu ${tituloPanel}`}>
          <p className="sidebar-panel-etiqueta">{tituloPanel}</p>
          <nav className="sidebar-panel-nav">
            <Link
              className={rutaActual === rutaDashboard ? 'activo' : undefined}
              to={rutaDashboard}
            >
              Inicio del panel
            </Link>
            {modulos.reduce<{ seccion?: string; items: ModuloInterno[] }[]>((grupos, modulo) => {
              const ultimo = grupos[grupos.length - 1]
              if (ultimo && ultimo.seccion === modulo.seccion) {
                ultimo.items.push(modulo)
              } else {
                grupos.push({ seccion: modulo.seccion, items: [modulo] })
              }
              return grupos
            }, []).map((grupo) => (
              <div key={grupo.seccion ?? grupo.items[0]?.id} className="sidebar-panel-grupo">
                {grupo.seccion && <p className="sidebar-panel-seccion">{grupo.seccion}</p>}
                {grupo.items.map((modulo) => (
                  <Link
                    key={modulo.id}
                    className={rutaActual === modulo.ruta ? 'activo' : undefined}
                    to={modulo.ruta}
                    aria-disabled={!modulo.disponible}
                  >
                    {modulo.titulo}
                    {!modulo.disponible && <small>Proximamente</small>}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="contenido-panel-interno">{children}</main>
      </div>
    </div>
  )
}

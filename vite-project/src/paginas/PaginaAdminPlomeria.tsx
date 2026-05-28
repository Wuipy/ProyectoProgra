import logoAsada from '../assets/logo-asada.svg'
import { RegistroActividadesPlomeria } from '../componentes/RegistroActividadesPlomeria'
import { cerrarSesionAdmin } from '../servicios/authAdmin'

export function PaginaAdminPlomeria() {
  const cerrarSesion = () => {
    cerrarSesionAdmin()
    window.location.href = '/'
  }

  return (
    <div className="pagina pagina-admin">
      <header className="encabezado-admin">
        <nav className="contenedor barra-admin" aria-label="Navegacion administrativa">
          <a className="marca" href="/" aria-label="Volver al inicio de SIGASJ">
            <img src={logoAsada} alt="Logo ASADA San Juan" />
            <span className="marca-copy">
              <strong>SIGASJ</strong>
              <small>ASADA San Juan de Santa Cruz</small>
            </span>
          </a>

          <div className="acciones-admin">
            <a className="boton-admin-secundario" href="/">
              Portal publico
            </a>
            <button className="boton-login boton-cerrar-sesion" type="button" onClick={cerrarSesion}>
              Cerrar sesion
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-admin">
          <div className="contenedor hero-admin-contenido">
            <div>
              <p className="etiqueta">Panel administrativo</p>
              <h1>Registro de actividades de plomeria</h1>
              <p>
                Control interno para documentar trabajos operativos, dar seguimiento a estados y mantener el historial
                de tareas realizadas por el equipo de campo.
              </p>
            </div>

            <aside className="tarjeta-admin-resumen" aria-label="Resumen del modulo administrativo">
              <span>Modulo operativo</span>
              <strong>Plomeria</strong>
              <p>Gestion de fugas, presion, visitas de campo, aforos y control operativo.</p>
            </aside>
          </div>
        </section>

        <RegistroActividadesPlomeria />
      </main>
    </div>
  )
}

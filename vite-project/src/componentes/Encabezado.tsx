import logoAsada from '../assets/logo-asada.svg'

const enlaces = [
  { texto: 'Inicio', destino: '#inicio' },
  { texto: 'Quienes somos', destino: '#quienes-somos' },
  { texto: 'Servicios', destino: '#servicios' },
  { texto: 'Comunicados', destino: '#comunicados' },
  { texto: 'Reportar averia', destino: '#reportar-averia' },
  { texto: 'Proyectos', destino: '#proyectos' },
  { texto: 'Contacto', destino: '#contacto' },
]

export function Encabezado() {
  return (
    <header className="encabezado">
      <nav className="contenedor barra-navegacion" aria-label="Navegacion principal">
        <a className="marca" href="#inicio" aria-label="Ir al inicio de SIGASJ">
          <img src={logoAsada} alt="Logo ASADA San Juan" />
          <span className="marca-copy">
            <strong>SIGASJ</strong>
            <small>ASADA San Juan de Santa Cruz</small>
          </span>
        </a>

        <div className="navegacion-derecha">
          <div className="enlaces-navegacion">
            {enlaces.map((enlace) => (
              <a key={enlace.destino} href={enlace.destino}>
                {enlace.texto}
              </a>
            ))}
          </div>
          <a className="boton-login" href="/login">
            Panel admin
          </a>
        </div>
      </nav>
    </header>
  )
}

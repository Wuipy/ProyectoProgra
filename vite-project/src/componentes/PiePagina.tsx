import logoAsada from '../assets/logo-asada.svg'

const enlacesRapidos = [
  { texto: 'Servicios', destino: '#servicios' },
  { texto: 'Comunicados', destino: '#comunicados' },
  { texto: 'Consulta publica', destino: '#consulta-publica' },
  { texto: 'Contacto', destino: '#contacto' },
  { texto: 'Iniciar sesion', destino: '/login' },
]

export function PiePagina() {
  return (
    <footer className="pie-pagina">
      <div className="contenedor pie-contenido">
        <div>
          <h2>
            <img className="logo-pie" src={logoAsada} alt="Logo ASADA San Juan" />
            SIGASJ
          </h2>
          <p>ASADA San Juan de Santa Cruz</p>
          <small>Sistema desarrollado para mejorar la gestion del acueducto comunal.</small>
        </div>
        <nav aria-label="Enlaces rapidos del pie de pagina">
          {enlacesRapidos.map((enlace) => (
            <a key={enlace.destino} href={enlace.destino}>
              {enlace.texto}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

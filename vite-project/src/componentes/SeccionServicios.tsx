import { serviciosDisponibles } from '../datos/landingDatos'

export function SeccionServicios() {
  return (
    <section className="seccion servicios" id="servicios">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Servicios disponibles</p>
          <h2>Opciones publicas para abonados y visitantes</h2>
        </div>
        <div className="grilla-tarjetas">
          {serviciosDisponibles.map((servicio) => (
            <article className="tarjeta tarjeta-servicio" key={servicio.titulo}>
              <span className="icono-servicio" aria-hidden="true">
                {servicio.icono}
              </span>
              <h3>{servicio.titulo}</h3>
              <p>{servicio.descripcion}</p>
              <a className="enlace-accion" href={servicio.destino}>
                {servicio.accion}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

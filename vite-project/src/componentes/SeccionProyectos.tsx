import { proyectosFuturos } from '../datos/landingDatos'

export function SeccionProyectos() {
  return (
    <section className="seccion seccion-suave" id="proyectos">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Proyectos a futuro</p>
          <h2>Mejoras previstas para el acueducto</h2>
        </div>
        <div className="grilla-tarjetas proyectos">
          {proyectosFuturos.map((proyecto) => (
            <article className="tarjeta" key={proyecto.titulo}>
              <div className="meta-tarjeta">
                <strong>{proyecto.estado}</strong>
              </div>
              <h3>{proyecto.titulo}</h3>
              <p>{proyecto.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

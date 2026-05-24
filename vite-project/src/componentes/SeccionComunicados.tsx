import { comunicados } from '../datos/landingDatos'

export function SeccionComunicados() {
  return (
    <section className="seccion seccion-suave" id="comunicados">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Comunicados oficiales</p>
          <h2>Informacion reciente para la comunidad</h2>
        </div>
        <div className="grilla-tarjetas">
          {comunicados.map((comunicado) => (
            <article className="tarjeta comunicado" key={comunicado.titulo}>
              <div className="meta-tarjeta">
                <span>{comunicado.fecha}</span>
                <strong>{comunicado.estado}</strong>
              </div>
              <h3>{comunicado.titulo}</h3>
              <p>{comunicado.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

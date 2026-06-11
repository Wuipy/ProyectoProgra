import { useEffect, useState } from 'react'
import { proyectosFuturos as proyectosLocales } from '../datos/landingDatos'
import { listarProyectos, Proyecto } from '../servicios/landingService'

export function SeccionProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosLocales)

  useEffect(() => {
    let activo = true

    const cargarProyectos = async () => {
      try {
        const datos = await listarProyectos()
        if (activo && datos.length > 0) {
          setProyectos(datos)
        }
      } catch {
        // Mantiene datos locales como respaldo si el backend no esta disponible.
      }
    }

    cargarProyectos()

    return () => {
      activo = false
    }
  }, [])

  return (
    <section className="seccion seccion-suave" id="proyectos">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Proyectos a futuro</p>
          <h2>Mejoras previstas para el acueducto</h2>
        </div>
        <div className="grilla-tarjetas proyectos">
          {proyectos.map((proyecto) => (
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

import { useEffect, useState } from 'react'
import { comunicados as comunicadosLocales } from '../datos/landingDatos'
import { Comunicado, listarComunicados } from '../servicios/landingService'

export function SeccionComunicados() {
  const [comunicados, setComunicados] = useState<Comunicado[]>(comunicadosLocales)

  useEffect(() => {
    let activo = true

    const cargarComunicados = async () => {
      try {
        const datos = await listarComunicados()
        if (activo && datos.length > 0) {
          setComunicados(datos)
        }
      } catch {
        // Mantiene datos locales como respaldo si el backend no esta disponible.
      }
    }

    cargarComunicados()

    return () => {
      activo = false
    }
  }, [])

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

import { FormEvent, useState } from 'react'
import { consultarSeguimiento } from '../servicios/landingService'
import { ReporteAveria } from './FormularioAveria'

type ConsultaPublicaProps = {
  reportesAveria?: ReporteAveria[]
}

export function ConsultaPublica({ reportesAveria = [] }: ConsultaPublicaProps) {
  const [numeroSeguimiento, setNumeroSeguimiento] = useState('')
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState('')
  const [detalleReporte, setDetalleReporte] = useState<ReporteAveria | null>(null)
  const [consultando, setConsultando] = useState(false)

  const consultar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setResultado('')
    setDetalleReporte(null)

    if (!numeroSeguimiento.trim()) {
      setError('Ingrese un numero de seguimiento para realizar la consulta.')
      return
    }

    const busqueda = numeroSeguimiento.trim().toUpperCase()
    const reporteEncontrado = reportesAveria.find(
      (reporte) => reporte.numeroSeguimiento.toUpperCase() === busqueda,
    )

    setError('')

    if (reporteEncontrado) {
      setDetalleReporte(reporteEncontrado)
      setResultado('Estado: Recibido por la ASADA, pendiente de revision operativa.')
      return
    }

    setConsultando(true)

    try {
      const respuesta = await consultarSeguimiento(numeroSeguimiento)
      setResultado(respuesta.mensajeEstado)

      if (respuesta.detalleAveria) {
        setDetalleReporte({
          nombre: respuesta.detalleAveria.nombre,
          telefono: respuesta.detalleAveria.telefono,
          correo: respuesta.detalleAveria.correo,
          direccion: respuesta.detalleAveria.direccion,
          tipo: respuesta.detalleAveria.tipo,
          descripcion: respuesta.detalleAveria.descripcion,
          numeroSeguimiento: respuesta.detalleAveria.numeroSeguimiento,
          fecha: respuesta.detalleAveria.fecha,
          foto: respuesta.detalleAveria.foto,
        })
      }
    } catch (consultaError) {
      setError(consultaError instanceof Error ? consultaError.message : 'No se pudo consultar el seguimiento.')
    } finally {
      setConsultando(false)
    }
  }

  return (
    <section className="seccion consulta-publica" id="consulta-publica">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Consulta publica</p>
          <h2>Seguimiento de solicitudes</h2>
          <p>Consulte el estado de un tramite o reporte usando el numero de seguimiento asignado.</p>
        </div>

        <div className="consulta-contenido">
          <div className="consulta-resumen" aria-label="Tipos de seguimiento disponibles">
            <span>Reportes AV</span>
            <span>Solicitudes SOL</span>
            <span>Respuesta en linea</span>
          </div>

          <form className="formulario-consulta" onSubmit={consultar} noValidate>
            <label className="campo" htmlFor="numero-seguimiento">
              <span>Numero de seguimiento</span>
              <input
                id="numero-seguimiento"
                value={numeroSeguimiento}
                placeholder="Ejemplo: AV-0001 o SOL-0001"
                onChange={(evento) => {
                  setNumeroSeguimiento(evento.target.value)
                  setError('')
                }}
              />
              {error && <small className="error">{error}</small>}
            </label>
            <div className="consulta-ejemplos" aria-label="Ejemplos de busqueda">
              {['AV-0001', 'SOL-0001'].map((ejemplo) => (
                <button
                  key={ejemplo}
                  type="button"
                  onClick={() => {
                    setNumeroSeguimiento(ejemplo)
                    setError('')
                  }}
                >
                  {ejemplo}
                </button>
              ))}
            </div>
            <button className="boton primario" type="submit" disabled={consultando}>
              {consultando ? 'Consultando...' : 'Consultar'}
            </button>
            {resultado && (
              <div className="mensaje-exito resultado-consulta" role="status">
                <strong>{resultado}</strong>
                {detalleReporte && (
                  <span>
                    {detalleReporte.tipo} en {detalleReporte.direccion}. Reportado por {detalleReporte.nombre}.
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

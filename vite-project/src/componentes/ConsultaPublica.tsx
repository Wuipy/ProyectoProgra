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

  const consultar = (evento: FormEvent<HTMLFormElement>) => {
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

    setResultado(consultarSeguimiento(numeroSeguimiento))
  }

  return (
    <section className="seccion consulta-publica" id="consulta-publica">
      <div className="contenedor consulta-contenido">
        <div>
          <p className="etiqueta">Consulta publica</p>
          <h2>Seguimiento de solicitudes</h2>
          <p>Consulte el estado de un tramite o reporte usando el numero de seguimiento asignado.</p>
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
          <button className="boton primario" type="submit">
            Consultar
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
    </section>
  )
}

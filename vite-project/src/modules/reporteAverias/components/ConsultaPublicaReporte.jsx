import { useState } from 'react'
import { obtenerReporteAveria } from '../services/reporteAveriasService'

export function ConsultaPublicaReporte() {
  const [numero, setNumero] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [consultando, setConsultando] = useState(false)

  const consultarReporte = async (evento) => {
    evento.preventDefault()
    const busqueda = numero.trim().toUpperCase()

    setResultado(null)
    setError('')

    if (!busqueda) {
      setError('Ingresa un numero de seguimiento.')
      return
    }

    try {
      setConsultando(true)
      const reporte = await obtenerReporteAveria(busqueda)
      setResultado(reporte)
    } catch {
      setError('No se encontro un reporte con ese numero.')
    } finally {
      setConsultando(false)
    }
  }

  return (
    <section className="consulta-seguimiento">
      <div>
        <p>Consulta publica</p>
        <h2>Seguimiento de solicitudes</h2>
      </div>

      <form className="consulta-seguimiento__formulario" onSubmit={consultarReporte}>
        <label>
          Numero de seguimiento
          <input
            onChange={(evento) => {
              setNumero(evento.target.value)
              setError('')
            }}
            placeholder="Ejemplo: AV-0001"
            type="search"
            value={numero}
          />
        </label>
        <button className="boton-principal" disabled={consultando} type="submit">
          {consultando ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {error && <p className="reporte-alerta">{error}</p>}

      {resultado && (
        <div className="consulta-seguimiento__resultado" role="status">
          <strong>Reporte: {resultado.id}</strong>
          <span>Estado: {resultado.estado}</span>
          <span>Prioridad: {resultado.prioridad ?? 'Media'}</span>
          <span>Fecha: {resultado.fecha}</span>
        </div>
      )}
    </section>
  )
}

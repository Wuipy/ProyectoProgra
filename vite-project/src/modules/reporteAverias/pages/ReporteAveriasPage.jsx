import { ConsultaPublicaReporte } from '../components/ConsultaPublicaReporte'
import { ReporteAveriasForm } from '../components/ReporteAveriasForm'
import { ReporteAveriasTable } from '../components/ReporteAveriasTable'
import { useReporteAverias } from '../hooks/useReporteAverias'

export function ReporteAveriasPage() {
  const {
    busqueda,
    cambiarEstado,
    cargando,
    eliminarReporte,
    error,
    guardarReporte,
    reporteEditando,
    reportes,
    setBusqueda,
    setReporteEditando,
  } = useReporteAverias()

  return (
    <main className="reporte-averias-page">
      <section className="reporte-averias-hero">
        <div>
          <p>Modulo operativo</p>
          <h1>Reporte de averias</h1>
        </div>
        <strong>{reportes.length} reportes</strong>
      </section>

      <section className="reporte-averias-layout">
        <ReporteAveriasForm
          onCancelar={() => setReporteEditando(null)}
          onGuardar={guardarReporte}
          reporteEditando={reporteEditando}
        />

        <div className="reporte-listado">
          <div className="reporte-listado__encabezado">
            <h2>Listado de reportes</h2>
            <input
              aria-label="Buscar reporte"
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por codigo, vecino, direccion o estado"
              type="search"
              value={busqueda}
            />
          </div>

          {error && <p className="reporte-alerta">{error}</p>}
          {cargando ? (
            <p className="reporte-tabla-vacia">Cargando reportes...</p>
          ) : (
            <ReporteAveriasTable
              filtroGlobal={busqueda}
              onCambiarEstado={cambiarEstado}
              onEditar={setReporteEditando}
              onEliminar={eliminarReporte}
              reportes={reportes}
            />
          )}
        </div>
      </section>

      <ConsultaPublicaReporte />
    </main>
  )
}

import { useMemo, useState } from 'react'
import { ReporteAveria } from './FormularioAveria'

type SeccionReportesAveriaProps = {
  reportes: ReporteAveria[]
}

export function SeccionReportesAveria({ reportes }: SeccionReportesAveriaProps) {
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  const tiposDisponibles = useMemo(
    () => ['Todos', ...Array.from(new Set(reportes.map((reporte) => reporte.tipo))).filter(Boolean)],
    [reportes],
  )

  const reportesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return reportes.filter((reporte) => {
      const coincideTipo = filtroTipo === 'Todos' || reporte.tipo === filtroTipo
      const coincideBusqueda =
        !termino ||
        reporte.numeroSeguimiento.toLowerCase().includes(termino) ||
        reporte.direccion.toLowerCase().includes(termino) ||
        reporte.descripcion.toLowerCase().includes(termino)

      return coincideTipo && coincideBusqueda
    })
  }, [busqueda, filtroTipo, reportes])

  const reportesConFoto = reportes.filter((reporte) => reporte.foto).length

  return (
    <section className="seccion seccion-reportes-averia" id="reportes-recibidos">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Seguimiento comunitario</p>
          <h2>Reportes de averias recibidos</h2>
          <p>Los comentarios enviados desde el formulario se reflejan aqui para consulta visual.</p>
        </div>

        <div className="panel-reportes">
          <div className="metricas-reportes" aria-label="Resumen de reportes de averia">
            <div>
              <strong>{reportes.length}</strong>
              <span>Reportes recibidos</span>
            </div>
            <div>
              <strong>{reportesConFoto}</strong>
              <span>Con evidencia</span>
            </div>
            <div>
              <strong>{reportes.length ? 'Activo' : 'En espera'}</strong>
              <span>Canal comunitario</span>
            </div>
          </div>

          <div className="barra-reportes">
            <label className="campo busqueda-reportes" htmlFor="buscar-reporte">
              <span>Buscar reporte</span>
              <input
                id="buscar-reporte"
                placeholder="Numero, ubicacion o comentario"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </label>

            <div className="filtros-reportes" aria-label="Filtrar reportes por tipo">
              {tiposDisponibles.map((tipo) => (
                <button
                  className={tipo === filtroTipo ? 'activo' : ''}
                  key={tipo}
                  type="button"
                  onClick={() => setFiltroTipo(tipo)}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="reportes-averia">
            <div className="reportes-averia-encabezado">
              <h3>Ultimos reportes</h3>
              <span>{reportesFiltrados.length} visibles</span>
            </div>

            {reportes.length === 0 ? (
              <p className="sin-reportes">Cuando alguien envie el formulario de averias, su comentario aparecera aqui.</p>
            ) : reportesFiltrados.length === 0 ? (
              <p className="sin-reportes">No hay reportes que coincidan con la busqueda seleccionada.</p>
            ) : (
              <div className="grilla-reportes-averia">
                {reportesFiltrados.map((reporte) => (
                  <article className="tarjeta-reporte-averia" key={reporte.numeroSeguimiento}>
                    <div>
                      <strong>{reporte.tipo}</strong>
                      <span>{reporte.numeroSeguimiento}</span>
                    </div>
                    <p>{reporte.descripcion}</p>
                    <small>
                      {reporte.direccion} - {reporte.fecha}
                    </small>
                    {reporte.foto && <img src={reporte.foto.vistaPrevia} alt={`Evidencia de ${reporte.tipo}`} />}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

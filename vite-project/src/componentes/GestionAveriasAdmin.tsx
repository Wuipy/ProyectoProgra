import { useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_AVERIA_ADMIN,
  PAGINA_TAMANIO,
  PRIORIDADES_AVERIA,
  TIPOS_AVERIA,
  claseEtiquetaEstado,
  claseEtiquetaPrioridad,
} from '../config/constantesModulos'
import {
  AveriaHistorialItem,
  ReporteAveriaResponse,
  asignarFontaneroAveria,
  cambiarEstadoAveria,
  cambiarPrioridadAveria,
  guardarObservacionesAdminAveria,
  listarAveriasGestion,
  listarFontaneros,
  listarHistorialAveria,
} from '../servicios/landingService'

export function GestionAveriasAdmin() {
  const [reportes, setReportes] = useState<ReporteAveriaResponse[]>([])
  const [fontaneros, setFontaneros] = useState<string[]>([])
  const [historial, setHistorial] = useState<AveriaHistorialItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todos')
  const [pagina, setPagina] = useState(1)
  const [seleccionado, setSeleccionado] = useState<ReporteAveriaResponse | null>(null)
  const [observacionesAdmin, setObservacionesAdmin] = useState('')
  const [fontaneroAsignar, setFontaneroAsignar] = useState('')

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const [datos, listaFontaneros] = await Promise.all([listarAveriasGestion(), listarFontaneros()])
      setReportes(datos)
      setFontaneros(listaFontaneros.map((f) => f.usuario))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las averias.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return reportes.filter((r) => {
      const okEstado = filtroEstado === 'Todos' || r.estado === filtroEstado
      const okTipo = filtroTipo === 'Todos' || r.tipo === filtroTipo
      const okPrioridad = filtroPrioridad === 'Todos' || r.prioridad === filtroPrioridad
      const okBusqueda =
        !termino ||
        r.numeroSeguimiento.toLowerCase().includes(termino) ||
        r.nombre.toLowerCase().includes(termino) ||
        r.direccion.toLowerCase().includes(termino)
      return okEstado && okTipo && okPrioridad && okBusqueda
    })
  }, [busqueda, filtroEstado, filtroPrioridad, filtroTipo, reportes])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGINA_TAMANIO))
  const paginados = filtrados.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  useEffect(() => {
    setPagina(1)
  }, [busqueda, filtroEstado, filtroPrioridad, filtroTipo])

  const abrirDetalle = async (reporte: ReporteAveriaResponse) => {
    setSeleccionado(reporte)
    setObservacionesAdmin(reporte.observacionesAdmin ?? '')
    setFontaneroAsignar(reporte.fontaneroAsignado ?? '')
    setMensaje('')
    setError('')
    try {
      const items = await listarHistorialAveria(reporte.numeroSeguimiento)
      setHistorial(items)
    } catch {
      setHistorial([])
    }
  }

  const actualizarLocal = (actualizado: ReporteAveriaResponse) => {
    setReportes((prev) => prev.map((r) => (r.numeroSeguimiento === actualizado.numeroSeguimiento ? actualizado : r)))
    setSeleccionado(actualizado)
  }

  const ejecutar = async (numero: string, accion: () => Promise<ReporteAveriaResponse>, ok: string) => {
    setProcesando(numero)
    setMensaje('')
    setError('')
    try {
      const actualizado = await accion()
      actualizarLocal(actualizado)
      setMensaje(ok)
      const items = await listarHistorialAveria(numero)
      setHistorial(items)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo completar la accion.')
    } finally {
      setProcesando(null)
    }
  }

  return (
    <section className="seccion banda-actividades banda-averias-fontanero">
      <div className="contenedor">
        <div className="encabezado-seccion modulo-encabezado-interno">
          <p className="etiqueta">Gestion administrativa</p>
          <h2>Reportes de averias</h2>
          <p>Supervise, asigne fontaneros, defina prioridades y consulte el historial de cada reporte.</p>
        </div>

        <div className="barra-filtros-modulo">
          <label className="campo">
            <span>Buscar</span>
            <input placeholder="Numero, nombre, ubicacion..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </label>
          <label className="campo">
            <span>Estado</span>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="Todos">Todos</option>
              {ESTADOS_AVERIA_ADMIN.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span>Tipo</span>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="Todos">Todos</option>
              {TIPOS_AVERIA.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="campo">
            <span>Prioridad</span>
            <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
              <option value="Todos">Todas</option>
              {PRIORIDADES_AVERIA.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <button className="boton secundario" type="button" onClick={cargar} disabled={cargando}>
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {mensaje && <div className="mensaje-exito" role="status"><strong>{mensaje}</strong></div>}
        {error && <div className="mensaje-error" role="alert"><strong>{error}</strong></div>}

        <div className="grilla-gestion-modulo">
          <div className="panel-reportes panel-gestion-averias">
            {cargando ? (
              <p className="sin-reportes">Cargando averias...</p>
            ) : paginados.length === 0 ? (
              <p className="sin-reportes">No hay averias con los filtros seleccionados.</p>
            ) : (
              <div className="lista-modulo-compacta">
                {paginados.map((reporte) => (
                  <button
                    key={reporte.numeroSeguimiento}
                    type="button"
                    className={`item-lista-modulo ${seleccionado?.numeroSeguimiento === reporte.numeroSeguimiento ? 'activo' : ''}`}
                    onClick={() => abrirDetalle(reporte)}
                  >
                    <div className="item-lista-encabezado">
                      <strong>{reporte.numeroSeguimiento}</strong>
                      <span className={claseEtiquetaEstado(reporte.estado)}>{reporte.estado}</span>
                    </div>
                    <span>{reporte.tipo} — {reporte.direccion}</span>
                    <small>
                      <span className={claseEtiquetaPrioridad(reporte.prioridad)}>{reporte.prioridad}</span>
                      {' · '}
                      {reporte.fontaneroAsignado ?? 'Sin asignar'}
                    </small>
                  </button>
                ))}
              </div>
            )}

            {totalPaginas > 1 && (
              <div className="paginacion-modulo">
                <button type="button" className="boton secundario" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>Anterior</button>
                <span>Pagina {pagina} de {totalPaginas}</span>
                <button type="button" className="boton secundario" disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>Siguiente</button>
              </div>
            )}
          </div>

          <aside className="panel-formulario panel-detalle-modulo">
            {!seleccionado ? (
              <div className="detalle-vacio">
                <h3>Seleccione una averia</h3>
                <p>Elija un reporte para gestionar estado, asignacion, prioridad e historial.</p>
              </div>
            ) : (
              <>
                <div className="encabezado-formulario">
                  <h3>{seleccionado.numeroSeguimiento}</h3>
                  <p>{seleccionado.mensajeEstado}</p>
                </div>

                <dl className="ficha-detalle">
                  <div><dt>Reportado por</dt><dd>{seleccionado.nombre}</dd></div>
                  <div><dt>Telefono</dt><dd><a href={`tel:${seleccionado.telefono}`}>{seleccionado.telefono}</a></dd></div>
                  <div><dt>Ubicacion</dt><dd>{seleccionado.direccion}</dd></div>
                  <div><dt>Descripcion</dt><dd>{seleccionado.descripcion}</dd></div>
                  <div><dt>Fecha</dt><dd>{seleccionado.fecha}</dd></div>
                </dl>

                {seleccionado.foto && (
                  <img className="evidencia-detalle" src={seleccionado.foto.vistaPrevia} alt="Evidencia del reporte" />
                )}

                <label className="campo">
                  <span>Asignar fontanero</span>
                  <select value={fontaneroAsignar} onChange={(e) => setFontaneroAsignar(e.target.value)}>
                    <option value="">Seleccione fontanero</option>
                    {fontaneros.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </label>
                <button
                  className="boton primario ancho"
                  type="button"
                  disabled={!fontaneroAsignar || procesando === seleccionado.numeroSeguimiento}
                  onClick={() =>
                    ejecutar(
                      seleccionado.numeroSeguimiento,
                      () => asignarFontaneroAveria(seleccionado.numeroSeguimiento, fontaneroAsignar),
                      'Fontanero asignado correctamente.',
                    )
                  }
                >
                  Asignar fontanero
                </button>

                <label className="campo">
                  <span>Prioridad</span>
                  <select
                    value={seleccionado.prioridad}
                    onChange={(e) =>
                      ejecutar(
                        seleccionado.numeroSeguimiento,
                        () => cambiarPrioridadAveria(seleccionado.numeroSeguimiento, e.target.value),
                        'Prioridad actualizada.',
                      )
                    }
                  >
                    {PRIORIDADES_AVERIA.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>

                <label className="campo">
                  <span>Observaciones administrativas</span>
                  <textarea value={observacionesAdmin} onChange={(e) => setObservacionesAdmin(e.target.value)} />
                </label>
                <button
                  className="boton secundario ancho"
                  type="button"
                  disabled={procesando === seleccionado.numeroSeguimiento}
                  onClick={() =>
                    ejecutar(
                      seleccionado.numeroSeguimiento,
                      () => guardarObservacionesAdminAveria(seleccionado.numeroSeguimiento, observacionesAdmin),
                      'Observaciones guardadas.',
                    )
                  }
                >
                  Guardar observaciones
                </button>

                <div className="grupo-botones">
                  {ESTADOS_AVERIA_ADMIN.map((estado) => (
                    <button
                      key={estado}
                      className="boton secundario"
                      type="button"
                      disabled={procesando === seleccionado.numeroSeguimiento || seleccionado.estado === estado}
                      onClick={() =>
                        ejecutar(
                          seleccionado.numeroSeguimiento,
                          () => cambiarEstadoAveria(seleccionado.numeroSeguimiento, estado),
                          `Estado cambiado a ${estado}.`,
                        )
                      }
                    >
                      {estado}
                    </button>
                  ))}
                </div>

                <div className="panel-historial">
                  <h4>Historial de cambios</h4>
                  {historial.length === 0 ? (
                    <p className="sin-reportes">Sin historial registrado.</p>
                  ) : (
                    <ul className="lista-historial">
                      {historial.map((item, i) => (
                        <li key={`${item.fecha}-${i}`}>
                          <strong>{item.accion}</strong>
                          <span>{item.valorAnterior ?? '—'} → {item.valorNuevo ?? '—'}</span>
                          <small>{item.usuario ?? 'Sistema'} · {item.fecha}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import {
  asignarmeAveria,
  cambiarEstadoAveria,
  guardarNotasAveria,
  listarAveriasGestion,
  listarAveriasOperativas,
  ReporteAveriaResponse,
} from '../servicios/landingService'
import { obtenerNombreUsuario, RolUsuario } from '../servicios/authAdmin'

type GestionReportesAveriaProps = {
  rol: RolUsuario | string
}

type VistaTab = 'todos' | 'sin-asignar' | 'mis-casos' | 'atendidos'

const ESTADOS_AVERIA = ['Recibido', 'En revision', 'En atencion', 'Atendido'] as const
const TIPOS_AVERIA = ['Fuga', 'Baja presion', 'Ruptura de tuberia', 'Falta de agua', 'Otro']

const SIGUIENTE_ESTADO: Record<string, string> = {
  Recibido: 'En revision',
  'En revision': 'En atencion',
  'En atencion': 'Atendido',
  Atendido: 'Atendido',
}

export function GestionReportesAveria({ rol }: GestionReportesAveriaProps) {
  const esFontanero = rol === 'fontanero'
  const nombreUsuario = obtenerNombreUsuario()
  const [reportes, setReportes] = useState<ReporteAveriaResponse[]>([])
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [vistaActiva, setVistaActiva] = useState<VistaTab>(esFontanero ? 'sin-asignar' : 'todos')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState<ReporteAveriaResponse | null>(null)
  const [notasBorrador, setNotasBorrador] = useState('')

  const cargarReportes = async () => {
    setCargando(true)
    try {
      const datos = esFontanero ? await listarAveriasOperativas() : await listarAveriasGestion()
      setReportes(datos)
      if (seleccionado) {
        const actualizado = datos.find((r) => r.numeroSeguimiento === seleccionado.numeroSeguimiento)
        setSeleccionado(actualizado ?? null)
        setNotasBorrador(actualizado?.notasAtencion ?? '')
      }
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudieron cargar los reportes.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarReportes()
  }, [])

  const estadisticas = useMemo(
    () => ({
      total: reportes.length,
      sinAsignar: reportes.filter((r) => !r.fontaneroAsignado && r.estado !== 'Atendido').length,
      misCasos: reportes.filter((r) => r.fontaneroAsignado === nombreUsuario).length,
      atendidos: reportes.filter((r) => r.estado === 'Atendido').length,
    }),
    [reportes, nombreUsuario],
  )

  const reportesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return reportes.filter((reporte) => {
      const coincideVista =
        vistaActiva === 'todos' ||
        (vistaActiva === 'sin-asignar' && !reporte.fontaneroAsignado && reporte.estado !== 'Atendido') ||
        (vistaActiva === 'mis-casos' && reporte.fontaneroAsignado === nombreUsuario) ||
        (vistaActiva === 'atendidos' && reporte.estado === 'Atendido')

      const coincideTipo = filtroTipo === 'Todos' || reporte.tipo === filtroTipo
      const coincideBusqueda =
        !termino ||
        reporte.numeroSeguimiento.toLowerCase().includes(termino) ||
        reporte.direccion.toLowerCase().includes(termino) ||
        reporte.descripcion.toLowerCase().includes(termino) ||
        reporte.nombre.toLowerCase().includes(termino) ||
        (reporte.fontaneroAsignado ?? '').toLowerCase().includes(termino)

      return coincideVista && coincideTipo && coincideBusqueda
    })
  }, [busqueda, filtroTipo, nombreUsuario, reportes, vistaActiva])

  const abrirDetalle = (reporte: ReporteAveriaResponse) => {
    setSeleccionado(reporte)
    setNotasBorrador(reporte.notasAtencion ?? '')
    setMensaje('')
  }

  const asignarme = async (numeroSeguimiento: string) => {
    setProcesando(numeroSeguimiento)
    setMensaje('')

    try {
      const actualizado = await asignarmeAveria(numeroSeguimiento)
      setReportes((actuales) =>
        actuales.map((reporte) => (reporte.numeroSeguimiento === numeroSeguimiento ? actualizado : reporte)),
      )
      setSeleccionado(actualizado)
      setMensaje(`Reporte ${numeroSeguimiento} asignado a usted.`)
      setVistaActiva('mis-casos')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo asignar el reporte.')
    } finally {
      setProcesando(null)
    }
  }

  const cambiarEstado = async (reporte: ReporteAveriaResponse, estado?: string) => {
    const numeroSeguimiento = reporte.numeroSeguimiento
    const nuevoEstado = estado ?? SIGUIENTE_ESTADO[reporte.estado] ?? reporte.estado
    setProcesando(numeroSeguimiento)
    setMensaje('')

    try {
      const actualizado = await cambiarEstadoAveria(numeroSeguimiento, nuevoEstado)
      setReportes((actuales) =>
        actuales.map((item) => (item.numeroSeguimiento === numeroSeguimiento ? actualizado : item)),
      )
      setSeleccionado(actualizado)
      setMensaje(`Estado de ${numeroSeguimiento} actualizado a "${actualizado.estado}".`)
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo cambiar el estado.')
    } finally {
      setProcesando(null)
    }
  }

  const guardarNotas = async () => {
    if (!seleccionado) return

    setProcesando(seleccionado.numeroSeguimiento)
    setMensaje('')

    try {
      const actualizado = await guardarNotasAveria(seleccionado.numeroSeguimiento, notasBorrador)
      setReportes((actuales) =>
        actuales.map((item) =>
          item.numeroSeguimiento === seleccionado.numeroSeguimiento ? actualizado : item,
        ),
      )
      setSeleccionado(actualizado)
      setMensaje('Notas de atencion guardadas.')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudieron guardar las notas.')
    } finally {
      setProcesando(null)
    }
  }

  const puedeGestionar = (reporte: ReporteAveriaResponse) =>
    !esFontanero || reporte.fontaneroAsignado === nombreUsuario

  return (
    <section className="seccion banda-actividades banda-averias-fontanero">
      <div className="contenedor">
        <div className="panel-metricas-actividades panel-metricas-mejorado" aria-label="Resumen de reportes">
          <div>
            <span>Total</span>
            <strong>{estadisticas.total}</strong>
          </div>
          <div>
            <span>Sin asignar</span>
            <strong>{estadisticas.sinAsignar}</strong>
          </div>
          <div>
            <span>{esFontanero ? 'Mis casos' : 'En equipo'}</span>
            <strong>{estadisticas.misCasos}</strong>
          </div>
          <div>
            <span>Atendidos</span>
            <strong>{estadisticas.atendidos}</strong>
          </div>
        </div>

        <div className="barra-modulo-superior">
          <div className="tabs-modulo" role="tablist" aria-label="Vistas de reportes">
            {(
              esFontanero
                ? [
                    { id: 'sin-asignar' as VistaTab, label: 'Sin asignar' },
                    { id: 'mis-casos' as VistaTab, label: 'Mis casos' },
                    { id: 'atendidos' as VistaTab, label: 'Atendidos' },
                  ]
                : [
                    { id: 'todos' as VistaTab, label: 'Todos' },
                    { id: 'sin-asignar' as VistaTab, label: 'Sin asignar' },
                    { id: 'mis-casos' as VistaTab, label: 'Asignados' },
                    { id: 'atendidos' as VistaTab, label: 'Atendidos' },
                  ]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={vistaActiva === tab.id}
                className={vistaActiva === tab.id ? 'activo' : ''}
                onClick={() => setVistaActiva(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="boton secundario boton-refrescar" type="button" onClick={cargarReportes} disabled={cargando}>
            {cargando ? 'Actualizando...' : 'Actualizar lista'}
          </button>
        </div>

        <div className="grilla-gestion-modulo">
          <div className="panel-reportes panel-gestion-averias">
            <div className="barra-reportes">
              <label className="campo busqueda-reportes" htmlFor="buscar-averia-fontanero">
                <span>Buscar reporte</span>
                <input
                  id="buscar-averia-fontanero"
                  placeholder="Numero, nombre, ubicacion..."
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                />
              </label>

              <label className="campo filtro-select-modulo">
                <span>Tipo de averia</span>
                <select value={filtroTipo} onChange={(evento) => setFiltroTipo(evento.target.value)}>
                  <option value="Todos">Todos</option>
                  {TIPOS_AVERIA.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {mensaje && (
              <div className="mensaje-exito" role="status">
                <strong>{mensaje}</strong>
              </div>
            )}

            {cargando ? (
              <p className="sin-reportes">Cargando reportes de averia...</p>
            ) : reportesFiltrados.length === 0 ? (
              <p className="sin-reportes">No hay reportes en esta vista.</p>
            ) : (
              <div className="lista-modulo-compacta">
                {reportesFiltrados.map((reporte) => {
                  const activo = seleccionado?.numeroSeguimiento === reporte.numeroSeguimiento
                  const ocupado = procesando === reporte.numeroSeguimiento

                  return (
                    <button
                      key={reporte.numeroSeguimiento}
                      type="button"
                      className={`item-lista-modulo ${activo ? 'activo' : ''}`}
                      onClick={() => abrirDetalle(reporte)}
                    >
                      <div className="item-lista-encabezado">
                        <strong>{reporte.numeroSeguimiento}</strong>
                        <span className={`prioridad prioridad-${reporte.estado.replace(/ /g, '-').toLowerCase()}`}>
                          {reporte.estado}
                        </span>
                      </div>
                      <span>{reporte.tipo} — {reporte.direccion}</span>
                      <small>{reporte.fontaneroAsignado ? `Fontanero: ${reporte.fontaneroAsignado}` : 'Sin asignar'}</small>
                      {esFontanero && !reporte.fontaneroAsignado && reporte.estado !== 'Atendido' && (
                        <span
                          className="accion-inline"
                          onClick={(evento) => {
                            evento.stopPropagation()
                            if (!ocupado) asignarme(reporte.numeroSeguimiento)
                          }}
                        >
                          Tomar caso
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <aside className="panel-formulario panel-detalle-modulo">
            {!seleccionado ? (
              <div className="detalle-vacio">
                <p className="etiqueta">Detalle del reporte</p>
                <h3>Seleccione un reporte</h3>
                <p>Elija un reporte de la lista para ver datos de contacto, evidencia y acciones de seguimiento.</p>
              </div>
            ) : (
              <>
                <div className="encabezado-formulario">
                  <p className="etiqueta">Detalle operativo</p>
                  <h3>{seleccionado.numeroSeguimiento}</h3>
                  <p>{seleccionado.mensajeEstado}</p>
                </div>

                <dl className="ficha-detalle">
                  <div>
                    <dt>Tipo</dt>
                    <dd>{seleccionado.tipo}</dd>
                  </div>
                  <div>
                    <dt>Reportado por</dt>
                    <dd>{seleccionado.nombre}</dd>
                  </div>
                  <div>
                    <dt>Telefono</dt>
                    <dd>
                      <a href={`tel:${seleccionado.telefono}`}>{seleccionado.telefono}</a>
                    </dd>
                  </div>
                  {seleccionado.correo && (
                    <div>
                      <dt>Correo</dt>
                      <dd>
                        <a href={`mailto:${seleccionado.correo}`}>{seleccionado.correo}</a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt>Ubicacion</dt>
                    <dd>{seleccionado.direccion}</dd>
                  </div>
                  <div>
                    <dt>Descripcion</dt>
                    <dd>{seleccionado.descripcion}</dd>
                  </div>
                  <div>
                    <dt>Fecha reporte</dt>
                    <dd>{seleccionado.fecha}</dd>
                  </div>
                  {seleccionado.fechaUltimaActualizacion && (
                    <div>
                      <dt>Ultima actualizacion</dt>
                      <dd>{seleccionado.fechaUltimaActualizacion}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Fontanero asignado</dt>
                    <dd>{seleccionado.fontaneroAsignado ?? 'Sin asignar'}</dd>
                  </div>
                </dl>

                {seleccionado.foto && (
                  <img className="evidencia-detalle" src={seleccionado.foto.vistaPrevia} alt={`Evidencia ${seleccionado.tipo}`} />
                )}

                <label className="campo">
                  <span>Notas de atencion</span>
                  <textarea
                    placeholder="Registre lo revisado, materiales usados o visitas realizadas."
                    value={notasBorrador}
                    onChange={(evento) => setNotasBorrador(evento.target.value)}
                    disabled={!puedeGestionar(seleccionado)}
                  />
                </label>

                <div className="grupo-botones">
                  {esFontanero && !seleccionado.fontaneroAsignado && seleccionado.estado !== 'Atendido' && (
                    <button
                      className="boton primario ancho"
                      type="button"
                      disabled={procesando === seleccionado.numeroSeguimiento}
                      onClick={() => asignarme(seleccionado.numeroSeguimiento)}
                    >
                      Tomar reporte
                    </button>
                  )}
                  {puedeGestionar(seleccionado) && seleccionado.estado !== 'Atendido' && (
                    <button
                      className="boton claro ancho"
                      type="button"
                      disabled={procesando === seleccionado.numeroSeguimiento}
                      onClick={() => cambiarEstado(seleccionado)}
                    >
                      Avanzar a: {SIGUIENTE_ESTADO[seleccionado.estado]}
                    </button>
                  )}
                  {puedeGestionar(seleccionado) && (
                    <button
                      className="boton secundario ancho"
                      type="button"
                      disabled={procesando === seleccionado.numeroSeguimiento}
                      onClick={guardarNotas}
                    >
                      Guardar notas
                    </button>
                  )}
                  {!esFontanero &&
                    ESTADOS_AVERIA.map((estado) => (
                      <button
                        className="boton secundario"
                        key={estado}
                        type="button"
                        disabled={procesando === seleccionado.numeroSeguimiento || seleccionado.estado === estado}
                        onClick={() => cambiarEstado(seleccionado, estado)}
                      >
                        Marcar: {estado}
                      </button>
                    ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

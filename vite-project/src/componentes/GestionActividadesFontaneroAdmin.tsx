import { useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_ACTIVIDAD_FONTANERO,
  ESTADOS_VALIDACION_ACTIVIDAD,
  PAGINA_TAMANIO,
  TIPOS_ACTIVIDAD_FONTANERO,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  ActividadFontaneroItem,
  listarActividadesFontaneroAdmin,
  validarActividadFontanero,
} from '../servicios/landingService'

export function GestionActividadesFontaneroAdmin() {
  const [actividades, setActividades] = useState<ActividadFontaneroItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroFontanero, setFiltroFontanero] = useState('Todos')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroValidacion, setFiltroValidacion] = useState('Todos')
  const [pagina, setPagina] = useState(1)
  const [seleccionada, setSeleccionada] = useState<ActividadFontaneroItem | null>(null)
  const [observacionValidacion, setObservacionValidacion] = useState('')

  const cargar = async () => {
    setCargando(true)
    try {
      setActividades(await listarActividadesFontaneroAdmin())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las actividades.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const fontaneros = useMemo(
    () => ['Todos', ...Array.from(new Set(actividades.map((a) => a.fontanero)))],
    [actividades],
  )

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return actividades.filter((a) => {
      const okFontanero = filtroFontanero === 'Todos' || a.fontanero === filtroFontanero
      const okTipo = filtroTipo === 'Todos' || a.tipo === filtroTipo
      const okEstado = filtroEstado === 'Todos' || a.estado === filtroEstado
      const okValidacion = filtroValidacion === 'Todos' || a.estadoValidacion === filtroValidacion
      const okBusqueda =
        !termino ||
        a.descripcion.toLowerCase().includes(termino) ||
        a.ubicacion.toLowerCase().includes(termino)
      return okFontanero && okTipo && okEstado && okValidacion && okBusqueda
    })
  }, [actividades, busqueda, filtroEstado, filtroFontanero, filtroTipo, filtroValidacion])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGINA_TAMANIO))
  const paginadas = filtradas.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  const validar = async (estadoValidacion: string) => {
    if (!seleccionada) return
    if (estadoValidacion === 'Rechazada' && !observacionValidacion.trim()) {
      setError('Debe indicar una observacion al rechazar.')
      return
    }
    setError('')
    setMensaje('')
    try {
      const actualizada = await validarActividadFontanero(
        seleccionada.id,
        estadoValidacion,
        observacionValidacion,
      )
      setActividades((prev) => prev.map((a) => (a.id === actualizada.id ? actualizada : a)))
      setSeleccionada(actualizada)
      setMensaje(`Actividad ${estadoValidacion.toLowerCase()}.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo validar la actividad.')
    }
  }

  return (
    <section className="seccion modulo-supervision-bitacora">
      <div className="contenedor">
        <div className="encabezado-seccion modulo-encabezado-interno">
          <p className="etiqueta">Supervision de campo</p>
          <h2>Bitacora del fontanero</h2>
          <p>Revise, valide o rechace registros enviados desde el panel del fontanero.</p>
        </div>

        <p className="aviso-separacion-modulos" role="note">
          Este modulo muestra unicamente la bitacora del fontanero. Los trabajos internos de la
          administracion se gestionan en <strong>Trabajos internos ASADA</strong>.
        </p>

        <div className="barra-filtros-modulo">
          <input placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select value={filtroFontanero} onChange={(e) => setFiltroFontanero(e.target.value)}>
            {fontaneros.map((f) => <option key={f} value={f}>{f === 'Todos' ? 'Fontanero' : f}</option>)}
          </select>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="Todos">Tipo</option>
            {TIPOS_ACTIVIDAD_FONTANERO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Estado</option>
            {ESTADOS_ACTIVIDAD_FONTANERO.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={filtroValidacion} onChange={(e) => setFiltroValidacion(e.target.value)}>
            <option value="Todos">Validacion</option>
            {ESTADOS_VALIDACION_ACTIVIDAD.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
        {error && <div className="mensaje-error" role="alert">{error}</div>}

        <div className="grilla-gestion-modulo">
          <div className="lista-modulo-compacta">
            {cargando ? (
              <p className="sin-reportes">Cargando...</p>
            ) : paginadas.map((actividad) => (
              <button
                key={actividad.id}
                type="button"
                className={`item-lista-modulo ${seleccionada?.id === actividad.id ? 'activo' : ''}`}
                onClick={() => { setSeleccionada(actividad); setObservacionValidacion('') }}
              >
                <div className="item-lista-encabezado">
                  <strong>{actividad.tipo}</strong>
                  <span className={claseEtiquetaEstado(actividad.estadoValidacion)}>{actividad.estadoValidacion}</span>
                </div>
                <span>{actividad.fontanero} · {actividad.ubicacion}</span>
                <small>{actividad.fechaActividad}</small>
              </button>
            ))}
          </div>

          <aside className="panel-detalle-modulo">
            {!seleccionada ? (
              <p className="sin-reportes">Seleccione una actividad para validar.</p>
            ) : (
              <>
                <h3>{seleccionada.tipo}</h3>
                <p><strong>Fontanero:</strong> {seleccionada.fontanero}</p>
                <p><strong>Ubicacion:</strong> {seleccionada.ubicacion}</p>
                <p><strong>Descripcion:</strong> {seleccionada.descripcion}</p>
                {seleccionada.numeroAveriaVinculada && <p><strong>Averia:</strong> {seleccionada.numeroAveriaVinculada}</p>}
                {seleccionada.materialesUtilizados && <p><strong>Materiales:</strong> {seleccionada.materialesUtilizados}</p>}
                <label className="campo">
                  <span>Observacion de validacion</span>
                  <textarea value={observacionValidacion} onChange={(e) => setObservacionValidacion(e.target.value)} />
                </label>
                <div className="grupo-botones">
                  <button className="boton primario" type="button" onClick={() => validar('Validada')}>Validar</button>
                  <button className="boton secundario" type="button" onClick={() => validar('Rechazada')}>Rechazar</button>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

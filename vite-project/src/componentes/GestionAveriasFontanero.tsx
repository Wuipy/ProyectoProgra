import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_AVERIA_FONTANERO,
  PAGINA_TAMANIO,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  ReporteAveriaResponse,
  guardarAtencionFontaneroAveria,
  listarAveriasAsignadas,
} from '../servicios/landingService'

export function GestionAveriasFontanero() {
  const [reportes, setReportes] = useState<ReporteAveriaResponse[]>([])
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [pagina, setPagina] = useState(1)
  const [seleccionado, setSeleccionado] = useState<ReporteAveriaResponse | null>(null)
  const [descripcionTrabajo, setDescripcionTrabajo] = useState('')
  const [materialesUtilizados, setMaterialesUtilizados] = useState('')
  const [notasAtencion, setNotasAtencion] = useState('')
  const [estadoTrabajo, setEstadoTrabajo] = useState('En proceso')
  const [evidencia, setEvidencia] = useState<{ nombre: string; vistaPrevia: string } | undefined>()

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      setReportes(await listarAveriasAsignadas())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar sus averias asignadas.')
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
      const okBusqueda =
        !termino ||
        r.numeroSeguimiento.toLowerCase().includes(termino) ||
        r.direccion.toLowerCase().includes(termino)
      return okEstado && okBusqueda
    })
  }, [busqueda, filtroEstado, reportes])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGINA_TAMANIO))
  const paginados = filtrados.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  const abrirDetalle = (reporte: ReporteAveriaResponse) => {
    setSeleccionado(reporte)
    setDescripcionTrabajo(reporte.descripcionTrabajo ?? '')
    setMaterialesUtilizados(reporte.materialesUtilizados ?? '')
    setNotasAtencion(reporte.notasAtencion ?? '')
    setEstadoTrabajo(
      ESTADOS_AVERIA_FONTANERO.includes(reporte.estado as (typeof ESTADOS_AVERIA_FONTANERO)[number])
        ? reporte.estado
        : 'En proceso',
    )
    setMensaje('')
    setError('')
  }

  const actualizarFoto = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) {
      setEvidencia(undefined)
      return
    }
    const lector = new FileReader()
    lector.onload = () => setEvidencia({ nombre: archivo.name, vistaPrevia: String(lector.result) })
    lector.readAsDataURL(archivo)
  }

  const guardarAtencion = async () => {
    if (!seleccionado) return
    setProcesando(seleccionado.numeroSeguimiento)
    setMensaje('')
    setError('')
    try {
      const actualizado = await guardarAtencionFontaneroAveria(seleccionado.numeroSeguimiento, {
        descripcionTrabajo,
        materialesUtilizados,
        notasAtencion,
        estado: estadoTrabajo,
        evidenciaNombre: evidencia?.nombre,
        evidenciaBase64: evidencia?.vistaPrevia,
      })
      setReportes((prev) => prev.map((r) => (r.numeroSeguimiento === actualizado.numeroSeguimiento ? actualizado : r)))
      setSeleccionado(actualizado)
      setMensaje('Atencion registrada correctamente.')
      setEvidencia(undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la atencion.')
    } finally {
      setProcesando(null)
    }
  }

  return (
    <section className="seccion banda-actividades banda-averias-fontanero modulo-averias-fontanero modulo-layout-horizontal">
      <div className="contenedor modulo-layout-horizontal-contenedor">
        <div className="encabezado-formulario encabezado-formulario-horizontal encabezado-modulo-interno">
          <div>
            <p className="etiqueta">Trabajo asignado</p>
            <h2>Averias asignadas</h2>
          </div>
          <p>Solo puede ver y atender los reportes que la administradora le asigno.</p>
        </div>

        <div className="barra-filtros-modulo barra-filtros-horizontal">
          <label className="campo">
            <span>Buscar</span>
            <input placeholder="Numero o ubicacion..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </label>
          <label className="campo">
            <span>Estado</span>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="Todos">Todos</option>
              {ESTADOS_AVERIA_FONTANERO.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </label>
          <button className="boton secundario" type="button" onClick={cargar} disabled={cargando}>Actualizar</button>
        </div>

        {mensaje && <div className="mensaje-exito" role="status"><strong>{mensaje}</strong></div>}
        {error && <div className="mensaje-error" role="alert"><strong>{error}</strong></div>}

        <div className="panel-reportes panel-gestion-averias panel-lista-averias-horizontal">
          {cargando ? (
            <p className="sin-reportes">Cargando averias asignadas...</p>
          ) : paginados.length === 0 ? (
            <p className="sin-reportes">No tiene averias asignadas en este momento.</p>
          ) : (
            <div className="lista-modulo-horizontal">
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
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="panel-formulario panel-detalle-modulo panel-detalle-horizontal">
          {!seleccionado ? (
            <div className="detalle-vacio">
              <h3>Seleccione una averia</h3>
              <p>Registre el trabajo realizado, materiales y evidencia.</p>
            </div>
          ) : (
            <>
              <div className="encabezado-formulario encabezado-formulario-horizontal encabezado-detalle-averia">
                <div>
                  <p className="etiqueta">Atencion de averia</p>
                  <h3>{seleccionado.numeroSeguimiento}</h3>
                </div>
                <p>{seleccionado.descripcion}</p>
              </div>

              {seleccionado.foto && (
                <img className="evidencia-detalle evidencia-detalle-inline" src={seleccionado.foto.vistaPrevia} alt="Evidencia inicial" />
              )}

              <div className="grilla-formulario-modulo grilla-formulario-horizontal">
                <label className="campo">
                  <span>Estado del trabajo</span>
                  <select value={estadoTrabajo} onChange={(e) => setEstadoTrabajo(e.target.value)}>
                    {ESTADOS_AVERIA_FONTANERO.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </label>

                <label className="campo">
                  <span>Evidencia del trabajo (opcional)</span>
                  <input type="file" accept="image/*" onChange={actualizarFoto} />
                </label>

                <label className="campo campo-ancho-completo">
                  <span>Descripcion del trabajo realizado</span>
                  <textarea rows={2} value={descripcionTrabajo} onChange={(e) => setDescripcionTrabajo(e.target.value)} />
                </label>

                <label className="campo campo-span-2">
                  <span>Materiales utilizados</span>
                  <textarea rows={2} value={materialesUtilizados} onChange={(e) => setMaterialesUtilizados(e.target.value)} />
                </label>

                <label className="campo campo-span-2">
                  <span>Notas adicionales</span>
                  <textarea rows={2} value={notasAtencion} onChange={(e) => setNotasAtencion(e.target.value)} />
                </label>
              </div>

              {seleccionado.evidenciaTrabajo && (
                <img className="evidencia-detalle evidencia-detalle-inline" src={seleccionado.evidenciaTrabajo.vistaPrevia} alt="Evidencia de trabajo" />
              )}

              <div className="fila-accion-formulario-horizontal">
                <button
                  className="boton primario"
                  type="button"
                  disabled={procesando === seleccionado.numeroSeguimiento}
                  onClick={guardarAtencion}
                >
                  Guardar atencion
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}

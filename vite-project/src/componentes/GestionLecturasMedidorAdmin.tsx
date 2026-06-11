import { useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_LECTURA,
  PAGINA_TAMANIO,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  LecturaMedidorItem,
  actualizarLecturaMedidor,
  historialLecturasMedidor,
  listarLecturasMedidorAdmin,
} from '../servicios/landingService'

export function GestionLecturasMedidorAdmin() {
  const [lecturas, setLecturas] = useState<LecturaMedidorItem[]>([])
  const [historial, setHistorial] = useState<LecturaMedidorItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroFontanero, setFiltroFontanero] = useState('Todos')
  const [pagina, setPagina] = useState(1)
  const [seleccionada, setSeleccionada] = useState<LecturaMedidorItem | null>(null)
  const [lecturaCorregida, setLecturaCorregida] = useState('')

  const cargar = async () => {
    setCargando(true)
    try {
      setLecturas(await listarLecturasMedidorAdmin())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las lecturas.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const fontaneros = useMemo(
    () => ['Todos', ...Array.from(new Set(lecturas.map((l) => l.fontanero)))],
    [lecturas],
  )

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return lecturas.filter((l) => {
      const okEstado = filtroEstado === 'Todos' || l.estado === filtroEstado
      const okFontanero = filtroFontanero === 'Todos' || l.fontanero === filtroFontanero
      const okBusqueda =
        !termino ||
        l.nombreAbonado.toLowerCase().includes(termino) ||
        l.numeroMedidor.toLowerCase().includes(termino)
      return okEstado && okFontanero && okBusqueda
    })
  }, [busqueda, filtroEstado, filtroFontanero, lecturas])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGINA_TAMANIO))
  const paginadas = filtradas.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  const abrirDetalle = async (lectura: LecturaMedidorItem) => {
    setSeleccionada(lectura)
    setLecturaCorregida(String(lectura.lecturaActual))
    try {
      setHistorial(await historialLecturasMedidor(lectura.numeroMedidor))
    } catch {
      setHistorial([])
    }
  }

  const aprobar = async () => {
    if (!seleccionada) return
    try {
      const actualizada = await actualizarLecturaMedidor(seleccionada.id, { estado: 'Revisada' })
      setLecturas((prev) => prev.map((l) => (l.id === actualizada.id ? actualizada : l)))
      setSeleccionada(actualizada)
      setMensaje('Lectura revisada y aprobada.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo aprobar la lectura.')
    }
  }

  const corregir = async () => {
    if (!seleccionada) return
    const valor = Number(lecturaCorregida)
    if (Number.isNaN(valor)) {
      setError('Ingrese una lectura valida.')
      return
    }
    try {
      const actualizada = await actualizarLecturaMedidor(seleccionada.id, {
        lecturaActual: valor,
        estado: 'Revisada',
      })
      setLecturas((prev) => prev.map((l) => (l.id === actualizada.id ? actualizada : l)))
      setSeleccionada(actualizada)
      setMensaje('Lectura corregida.')
      setHistorial(await historialLecturasMedidor(actualizada.numeroMedidor))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo corregir la lectura.')
    }
  }

  return (
    <section className="seccion banda-actividades">
      <div className="contenedor">
        <div className="encabezado-seccion modulo-encabezado-interno">
          <p className="etiqueta">Control de consumo</p>
          <h2>Lecturas de medidores</h2>
          <p>Revise lecturas, inconsistencias e historial por abonado o medidor.</p>
        </div>

        <div className="barra-filtros-modulo">
          <input placeholder="Abonado o medidor..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos">Estado</option>
            {ESTADOS_LECTURA.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={filtroFontanero} onChange={(e) => setFiltroFontanero(e.target.value)}>
            {fontaneros.map((f) => <option key={f} value={f}>{f === 'Todos' ? 'Fontanero' : f}</option>)}
          </select>
        </div>

        {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
        {error && <div className="mensaje-error" role="alert">{error}</div>}

        <div className="grilla-gestion-modulo">
          <div className="lista-modulo-compacta">
            {cargando ? (
              <p className="sin-reportes">Cargando...</p>
            ) : paginadas.map((lectura) => (
              <button
                key={lectura.id}
                type="button"
                className={`item-lista-modulo ${seleccionada?.id === lectura.id ? 'activo' : ''}`}
                onClick={() => abrirDetalle(lectura)}
              >
                <div className="item-lista-encabezado">
                  <strong>{lectura.numeroMedidor}</strong>
                  <span className={claseEtiquetaEstado(lectura.estado)}>{lectura.estado}</span>
                </div>
                <span>{lectura.nombreAbonado} · Consumo {lectura.consumo}</span>
                <small>{lectura.fontanero} · {lectura.fechaLectura}</small>
              </button>
            ))}
          </div>

          <aside className="panel-detalle-modulo">
            {!seleccionada ? (
              <p className="sin-reportes">Seleccione una lectura para revisar.</p>
            ) : (
              <>
                <h3>{seleccionada.numeroMedidor}</h3>
                <p><strong>Abonado:</strong> {seleccionada.nombreAbonado}</p>
                <p><strong>Anterior / Actual:</strong> {seleccionada.lecturaAnterior} → {seleccionada.lecturaActual}</p>
                <p><strong>Consumo:</strong> {seleccionada.consumo}</p>
                {seleccionada.alertaConsumoAlto && <p className="alerta-consumo">Alerta: consumo alto vs mes anterior.</p>}
                <label className="campo">
                  <span>Corregir lectura actual</span>
                  <input value={lecturaCorregida} onChange={(e) => setLecturaCorregida(e.target.value)} />
                </label>
                <div className="grupo-botones">
                  <button className="boton primario" type="button" onClick={aprobar}>Aprobar</button>
                  <button className="boton secundario" type="button" onClick={corregir}>Corregir y aprobar</button>
                </div>
                <div className="panel-historial">
                  <h4>Historial del medidor</h4>
                  <ul className="lista-historial">
                    {historial.map((h) => (
                      <li key={h.id}>
                        <strong>{h.fechaLectura}</strong>
                        <span>Consumo {h.consumo} · {h.estado}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

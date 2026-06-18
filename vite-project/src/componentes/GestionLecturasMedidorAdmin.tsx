import { useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_LECTURA,
  ESTADOS_MEDIDOR_LECTURA,
  PAGINA_TAMANIO,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  AsignarLecturaMedidorForm,
  FontaneroResumen,
  HistorialLecturaCambio,
  LecturaMedidorItem,
  ResumenLecturasMedidor,
  actualizarLecturaMedidor,
  asignarLecturaMedidor,
  historialCambiosLectura,
  historialLecturasMedidor,
  historialLecturasPorAbonado,
  listarLecturasMedidorAdmin,
  reporteLecturasMedidor,
  resumenLecturasMedidorAdmin,
} from '../servicios/lecturasMedidoresService'
import { listarFontaneros } from '../servicios/landingService'

const resumenInicial: ResumenLecturasMedidor = {
  totalMes: 0,
  pendientes: 0,
  registradasHoy: 0,
  validadas: 0,
  conInconsistencia: 0,
  consumosAltos: 0,
}

const asignacionInicial = (): AsignarLecturaMedidorForm => ({
  nombreAbonado: '',
  numeroAbonado: '',
  numeroMedidor: '',
  ubicacion: '',
  lecturaAnterior: 0,
  fechaLectura: new Date().toISOString().slice(0, 10),
  fontaneroId: 0,
  observaciones: '',
})

function parseFecha(valor: string) {
  const partes = valor.split('/')
  if (partes.length === 3) {
    return new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]))
  }
  return new Date(valor)
}

export function GestionLecturasMedidorAdmin() {
  const [lecturas, setLecturas] = useState<LecturaMedidorItem[]>([])
  const [fontaneros, setFontaneros] = useState<FontaneroResumen[]>([])
  const [historial, setHistorial] = useState<LecturaMedidorItem[]>([])
  const [historialCambios, setHistorialCambios] = useState<HistorialLecturaCambio[]>([])
  const [resumen, setResumen] = useState<ResumenLecturasMedidor>(resumenInicial)
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroFontanero, setFiltroFontanero] = useState('Todos')
  const [filtroEstadoMedidor, setFiltroEstadoMedidor] = useState('Todos')
  const [filtroConsumoAlto, setFiltroConsumoAlto] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [pagina, setPagina] = useState(1)
  const [seleccionada, setSeleccionada] = useState<LecturaMedidorItem | null>(null)
  const [lecturaCorregida, setLecturaCorregida] = useState('')
  const [observacionAdmin, setObservacionAdmin] = useState('')
  const [mostrarAsignacion, setMostrarAsignacion] = useState(false)
  const [asignacion, setAsignacion] = useState<AsignarLecturaMedidorForm>(asignacionInicial())

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const [lista, resumenData, listaFontaneros] = await Promise.all([
        listarLecturasMedidorAdmin(),
        resumenLecturasMedidorAdmin(),
        listarFontaneros(),
      ])
      setLecturas(lista)
      setResumen(resumenData)
      setFontaneros(listaFontaneros)
      if (listaFontaneros.length > 0 && asignacion.fontaneroId === 0) {
        setAsignacion((a) => ({ ...a, fontaneroId: listaFontaneros[0].id }))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las lecturas.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const nombresFontaneros = useMemo(
    () => ['Todos', ...Array.from(new Set(lecturas.map((l) => l.fontanero)))],
    [lecturas],
  )

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return lecturas.filter((l) => {
      const okEstado = filtroEstado === 'Todos' || l.estado === filtroEstado
      const okFontanero = filtroFontanero === 'Todos' || l.fontanero === filtroFontanero
      const okEstadoMedidor = filtroEstadoMedidor === 'Todos' || l.estadoMedidor === filtroEstadoMedidor
      const okConsumoAlto = !filtroConsumoAlto || l.consumoAlto || l.alertaConsumoAlto
      const okBusqueda =
        !termino ||
        l.nombreAbonado.toLowerCase().includes(termino) ||
        (l.numeroAbonado ?? '').toLowerCase().includes(termino) ||
        l.numeroMedidor.toLowerCase().includes(termino)
      let okFecha = true
      if (fechaInicio) okFecha = okFecha && parseFecha(l.fechaLectura) >= new Date(fechaInicio)
      if (fechaFin) okFecha = okFecha && parseFecha(l.fechaLectura) <= new Date(fechaFin + 'T23:59:59')
      return okEstado && okFontanero && okEstadoMedidor && okConsumoAlto && okBusqueda && okFecha
    })
  }, [busqueda, filtroEstado, filtroFontanero, filtroEstadoMedidor, filtroConsumoAlto, fechaInicio, fechaFin, lecturas])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGINA_TAMANIO))
  const paginadas = filtradas.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  useEffect(() => {
    setPagina(1)
  }, [busqueda, filtroEstado, filtroFontanero, filtroEstadoMedidor, filtroConsumoAlto, fechaInicio, fechaFin])

  const abrirDetalle = async (lectura: LecturaMedidorItem) => {
    setSeleccionada(lectura)
    setLecturaCorregida(String(lectura.lecturaActual))
    setObservacionAdmin(lectura.observacionAdmin ?? '')
    setMensaje('')
    setError('')
    try {
      const [histMedidor, histCambios] = await Promise.all([
        historialLecturasMedidor(lectura.numeroMedidor),
        historialCambiosLectura(lectura.id),
      ])
      setHistorial(histMedidor)
      setHistorialCambios(histCambios)
    } catch {
      setHistorial([])
      setHistorialCambios([])
    }
  }

  const actualizarLocal = (actualizada: LecturaMedidorItem) => {
    setLecturas((prev) => prev.map((l) => (l.id === actualizada.id ? actualizada : l)))
    setSeleccionada(actualizada)
  }

  const ejecutarAccion = async (
    accion: () => Promise<LecturaMedidorItem>,
    mensajeOk: string,
    confirmacion?: string,
  ) => {
    if (confirmacion && !window.confirm(confirmacion)) return
    setProcesando(true)
    setMensaje('')
    setError('')
    try {
      const actualizada = await accion()
      actualizarLocal(actualizada)
      setHistorial(await historialLecturasMedidor(actualizada.numeroMedidor))
      setHistorialCambios(await historialCambiosLectura(actualizada.id))
      setResumen(await resumenLecturasMedidorAdmin())
      setMensaje(mensajeOk)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo completar la accion.')
    } finally {
      setProcesando(false)
    }
  }

  const validar = () => {
    if (!seleccionada) return
    ejecutarAccion(
      () => actualizarLecturaMedidor(seleccionada.id, { estado: 'Validada', observacionAdmin }),
      'Lectura validada correctamente.',
      '¿Confirma que desea validar esta lectura?',
    )
  }

  const rechazar = () => {
    if (!seleccionada) return
    if (!observacionAdmin.trim()) {
      setError('Debe indicar una observacion administrativa para rechazar.')
      return
    }
    ejecutarAccion(
      () => actualizarLecturaMedidor(seleccionada.id, { estado: 'Rechazada', observacionAdmin }),
      'Lectura rechazada.',
      '¿Confirma que desea rechazar esta lectura?',
    )
  }

  const revisar = () => {
    if (!seleccionada) return
    ejecutarAccion(
      () => actualizarLecturaMedidor(seleccionada.id, { estado: 'Revisada', observacionAdmin }),
      'Lectura marcada como revisada.',
    )
  }

  const corregir = () => {
    if (!seleccionada) return
    const valor = Number(lecturaCorregida)
    if (Number.isNaN(valor)) {
      setError('Ingrese una lectura valida.')
      return
    }
    ejecutarAccion(
      () =>
        actualizarLecturaMedidor(seleccionada.id, {
          lecturaActual: valor,
          estado: 'Revisada',
          observacionAdmin,
        }),
      'Lectura corregida.',
      '¿Confirma la correccion de la lectura actual?',
    )
  }

  const guardarObservacionAdmin = () => {
    if (!seleccionada) return
    ejecutarAccion(
      () => actualizarLecturaMedidor(seleccionada.id, { observacionAdmin }),
      'Observacion administrativa guardada.',
    )
  }

  const consultarHistorialAbonado = async () => {
    if (!seleccionada?.numeroAbonado) {
      setError('Esta lectura no tiene numero de abonado registrado.')
      return
    }
    try {
      setHistorial(await historialLecturasPorAbonado(seleccionada.numeroAbonado))
      setMensaje('Mostrando historial por abonado.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el historial del abonado.')
    }
  }

  const generarReporte = async (tipo: string) => {
    setProcesando(true)
    setError('')
    try {
      const reporte = await reporteLecturasMedidor(tipo)
      const blob = new Blob([JSON.stringify(reporte, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = `reporte-lecturas-${tipo}.json`
      enlace.click()
      URL.revokeObjectURL(url)
      setMensaje(`Reporte "${tipo}" generado (${reporte.totalRegistros} registros).`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo generar el reporte.')
    } finally {
      setProcesando(false)
    }
  }

  const enviarAsignacion = async () => {
    if (!asignacion.nombreAbonado.trim() || !asignacion.numeroMedidor.trim()) {
      setError('Abonado y medidor son obligatorios para asignar.')
      return
    }
    setProcesando(true)
    setError('')
    try {
      await asignarLecturaMedidor(asignacion)
      setMensaje('Lectura asignada al fontanero.')
      setAsignacion(asignacionInicial())
      setMostrarAsignacion(false)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo asignar la lectura.')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <section className="seccion banda-actividades">
      <div className="contenedor">
        <div className="encabezado-seccion modulo-encabezado-interno">
          <p className="etiqueta">Control de consumo</p>
          <h2>Lecturas de medidores</h2>
          <p>Revise lecturas, valide consumos, asigne rutas y genere reportes.</p>
        </div>

        <div className="panel-metricas-actividades panel-metricas-mejorado" aria-label="Resumen administrativo">
          <div>
            <span>Total del mes</span>
            <strong>{resumen.totalMes}</strong>
          </div>
          <div>
            <span>Validadas</span>
            <strong>{resumen.validadas}</strong>
          </div>
          <div>
            <span>Con inconsistencia</span>
            <strong>{resumen.conInconsistencia}</strong>
          </div>
          <div>
            <span>Consumos altos</span>
            <strong>{resumen.consumosAltos}</strong>
          </div>
        </div>

        <div className="barra-filtros-modulo">
          <label className="campo">
            <span>Buscar</span>
            <input placeholder="Abonado, numero o medidor..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </label>
          <label className="campo">
            <span>Desde</span>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </label>
          <label className="campo">
            <span>Hasta</span>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </label>
          <label className="campo">
            <span>Estado</span>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="Todos">Todos</option>
              {ESTADOS_LECTURA.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </label>
          <label className="campo">
            <span>Estado medidor</span>
            <select value={filtroEstadoMedidor} onChange={(e) => setFiltroEstadoMedidor(e.target.value)}>
              <option value="Todos">Todos</option>
              {ESTADOS_MEDIDOR_LECTURA.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </label>
          <label className="campo">
            <span>Fontanero</span>
            <select value={filtroFontanero} onChange={(e) => setFiltroFontanero(e.target.value)}>
              {nombresFontaneros.map((f) => <option key={f} value={f}>{f === 'Todos' ? 'Todos' : f}</option>)}
            </select>
          </label>
          <label className="campo campo-checkbox">
            <input type="checkbox" checked={filtroConsumoAlto} onChange={(e) => setFiltroConsumoAlto(e.target.checked)} />
            <span>Solo consumo alto</span>
          </label>
          <button className="boton secundario" type="button" onClick={cargar} disabled={cargando}>
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button className="boton secundario" type="button" onClick={() => setMostrarAsignacion((v) => !v)}>
            {mostrarAsignacion ? 'Ocultar asignacion' : 'Asignar lectura'}
          </button>
        </div>

        {mostrarAsignacion && (
          <div className="panel-formulario modulo-formulario panel-asignacion-lectura">
            <h3>Asignar lectura pendiente a fontanero</h3>
            <div className="grilla-formulario-modulo">
              <label className="campo">
                <span>Abonado</span>
                <input value={asignacion.nombreAbonado} onChange={(e) => setAsignacion({ ...asignacion, nombreAbonado: e.target.value })} />
              </label>
              <label className="campo">
                <span>Numero abonado</span>
                <input value={asignacion.numeroAbonado} onChange={(e) => setAsignacion({ ...asignacion, numeroAbonado: e.target.value })} />
              </label>
              <label className="campo">
                <span>Medidor</span>
                <input value={asignacion.numeroMedidor} onChange={(e) => setAsignacion({ ...asignacion, numeroMedidor: e.target.value })} />
              </label>
              <label className="campo">
                <span>Ubicacion</span>
                <input value={asignacion.ubicacion} onChange={(e) => setAsignacion({ ...asignacion, ubicacion: e.target.value })} />
              </label>
              <label className="campo">
                <span>Lectura anterior</span>
                <input type="number" min={0} step="0.01" value={asignacion.lecturaAnterior} onChange={(e) => setAsignacion({ ...asignacion, lecturaAnterior: Number(e.target.value) })} />
              </label>
              <label className="campo">
                <span>Fecha programada</span>
                <input type="date" value={asignacion.fechaLectura} onChange={(e) => setAsignacion({ ...asignacion, fechaLectura: e.target.value })} />
              </label>
              <label className="campo">
                <span>Fontanero</span>
                <select value={asignacion.fontaneroId} onChange={(e) => setAsignacion({ ...asignacion, fontaneroId: Number(e.target.value) })}>
                  {fontaneros.map((f) => (
                    <option key={f.id} value={f.id}>{f.usuario}</option>
                  ))}
                </select>
              </label>
              <label className="campo campo-ancho-completo">
                <span>Observaciones</span>
                <textarea rows={2} value={asignacion.observaciones} onChange={(e) => setAsignacion({ ...asignacion, observaciones: e.target.value })} />
              </label>
            </div>
            <button className="boton primario" type="button" onClick={enviarAsignacion} disabled={procesando}>
              {procesando ? 'Asignando...' : 'Asignar al fontanero'}
            </button>
          </div>
        )}

        <div className="barra-reportes-modulo">
          <span>Reportes:</span>
          {['mes', 'consumo-alto', 'inconsistencia', 'fontanero'].map((tipo) => (
            <button key={tipo} className="boton secundario" type="button" disabled={procesando} onClick={() => generarReporte(tipo)}>
              {tipo.replace('-', ' ')}
            </button>
          ))}
        </div>

        {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
        {error && (
          <div className="mensaje-error" role="alert">
            <strong>{error}</strong>
            <p>Verifique que el backend este en http://localhost:5145 y que Supabase tenga la contraseña configurada.</p>
          </div>
        )}

        <div className="grilla-gestion-modulo">
          <div className="lista-modulo-compacta">
            {cargando ? (
              <p className="sin-reportes">Cargando...</p>
            ) : paginadas.length === 0 ? (
              <p className="sin-reportes">
                {error
                  ? 'No se pudieron cargar las lecturas. Verifique que el backend este activo y la conexion a Supabase configurada.'
                  : 'No hay lecturas registradas todavia. Puede asignar lecturas a un fontanero o esperar registros de campo.'}
              </p>
            ) : (
              paginadas.map((lectura) => (
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
                  <span>{lectura.nombreAbonado} · Consumo {lectura.consumo} m³</span>
                  <small>{lectura.fontanero} · {lectura.fechaLectura}</small>
                  {(lectura.consumoAlto || lectura.alertaConsumoAlto) && (
                    <small className="alerta-consumo">Consumo alto</small>
                  )}
                </button>
              ))
            )}

            {totalPaginas > 1 && (
              <div className="paginacion-modulo">
                <button type="button" className="boton secundario" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>Anterior</button>
                <span>Pagina {pagina} de {totalPaginas}</span>
                <button type="button" className="boton secundario" disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>Siguiente</button>
              </div>
            )}
          </div>

          <aside className="panel-detalle-modulo">
            {!seleccionada ? (
              <p className="sin-reportes">Seleccione una lectura para revisar.</p>
            ) : (
              <>
                <h3>{seleccionada.numeroMedidor}</h3>
                <dl className="ficha-detalle">
                  <div><dt>Abonado</dt><dd>{seleccionada.nombreAbonado}{seleccionada.numeroAbonado ? ` (#${seleccionada.numeroAbonado})` : ''}</dd></div>
                  <div><dt>Ubicacion</dt><dd>{seleccionada.ubicacion ?? '—'}</dd></div>
                  <div><dt>Fontanero</dt><dd>{seleccionada.fontanero}</dd></div>
                  <div><dt>Fecha / Hora</dt><dd>{seleccionada.fechaLectura}{seleccionada.horaLectura ? ` · ${seleccionada.horaLectura}` : ''}</dd></div>
                  <div><dt>Lecturas</dt><dd>{seleccionada.lecturaAnterior} → {seleccionada.lecturaActual} m³</dd></div>
                  <div><dt>Consumo</dt><dd>{seleccionada.consumo} m³</dd></div>
                  <div><dt>Estado medidor</dt><dd>{seleccionada.estadoMedidor ?? '—'}</dd></div>
                  <div><dt>Estado</dt><dd><span className={claseEtiquetaEstado(seleccionada.estado)}>{seleccionada.estado}</span></dd></div>
                  {seleccionada.observaciones && <div><dt>Observaciones</dt><dd>{seleccionada.observaciones}</dd></div>}
                  {seleccionada.motivoVisita && <div><dt>Motivo visita</dt><dd>{seleccionada.motivoVisita}</dd></div>}
                  {seleccionada.resultadoInspeccion && <div><dt>Inspeccion</dt><dd>{seleccionada.resultadoInspeccion}</dd></div>}
                  {seleccionada.revisadaPorAdmin && <div><dt>Revisada por</dt><dd>{seleccionada.revisadaPorAdmin}</dd></div>}
                </dl>

                {(seleccionada.consumoAlto || seleccionada.alertaConsumoAlto) && (
                  <p className="alerta-consumo">Alerta: consumo alto detectado.</p>
                )}

                {seleccionada.evidenciaBase64 && (
                  <img
                    className="evidencia-detalle-inline"
                    src={seleccionada.evidenciaBase64}
                    alt={seleccionada.evidenciaNombre ?? 'Evidencia del medidor'}
                  />
                )}

                <label className="campo">
                  <span>Observacion administrativa</span>
                  <textarea rows={3} value={observacionAdmin} onChange={(e) => setObservacionAdmin(e.target.value)} />
                </label>

                <label className="campo">
                  <span>Corregir lectura actual</span>
                  <input value={lecturaCorregida} onChange={(e) => setLecturaCorregida(e.target.value)} />
                </label>

                <div className="grupo-botones">
                  <button className="boton primario" type="button" disabled={procesando} onClick={validar}>Validar</button>
                  <button className="boton secundario" type="button" disabled={procesando} onClick={revisar}>Marcar revisada</button>
                  <button className="boton secundario" type="button" disabled={procesando} onClick={corregir}>Corregir</button>
                  <button className="boton secundario" type="button" disabled={procesando} onClick={rechazar}>Rechazar</button>
                  <button className="boton secundario" type="button" disabled={procesando} onClick={guardarObservacionAdmin}>Guardar obs.</button>
                </div>

                <div className="panel-historial">
                  <div className="panel-historial-encabezado">
                    <h4>Historial</h4>
                    <button className="boton secundario" type="button" onClick={consultarHistorialAbonado}>Por abonado</button>
                  </div>
                  <ul className="lista-historial">
                    {historial.map((h) => (
                      <li key={h.id}>
                        <strong>{h.fechaLectura}</strong>
                        <span>Medidor {h.numeroMedidor} · Consumo {h.consumo} · {h.estado}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {historialCambios.length > 0 && (
                  <div className="panel-historial">
                    <h4>Auditoria de cambios</h4>
                    <ul className="lista-historial">
                      {historialCambios.map((h) => (
                        <li key={h.id}>
                          <strong>{h.fecha}</strong>
                          <span>{h.accion}: {h.estadoAnterior ?? '—'} → {h.estadoNuevo ?? '—'}</span>
                          {h.observacion && <small>{h.observacion}</small>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

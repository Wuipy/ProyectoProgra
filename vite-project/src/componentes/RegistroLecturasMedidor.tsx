import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_MEDIDOR_LECTURA,
  LIMITE_CONSUMO_ALTO_M3,
  MOTIVOS_VISITA_LECTURA,
  PAGINA_TAMANIO,
  RESULTADOS_INSPECCION_LECTURA,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  LecturaMedidorForm,
  LecturaMedidorItem,
  actualizarLecturaMedidor,
  crearLecturaMedidor,
  listarLecturasPendientesMedidor,
  listarMisLecturasMedidor,
  resumenMisLecturasMedidor,
  ResumenLecturasMedidor,
} from '../servicios/lecturasMedidoresService'

type VistaTab = 'pendientes' | 'registrar' | 'mis-lecturas'

const formularioInicial = (): LecturaMedidorForm => ({
  nombreAbonado: '',
  numeroAbonado: '',
  numeroMedidor: '',
  cedulaAbonado: '',
  ubicacion: '',
  lecturaAnterior: 0,
  lecturaActual: 0,
  fechaLectura: new Date().toISOString().slice(0, 10),
  horaLectura: new Date().toTimeString().slice(0, 5),
  observaciones: '',
  estadoMedidor: 'Bueno',
  motivoVisita: 'Lectura mensual',
})

const resumenInicial: ResumenLecturasMedidor = {
  totalMes: 0,
  pendientes: 0,
  registradasHoy: 0,
  validadas: 0,
  conInconsistencia: 0,
  consumosAltos: 0,
}

function esConsumoAlto(consumo: number, consumoMesAnterior?: number | null) {
  return (
    consumo > LIMITE_CONSUMO_ALTO_M3 ||
    (consumoMesAnterior != null && consumoMesAnterior > 0 && consumo > consumoMesAnterior * 2)
  )
}

export function RegistroLecturasMedidor() {
  const [vistaActiva, setVistaActiva] = useState<VistaTab>('pendientes')
  const [pendientes, setPendientes] = useState<LecturaMedidorItem[]>([])
  const [lecturas, setLecturas] = useState<LecturaMedidorItem[]>([])
  const [resumen, setResumen] = useState<ResumenLecturasMedidor>(resumenInicial)
  const [formulario, setFormulario] = useState<LecturaMedidorForm>(formularioInicial())
  const [pendienteSeleccionada, setPendienteSeleccionada] = useState<LecturaMedidorItem | null>(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState('')

  const consumoCalculado = formulario.lecturaActual - formulario.lecturaAnterior
  const lecturaInvalida = formulario.lecturaActual < formulario.lecturaAnterior
  const consumoMesAnterior = lecturas.find((l) => l.numeroMedidor === formulario.numeroMedidor)?.consumo
  const alertaConsumoAlto = esConsumoAlto(Math.max(0, consumoCalculado), consumoMesAnterior)
  const requiereObservacion = consumoCalculado === 0 || lecturaInvalida || alertaConsumoAlto

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const [listaPendientes, misLecturas, resumenData] = await Promise.all([
        listarLecturasPendientesMedidor(),
        listarMisLecturasMedidor(),
        resumenMisLecturasMedidor(),
      ])
      setPendientes(listaPendientes)
      setLecturas(misLecturas)
      setResumen(resumenData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las lecturas.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const pendientesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return pendientes
    return pendientes.filter(
      (l) =>
        l.nombreAbonado.toLowerCase().includes(termino) ||
        (l.numeroAbonado ?? '').toLowerCase().includes(termino) ||
        l.numeroMedidor.toLowerCase().includes(termino),
    )
  }, [busqueda, pendientes])

  const lecturasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return lecturas
    return lecturas.filter(
      (l) =>
        l.nombreAbonado.toLowerCase().includes(termino) ||
        (l.numeroAbonado ?? '').toLowerCase().includes(termino) ||
        l.numeroMedidor.toLowerCase().includes(termino),
    )
  }, [busqueda, lecturas])

  const listaActual = vistaActiva === 'pendientes' ? pendientesFiltradas : lecturasFiltradas
  const totalPaginas = Math.max(1, Math.ceil(listaActual.length / PAGINA_TAMANIO))
  const paginadas = listaActual.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  useEffect(() => {
    setPagina(1)
  }, [vistaActiva, busqueda])

  const iniciarDesdePendiente = (lectura: LecturaMedidorItem) => {
    setPendienteSeleccionada(lectura)
    setFormulario({
      nombreAbonado: lectura.nombreAbonado,
      numeroAbonado: lectura.numeroAbonado ?? '',
      numeroMedidor: lectura.numeroMedidor,
      cedulaAbonado: lectura.cedulaAbonado ?? '',
      ubicacion: lectura.ubicacion ?? '',
      lecturaAnterior: lectura.lecturaAnterior,
      lecturaActual: lectura.lecturaAnterior,
      fechaLectura: new Date().toISOString().slice(0, 10),
      horaLectura: new Date().toTimeString().slice(0, 5),
      observaciones: lectura.observaciones ?? '',
      estadoMedidor: 'Bueno',
      motivoVisita: 'Lectura mensual',
    })
    setVistaActiva('registrar')
    setMensaje('')
    setError('')
  }

  const sugerirLecturaAnterior = (numeroMedidor: string) => {
    const ultima = lecturas.find((l) => l.numeroMedidor === numeroMedidor)
    if (ultima) {
      setFormulario((f) => ({ ...f, lecturaAnterior: ultima.lecturaActual }))
    }
  }

  const actualizarFoto = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) {
      setFormulario((f) => ({ ...f, evidenciaNombre: undefined, evidenciaBase64: undefined }))
      return
    }
    const lector = new FileReader()
    lector.onload = () =>
      setFormulario((f) => ({
        ...f,
        evidenciaNombre: archivo.name,
        evidenciaBase64: String(lector.result),
      }))
    lector.readAsDataURL(archivo)
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!formulario.nombreAbonado.trim() || !formulario.numeroMedidor.trim()) {
      setError('Abonado y numero de medidor son obligatorios.')
      return
    }
    if (requiereObservacion && !formulario.observaciones?.trim()) {
      setError('Debe registrar una observacion para consumo cero, inconsistencia o consumo alto.')
      return
    }

    setEnviando(true)
    setMensaje('')
    setError('')
    try {
      if (pendienteSeleccionada) {
        await actualizarLecturaMedidor(pendienteSeleccionada.id, {
          lecturaActual: formulario.lecturaActual,
          observaciones: formulario.observaciones,
          estadoMedidor: formulario.estadoMedidor,
          horaLectura: formulario.horaLectura,
          motivoVisita: formulario.motivoVisita,
          resultadoInspeccion: formulario.resultadoInspeccion,
          evidenciaNombre: formulario.evidenciaNombre,
          evidenciaBase64: formulario.evidenciaBase64,
        })
        setMensaje('Lectura asignada completada correctamente.')
      } else {
        await crearLecturaMedidor(formulario)
        setMensaje(
          lecturaInvalida || alertaConsumoAlto
            ? 'Lectura registrada con inconsistencia o consumo alto.'
            : 'Lectura registrada correctamente.',
        )
      }
      setFormulario(formularioInicial())
      setPendienteSeleccionada(null)
      await cargar()
      setVistaActiva('mis-lecturas')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar la lectura.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="seccion banda-actividades modulo-bitacora modulo-lecturas">
      <div className="contenedor">
        <div className="panel-metricas-actividades panel-metricas-mejorado" aria-label="Resumen de lecturas">
          <div>
            <span>Pendientes</span>
            <strong>{resumen.pendientes}</strong>
          </div>
          <div>
            <span>Registradas hoy</span>
            <strong>{resumen.registradasHoy}</strong>
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

        {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
        {error && (
          <div className="mensaje-error" role="alert">
            <strong>{error}</strong>
            <p>Si el backend no arranca, configure la contraseña de Supabase en appsettings.Development.json</p>
          </div>
        )}

        <div className="barra-modulo-superior">
          <div className="tabs-modulo" role="tablist" aria-label="Vistas de lecturas">
            {[
              { id: 'pendientes' as VistaTab, label: `Asignadas (${pendientes.length})` },
              { id: 'registrar' as VistaTab, label: 'Registrar lectura' },
              { id: 'mis-lecturas' as VistaTab, label: 'Mis lecturas' },
            ].map((tab) => (
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
          <button className="boton secundario boton-refrescar" type="button" onClick={cargar} disabled={cargando}>
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {vistaActiva === 'registrar' ? (
          <div className="modulo-layout-horizontal-contenedor">
            <form className="panel-formulario modulo-formulario" onSubmit={enviar}>
              <div className="encabezado-formulario">
                <div>
                  <p className="etiqueta">Lecturas de campo</p>
                  <h2>{pendienteSeleccionada ? 'Completar lectura asignada' : 'Registrar lectura de medidor'}</h2>
                </div>
                <p>Complete los datos del abonado. El consumo se calcula automaticamente.</p>
              </div>

              {pendienteSeleccionada && (
                <p className="aviso-formulario-modulo">
                  Completando asignacion de <strong>{pendienteSeleccionada.numeroMedidor}</strong> — {pendienteSeleccionada.nombreAbonado}
                </p>
              )}

              <div className="grilla-formulario-modulo grilla-lecturas-horizontal">
                <label className="campo">
                  <span>Numero de abonado</span>
                  <input
                    value={formulario.numeroAbonado}
                    onChange={(e) => setFormulario({ ...formulario, numeroAbonado: e.target.value })}
                  />
                </label>
                <label className="campo">
                  <span>Abonado</span>
                  <input
                    required
                    value={formulario.nombreAbonado}
                    onChange={(e) => setFormulario({ ...formulario, nombreAbonado: e.target.value })}
                    readOnly={!!pendienteSeleccionada}
                  />
                </label>
                <label className="campo">
                  <span>Numero de medidor</span>
                  <input
                    required
                    value={formulario.numeroMedidor}
                    onChange={(e) => setFormulario({ ...formulario, numeroMedidor: e.target.value })}
                    onBlur={(e) => sugerirLecturaAnterior(e.target.value)}
                    readOnly={!!pendienteSeleccionada}
                  />
                </label>
                <label className="campo">
                  <span>Ubicacion / comunidad</span>
                  <input
                    value={formulario.ubicacion}
                    onChange={(e) => setFormulario({ ...formulario, ubicacion: e.target.value })}
                  />
                </label>
                <label className="campo">
                  <span>Cedula (opcional)</span>
                  <input
                    value={formulario.cedulaAbonado}
                    onChange={(e) => setFormulario({ ...formulario, cedulaAbonado: e.target.value })}
                  />
                </label>
                <label className="campo">
                  <span>Fecha de lectura</span>
                  <input
                    type="date"
                    required
                    value={formulario.fechaLectura}
                    onChange={(e) => setFormulario({ ...formulario, fechaLectura: e.target.value })}
                  />
                </label>
                <label className="campo">
                  <span>Hora de lectura</span>
                  <input
                    type="time"
                    value={formulario.horaLectura ?? ''}
                    onChange={(e) => setFormulario({ ...formulario, horaLectura: e.target.value })}
                  />
                </label>
                <label className="campo">
                  <span>Estado del medidor</span>
                  <select
                    value={formulario.estadoMedidor ?? 'Bueno'}
                    onChange={(e) => setFormulario({ ...formulario, estadoMedidor: e.target.value })}
                  >
                    {ESTADOS_MEDIDOR_LECTURA.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </label>
                <label className="campo">
                  <span>Motivo de visita</span>
                  <select
                    value={formulario.motivoVisita ?? 'Lectura mensual'}
                    onChange={(e) => setFormulario({ ...formulario, motivoVisita: e.target.value })}
                  >
                    {MOTIVOS_VISITA_LECTURA.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>

                <div className="grilla-lecturas-consumo campo-ancho-completo">
                  <label className="campo">
                    <span>Lectura anterior</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={formulario.lecturaAnterior}
                      onChange={(e) =>
                        setFormulario({ ...formulario, lecturaAnterior: Number(e.target.value) })
                      }
                      readOnly={!!pendienteSeleccionada}
                    />
                  </label>
                  <label className="campo">
                    <span>Lectura actual</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={formulario.lecturaActual}
                      onChange={(e) =>
                        setFormulario({ ...formulario, lecturaActual: Number(e.target.value) })
                      }
                    />
                  </label>
                  <div className={`panel-consumo-calculado panel-consumo-inline ${lecturaInvalida || alertaConsumoAlto ? 'alerta' : ''}`}>
                    <span>Consumo</span>
                    <strong>{consumoCalculado}</strong>
                    <small>m³</small>
                  </div>
                </div>

                {lecturaInvalida && (
                  <p className="aviso-formulario-modulo campo-ancho-completo">
                    La lectura actual es menor que la anterior. Se marcara como inconsistencia.
                  </p>
                )}
                {alertaConsumoAlto && !lecturaInvalida && (
                  <p className="aviso-formulario-modulo alerta-consumo campo-ancho-completo">
                    Consumo alto detectado (supera {LIMITE_CONSUMO_ALTO_M3} m³ o el doble del mes anterior).
                  </p>
                )}
                {consumoCalculado === 0 && (
                  <p className="aviso-formulario-modulo campo-ancho-completo">
                    Consumo cero: la observacion es obligatoria.
                  </p>
                )}

                {(alertaConsumoAlto || formulario.estadoMedidor === 'Con posible fuga') && (
                  <label className="campo campo-ancho-completo">
                    <span>Resultado de inspeccion</span>
                    <select
                      value={formulario.resultadoInspeccion ?? ''}
                      onChange={(e) => setFormulario({ ...formulario, resultadoInspeccion: e.target.value })}
                    >
                      <option value="">Seleccione...</option>
                      {RESULTADOS_INSPECCION_LECTURA.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="campo campo-ancho-completo">
                  <span>Observaciones{requiereObservacion ? ' *' : ''}</span>
                  <textarea
                    rows={3}
                    placeholder="Medidor dañado, inaccesible, consumo alto, inspeccion realizada..."
                    value={formulario.observaciones}
                    onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
                  />
                </label>

                <label className="campo campo-ancho-completo">
                  <span>Fotografia del medidor (opcional)</span>
                  <input type="file" accept="image/*" onChange={actualizarFoto} />
                  {formulario.evidenciaNombre && <small>{formulario.evidenciaNombre}</small>}
                </label>
              </div>

              {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
              {error && <div className="mensaje-error" role="alert">{error}</div>}

              <div className="fila-accion-formulario-horizontal">
                {pendienteSeleccionada && (
                  <button
                    className="boton secundario"
                    type="button"
                    onClick={() => {
                      setPendienteSeleccionada(null)
                      setFormulario(formularioInicial())
                    }}
                  >
                    Cancelar asignacion
                  </button>
                )}
                <button className="boton primario" type="submit" disabled={enviando}>
                  {enviando ? 'Guardando...' : pendienteSeleccionada ? 'Completar lectura' : 'Registrar lectura'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <label className="campo busqueda-modulo">
              <span>Buscar abonado o medidor</span>
              <input
                placeholder="Nombre, numero de abonado o medidor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </label>

            {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
            {error && <div className="mensaje-error" role="alert">{error}</div>}

            {cargando ? (
              <p className="sin-reportes">Cargando...</p>
            ) : paginadas.length === 0 ? (
              <p className="sin-reportes">
                {error
                  ? 'No se pudieron cargar las lecturas. Verifique que el backend este activo en http://localhost:5145'
                  : vistaActiva === 'pendientes'
                    ? 'No hay lecturas asignadas pendientes. La administradora puede asignarle nuevas rutas.'
                    : 'No hay lecturas registradas todavia. Use la pestaña "Registrar lectura" para agregar una.'}
              </p>
            ) : (
              <div className="lista-modulo-compacta">
                {paginadas.map((lectura) => (
                  <article key={lectura.id} className="tarjeta-actividad">
                    <div className="actividad-meta">
                      <strong>{lectura.numeroMedidor}</strong>
                      <span className={claseEtiquetaEstado(lectura.estado)}>{lectura.estado}</span>
                    </div>
                    <p>{lectura.nombreAbonado}{lectura.numeroAbonado ? ` (#${lectura.numeroAbonado})` : ''}</p>
                    {lectura.ubicacion && <p>{lectura.ubicacion}</p>}
                    {vistaActiva === 'mis-lecturas' && (
                      <p>Consumo: <strong>{lectura.consumo}</strong> m³</p>
                    )}
                    {vistaActiva === 'pendientes' && (
                      <p>Lectura anterior: <strong>{lectura.lecturaAnterior}</strong> m³</p>
                    )}
                    {(lectura.consumoAlto || lectura.alertaConsumoAlto) && (
                      <p className="alerta-consumo">Consumo alto o alerta detectada.</p>
                    )}
                    <small>{lectura.fechaLectura}{lectura.horaLectura ? ` · ${lectura.horaLectura}` : ''}</small>
                    {vistaActiva === 'pendientes' && (
                      <button className="boton primario" type="button" onClick={() => iniciarDesdePendiente(lectura)}>
                        Registrar lectura
                      </button>
                    )}
                  </article>
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
          </>
        )}
      </div>
    </section>
  )
}

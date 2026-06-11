import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ActividadForm,
  cambiarEstadoActividadPlomeria,
  crearActividadPlomeria,
  eliminarActividadPlomeria,
  listarActividadesPlomeria,
  PrioridadActividad,
  RegistroActividad,
  actualizarActividadPlomeria,
} from '../servicios/landingService'

const ACTIVIDADES = [
  'Control de Fugas',
  'Toma de presion',
  'Visita de Campo',
  'Control de Aforos',
  'Control Operativo',
] as const

const ESTADOS = ['Pendiente', 'En progreso', 'Completado'] as const
const PRIORIDADES: PrioridadActividad[] = ['Baja', 'Media', 'Alta']

type VistaTab = 'todas' | 'pendientes' | 'en-progreso' | 'completadas'
type ErroresActividad = Partial<Record<keyof ActividadForm, string>>

const valoresIniciales: ActividadForm = {
  tipo: ACTIVIDADES[0],
  cliente: '',
  ubicacion: '',
  descripcion: '',
  estado: 'Pendiente',
  prioridad: 'Media',
  notasSeguimiento: '',
  numeroAveriaVinculada: '',
}

const SIGUIENTE_ESTADO: Record<string, string> = {
  Pendiente: 'En progreso',
  'En progreso': 'Completado',
  Completado: 'Pendiente',
}

export function RegistroActividadesPlomeria() {
  const [formulario, setFormulario] = useState<ActividadForm>(valoresIniciales)
  const [errores, setErrores] = useState<ErroresActividad>({})
  const [registros, setRegistros] = useState<RegistroActividad[]>([])
  const [editarId, setEditarId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [vistaActiva, setVistaActiva] = useState<VistaTab>('todas')
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todos')

  const cargarActividades = async () => {
    setCargando(true)
    try {
      const actividades = await listarActividadesPlomeria()
      setRegistros(actividades)
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudieron cargar las actividades.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarActividades()
  }, [])

  const estadisticas = useMemo(
    () => ({
      total: registros.length,
      completados: registros.filter((r) => r.estado === 'Completado').length,
      enProceso: registros.filter((r) => r.estado === 'En progreso').length,
      pendientes: registros.filter((r) => r.estado === 'Pendiente').length,
      altaPrioridad: registros.filter((r) => r.prioridad === 'Alta' && r.estado !== 'Completado').length,
    }),
    [registros],
  )

  const registrosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return registros
      .filter((registro) => {
        const coincideVista =
          vistaActiva === 'todas' ||
          (vistaActiva === 'pendientes' && registro.estado === 'Pendiente') ||
          (vistaActiva === 'en-progreso' && registro.estado === 'En progreso') ||
          (vistaActiva === 'completadas' && registro.estado === 'Completado')

        const coincideTipo = filtroTipo === 'Todos' || registro.tipo === filtroTipo
        const coincidePrioridad = filtroPrioridad === 'Todos' || registro.prioridad === filtroPrioridad
        const coincideBusqueda =
          !termino ||
          registro.cliente.toLowerCase().includes(termino) ||
          registro.ubicacion.toLowerCase().includes(termino) ||
          registro.descripcion.toLowerCase().includes(termino) ||
          (registro.numeroAveriaVinculada ?? '').toLowerCase().includes(termino)

        return coincideVista && coincideTipo && coincidePrioridad && coincideBusqueda
      })
      .sort((a, b) => {
        const peso = (p: PrioridadActividad) => (p === 'Alta' ? 3 : p === 'Media' ? 2 : 1)
        return peso(b.prioridad) - peso(a.prioridad)
      })
  }, [busqueda, filtroPrioridad, filtroTipo, registros, vistaActiva])

  const actualizarCampo = (campo: keyof ActividadForm, valor: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actual) => ({ ...actual, [campo]: '' }))
  }

  const validarFormulario = () => {
    const nuevosErrores: ErroresActividad = {}
    if (!formulario.cliente.trim()) nuevosErrores.cliente = 'El nombre del cliente es obligatorio.'
    if (!formulario.ubicacion.trim()) nuevosErrores.ubicacion = 'La ubicacion es obligatoria.'
    if (!formulario.descripcion.trim()) nuevosErrores.descripcion = 'La descripcion es obligatoria.'
    if (formulario.numeroAveriaVinculada?.trim() && !/^AV-\d{4}$/i.test(formulario.numeroAveriaVinculada.trim())) {
      nuevosErrores.numeroAveriaVinculada = 'Use el formato AV-0001.'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const construirPayload = (): ActividadForm => ({
    tipo: formulario.tipo,
    cliente: formulario.cliente.trim(),
    ubicacion: formulario.ubicacion.trim(),
    descripcion: formulario.descripcion.trim(),
    estado: formulario.estado,
    prioridad: formulario.prioridad,
    notasSeguimiento: formulario.notasSeguimiento?.trim() || undefined,
    numeroAveriaVinculada: formulario.numeroAveriaVinculada?.trim().toUpperCase() || undefined,
  })

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setMensaje('')
    if (!validarFormulario()) return

    setProcesando(true)
    try {
      const payload = construirPayload()
      if (editarId) {
        const actualizado = await actualizarActividadPlomeria(editarId, payload)
        setRegistros((actuales) => actuales.map((r) => (r.id === editarId ? actualizado : r)))
        setMensaje('Actividad actualizada correctamente.')
      } else {
        const creado = await crearActividadPlomeria(payload)
        setRegistros((actuales) => [creado, ...actuales])
        setMensaje('Actividad registrada correctamente.')
      }
      setEditarId(null)
      setFormulario(valoresIniciales)
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar la actividad.')
    } finally {
      setProcesando(false)
    }
  }

  const comenzarEdicion = (registro: RegistroActividad) => {
    setFormulario({
      tipo: registro.tipo,
      cliente: registro.cliente,
      ubicacion: registro.ubicacion,
      descripcion: registro.descripcion,
      estado: registro.estado,
      prioridad: registro.prioridad,
      notasSeguimiento: registro.notasSeguimiento ?? '',
      numeroAveriaVinculada: registro.numeroAveriaVinculada ?? '',
    })
    setEditarId(registro.id)
    setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicion = () => {
    setFormulario(valoresIniciales)
    setEditarId(null)
    setErrores({})
    setMensaje('Edicion cancelada.')
  }

  const eliminarRegistro = async (id: string) => {
    if (!window.confirm('¿Eliminar esta actividad de forma permanente?')) return

    setProcesando(true)
    try {
      await eliminarActividadPlomeria(id)
      setRegistros((actuales) => actuales.filter((r) => r.id !== id))
      if (editarId === id) cancelarEdicion()
      setMensaje('Actividad eliminada.')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar la actividad.')
    } finally {
      setProcesando(false)
    }
  }

  const cambiarEstado = async (registro: RegistroActividad) => {
    setProcesando(true)
    try {
      const siguiente = SIGUIENTE_ESTADO[registro.estado]
      const actualizado = await cambiarEstadoActividadPlomeria(registro.id, siguiente)
      setRegistros((actuales) => actuales.map((r) => (r.id === registro.id ? actualizado : r)))
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo cambiar el estado.')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <section className="seccion modulo-plomeria-interna" id="registro-actividades">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Gestion interna</p>
          <h2>Trabajos internos ASADA</h2>
          <p>Planifique tareas de oficina, vincule reportes AV, priorice trabajos y lleve seguimiento interno.</p>
        </div>

        <p className="aviso-separacion-modulos" role="note">
          Registro exclusivo de la administracion. La bitacora del fontanero se crea en su panel y
          se valida en <strong>Validacion de bitacora</strong>.
        </p>

        <div className="panel-metricas-actividades panel-metricas-mejorado" aria-label="Resumen de actividades">
          <div>
            <span>Total</span>
            <strong>{estadisticas.total}</strong>
          </div>
          <div>
            <span>Pendientes</span>
            <strong>{estadisticas.pendientes}</strong>
          </div>
          <div>
            <span>En progreso</span>
            <strong>{estadisticas.enProceso}</strong>
          </div>
          <div>
            <span>Alta prioridad</span>
            <strong>{estadisticas.altaPrioridad}</strong>
          </div>
        </div>

        <div className="barra-modulo-superior">
          <div className="tabs-modulo" role="tablist">
            {[
              { id: 'todas' as VistaTab, label: 'Todas' },
              { id: 'pendientes' as VistaTab, label: 'Pendientes' },
              { id: 'en-progreso' as VistaTab, label: 'En progreso' },
              { id: 'completadas' as VistaTab, label: 'Completadas' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={vistaActiva === tab.id ? 'activo' : ''}
                onClick={() => setVistaActiva(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="boton secundario boton-refrescar" type="button" onClick={cargarActividades} disabled={cargando}>
            {cargando ? 'Actualizando...' : 'Actualizar lista'}
          </button>
        </div>

        <div className="grilla-actividades">
          <section className="panel-formulario panel-actividades">
            <div className="encabezado-formulario">
              <p className="etiqueta">{editarId ? 'Edicion' : 'Nueva actividad'}</p>
              <h3>{editarId ? 'Editar actividad' : 'Registrar actividad'}</h3>
            </div>

            <form onSubmit={enviarFormulario} noValidate>
              <label className="campo">
                <span>Tipo de actividad</span>
                <select value={formulario.tipo} onChange={(e) => actualizarCampo('tipo', e.target.value)}>
                  {ACTIVIDADES.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </label>

              <div className="grilla-campos-doble">
                <label className="campo">
                  <span>Prioridad</span>
                  <select value={formulario.prioridad} onChange={(e) => actualizarCampo('prioridad', e.target.value)}>
                    {PRIORIDADES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="campo">
                  <span>Estado</span>
                  <select value={formulario.estado} onChange={(e) => actualizarCampo('estado', e.target.value)}>
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </label>
              </div>

              <CampoTexto id="actividad-cliente" label="Nombre del cliente" value={formulario.cliente} error={errores.cliente} onChange={(v) => actualizarCampo('cliente', v)} />
              <CampoTexto id="actividad-ubicacion" label="Ubicacion" value={formulario.ubicacion} error={errores.ubicacion} onChange={(v) => actualizarCampo('ubicacion', v)} />
              <CampoTexto id="actividad-averia" label="Reporte AV vinculado (opcional)" value={formulario.numeroAveriaVinculada ?? ''} error={errores.numeroAveriaVinculada} placeholder="AV-0001" onChange={(v) => actualizarCampo('numeroAveriaVinculada', v)} />

              <label className="campo">
                <span>Descripcion de la actividad</span>
                <textarea value={formulario.descripcion} onChange={(e) => actualizarCampo('descripcion', e.target.value)} placeholder="Detalle del trabajo a realizar o realizado." />
                {errores.descripcion && <small className="error">{errores.descripcion}</small>}
              </label>

              <label className="campo">
                <span>Notas de seguimiento (opcional)</span>
                <textarea value={formulario.notasSeguimiento ?? ''} onChange={(e) => actualizarCampo('notasSeguimiento', e.target.value)} placeholder="Observaciones internas, materiales, horarios..." />
              </label>

              <div className="grupo-botones">
                <button className="boton primario ancho" type="submit" disabled={procesando}>
                  {procesando ? 'Guardando...' : editarId ? 'Guardar cambios' : 'Registrar actividad'}
                </button>
                {editarId && (
                  <button className="boton secundario ancho" type="button" onClick={cancelarEdicion} disabled={procesando}>
                    Cancelar edicion
                  </button>
                )}
              </div>
            </form>

            {mensaje && <div className="mensaje-exito" role="status"><strong>{mensaje}</strong></div>}
          </section>

          <section className="panel-formulario panel-actividades resumen-actividades">
            <div className="encabezado-formulario">
              <p className="etiqueta">Historial</p>
              <h3>Actividades ({registrosFiltrados.length})</h3>
            </div>

            <div className="barra-filtros-inline">
              <input placeholder="Buscar cliente, ubicacion, AV..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="Todos">Todos los tipos</option>
                {ACTIVIDADES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
                <option value="Todos">Todas las prioridades</option>
                {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {cargando ? (
              <p className="sin-reportes">Cargando actividades...</p>
            ) : registrosFiltrados.length === 0 ? (
              <p className="sin-reportes">No hay actividades en esta vista.</p>
            ) : (
              <div className="tarjetas-actividades">
                {registrosFiltrados.map((registro) => (
                  <article className="tarjeta-actividad" key={registro.id}>
                    <div className="actividad-meta">
                      <strong>{registro.tipo}</strong>
                      <span className={`prioridad prioridad-${registro.prioridad.toLowerCase()}`}>{registro.prioridad}</span>
                    </div>
                    <p>{registro.descripcion}</p>
                    <div className="actividad-detalle">
                      <span>{registro.cliente}</span>
                      <span>{registro.ubicacion}</span>
                      <span>{registro.fecha}</span>
                      <strong className={`estado estado-${registro.estado.replace(' ', '-').toLowerCase()}`}>{registro.estado}</strong>
                    </div>
                    {registro.numeroAveriaVinculada && (
                      <p className="vinculo-averia">
                        Vinculado a: <a href="/fontanero/averias">{registro.numeroAveriaVinculada}</a>
                      </p>
                    )}
                    {registro.notasSeguimiento && <p className="notas-seguimiento">{registro.notasSeguimiento}</p>}
                    <div className="acciones-actividad">
                      <button className="boton claro" type="button" onClick={() => cambiarEstado(registro)} disabled={procesando}>
                        → {SIGUIENTE_ESTADO[registro.estado]}
                      </button>
                      <button className="boton secundario" type="button" onClick={() => comenzarEdicion(registro)} disabled={procesando}>Editar</button>
                      <button className="boton claro" type="button" onClick={() => eliminarRegistro(registro.id)} disabled={procesando}>Eliminar</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}

type CampoTextoProps = {
  id: string
  label: string
  value: string
  error?: string
  placeholder?: string
  onChange: (valor: string) => void
}

function CampoTexto({ id, label, value, error, placeholder, onChange }: CampoTextoProps) {
  return (
    <label className="campo" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {error && <small className="error">{error}</small>}
    </label>
  )
}

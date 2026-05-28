import { FormEvent, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'sigasj-actividades-plomeria'

const ACTIVIDADES = [
  'Control de Fugas',
  'Toma de presion',
  'Visita de Campo',
  'Control de Aforos',
  'Control Operativo',
] as const

const ESTADOS = ['Pendiente', 'En progreso', 'Completado'] as const

type TipoActividad = (typeof ACTIVIDADES)[number]
type EstadoActividad = (typeof ESTADOS)[number]

type RegistroActividad = {
  id: string
  tipo: TipoActividad
  cliente: string
  ubicacion: string
  descripcion: string
  fecha: string
  estado: EstadoActividad
}

type ActividadForm = Omit<RegistroActividad, 'id' | 'fecha'>

type ErroresActividad = Partial<Record<keyof ActividadForm, string>>

const valoresIniciales: ActividadForm = {
  tipo: ACTIVIDADES[0],
  cliente: '',
  ubicacion: '',
  descripcion: '',
  estado: 'Pendiente',
}

function generarId() {
  return `ACT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function RegistroActividadesPlomeria() {
  const [formulario, setFormulario] = useState<ActividadForm>(valoresIniciales)
  const [errores, setErrores] = useState<ErroresActividad>({})
  const [registros, setRegistros] = useState<RegistroActividad[]>(() => {
    const almacenado = window.localStorage.getItem(STORAGE_KEY)
    if (!almacenado) return []

    try {
      return JSON.parse(almacenado) as RegistroActividad[]
    } catch {
      return []
    }
  })
  const [editarId, setEditarId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registros))
  }, [registros])

  const estadisticas = useMemo(
    () => ({
      total: registros.length,
      completados: registros.filter((registro) => registro.estado === 'Completado').length,
      enProceso: registros.filter((registro) => registro.estado === 'En progreso').length,
      pendientes: registros.filter((registro) => registro.estado === 'Pendiente').length,
    }),
    [registros],
  )

  const actualizarCampo = (campo: keyof ActividadForm, valor: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actual) => ({ ...actual, [campo]: '' }))
  }

  const validarFormulario = () => {
    const nuevosErrores: ErroresActividad = {}

    if (!formulario.cliente.trim()) nuevosErrores.cliente = 'El nombre del cliente es obligatorio.'
    if (!formulario.ubicacion.trim()) nuevosErrores.ubicacion = 'La ubicacion es obligatoria.'
    if (!formulario.descripcion.trim()) nuevosErrores.descripcion = 'La descripcion es obligatoria.'

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const enviarFormulario = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setMensaje('')

    if (!validarFormulario()) return

    const registroNuevo: RegistroActividad = {
      id: editarId ?? generarId(),
      tipo: formulario.tipo,
      cliente: formulario.cliente.trim(),
      ubicacion: formulario.ubicacion.trim(),
      descripcion: formulario.descripcion.trim(),
      estado: formulario.estado,
      fecha: new Date().toLocaleString('es-CR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    }

    setRegistros((actuales) => {
      if (editarId) {
        return actuales.map((registro) => (registro.id === editarId ? registroNuevo : registro))
      }
      return [registroNuevo, ...actuales]
    })

    setMensaje(editarId ? 'Registro actualizado correctamente.' : 'Actividad registrada correctamente.')
    setEditarId(null)
    setFormulario(valoresIniciales)
  }

  const comenzarEdicion = (registro: RegistroActividad) => {
    setFormulario({
      tipo: registro.tipo,
      cliente: registro.cliente,
      ubicacion: registro.ubicacion,
      descripcion: registro.descripcion,
      estado: registro.estado,
    })
    setEditarId(registro.id)
    setMensaje('')
  }

  const cancelarEdicion = () => {
    setFormulario(valoresIniciales)
    setEditarId(null)
    setErrores({})
    setMensaje('Edicion cancelada.')
  }

  const eliminarRegistro = (id: string) => {
    setRegistros((actuales) => actuales.filter((registro) => registro.id !== id))
    if (editarId === id) {
      cancelarEdicion()
    }
  }

  const cambiarEstado = (id: string) => {
    setRegistros((actuales) =>
      actuales.map((registro) => {
        if (registro.id !== id) return registro
        const siguienteEstado: EstadoActividad =
          registro.estado === 'Pendiente'
            ? 'En progreso'
            : registro.estado === 'En progreso'
              ? 'Completado'
              : 'Pendiente'
        return { ...registro, estado: siguienteEstado }
      }),
    )
  }

  return (
    <section className="seccion banda-actividades" id="registro-actividades">
      <div className="contenedor">
        <div className="encabezado-seccion">
          <p className="etiqueta">Gestion de actividades</p>
          <h2>Control operativo de plomeria</h2>
          <p>Registra y administra las tareas de control de fugas, toma de presion, visitas de campo y mas.</p>
        </div>

        <div className="panel-metricas-actividades" aria-label="Resumen de actividades de plomeria">
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
            <span>Completadas</span>
            <strong>{estadisticas.completados}</strong>
          </div>
        </div>

        <div className="grilla-actividades">
          <section className="panel-formulario panel-actividades">
            <div className="encabezado-formulario">
              <p className="etiqueta">Nueva actividad</p>
              <h3>{editarId ? 'Editar actividad' : 'Registrar actividad'}</h3>
            </div>

            <form onSubmit={enviarFormulario} noValidate>
              <label className="campo">
                <span>Tipo de actividad</span>
                <select value={formulario.tipo} onChange={(evento) => actualizarCampo('tipo', evento.target.value)}>
                  {ACTIVIDADES.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>

              <CampoTexto
                id="actividad-cliente"
                label="Nombre del cliente"
                value={formulario.cliente}
                error={errores.cliente}
                onChange={(valor) => actualizarCampo('cliente', valor)}
              />

              <CampoTexto
                id="actividad-ubicacion"
                label="Ubicacion"
                value={formulario.ubicacion}
                error={errores.ubicacion}
                onChange={(valor) => actualizarCampo('ubicacion', valor)}
              />

              <label className="campo">
                <span>Descripcion de la actividad</span>
                <textarea
                  placeholder="Describe lo que se debe hacer o lo que se reviso."
                  value={formulario.descripcion}
                  onChange={(evento) => actualizarCampo('descripcion', evento.target.value)}
                />
                {errores.descripcion && <small className="error">{errores.descripcion}</small>}
              </label>

              <label className="campo">
                <span>Estado</span>
                <select value={formulario.estado} onChange={(evento) => actualizarCampo('estado', evento.target.value)}>
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grupo-botones">
                <button className="boton primario ancho" type="submit">
                  {editarId ? 'Guardar cambios' : 'Registrar actividad'}
                </button>
                {editarId && (
                  <button className="boton secundario ancho" type="button" onClick={cancelarEdicion}>
                    Cancelar edicion
                  </button>
                )}
              </div>
            </form>

            {mensaje && (
              <div className="mensaje-exito" role="status">
                <strong>{mensaje}</strong>
              </div>
            )}
          </section>

          <section className="panel-formulario panel-actividades resumen-actividades">
            <div className="encabezado-formulario">
              <p className="etiqueta">Historial</p>
              <h3>Actividades guardadas</h3>
              <p>Verifica las tareas registradas y actualiza su estado segun avance el trabajo.</p>
            </div>

            {registros.length === 0 ? (
              <p className="sin-reportes">No hay actividades registradas. Crea una desde el formulario.</p>
            ) : (
              <div className="tarjetas-actividades">
                {registros.map((registro) => (
                  <article className="tarjeta-actividad" key={registro.id}>
                    <div className="actividad-meta">
                      <strong>{registro.tipo}</strong>
                      <span>{registro.fecha}</span>
                    </div>
                    <p>{registro.descripcion}</p>
                    <div className="actividad-detalle">
                      <span>{registro.cliente}</span>
                      <span>{registro.ubicacion}</span>
                      <strong className={`estado estado-${registro.estado.replace(' ', '-').toLowerCase()}`}>
                        {registro.estado}
                      </strong>
                    </div>
                    <div className="acciones-actividad">
                      <button className="boton claro" type="button" onClick={() => cambiarEstado(registro.id)}>
                        Cambiar estado
                      </button>
                      <button className="boton secundario" type="button" onClick={() => comenzarEdicion(registro)}>
                        Editar
                      </button>
                      <button className="boton claro" type="button" onClick={() => eliminarRegistro(registro.id)}>
                        Eliminar
                      </button>
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
  onChange: (valor: string) => void
}

function CampoTexto({ id, label, value, error, onChange }: CampoTextoProps) {
  return (
    <label className="campo" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="text" value={value} onChange={(evento) => onChange(evento.target.value)} />
      {error && <small className="error">{error}</small>}
    </label>
  )
}

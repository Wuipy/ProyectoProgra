import { FormEvent, useState } from 'react'
import { DatosSolicitud, registrarSolicitud } from '../servicios/landingService'

type ErroresSolicitud = Partial<Record<keyof DatosSolicitud, string>>

const valoresIniciales: DatosSolicitud = {
  nombre: '',
  cedula: '',
  telefono: '',
  correo: '',
  direccion: '',
  tipo: '',
  descripcion: '',
}

const tiposSolicitud = [
  'Nueva conexion',
  'Disponibilidad de agua',
  'Suspension temporal',
  'Cancelacion del servicio',
  'Cambio de titular',
]

export function FormularioSolicitud() {
  const [datos, setDatos] = useState<DatosSolicitud>(valoresIniciales)
  const [errores, setErrores] = useState<ErroresSolicitud>({})
  const [confirmacion, setConfirmacion] = useState('')
  const [ultimoSeguimiento, setUltimoSeguimiento] = useState('')

  const actualizarCampo = (campo: keyof DatosSolicitud, valor: string) => {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setErrores((actuales) => ({ ...actuales, [campo]: '' }))
  }

  const validar = () => {
    const nuevosErrores: ErroresSolicitud = {}

    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre completo es obligatorio.'
    if (!datos.cedula.trim()) nuevosErrores.cedula = 'La cedula es obligatoria.'
    if (!datos.telefono.trim()) nuevosErrores.telefono = 'El telefono es obligatorio.'
    if (!datos.correo.trim()) {
      nuevosErrores.correo = 'El correo electronico es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
      nuevosErrores.correo = 'Ingrese un correo electronico valido.'
    }
    if (!datos.direccion.trim()) nuevosErrores.direccion = 'La direccion es obligatoria.'
    if (!datos.tipo) nuevosErrores.tipo = 'Seleccione el tipo de solicitud.'
    if (!datos.descripcion.trim()) nuevosErrores.descripcion = 'Agregue el detalle de la solicitud.'

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setConfirmacion('')

    if (!validar()) return

    try {
      const resultado = await registrarSolicitud(datos)
      setConfirmacion(resultado.mensaje)
      setUltimoSeguimiento(resultado.numeroSeguimiento)
      setDatos(valoresIniciales)
    } catch (error) {
      setConfirmacion('')
      setErrores({ descripcion: error instanceof Error ? error.message : 'No se pudo registrar la solicitud.' })
    }
  }

  return (
    <section className="panel-formulario" id="solicitar-servicio">
      <div className="encabezado-formulario">
        <p className="etiqueta">Tramites</p>
        <h2>Solicitar servicio</h2>
        <p>Registre solicitudes de conexion, disponibilidad, suspension o cambios del servicio.</p>
      </div>

      <form onSubmit={enviarFormulario} noValidate>
        <CampoTexto
          id="solicitud-nombre"
          label="Nombre completo"
          value={datos.nombre}
          error={errores.nombre}
          onChange={(valor) => actualizarCampo('nombre', valor)}
        />
        <CampoTexto
          id="solicitud-cedula"
          label="Cedula"
          value={datos.cedula}
          error={errores.cedula}
          onChange={(valor) => actualizarCampo('cedula', valor)}
        />
        <CampoTexto
          id="solicitud-telefono"
          label="Telefono"
          value={datos.telefono}
          error={errores.telefono}
          onChange={(valor) => actualizarCampo('telefono', valor)}
        />
        <CampoTexto
          id="solicitud-correo"
          label="Correo electronico"
          type="email"
          value={datos.correo}
          error={errores.correo}
          onChange={(valor) => actualizarCampo('correo', valor)}
        />
        <CampoTexto
          id="solicitud-direccion"
          label="Direccion"
          value={datos.direccion}
          error={errores.direccion}
          onChange={(valor) => actualizarCampo('direccion', valor)}
        />

        <label className="campo">
          <span>Tipo de solicitud</span>
          <select value={datos.tipo} onChange={(evento) => actualizarCampo('tipo', evento.target.value)}>
            <option value="">Seleccione una opcion</option>
            {tiposSolicitud.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errores.tipo && <small className="error">{errores.tipo}</small>}
        </label>
        <label className="campo">
          <span>Descripcion o detalle de la solicitud</span>
          <textarea value={datos.descripcion} onChange={(evento) => actualizarCampo('descripcion', evento.target.value)} />
          {errores.descripcion && <small className="error">{errores.descripcion}</small>}
        </label>

        <button className="boton primario ancho" type="submit">
          Enviar solicitud
        </button>
      </form>

      {confirmacion && (
        <div className="mensaje-exito" role="status">
          <strong>{confirmacion}</strong>
          <span>Ultima solicitud visible: {ultimoSeguimiento}</span>
        </div>
      )}
    </section>
  )
}

type CampoTextoProps = {
  id: string
  label: string
  value: string
  error?: string
  type?: string
  onChange: (valor: string) => void
}

function CampoTexto({ id, label, value, error, type = 'text', onChange }: CampoTextoProps) {
  return (
    <label className="campo" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type={type} value={value} onChange={(evento) => onChange(evento.target.value)} />
      {error && <small className="error">{error}</small>}
    </label>
  )
}

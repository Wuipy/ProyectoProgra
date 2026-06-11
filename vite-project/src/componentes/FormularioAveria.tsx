import { ChangeEvent, FormEvent, useState } from 'react'
import { DatosAveria, registrarAveria } from '../servicios/landingService'

type ErroresAveria = Partial<Record<keyof DatosAveria, string>>

export type FotoAveria = {
  nombre: string
  vistaPrevia: string
}

export type ReporteAveria = DatosAveria & {
  numeroSeguimiento: string
  fecha: string
  foto?: FotoAveria
}

const valoresIniciales: DatosAveria = {
  nombre: '',
  telefono: '',
  correo: '',
  direccion: '',
  tipo: '',
  descripcion: '',
}

const tiposAveria = ['Fuga de agua', 'Tuberia dañada', 'Falta de agua', 'Medidor dañado', 'Otro']

type FormularioAveriaProps = {
  onReporteCreado?: (reporte: ReporteAveria) => void
}

export function FormularioAveria({ onReporteCreado }: FormularioAveriaProps) {
  const [datos, setDatos] = useState<DatosAveria>(valoresIniciales)
  const [foto, setFoto] = useState<FotoAveria | undefined>()
  const [errores, setErrores] = useState<ErroresAveria>({})
  const [confirmacion, setConfirmacion] = useState('')
  const [ultimoSeguimiento, setUltimoSeguimiento] = useState('')

  const actualizarCampo = (campo: keyof DatosAveria, valor: string) => {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }))
    setErrores((actuales) => ({ ...actuales, [campo]: '' }))
  }

  const actualizarFoto = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]

    if (!archivo) {
      setFoto(undefined)
      return
    }

    const lector = new FileReader()
    lector.onload = () => {
      setFoto({
        nombre: archivo.name,
        vistaPrevia: String(lector.result),
      })
    }
    lector.readAsDataURL(archivo)
  }

  const validar = () => {
    const nuevosErrores: ErroresAveria = {}

    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre completo es obligatorio.'
    if (!datos.telefono.trim()) nuevosErrores.telefono = 'El telefono es obligatorio.'
    if (datos.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
      nuevosErrores.correo = 'Ingrese un correo electronico valido.'
    }
    if (!datos.direccion.trim()) nuevosErrores.direccion = 'La ubicacion de la averia es obligatoria.'
    if (!datos.tipo) nuevosErrores.tipo = 'Seleccione el tipo de averia.'
    if (!datos.descripcion.trim()) nuevosErrores.descripcion = 'La descripcion del problema es obligatoria.'

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setConfirmacion('')

    if (!validar()) return

    try {
      const resultado = await registrarAveria(datos, foto)
      const nuevoReporte: ReporteAveria = {
        ...datos,
        numeroSeguimiento: resultado.numeroSeguimiento,
        fecha: new Date().toLocaleString('es-CR', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        foto,
      }

      onReporteCreado?.(nuevoReporte)
      setConfirmacion(resultado.mensaje)
      setUltimoSeguimiento(resultado.numeroSeguimiento)
      setDatos(valoresIniciales)
      setFoto(undefined)
      evento.currentTarget.reset()
    } catch (error) {
      setConfirmacion('')
      setErrores({ descripcion: error instanceof Error ? error.message : 'No se pudo registrar el reporte.' })
    }
  }

  return (
    <section className="panel-formulario" id="reportar-averia">
      <div className="encabezado-formulario">
        <p className="etiqueta">Reporte publico</p>
        <h2>Reportar averia</h2>
        <p>Complete los datos para registrar un incidente del servicio de agua.</p>
      </div>

      <form onSubmit={enviarFormulario} noValidate>
        <CampoTexto
          id="averia-nombre"
          label="Nombre completo"
          value={datos.nombre}
          error={errores.nombre}
          onChange={(valor) => actualizarCampo('nombre', valor)}
        />
        <CampoTexto
          id="averia-telefono"
          label="Telefono"
          value={datos.telefono}
          error={errores.telefono}
          onChange={(valor) => actualizarCampo('telefono', valor)}
        />
        <CampoTexto
          id="averia-correo"
          label="Correo electronico (opcional)"
          type="email"
          value={datos.correo ?? ''}
          error={errores.correo}
          onChange={(valor) => actualizarCampo('correo', valor)}
        />
        <CampoTexto
          id="averia-direccion"
          label="Direccion o ubicacion de la averia"
          value={datos.direccion}
          error={errores.direccion}
          onChange={(valor) => actualizarCampo('direccion', valor)}
        />
        <label className="campo">
          <span>Tipo de averia</span>
          <select value={datos.tipo} onChange={(evento) => actualizarCampo('tipo', evento.target.value)}>
            <option value="">Seleccione una opcion</option>
            {tiposAveria.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errores.tipo && <small className="error">{errores.tipo}</small>}
        </label>
        <label className="campo">
          <span>Descripcion del problema</span>
          <textarea
            placeholder="Explique lo que ocurre. Este comentario quedara visible como reporte recibido."
            value={datos.descripcion}
            onChange={(evento) => actualizarCampo('descripcion', evento.target.value)}
          />
          {errores.descripcion && <small className="error">{errores.descripcion}</small>}
        </label>

        <label className="campo campo-foto" htmlFor="averia-foto">
          <span>Foto o evidencia (opcional)</span>
          <input id="averia-foto" type="file" accept="image/*" onChange={actualizarFoto} />
        </label>

        {foto && (
          <div className="preview-foto">
            <img src={foto.vistaPrevia} alt={`Vista previa de ${foto.nombre}`} />
            <span>{foto.nombre}</span>
          </div>
        )}

        <button className="boton primario ancho" type="submit">
          Enviar reporte
        </button>
      </form>

      {confirmacion && (
        <div className="mensaje-exito mensaje-confirmacion-averia" role="status">
          <strong>Reporte registrado correctamente</strong>
          <span>Su averia quedo en estado <strong>Pendiente</strong>.</span>
          <span>Numero de seguimiento: <strong>{ultimoSeguimiento}</strong></span>
          <span>{confirmacion}</span>
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

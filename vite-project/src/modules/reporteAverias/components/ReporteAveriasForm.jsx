import { useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'

const estadoInicial = {
  nombre: '',
  telefono: '',
  direccion: '',
  tipo: 'Fuga de agua',
  prioridad: 'Media',
  descripcion: '',
}

export function ReporteAveriasForm({ reporteEditando, onCancelar, onGuardar }) {
  const [errorEnvio, setErrorEnvio] = useState('')
  const form = useForm({
    defaultValues: estadoInicial,
    onSubmit: async ({ value }) => {
      try {
        setErrorEnvio('')
        await onGuardar(value)
        form.reset(estadoInicial)
      } catch {
        setErrorEnvio('No se pudo guardar el reporte. Revisa que la API este activa.')
      }
    },
  })

  useEffect(() => {
    if (reporteEditando) {
      form.reset({
        nombre: reporteEditando.nombre,
        telefono: reporteEditando.telefono,
        direccion: reporteEditando.direccion,
        tipo: reporteEditando.tipo,
        prioridad: reporteEditando.prioridad ?? 'Media',
        descripcion: reporteEditando.descripcion,
      })
      return
    }

    form.reset(estadoInicial)
  }, [form, reporteEditando])

  const validarRequerido = (mensaje) => ({ value }) => {
    return value.trim() ? undefined : mensaje
  }

  const validarTelefono = ({ value }) => {
    if (!value.trim()) return 'El telefono es obligatorio'
    return /^[0-9+\-\s]{8,}$/.test(value) ? undefined : 'Ingresa un telefono valido'
  }

  const mostrarError = (field) => {
    const errores = field.state.meta.errors
    if (!errores.length || !field.state.meta.isTouched) return null

    return <span className="reporte-formulario__error">{errores[0]}</span>
  }

  return (
    <form
      className="reporte-formulario"
      onSubmit={(evento) => {
        evento.preventDefault()
        evento.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="reporte-formulario__encabezado">
        <h2>{reporteEditando ? 'Editar reporte' : 'Nuevo reporte'}</h2>
        {reporteEditando && (
          <button className="boton-secundario" type="button" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>

      {errorEnvio && <p className="reporte-alerta">{errorEnvio}</p>}

      <form.Field name="nombre" validators={{ onBlur: validarRequerido('El nombre es obligatorio') }}>
        {(field) => (
          <label>
            Nombre completo
            <input
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(evento) => field.handleChange(evento.target.value)}
              type="text"
              value={field.state.value}
            />
            {mostrarError(field)}
          </label>
        )}
      </form.Field>

      <form.Field name="telefono" validators={{ onBlur: validarTelefono }}>
        {(field) => (
          <label>
            Telefono
            <input
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(evento) => field.handleChange(evento.target.value)}
              type="tel"
              value={field.state.value}
            />
            {mostrarError(field)}
          </label>
        )}
      </form.Field>

      <form.Field
        name="direccion"
        validators={{ onBlur: validarRequerido('La direccion es obligatoria') }}
      >
        {(field) => (
          <label>
            Direccion
            <input
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(evento) => field.handleChange(evento.target.value)}
              type="text"
              value={field.state.value}
            />
            {mostrarError(field)}
          </label>
        )}
      </form.Field>

      <form.Field name="tipo">
        {(field) => (
          <label>
            Tipo de averia
            <select
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(evento) => field.handleChange(evento.target.value)}
              value={field.state.value}
            >
              <option>Fuga de agua</option>
              <option>Baja presion</option>
              <option>Sin servicio</option>
              <option>Medidor danado</option>
              <option>Otro</option>
            </select>
          </label>
        )}
      </form.Field>

      <form.Field name="prioridad">
        {(field) => (
          <label>
            Prioridad
            <select
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(evento) => field.handleChange(evento.target.value)}
              value={field.state.value}
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </label>
        )}
      </form.Field>

      <form.Field
        name="descripcion"
        validators={{ onBlur: validarRequerido('La descripcion es obligatoria') }}
      >
        {(field) => (
          <label className="reporte-formulario__textarea">
            Descripcion
            <textarea
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(evento) => field.handleChange(evento.target.value)}
              rows="4"
              value={field.state.value}
            />
            {mostrarError(field)}
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button className="boton-principal" disabled={!canSubmit || isSubmitting} type="submit">
            {isSubmitting
              ? 'Guardando...'
              : reporteEditando
                ? 'Guardar cambios'
                : 'Registrar averia'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}

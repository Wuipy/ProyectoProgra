import { ChangeEvent } from 'react'
import { OPCIONES_SI_NO, PRIORIDADES_SEGUIMIENTO } from '../../config/constantesModulos'
import type { ActividadFontaneroForm } from '../../types/actividades'

type Props = {
  formulario: ActividadFontaneroForm
  onChange: (formulario: ActividadFontaneroForm) => void
}

export function FormularioActividadGeneral({ formulario, onChange }: Props) {
  const actualizar = (cambios: Partial<ActividadFontaneroForm>) =>
    onChange({ ...formulario, ...cambios })

  const actualizarFoto = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) {
      actualizar({ fotoEvidenciaNombre: undefined, fotoEvidenciaBase64: undefined })
      return
    }
    const lector = new FileReader()
    lector.onload = () =>
      actualizar({
        fotoEvidenciaNombre: archivo.name,
        fotoEvidenciaBase64: String(lector.result),
      })
    lector.readAsDataURL(archivo)
  }

  return (
    <>
      <label className="campo">
        <span>Fecha</span>
        <input
          type="date"
          required
          value={formulario.fechaActividad}
          onChange={(e) => actualizar({ fechaActividad: e.target.value })}
        />
      </label>
      <label className="campo campo-ancho-completo">
        <span>Detalle del trabajo realizado</span>
        <textarea
          rows={3}
          required
          value={formulario.detalleTrabajoRealizado ?? ''}
          onChange={(e) => actualizar({ detalleTrabajoRealizado: e.target.value })}
        />
      </label>
      <label className="campo campo-ancho-completo">
        <span>Resultado del trabajo</span>
        <textarea
          rows={2}
          value={formulario.resultadoTrabajo ?? ''}
          onChange={(e) => actualizar({ resultadoTrabajo: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>¿Requiere seguimiento?</span>
        <select
          value={formulario.requiereSeguimiento ?? ''}
          onChange={(e) =>
            actualizar({
              requiereSeguimiento: e.target.value,
              prioridadSeguimiento: e.target.value === 'Si' ? formulario.prioridadSeguimiento : undefined,
            })
          }
        >
          <option value="">Seleccione</option>
          {OPCIONES_SI_NO.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
      {formulario.requiereSeguimiento === 'Si' && (
        <label className="campo">
          <span>Prioridad del seguimiento</span>
          <select
            value={formulario.prioridadSeguimiento ?? ''}
            onChange={(e) => actualizar({ prioridadSeguimiento: e.target.value })}
          >
            <option value="">Seleccione</option>
            {PRIORIDADES_SEGUIMIENTO.map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {prioridad}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="campo campo-ancho-completo">
        <span>Foto de evidencia (opcional)</span>
        <input type="file" accept="image/*" onChange={actualizarFoto} />
        {formulario.fotoEvidenciaBase64 && (
          <img
            className="evidencia-detalle evidencia-detalle-inline"
            src={formulario.fotoEvidenciaBase64}
            alt="Evidencia de actividad"
          />
        )}
      </label>
    </>
  )
}

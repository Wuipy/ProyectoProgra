import type { ActividadFontaneroForm } from '../../servicios/landingService'
import { DIAMETROS_TUBERIA } from '../../config/constantesModulos'

type Props = {
  formulario: ActividadFontaneroForm
  onChange: (formulario: ActividadFontaneroForm) => void
}

export function FormularioTomaPresion({ formulario, onChange }: Props) {
  const actualizar = (cambios: Partial<ActividadFontaneroForm>) =>
    onChange({ ...formulario, ...cambios })

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
      <label className="campo">
        <span>Aforo N°</span>
        <input
          required
          value={formulario.aforoNumero ?? ''}
          onChange={(e) => actualizar({ aforoNumero: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Lugar donde se hace la prueba</span>
        <input
          required
          value={formulario.lugarPrueba ?? ''}
          onChange={(e) => actualizar({ lugarPrueba: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Hora de la prueba</span>
        <input
          type="time"
          required
          value={formulario.horaPrueba ?? ''}
          onChange={(e) => actualizar({ horaPrueba: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Resultado en PSI</span>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={formulario.resultadoPsi ?? ''}
          onChange={(e) =>
            actualizar({
              resultadoPsi: e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
        />
      </label>
      <label className="campo">
        <span>Diametro de tuberia</span>
        <select
          required
          value={formulario.diametroTuberia ?? ''}
          onChange={(e) => actualizar({ diametroTuberia: e.target.value })}
        >
          <option value="">Seleccione</option>
          {DIAMETROS_TUBERIA.map((diametro) => (
            <option key={diametro} value={diametro}>
              {diametro}
            </option>
          ))}
        </select>
      </label>
      <label className="campo campo-ancho-completo">
        <span>Observaciones de presion</span>
        <textarea
          rows={2}
          value={formulario.observacionesPresion ?? ''}
          onChange={(e) => actualizar({ observacionesPresion: e.target.value })}
        />
      </label>
    </>
  )
}

import type { ActividadFontaneroForm } from '../../types/actividades'
import { OPCIONES_OLOR_SABOR } from '../../config/constantesModulos'

type Props = {
  formulario: ActividadFontaneroForm
  onChange: (formulario: ActividadFontaneroForm) => void
}

export function FormularioControlOperativo({ formulario, onChange }: Props) {
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
        <span>Prueba N°</span>
        <input
          required
          value={formulario.pruebaNumero ?? ''}
          onChange={(e) => actualizar({ pruebaNumero: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Lugar / casa</span>
        <input
          required
          value={formulario.lugarCasa ?? ''}
          onChange={(e) => actualizar({ lugarCasa: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Hora</span>
        <input
          type="time"
          required
          value={formulario.horaControl ?? ''}
          onChange={(e) => actualizar({ horaControl: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Cloro residual</span>
        <input
          required
          value={formulario.cloroResidual ?? ''}
          onChange={(e) => actualizar({ cloroResidual: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Turbiedad</span>
        <input
          value={formulario.turbiedad ?? ''}
          onChange={(e) => actualizar({ turbiedad: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>pH</span>
        <input
          type="number"
          min="0"
          max="14"
          step="0.01"
          value={formulario.ph ?? ''}
          onChange={(e) =>
            actualizar({ ph: e.target.value === '' ? undefined : Number(e.target.value) })
          }
        />
      </label>
      <label className="campo">
        <span>Olor</span>
        <select value={formulario.olor ?? ''} onChange={(e) => actualizar({ olor: e.target.value })}>
          <option value="">Seleccione</option>
          {OPCIONES_OLOR_SABOR.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
      <label className="campo">
        <span>Sabor</span>
        <select value={formulario.sabor ?? ''} onChange={(e) => actualizar({ sabor: e.target.value })}>
          <option value="">Seleccione</option>
          {OPCIONES_OLOR_SABOR.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
      <label className="campo campo-ancho-completo">
        <span>Observaciones del control operativo</span>
        <textarea
          rows={2}
          value={formulario.observacionesControlOperativo ?? ''}
          onChange={(e) => actualizar({ observacionesControlOperativo: e.target.value })}
        />
      </label>
    </>
  )
}

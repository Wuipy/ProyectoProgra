import { ChangeEvent } from 'react'
import { ESTADOS_MEDIDOR_VISITA, OPCIONES_SI_NO } from '../../config/constantesModulos'
import type { ActividadFontaneroForm } from '../../servicios/landingService'

type Props = {
  formulario: ActividadFontaneroForm
  onChange: (formulario: ActividadFontaneroForm) => void
}

export function FormularioVisitaCampo({ formulario, onChange }: Props) {
  const actualizar = (cambios: Partial<ActividadFontaneroForm>) => {
    const siguiente = { ...formulario, ...cambios }
    if (
      cambios.lecturaAnteriorM3 !== undefined ||
      cambios.lecturaActualM3 !== undefined
    ) {
      const anterior = cambios.lecturaAnteriorM3 ?? formulario.lecturaAnteriorM3
      const actual = cambios.lecturaActualM3 ?? formulario.lecturaActualM3
      if (anterior != null && actual != null) {
        siguiente.consumoRegistradoM3 = actual - anterior
      }
    }
    onChange(siguiente)
  }

  const actualizarFoto = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) {
      actualizar({ fotoMedidorNombre: undefined, fotoMedidorBase64: undefined })
      return
    }
    const lector = new FileReader()
    lector.onload = () =>
      actualizar({
        fotoMedidorNombre: archivo.name,
        fotoMedidorBase64: String(lector.result),
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
      <label className="campo">
        <span>Hora inicio</span>
        <input
          type="time"
          required
          value={formulario.horaInicio ?? ''}
          onChange={(e) => actualizar({ horaInicio: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Hora fin</span>
        <input
          type="time"
          value={formulario.horaFin ?? ''}
          onChange={(e) => actualizar({ horaFin: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Abonado #</span>
        <input
          value={formulario.abonadoNumero ?? ''}
          onChange={(e) => actualizar({ abonadoNumero: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Nombre del abonado</span>
        <input
          required
          value={formulario.nombreAbonado ?? ''}
          onChange={(e) => actualizar({ nombreAbonado: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Lugar de la visita</span>
        <input
          required
          value={formulario.lugarVisita ?? ''}
          onChange={(e) => actualizar({ lugarVisita: e.target.value })}
        />
      </label>
      <label className="campo campo-ancho-completo">
        <span>Motivo de visita</span>
        <input
          required
          value={formulario.motivoVisita ?? ''}
          onChange={(e) => actualizar({ motivoVisita: e.target.value })}
        />
      </label>
      <label className="campo">
        <span>Lectura anterior m³</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formulario.lecturaAnteriorM3 ?? ''}
          onChange={(e) =>
            actualizar({
              lecturaAnteriorM3: e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
        />
      </label>
      <label className="campo">
        <span>Lectura actual m³</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formulario.lecturaActualM3 ?? ''}
          onChange={(e) =>
            actualizar({
              lecturaActualM3: e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
        />
      </label>
      <label className="campo">
        <span>Consumo registrado m³</span>
        <input type="number" readOnly value={formulario.consumoRegistradoM3 ?? ''} />
      </label>
      <label className="campo">
        <span>Estado del medidor</span>
        <select
          required
          value={formulario.estadoMedidor ?? ''}
          onChange={(e) => actualizar({ estadoMedidor: e.target.value })}
        >
          <option value="">Seleccione</option>
          {ESTADOS_MEDIDOR_VISITA.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </label>
      <label className="campo">
        <span>¿Se detecto fuga?</span>
        <select
          required
          value={formulario.detectoFuga ?? ''}
          onChange={(e) => actualizar({ detectoFuga: e.target.value })}
        >
          <option value="">Seleccione</option>
          {OPCIONES_SI_NO.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
      <label className="campo campo-ancho-completo">
        <span>Resultado de la inspeccion</span>
        <textarea
          rows={3}
          required
          value={formulario.resultadoInspeccion ?? ''}
          onChange={(e) => actualizar({ resultadoInspeccion: e.target.value })}
        />
      </label>
      <label className="campo campo-ancho-completo">
        <span>Accion recomendada</span>
        <textarea
          rows={2}
          value={formulario.accionRecomendada ?? ''}
          onChange={(e) => actualizar({ accionRecomendada: e.target.value })}
        />
      </label>
      <label className="campo campo-ancho-completo">
        <span>Foto del medidor (opcional)</span>
        <input type="file" accept="image/*" onChange={actualizarFoto} />
        {formulario.fotoMedidorBase64 && (
          <img
            className="evidencia-detalle evidencia-detalle-inline"
            src={formulario.fotoMedidorBase64}
            alt="Foto del medidor"
          />
        )}
      </label>
    </>
  )
}

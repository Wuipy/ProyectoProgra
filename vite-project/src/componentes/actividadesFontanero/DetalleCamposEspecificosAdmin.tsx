import {
  obtenerCategoriaFormulario,
  tituloFormularioEspecifico,
} from '../../config/formulariosActividadFontanero'
import type { ActividadFontaneroItem } from '../../types/actividades'

type Props = {
  actividad: ActividadFontaneroItem
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor?: string | number | null }) {
  if (valor == null || valor === '') return null
  return (
    <p>
      <strong>{etiqueta}:</strong> {valor}
    </p>
  )
}

export function DetalleCamposEspecificosAdmin({ actividad }: Props) {
  const categoria = obtenerCategoriaFormulario(actividad.tipo)
  if (!categoria) return null

  return (
    <div className="detalle-formulario-especifico">
      <h4>{tituloFormularioEspecifico(categoria)}</h4>
      <Campo etiqueta="Fecha" valor={actividad.fechaActividad} />

      {categoria === 'visita-campo' && (
        <>
          <Campo etiqueta="Hora inicio" valor={actividad.horaInicio} />
          <Campo etiqueta="Hora fin" valor={actividad.horaFin} />
        </>
      )}

      {categoria === 'visita-campo' && (
        <>
          <Campo etiqueta="Abonado #" valor={actividad.abonadoNumero} />
          <Campo etiqueta="Nombre del abonado" valor={actividad.nombreAbonado} />
          <Campo etiqueta="Lugar de la visita" valor={actividad.lugarVisita} />
          <Campo etiqueta="Motivo de visita" valor={actividad.motivoVisita} />
          <Campo etiqueta="Lectura anterior m³" valor={actividad.lecturaAnteriorM3} />
          <Campo etiqueta="Lectura actual m³" valor={actividad.lecturaActualM3} />
          <Campo etiqueta="Consumo registrado m³" valor={actividad.consumoRegistradoM3} />
          <Campo etiqueta="Estado del medidor" valor={actividad.estadoMedidor} />
          <Campo etiqueta="¿Se detecto fuga?" valor={actividad.detectoFuga} />
          <Campo etiqueta="Resultado de inspeccion" valor={actividad.resultadoInspeccion} />
          <Campo etiqueta="Accion recomendada" valor={actividad.accionRecomendada} />
          {actividad.fotoMedidorBase64 && (
            <img
              className="evidencia-detalle"
              src={actividad.fotoMedidorBase64}
              alt="Foto del medidor"
            />
          )}
        </>
      )}

      {categoria === 'toma-presion' && (
        <>
          <Campo etiqueta="Hora de prueba" valor={actividad.horaPrueba ?? actividad.horaInicio} />
          <Campo etiqueta="Aforo N°" valor={actividad.aforoNumero} />
          <Campo etiqueta="Lugar de prueba" valor={actividad.lugarPrueba} />
          <Campo etiqueta="Hora de prueba" valor={actividad.horaPrueba} />
          <Campo etiqueta="Resultado PSI" valor={actividad.resultadoPsi} />
          <Campo etiqueta="Diametro de tuberia" valor={actividad.diametroTuberia} />
          <Campo etiqueta="Observaciones de presion" valor={actividad.observacionesPresion} />
        </>
      )}

      {categoria === 'control-operativo' && (
        <>
          <Campo etiqueta="Hora" valor={actividad.horaControl ?? actividad.horaInicio} />
          <Campo etiqueta="Prueba N°" valor={actividad.pruebaNumero} />
          <Campo etiqueta="Lugar / casa" valor={actividad.lugarCasa} />
          <Campo etiqueta="Hora" valor={actividad.horaControl} />
          <Campo etiqueta="Cloro residual" valor={actividad.cloroResidual} />
          <Campo etiqueta="Turbiedad" valor={actividad.turbiedad} />
          <Campo etiqueta="pH" valor={actividad.ph} />
          <Campo etiqueta="Olor" valor={actividad.olor} />
          <Campo etiqueta="Sabor" valor={actividad.sabor} />
          <Campo
            etiqueta="Observaciones del control operativo"
            valor={actividad.observacionesControlOperativo}
          />
        </>
      )}

      {categoria === 'actividad-general' && (
        <>
          <Campo etiqueta="Detalle del trabajo" valor={actividad.detalleTrabajoRealizado} />
          <Campo etiqueta="Resultado del trabajo" valor={actividad.resultadoTrabajo} />
          <Campo etiqueta="¿Requiere seguimiento?" valor={actividad.requiereSeguimiento} />
          <Campo etiqueta="Prioridad del seguimiento" valor={actividad.prioridadSeguimiento} />
          {actividad.fotoEvidenciaBase64 && (
            <img
              className="evidencia-detalle"
              src={actividad.fotoEvidenciaBase64}
              alt="Evidencia de actividad"
            />
          )}
        </>
      )}
    </div>
  )
}

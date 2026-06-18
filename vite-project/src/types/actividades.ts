export type CamposEspecificosActividadFontanero = {
  abonadoNumero?: string
  nombreAbonado?: string
  lugarVisita?: string
  motivoVisita?: string
  lecturaAnteriorM3?: number
  lecturaActualM3?: number
  consumoRegistradoM3?: number
  estadoMedidor?: string
  detectoFuga?: string
  resultadoInspeccion?: string
  accionRecomendada?: string
  fotoMedidorNombre?: string
  fotoMedidorBase64?: string
  aforoNumero?: string
  lugarPrueba?: string
  horaPrueba?: string
  resultadoPsi?: number
  diametroTuberia?: string
  observacionesPresion?: string
  pruebaNumero?: string
  lugarCasa?: string
  horaControl?: string
  cloroResidual?: string
  turbiedad?: string
  ph?: number
  olor?: string
  sabor?: string
  observacionesControlOperativo?: string
  detalleTrabajoRealizado?: string
  resultadoTrabajo?: string
  requiereSeguimiento?: string
  prioridadSeguimiento?: string
  fotoEvidenciaNombre?: string
  fotoEvidenciaBase64?: string
}

export type ActividadFontaneroItem = {
  id: string
  fontanero: string
  fechaActividad: string
  fechaActividadIso?: string
  horaInicio?: string | null
  horaFin?: string | null
  tipo: string
  descripcion: string
  ubicacion: string
  numeroAveriaVinculada?: string | null
  lecturaMedidorId?: number | null
  materialesUtilizados?: string | null
  observaciones?: string | null
  estado: string
  estadoValidacion: string
  observacionValidacion?: string | null
  fechaCreacion: string
  fechaActualizacion?: string | null
} & CamposEspecificosActividadFontanero

export type ActividadFontaneroForm = {
  fechaActividad: string
  horaInicio?: string
  horaFin?: string
  tipo: string
  descripcion: string
  ubicacion: string
  numeroAveriaVinculada?: string
  lecturaMedidorId?: number
  materialesUtilizados?: string
  observaciones?: string
  estado: string
} & CamposEspecificosActividadFontanero

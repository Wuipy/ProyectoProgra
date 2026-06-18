export type LecturaMedidorItem = {
  id: number
  nombreAbonado: string
  numeroAbonado?: string | null
  numeroMedidor: string
  cedulaAbonado?: string | null
  ubicacion?: string | null
  lecturaAnterior: number
  lecturaActual: number
  consumo: number
  consumoMesAnterior?: number | null
  alertaConsumoAlto: boolean
  consumoAlto: boolean
  fechaLectura: string
  horaLectura?: string | null
  observaciones?: string | null
  observacionAdmin?: string | null
  motivoVisita?: string | null
  resultadoInspeccion?: string | null
  estado: string
  estadoMedidor?: string | null
  evidenciaNombre?: string | null
  evidenciaBase64?: string | null
  fontanero: string
  revisadaPorAdmin?: string | null
  fechaRegistro: string
  fechaActualizacion?: string | null
}

export type LecturaMedidorForm = {
  nombreAbonado: string
  numeroAbonado?: string
  numeroMedidor: string
  cedulaAbonado?: string
  ubicacion?: string
  lecturaAnterior: number
  lecturaActual: number
  fechaLectura: string
  horaLectura?: string
  observaciones?: string
  estadoMedidor?: string
  motivoVisita?: string
  resultadoInspeccion?: string
  evidenciaNombre?: string
  evidenciaBase64?: string
}

export type AsignarLecturaMedidorForm = {
  nombreAbonado: string
  numeroAbonado?: string
  numeroMedidor: string
  ubicacion?: string
  lecturaAnterior: number
  fechaLectura: string
  fontaneroId: number
  observaciones?: string
}

export type ResumenLecturasMedidor = {
  totalMes: number
  pendientes: number
  registradasHoy: number
  validadas: number
  conInconsistencia: number
  consumosAltos: number
}

export type HistorialLecturaCambio = {
  id: number
  accion: string
  estadoAnterior?: string | null
  estadoNuevo?: string | null
  observacion?: string | null
  usuario?: string | null
  fecha: string
}

export type ReporteLecturasMedidor = {
  tipo: string
  totalRegistros: number
  registros: LecturaMedidorItem[]
}

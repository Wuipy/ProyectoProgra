export type LecturaMedidorItem = {
  id: number
  nombreAbonado: string
  numeroMedidor: string
  cedulaAbonado?: string | null
  lecturaAnterior: number
  lecturaActual: number
  consumo: number
  consumoMesAnterior?: number | null
  alertaConsumoAlto: boolean
  fechaLectura: string
  observaciones?: string | null
  estado: string
  fontanero: string
  fechaRegistro: string
}

export type LecturaMedidorForm = {
  nombreAbonado: string
  numeroMedidor: string
  cedulaAbonado?: string
  lecturaAnterior: number
  lecturaActual: number
  fechaLectura: string
  observaciones?: string
}

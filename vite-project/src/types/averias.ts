import type { FotoAveriaPayload } from './comunes'

export type DatosAveria = {
  nombre: string
  telefono: string
  correo?: string
  direccion: string
  tipo: string
  descripcion: string
}

export type ReporteAveriaResponse = DatosAveria & {
  numeroSeguimiento: string
  fecha: string
  estado: string
  prioridad: string
  mensajeEstado: string
  fontaneroAsignado?: string | null
  notasAtencion?: string | null
  observacionesAdmin?: string | null
  descripcionTrabajo?: string | null
  materialesUtilizados?: string | null
  fechaUltimaActualizacion?: string | null
  foto?: FotoAveriaPayload
  evidenciaTrabajo?: FotoAveriaPayload
}

export type AveriaHistorialItem = {
  accion: string
  valorAnterior?: string | null
  valorNuevo?: string | null
  usuario?: string | null
  fecha: string
}

export type SeguimientoResponse = {
  numeroSeguimiento: string
  tipo: string
  estado: string
  mensajeEstado: string
  detalleAveria?: ReporteAveriaResponse
}

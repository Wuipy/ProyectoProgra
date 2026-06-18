import { apiClient } from './apiClient'
import type {
  AsignarLecturaMedidorForm,
  HistorialLecturaCambio,
  LecturaMedidorForm,
  LecturaMedidorItem,
  ReporteLecturasMedidor,
  ResumenLecturasMedidor,
} from '../types/lecturas'

export type {
  AsignarLecturaMedidorForm,
  HistorialLecturaCambio,
  LecturaMedidorForm,
  LecturaMedidorItem,
  ReporteLecturasMedidor,
  ResumenLecturasMedidor,
}

export {
  actualizarLecturaMedidor,
  asignarLecturaMedidor,
  crearLecturaMedidor,
  historialCambiosLectura,
  historialLecturasMedidor,
  historialLecturasPorAbonado,
  listarLecturasMedidorAdmin,
  listarLecturasPendientesMedidor,
  listarMisLecturasMedidor,
  reporteLecturasMedidor,
  resumenLecturasMedidorAdmin,
  resumenMisLecturasMedidor,
} from './lecturasService'

export async function obtenerLecturasMedidores(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor')
  return data
}

export async function obtenerLecturaPorId(id: number): Promise<LecturaMedidorItem | null> {
  const lecturas = await obtenerLecturasMedidores()
  return lecturas.find((l) => l.id === id) ?? null
}

export async function obtenerLecturasPorFontanero(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor/mis-lecturas')
  return data
}

export async function obtenerLecturasPendientesFontanero(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor/pendientes')
  return data
}

export async function obtenerLecturasPorAbonado(numeroAbonado: string): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>(
    `/lecturas-medidor/historial-abonado/${encodeURIComponent(numeroAbonado)}`,
  )
  return data
}

export async function obtenerLecturasConInconsistencia(): Promise<LecturaMedidorItem[]> {
  const lecturas = await obtenerLecturasMedidores()
  return lecturas.filter((l) => l.estado === 'Con inconsistencia')
}

export async function obtenerConsumosAltos(): Promise<LecturaMedidorItem[]> {
  const lecturas = await obtenerLecturasMedidores()
  return lecturas.filter((l) => l.consumoAlto || l.alertaConsumoAlto)
}

export async function validarLectura(id: number, observacionAdmin?: string): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.patch<LecturaMedidorItem>(`/lecturas-medidor/${id}`, {
    estado: 'Validada',
    observacionAdmin,
  })
  return data
}

export async function rechazarLectura(id: number, observacion: string): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.patch<LecturaMedidorItem>(`/lecturas-medidor/${id}`, {
    estado: 'Rechazada',
    observacionAdmin: observacion,
  })
  return data
}

export async function crearLectura(formulario: LecturaMedidorForm): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.post<LecturaMedidorItem>('/lecturas-medidor', formulario)
  return data
}

export async function actualizarLectura(
  id: number,
  payload: {
    lecturaActual?: number
    observaciones?: string
    observacionAdmin?: string
    estado?: string
    estadoMedidor?: string
    horaLectura?: string
    motivoVisita?: string
    resultadoInspeccion?: string
    evidenciaNombre?: string
    evidenciaBase64?: string
  },
): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.patch<LecturaMedidorItem>(`/lecturas-medidor/${id}`, payload)
  return data
}

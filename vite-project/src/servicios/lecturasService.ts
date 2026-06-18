import { apiClient } from './apiClient'
import type {
  AsignarLecturaMedidorForm,
  HistorialLecturaCambio,
  LecturaMedidorForm,
  LecturaMedidorItem,
  ReporteLecturasMedidor,
  ResumenLecturasMedidor,
} from '../types/lecturas'

export async function listarLecturasMedidorAdmin(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor')
  return data
}

export async function resumenLecturasMedidorAdmin(): Promise<ResumenLecturasMedidor> {
  const { data } = await apiClient.get<ResumenLecturasMedidor>('/lecturas-medidor/resumen')
  return data
}

export async function listarMisLecturasMedidor(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor/mis-lecturas')
  return data
}

export async function resumenMisLecturasMedidor(): Promise<ResumenLecturasMedidor> {
  const { data } = await apiClient.get<ResumenLecturasMedidor>('/lecturas-medidor/mis-lecturas/resumen')
  return data
}

export async function listarLecturasPendientesMedidor(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor/pendientes')
  return data
}

export async function historialLecturasMedidor(numeroMedidor: string): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>(
    `/lecturas-medidor/historial/${encodeURIComponent(numeroMedidor)}`,
  )
  return data
}

export async function historialLecturasPorAbonado(numeroAbonado: string): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>(
    `/lecturas-medidor/historial-abonado/${encodeURIComponent(numeroAbonado)}`,
  )
  return data
}

export async function historialCambiosLectura(id: number): Promise<HistorialLecturaCambio[]> {
  const { data } = await apiClient.get<HistorialLecturaCambio[]>(`/lecturas-medidor/${id}/historial-cambios`)
  return data
}

export async function reporteLecturasMedidor(tipo: string): Promise<ReporteLecturasMedidor> {
  const { data } = await apiClient.get<ReporteLecturasMedidor>(`/lecturas-medidor/reportes/${encodeURIComponent(tipo)}`)
  return data
}

export async function crearLecturaMedidor(formulario: LecturaMedidorForm): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.post<LecturaMedidorItem>('/lecturas-medidor', formulario)
  return data
}

export async function asignarLecturaMedidor(formulario: AsignarLecturaMedidorForm): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.post<LecturaMedidorItem>('/lecturas-medidor/asignar', formulario)
  return data
}

export async function actualizarLecturaMedidor(
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

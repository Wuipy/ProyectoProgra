import { apiClient } from './apiClient'
import type { LecturaMedidorForm, LecturaMedidorItem } from '../types/lecturas'

export async function listarLecturasMedidorAdmin(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor')
  return data
}

export async function listarMisLecturasMedidor(): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>('/lecturas-medidor/mis-lecturas')
  return data
}

export async function historialLecturasMedidor(numeroMedidor: string): Promise<LecturaMedidorItem[]> {
  const { data } = await apiClient.get<LecturaMedidorItem[]>(
    `/lecturas-medidor/historial/${encodeURIComponent(numeroMedidor)}`,
  )
  return data
}

export async function crearLecturaMedidor(formulario: LecturaMedidorForm): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.post<LecturaMedidorItem>('/lecturas-medidor', formulario)
  return data
}

export async function actualizarLecturaMedidor(
  id: number,
  payload: { lecturaActual?: number; observaciones?: string; estado?: string },
): Promise<LecturaMedidorItem> {
  const { data } = await apiClient.patch<LecturaMedidorItem>(`/lecturas-medidor/${id}`, payload)
  return data
}

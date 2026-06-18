import { apiClient } from './apiClient'
import type { ActividadFontaneroForm, ActividadFontaneroItem } from '../types/actividades'

export async function listarActividadesFontaneroAdmin(): Promise<ActividadFontaneroItem[]> {
  const { data } = await apiClient.get<ActividadFontaneroItem[]>('/actividades-fontanero')
  return data
}

export async function listarMisActividadesFontanero(): Promise<ActividadFontaneroItem[]> {
  const { data } = await apiClient.get<ActividadFontaneroItem[]>('/actividades-fontanero/mis-actividades')
  return data
}

export async function crearActividadFontanero(formulario: ActividadFontaneroForm): Promise<ActividadFontaneroItem> {
  const { data } = await apiClient.post<ActividadFontaneroItem>('/actividades-fontanero', formulario)
  return data
}

export async function actualizarActividadFontanero(
  id: string,
  formulario: ActividadFontaneroForm,
): Promise<ActividadFontaneroItem> {
  const { data } = await apiClient.put<ActividadFontaneroItem>(`/actividades-fontanero/${id}`, formulario)
  return data
}

export async function validarActividadFontanero(
  id: string,
  estadoValidacion: string,
  observacionValidacion?: string,
): Promise<ActividadFontaneroItem> {
  const { data } = await apiClient.patch<ActividadFontaneroItem>(`/actividades-fontanero/${id}/validar`, {
    estadoValidacion,
    observacionValidacion,
  })
  return data
}

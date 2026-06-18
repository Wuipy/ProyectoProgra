import { apiClient } from './apiClient'
import type { Comunicado, Proyecto } from '../types/contenido'

export async function listarComunicados(): Promise<Comunicado[]> {
  const { data } = await apiClient.get<Comunicado[]>('/comunicados')
  return data
}

export async function listarProyectos(): Promise<Proyecto[]> {
  const { data } = await apiClient.get<Proyecto[]>('/proyectos')
  return data
}

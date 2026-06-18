import { apiClient } from './apiClient'
import type { RegistroResponse } from '../types/comunes'
import type { DatosSolicitud } from '../types/solicitudes'

export async function registrarSolicitud(datos: DatosSolicitud): Promise<RegistroResponse> {
  const { data } = await apiClient.post<RegistroResponse>('/solicitudes', datos)
  return data
}

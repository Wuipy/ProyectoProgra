import { apiClient } from './apiClient'
import type {
  AveriaHistorialItem,
  DatosAveria,
  ReporteAveriaResponse,
  SeguimientoResponse,
} from '../types/averias'
import type { FotoAveriaPayload, FontaneroResumen, RegistroResponse } from '../types/comunes'

export async function registrarAveria(
  datos: DatosAveria,
  foto?: FotoAveriaPayload,
): Promise<RegistroResponse> {
  const { data } = await apiClient.post<RegistroResponse>('/averias', {
    ...datos,
    fotoNombre: foto?.nombre,
    fotoBase64: foto?.vistaPrevia,
  })
  return data
}

export async function listarAverias(): Promise<ReporteAveriaResponse[]> {
  const { data } = await apiClient.get<ReporteAveriaResponse[]>('/averias')
  return data
}

export async function listarAveriasGestion(): Promise<ReporteAveriaResponse[]> {
  const { data } = await apiClient.get<ReporteAveriaResponse[]>('/averias/gestion')
  return data
}

export async function listarAveriasAsignadas(): Promise<ReporteAveriaResponse[]> {
  const { data } = await apiClient.get<ReporteAveriaResponse[]>('/averias/asignadas')
  return data
}

export async function listarHistorialAveria(numeroSeguimiento: string): Promise<AveriaHistorialItem[]> {
  const { data } = await apiClient.get<AveriaHistorialItem[]>(
    `/averias/${encodeURIComponent(numeroSeguimiento)}/historial`,
  )
  return data
}

export async function listarFontaneros(): Promise<FontaneroResumen[]> {
  const { data } = await apiClient.get<FontaneroResumen[]>('/usuarios/fontaneros')
  return data
}

export async function asignarFontaneroAveria(
  numeroSeguimiento: string,
  fontanero: string,
): Promise<ReporteAveriaResponse> {
  const { data } = await apiClient.patch<ReporteAveriaResponse>(
    `/averias/${encodeURIComponent(numeroSeguimiento)}/asignar-fontanero`,
    { fontanero },
  )
  return data
}

export async function cambiarEstadoAveria(
  numeroSeguimiento: string,
  estado: string,
): Promise<ReporteAveriaResponse> {
  const { data } = await apiClient.patch<ReporteAveriaResponse>(
    `/averias/${encodeURIComponent(numeroSeguimiento)}/estado`,
    { estado },
  )
  return data
}

export async function cambiarPrioridadAveria(
  numeroSeguimiento: string,
  prioridad: string,
): Promise<ReporteAveriaResponse> {
  const { data } = await apiClient.patch<ReporteAveriaResponse>(
    `/averias/${encodeURIComponent(numeroSeguimiento)}/prioridad`,
    { prioridad },
  )
  return data
}

export async function guardarObservacionesAdminAveria(
  numeroSeguimiento: string,
  observacionesAdmin: string,
): Promise<ReporteAveriaResponse> {
  const { data } = await apiClient.patch<ReporteAveriaResponse>(
    `/averias/${encodeURIComponent(numeroSeguimiento)}/observaciones-admin`,
    { observacionesAdmin },
  )
  return data
}

export async function guardarAtencionFontaneroAveria(
  numeroSeguimiento: string,
  payload: {
    descripcionTrabajo?: string
    materialesUtilizados?: string
    notasAtencion?: string
    estado?: string
    evidenciaNombre?: string
    evidenciaBase64?: string
  },
): Promise<ReporteAveriaResponse> {
  const { data } = await apiClient.patch<ReporteAveriaResponse>(
    `/averias/${encodeURIComponent(numeroSeguimiento)}/atencion-fontanero`,
    payload,
  )
  return data
}

export async function consultarSeguimiento(numeroSeguimiento: string): Promise<SeguimientoResponse> {
  const { data } = await apiClient.get<SeguimientoResponse>(
    `/seguimiento/${encodeURIComponent(numeroSeguimiento.trim())}`,
  )
  return data
}

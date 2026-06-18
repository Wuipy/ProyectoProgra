import { apiClient } from './apiClient'

export type DatosAveria = {
  nombre: string
  telefono: string
  correo?: string
  direccion: string
  tipo: string
  descripcion: string
}

export type DatosSolicitud = {
  nombre: string
  cedula: string
  telefono: string
  correo: string
  direccion: string
  tipo: string
  descripcion: string
}

export type FotoAveriaPayload = {
  nombre: string
  vistaPrevia: string
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

export type FontaneroResumen = {
  id: number
  usuario: string
}

export type CamposEspecificosActividadFontanero = {
  abonadoNumero?: string
  nombreAbonado?: string
  lugarVisita?: string
  motivoVisita?: string
  lecturaAnteriorM3?: number
  lecturaActualM3?: number
  consumoRegistradoM3?: number
  estadoMedidor?: string
  detectoFuga?: string
  resultadoInspeccion?: string
  accionRecomendada?: string
  fotoMedidorNombre?: string
  fotoMedidorBase64?: string
  aforoNumero?: string
  lugarPrueba?: string
  horaPrueba?: string
  resultadoPsi?: number
  diametroTuberia?: string
  observacionesPresion?: string
  pruebaNumero?: string
  lugarCasa?: string
  horaControl?: string
  cloroResidual?: string
  turbiedad?: string
  ph?: number
  olor?: string
  sabor?: string
  observacionesControlOperativo?: string
  detalleTrabajoRealizado?: string
  resultadoTrabajo?: string
  requiereSeguimiento?: string
  prioridadSeguimiento?: string
  fotoEvidenciaNombre?: string
  fotoEvidenciaBase64?: string
}

export type ActividadFontaneroItem = {
  id: string
  fontanero: string
  fechaActividad: string
  fechaActividadIso?: string
  horaInicio?: string | null
  horaFin?: string | null
  tipo: string
  descripcion: string
  ubicacion: string
  numeroAveriaVinculada?: string | null
  lecturaMedidorId?: number | null
  materialesUtilizados?: string | null
  observaciones?: string | null
  estado: string
  estadoValidacion: string
  observacionValidacion?: string | null
  fechaCreacion: string
  fechaActualizacion?: string | null
} & CamposEspecificosActividadFontanero

export type ActividadFontaneroForm = {
  fechaActividad: string
  horaInicio?: string
  horaFin?: string
  tipo: string
  descripcion: string
  ubicacion: string
  numeroAveriaVinculada?: string
  lecturaMedidorId?: number
  materialesUtilizados?: string
  observaciones?: string
  estado: string
} & CamposEspecificosActividadFontanero

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

export type RegistroResponse = {
  numeroSeguimiento: string
  mensaje: string
}

export type SeguimientoResponse = {
  numeroSeguimiento: string
  tipo: string
  estado: string
  mensajeEstado: string
  detalleAveria?: ReporteAveriaResponse
}

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

export async function registrarSolicitud(datos: DatosSolicitud): Promise<RegistroResponse> {
  const { data } = await apiClient.post<RegistroResponse>('/solicitudes', datos)
  return data
}

export async function consultarSeguimiento(numeroSeguimiento: string): Promise<SeguimientoResponse> {
  const { data } = await apiClient.get<SeguimientoResponse>(
    `/seguimiento/${encodeURIComponent(numeroSeguimiento.trim())}`,
  )
  return data
}

export type Comunicado = {
  fecha: string
  titulo: string
  descripcion: string
  estado: string
}

export type Proyecto = {
  titulo: string
  descripcion: string
  estado: string
}

export async function listarComunicados(): Promise<Comunicado[]> {
  const { data } = await apiClient.get<Comunicado[]>('/comunicados')
  return data
}

export async function listarProyectos(): Promise<Proyecto[]> {
  const { data } = await apiClient.get<Proyecto[]>('/proyectos')
  return data
}

export type TipoActividad =
  | 'Control de Fugas'
  | 'Toma de presion'
  | 'Visita de Campo'
  | 'Control de Aforos'
  | 'Control Operativo'

export type EstadoActividad = 'Pendiente' | 'En progreso' | 'Completado'

export type PrioridadActividad = 'Baja' | 'Media' | 'Alta'

export type RegistroActividad = {
  id: string
  tipo: TipoActividad
  cliente: string
  ubicacion: string
  descripcion: string
  fecha: string
  fechaActualizacion?: string | null
  estado: EstadoActividad
  prioridad: PrioridadActividad
  notasSeguimiento?: string | null
  numeroAveriaVinculada?: string | null
}

export type ActividadForm = Omit<RegistroActividad, 'id' | 'fecha' | 'fechaActualizacion'>

export async function listarActividadesPlomeria(): Promise<RegistroActividad[]> {
  const { data } = await apiClient.get<RegistroActividad[]>('/actividades-plomeria')
  return data
}

export async function crearActividadPlomeria(formulario: ActividadForm): Promise<RegistroActividad> {
  const { data } = await apiClient.post<RegistroActividad>('/actividades-plomeria', formulario)
  return data
}

export async function actualizarActividadPlomeria(
  id: string,
  formulario: ActividadForm,
): Promise<RegistroActividad> {
  const { data } = await apiClient.put<RegistroActividad>(`/actividades-plomeria/${id}`, formulario)
  return data
}

export async function cambiarEstadoActividadPlomeria(
  id: string,
  estado?: string,
): Promise<RegistroActividad> {
  const { data } = await apiClient.patch<RegistroActividad>(`/actividades-plomeria/${id}/estado`, estado ? { estado } : {})
  return data
}

export async function eliminarActividadPlomeria(id: string): Promise<void> {
  await apiClient.delete(`/actividades-plomeria/${id}`)
}

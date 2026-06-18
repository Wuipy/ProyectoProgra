export const TIPOS_AVERIA = [
  'Fuga de agua',
  'Tuberia dañada',
  'Falta de agua',
  'Medidor dañado',
  'Otro',
] as const

export const ESTADOS_AVERIA_ADMIN = [
  'Pendiente',
  'En revision',
  'Asignada',
  'En proceso',
  'Finalizada',
  'Cancelada',
  'No se pudo atender',
] as const

export const ESTADOS_AVERIA_FONTANERO = ['En proceso', 'Finalizada', 'No se pudo atender'] as const

export const PRIORIDADES_AVERIA = ['Baja', 'Media', 'Alta', 'Urgente'] as const

import { TIPOS_ACTIVIDAD_CAMPO } from './formulariosActividadFontanero'

export const TIPOS_ACTIVIDAD_FONTANERO = TIPOS_ACTIVIDAD_CAMPO

export const ESTADOS_MEDIDOR_VISITA = [
  'Bueno',
  'Dañado',
  'Nuevo',
  'Con fuga',
  'Sin fuga',
  'Requiere revision',
] as const

export const OPCIONES_SI_NO = ['Si', 'No'] as const

export const DIAMETROS_TUBERIA = ['1/2', '3/4', '1', 'Otro'] as const

export const OPCIONES_OLOR_SABOR = ['Normal', 'Anormal', 'Sin observacion'] as const

export const PRIORIDADES_SEGUIMIENTO = ['Baja', 'Media', 'Alta'] as const

export const ESTADOS_ACTIVIDAD_FONTANERO = ['Pendiente', 'En proceso', 'Finalizada'] as const

export const ESTADOS_VALIDACION_ACTIVIDAD = ['Pendiente', 'Validada', 'Rechazada'] as const

export const ESTADOS_LECTURA = [
  'Pendiente',
  'Registrada',
  'Con inconsistencia',
  'Revisada',
  'Validada',
  'Rechazada',
] as const

export const ESTADOS_MEDIDOR_LECTURA = [
  'Bueno',
  'Dañado',
  'Inaccesible',
  'Con posible fuga',
  'Cambiado',
  'No encontrado',
] as const

export const MOTIVOS_VISITA_LECTURA = [
  'Lectura mensual',
  'Inspeccion por consumo alto',
  'Revision por fuga',
  'Verificacion de medidor',
  'Otro',
] as const

export const RESULTADOS_INSPECCION_LECTURA = [
  'Medidor en buen estado',
  'Medidor no presenta fuga',
  'Se detecto posible fuga',
  'Medidor dañado',
  'Medidor inaccesible',
  'Se recomienda revision administrativa',
] as const

export const LIMITE_CONSUMO_ALTO_M3 = 50

export function claseEtiquetaEstado(valor: string) {
  return `etiqueta-estado etiqueta-${valor.replace(/\s+/g, '-').toLowerCase()}`
}

export function claseEtiquetaPrioridad(valor: string) {
  return `etiqueta-prioridad etiqueta-prioridad-${valor.toLowerCase()}`
}

export const PAGINA_TAMANIO = 8

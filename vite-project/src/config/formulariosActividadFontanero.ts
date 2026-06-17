import type { ActividadFontaneroForm, ActividadFontaneroItem } from '../servicios/landingService'

export type CategoriaFormularioActividad =
  | 'visita-campo'
  | 'toma-presion'
  | 'control-operativo'
  | 'actividad-general'

export const TIPOS_ACTIVIDAD_CAMPO = [
  'Visita de campo',
  'Toma de presion',
  'Control operativo',
  'Actividad general',
] as const

const MAPA_TIPO_A_FORMULARIO: Record<(typeof TIPOS_ACTIVIDAD_CAMPO)[number], CategoriaFormularioActividad> = {
  'Visita de campo': 'visita-campo',
  'Toma de presion': 'toma-presion',
  'Control operativo': 'control-operativo',
  'Actividad general': 'actividad-general',
}

export function formularioInicialActividad(tipo = ''): ActividadFontaneroForm {
  return {
    fechaActividad: new Date().toISOString().slice(0, 10),
    horaInicio: '',
    horaFin: '',
    tipo,
    descripcion: '',
    ubicacion: '',
    estado: 'Pendiente',
  }
}

export function obtenerCategoriaFormulario(tipo: string): CategoriaFormularioActividad | null {
  return MAPA_TIPO_A_FORMULARIO[tipo as (typeof TIPOS_ACTIVIDAD_CAMPO)[number]] ?? null
}

export function tituloFormularioEspecifico(categoria: CategoriaFormularioActividad) {
  switch (categoria) {
    case 'visita-campo':
      return 'Bitacora visita de campo'
    case 'toma-presion':
      return 'Toma de presion'
    case 'control-operativo':
      return 'Bitacora control operativo'
    case 'actividad-general':
      return 'Actividad general'
  }
}

export function actividadItemAFormulario(actividad: ActividadFontaneroItem): ActividadFontaneroForm {
  const categoria = obtenerCategoriaFormulario(actividad.tipo)
  const base = formularioInicialActividad(actividad.tipo)

  const formulario: ActividadFontaneroForm = {
    ...base,
    fechaActividad: actividad.fechaActividadIso ?? actividad.fechaActividad.slice(0, 10),
    horaInicio: actividad.horaInicio ?? '',
    horaFin: actividad.horaFin ?? '',
    descripcion: actividad.descripcion,
    ubicacion: actividad.ubicacion,
    estado: actividad.estado,
    abonadoNumero: actividad.abonadoNumero ?? undefined,
    nombreAbonado: actividad.nombreAbonado ?? undefined,
    lugarVisita: actividad.lugarVisita ?? undefined,
    motivoVisita: actividad.motivoVisita ?? undefined,
    lecturaAnteriorM3: actividad.lecturaAnteriorM3 ?? undefined,
    lecturaActualM3: actividad.lecturaActualM3 ?? undefined,
    consumoRegistradoM3: actividad.consumoRegistradoM3 ?? undefined,
    estadoMedidor: actividad.estadoMedidor ?? undefined,
    detectoFuga: actividad.detectoFuga ?? undefined,
    resultadoInspeccion: actividad.resultadoInspeccion ?? undefined,
    accionRecomendada: actividad.accionRecomendada ?? undefined,
    fotoMedidorNombre: actividad.fotoMedidorNombre ?? undefined,
    fotoMedidorBase64: actividad.fotoMedidorBase64 ?? undefined,
    aforoNumero: actividad.aforoNumero ?? undefined,
    lugarPrueba: actividad.lugarPrueba ?? undefined,
    horaPrueba: actividad.horaPrueba ?? undefined,
    resultadoPsi: actividad.resultadoPsi ?? undefined,
    diametroTuberia: actividad.diametroTuberia ?? undefined,
    observacionesPresion: actividad.observacionesPresion ?? undefined,
    pruebaNumero: actividad.pruebaNumero ?? undefined,
    lugarCasa: actividad.lugarCasa ?? undefined,
    horaControl: actividad.horaControl ?? undefined,
    cloroResidual: actividad.cloroResidual ?? undefined,
    turbiedad: actividad.turbiedad ?? undefined,
    ph: actividad.ph ?? undefined,
    olor: actividad.olor ?? undefined,
    sabor: actividad.sabor ?? undefined,
    observacionesControlOperativo: actividad.observacionesControlOperativo ?? undefined,
    detalleTrabajoRealizado: actividad.detalleTrabajoRealizado ?? undefined,
    resultadoTrabajo: actividad.resultadoTrabajo ?? undefined,
    requiereSeguimiento: actividad.requiereSeguimiento ?? undefined,
    prioridadSeguimiento: actividad.prioridadSeguimiento ?? undefined,
    fotoEvidenciaNombre: actividad.fotoEvidenciaNombre ?? undefined,
    fotoEvidenciaBase64: actividad.fotoEvidenciaBase64 ?? undefined,
  }

  if (categoria === 'visita-campo') {
    formulario.lugarVisita = formulario.lugarVisita ?? actividad.ubicacion
  }
  if (categoria === 'toma-presion') {
    formulario.lugarPrueba = formulario.lugarPrueba ?? actividad.ubicacion
    formulario.horaPrueba = formulario.horaPrueba ?? actividad.horaInicio ?? ''
  }
  if (categoria === 'control-operativo') {
    formulario.lugarCasa = formulario.lugarCasa ?? actividad.ubicacion
    formulario.horaControl = formulario.horaControl ?? actividad.horaInicio ?? ''
  }
  if (categoria === 'actividad-general') {
    formulario.detalleTrabajoRealizado =
      formulario.detalleTrabajoRealizado ?? actividad.descripcion
  }

  return formulario
}

export function validarFormularioActividad(formulario: ActividadFontaneroForm): string | null {
  if (!formulario.tipo.trim()) return 'Debe seleccionar un tipo de actividad.'
  const categoria = obtenerCategoriaFormulario(formulario.tipo)
  if (!categoria) return 'El tipo de actividad seleccionado no tiene un formulario disponible.'
  if (!formulario.fechaActividad?.trim()) return 'La fecha es obligatoria.'

  if (categoria === 'visita-campo') {
    if (!formulario.horaInicio?.trim()) return 'La hora de inicio es obligatoria.'
    if (formulario.horaFin?.trim() && formulario.horaFin <= formulario.horaInicio) {
      return 'La hora fin debe ser mayor que la hora inicio.'
    }
    if (!formulario.nombreAbonado?.trim()) return 'El nombre del abonado es obligatorio.'
    if (!formulario.lugarVisita?.trim()) return 'El lugar de la visita es obligatorio.'
    if (!formulario.motivoVisita?.trim()) return 'El motivo de visita es obligatorio.'
    if (!formulario.estadoMedidor?.trim()) return 'El estado del medidor es obligatorio.'
    if (!formulario.detectoFuga?.trim()) return 'Debe indicar si se detecto fuga.'
    if (!formulario.resultadoInspeccion?.trim()) return 'El resultado de la inspeccion es obligatorio.'
    if (
      formulario.lecturaAnteriorM3 != null &&
      formulario.lecturaActualM3 != null &&
      formulario.lecturaActualM3 < formulario.lecturaAnteriorM3
    ) {
      return 'La lectura actual no puede ser menor que la lectura anterior.'
    }
    return null
  }

  if (categoria === 'toma-presion') {
    if (!formulario.aforoNumero?.trim()) return 'El aforo N° es obligatorio.'
    if (!formulario.lugarPrueba?.trim()) return 'El lugar de la prueba es obligatorio.'
    if (!formulario.horaPrueba?.trim()) return 'La hora de la prueba es obligatoria.'
    if (formulario.resultadoPsi == null || Number.isNaN(formulario.resultadoPsi)) {
      return 'El resultado en PSI es obligatorio.'
    }
    if (formulario.resultadoPsi < 0) return 'El resultado en PSI no puede ser negativo.'
    if (!formulario.diametroTuberia?.trim()) return 'El diametro de tuberia es obligatorio.'
    return null
  }

  if (categoria === 'control-operativo') {
    if (!formulario.pruebaNumero?.trim()) return 'La prueba N° es obligatoria.'
    if (!formulario.lugarCasa?.trim()) return 'El lugar o casa es obligatorio.'
    if (!formulario.horaControl?.trim()) return 'La hora del control es obligatoria.'
    if (!formulario.cloroResidual?.trim()) return 'El cloro residual es obligatorio.'
    if (formulario.ph != null && (formulario.ph < 0 || formulario.ph > 14)) {
      return 'El pH debe estar entre 0 y 14.'
    }
    return null
  }

  if (!formulario.detalleTrabajoRealizado?.trim()) {
    return 'El detalle del trabajo realizado es obligatorio.'
  }

  return null
}

export function prepararPayloadActividad(formulario: ActividadFontaneroForm): ActividadFontaneroForm {
  const categoria = obtenerCategoriaFormulario(formulario.tipo)
  const base: ActividadFontaneroForm = {
    fechaActividad: formulario.fechaActividad,
    tipo: formulario.tipo,
    estado: 'Pendiente',
    descripcion: '',
    ubicacion: '',
    horaInicio: '',
    horaFin: undefined,
  }

  if (categoria === 'visita-campo') {
    const consumo =
      formulario.lecturaAnteriorM3 != null && formulario.lecturaActualM3 != null
        ? formulario.lecturaActualM3 - formulario.lecturaAnteriorM3
        : formulario.consumoRegistradoM3

    return {
      ...base,
      horaInicio: formulario.horaInicio?.trim(),
      horaFin: formulario.horaFin?.trim() || undefined,
      ubicacion: formulario.lugarVisita!.trim(),
      descripcion: [formulario.motivoVisita, formulario.resultadoInspeccion]
        .filter(Boolean)
        .join('. ')
        .trim(),
      abonadoNumero: formulario.abonadoNumero?.trim() || undefined,
      nombreAbonado: formulario.nombreAbonado?.trim(),
      lugarVisita: formulario.lugarVisita?.trim(),
      motivoVisita: formulario.motivoVisita?.trim(),
      lecturaAnteriorM3: formulario.lecturaAnteriorM3,
      lecturaActualM3: formulario.lecturaActualM3,
      consumoRegistradoM3: consumo,
      estadoMedidor: formulario.estadoMedidor?.trim(),
      detectoFuga: formulario.detectoFuga?.trim(),
      resultadoInspeccion: formulario.resultadoInspeccion?.trim(),
      accionRecomendada: formulario.accionRecomendada?.trim() || undefined,
      fotoMedidorNombre: formulario.fotoMedidorNombre,
      fotoMedidorBase64: formulario.fotoMedidorBase64,
    }
  }

  if (categoria === 'toma-presion') {
    const resumen = `Aforo ${formulario.aforoNumero}: ${formulario.resultadoPsi} PSI, tuberia ${formulario.diametroTuberia}`
    return {
      ...base,
      horaInicio: formulario.horaPrueba!.trim(),
      ubicacion: formulario.lugarPrueba!.trim(),
      descripcion: formulario.observacionesPresion?.trim() || resumen,
      aforoNumero: formulario.aforoNumero?.trim(),
      lugarPrueba: formulario.lugarPrueba?.trim(),
      horaPrueba: formulario.horaPrueba?.trim(),
      resultadoPsi: formulario.resultadoPsi,
      diametroTuberia: formulario.diametroTuberia?.trim(),
      observacionesPresion: formulario.observacionesPresion?.trim() || undefined,
    }
  }

  if (categoria === 'control-operativo') {
    const resumen = `Prueba ${formulario.pruebaNumero} - Cloro ${formulario.cloroResidual}`
    return {
      ...base,
      horaInicio: formulario.horaControl!.trim(),
      ubicacion: formulario.lugarCasa!.trim(),
      descripcion: formulario.observacionesControlOperativo?.trim() || resumen,
      pruebaNumero: formulario.pruebaNumero?.trim(),
      lugarCasa: formulario.lugarCasa?.trim(),
      horaControl: formulario.horaControl?.trim(),
      cloroResidual: formulario.cloroResidual?.trim(),
      turbiedad: formulario.turbiedad?.trim() || undefined,
      ph: formulario.ph,
      olor: formulario.olor?.trim() || undefined,
      sabor: formulario.sabor?.trim() || undefined,
      observacionesControlOperativo: formulario.observacionesControlOperativo?.trim() || undefined,
    }
  }

  if (categoria === 'actividad-general') {
    return {
      ...base,
      horaInicio: '08:00',
      ubicacion: 'San Juan',
      descripcion: formulario.detalleTrabajoRealizado!.trim(),
      detalleTrabajoRealizado: formulario.detalleTrabajoRealizado?.trim(),
      resultadoTrabajo: formulario.resultadoTrabajo?.trim() || undefined,
      requiereSeguimiento: formulario.requiereSeguimiento?.trim() || undefined,
      prioridadSeguimiento:
        formulario.requiereSeguimiento === 'Si'
          ? formulario.prioridadSeguimiento?.trim() || undefined
          : undefined,
      fotoEvidenciaNombre: formulario.fotoEvidenciaNombre,
      fotoEvidenciaBase64: formulario.fotoEvidenciaBase64,
    }
  }

  return base
}

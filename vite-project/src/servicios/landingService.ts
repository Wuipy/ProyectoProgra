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

let consecutivoAveria = 1
let consecutivoSolicitud = 1

const crearSeguimiento = (prefijo: string, consecutivo: number) =>
  `${prefijo}-${String(consecutivo).padStart(4, '0')}`

export function registrarAveria(_datos: DatosAveria) {
  const numeroSeguimiento = crearSeguimiento('AV', consecutivoAveria)
  consecutivoAveria += 1

  return {
    numeroSeguimiento,
    mensaje: `Reporte registrado correctamente. Numero de seguimiento: ${numeroSeguimiento}`,
  }
}

export function registrarSolicitud(_datos: DatosSolicitud) {
  const numeroSeguimiento = crearSeguimiento('SOL', consecutivoSolicitud)
  consecutivoSolicitud += 1

  return {
    numeroSeguimiento,
    mensaje: `Solicitud registrada correctamente. Numero de seguimiento: ${numeroSeguimiento}`,
  }
}

export function consultarSeguimiento(_numeroSeguimiento: string) {
  return 'Estado: En revision por la Secretaria Ejecutiva'
}

export const CLAVE_TOKEN_ADMIN = 'sigasj-admin-token'
export const CLAVE_ROL_USUARIO = 'sigasj-usuario-rol'
export const CLAVE_NOMBRE_USUARIO = 'sigasj-nombre-usuario'

export type RolUsuario = 'admin' | 'fontanero'

type RespuestaAuth = {
  token: string
  usuario: string
  rol: string
  mensaje: string
}

export function obtenerTokenAdmin() {
  return window.sessionStorage.getItem(CLAVE_TOKEN_ADMIN)
}

export function obtenerNombreUsuario() {
  return window.sessionStorage.getItem(CLAVE_NOMBRE_USUARIO) ?? ''
}

export function obtenerRolUsuario(): RolUsuario | null {
  const rol = window.sessionStorage.getItem(CLAVE_ROL_USUARIO)
  if (rol === 'admin' || rol === 'fontanero') return rol
  return null
}

export function tieneSesionActiva() {
  return Boolean(obtenerTokenAdmin())
}

export function tieneSesionAdmin() {
  return tieneSesionActiva()
}

export function esAdmin() {
  return obtenerRolUsuario() === 'admin'
}

export function esFontanero() {
  return obtenerRolUsuario() === 'fontanero'
}

export function puedeEliminarActividades() {
  return esAdmin()
}

export function puedeAccederPlomeria() {
  return esAdmin()
}

export function puedeAccederAverias() {
  return esAdmin() || esFontanero()
}

export function puedeAccederPanelAdmin() {
  return esAdmin()
}

export function puedeAccederPanelFontanero() {
  return esFontanero()
}

export function obtenerEtiquetaRol() {
  if (esAdmin()) return 'Administradora'
  if (esFontanero()) return 'Fontanero'
  return 'Usuario'
}

export function obtenerRutaInicioSesion() {
  if (esAdmin()) return '/admin/dashboard'
  if (esFontanero()) return '/fontanero/dashboard'
  return '/login'
}

function guardarSesion(data: RespuestaAuth) {
  window.sessionStorage.setItem(CLAVE_TOKEN_ADMIN, data.token)
  window.sessionStorage.setItem(CLAVE_ROL_USUARIO, data.rol)
  window.sessionStorage.setItem(CLAVE_NOMBRE_USUARIO, data.usuario)
}

export async function iniciarSesionAdmin(usuario: string, contrasena: string) {
  const { apiClient } = await import('./apiClient')

  try {
    const { data } = await apiClient.post<RespuestaAuth>('/auth/login', {
      usuario,
      contrasena,
    })

    guardarSesion(data)
    return true
  } catch {
    cerrarSesionAdmin()
    return false
  }
}

export function cerrarSesionAdmin() {
  window.sessionStorage.removeItem(CLAVE_TOKEN_ADMIN)
  window.sessionStorage.removeItem(CLAVE_ROL_USUARIO)
  window.sessionStorage.removeItem(CLAVE_NOMBRE_USUARIO)
}

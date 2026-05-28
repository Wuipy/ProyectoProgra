export const CLAVE_SESION_ADMIN = 'sigasj-admin-auth'

export function tieneSesionAdmin() {
  window.localStorage.removeItem(CLAVE_SESION_ADMIN)
  return window.sessionStorage.getItem(CLAVE_SESION_ADMIN) === 'activa'
}

export function iniciarSesionAdmin(usuario: string, contrasena: string) {
  const credencialesValidas = usuario.trim() === 'admin' && contrasena === 'admin1234'

  if (credencialesValidas) {
    window.localStorage.removeItem(CLAVE_SESION_ADMIN)
    window.sessionStorage.setItem(CLAVE_SESION_ADMIN, 'activa')
  }

  return credencialesValidas
}

export function cerrarSesionAdmin() {
  window.localStorage.removeItem(CLAVE_SESION_ADMIN)
  window.sessionStorage.removeItem(CLAVE_SESION_ADMIN)
}

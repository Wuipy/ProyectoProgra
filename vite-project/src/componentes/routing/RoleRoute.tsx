import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { obtenerRolUsuario, obtenerRutaInicioSesion, RolUsuario, tieneSesionActiva } from '../../lib/auth'

type RoleRouteProps = {
  rolesPermitidos: RolUsuario[]
  children: ReactNode
}

export function RoleRoute({ rolesPermitidos, children }: RoleRouteProps) {
  if (!tieneSesionActiva()) {
    return <Navigate to="/login" replace />
  }

  const rol = obtenerRolUsuario()
  if (!rol || !rolesPermitidos.includes(rol)) {
    return <Navigate to={obtenerRutaInicioSesion()} replace />
  }

  return <>{children}</>
}

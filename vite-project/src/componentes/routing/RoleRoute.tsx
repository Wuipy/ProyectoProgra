import { ReactNode } from 'react'
import { AdminDashboard } from '../../paginas/admin/AdminDashboard'
import { FontaneroDashboard } from '../../paginas/fontanero/FontaneroDashboard'
import { PaginaLoginAdmin } from '../../paginas/PaginaLoginAdmin'
import {
  esAdmin,
  esFontanero,
  obtenerRolUsuario,
  obtenerRutaInicioSesion,
  RolUsuario,
  tieneSesionActiva,
} from '../../servicios/authAdmin'

type RoleRouteProps = {
  rolesPermitidos: RolUsuario[]
  children: ReactNode
}

function renderDashboardPorRol() {
  if (esAdmin()) return <AdminDashboard />
  if (esFontanero()) return <FontaneroDashboard />
  return <PaginaLoginAdmin />
}

export function RoleRoute({ rolesPermitidos, children }: RoleRouteProps) {
  if (!tieneSesionActiva()) {
    window.history.replaceState(null, '', '/login')
    return <PaginaLoginAdmin />
  }

  const rol = obtenerRolUsuario()
  if (!rol || !rolesPermitidos.includes(rol)) {
    const destino = obtenerRutaInicioSesion()
    window.history.replaceState(null, '', destino)
    return renderDashboardPorRol()
  }

  return <>{children}</>
}

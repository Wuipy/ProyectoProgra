import { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RoleRoute } from '../componentes/routing/RoleRoute'
import { MODULOS_ADMIN, MODULOS_FONTANERO } from '../config/navegacionInterna'
import { AdminDashboard } from '../paginas/admin/AdminDashboard'
import { PaginaAdminActividadesFontanero } from '../paginas/admin/PaginaAdminActividadesFontanero'
import { PaginaAdminAverias } from '../paginas/admin/PaginaAdminAverias'
import { PaginaAdminLecturasMedidor } from '../paginas/admin/PaginaAdminLecturasMedidor'
import { FontaneroDashboard } from '../paginas/fontanero/FontaneroDashboard'
import { PaginaFontaneroActividades } from '../paginas/fontanero/PaginaFontaneroActividades'
import { PaginaFontaneroAverias } from '../paginas/fontanero/PaginaFontaneroAverias'
import { PaginaFontaneroLecturas } from '../paginas/fontanero/PaginaFontaneroLecturas'
import { PaginaModuloPlaceholder } from '../paginas/PaginaModuloPlaceholder'
import { PaginaInicio } from '../paginas/publicas/PaginaInicio'
import { PaginaLoginAdmin } from '../paginas/publicas/PaginaLoginAdmin'
import { PaginaReportarAveria } from '../paginas/publicas/PaginaReportarAveria'

function RutaProtegidaAdmin({ children }: { children: ReactNode }) {
  return <RoleRoute rolesPermitidos={['admin']}>{children}</RoleRoute>
}

function RutaProtegidaFontanero({ children }: { children: ReactNode }) {
  return <RoleRoute rolesPermitidos={['fontanero']}>{children}</RoleRoute>
}

export function AppRouter() {
  const placeholdersAdmin = MODULOS_ADMIN.filter((modulo) => !modulo.disponible)
  const placeholdersFontanero = MODULOS_FONTANERO.filter((modulo) => !modulo.disponible)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/login" element={<PaginaLoginAdmin />} />
        <Route path="/reportar-averia" element={<PaginaReportarAveria />} />

        <Route
          path="/admin/dashboard"
          element={
            <RutaProtegidaAdmin>
              <AdminDashboard />
            </RutaProtegidaAdmin>
          }
        />
        <Route
          path="/admin/averias"
          element={
            <RutaProtegidaAdmin>
              <PaginaAdminAverias />
            </RutaProtegidaAdmin>
          }
        />
        <Route
          path="/admin/actividades-fontanero"
          element={
            <RutaProtegidaAdmin>
              <PaginaAdminActividadesFontanero />
            </RutaProtegidaAdmin>
          }
        />
        <Route
          path="/admin/lecturas-medidores"
          element={
            <RutaProtegidaAdmin>
              <PaginaAdminLecturasMedidor />
            </RutaProtegidaAdmin>
          }
        />
        {placeholdersAdmin.map((modulo) => (
          <Route
            key={modulo.id}
            path={modulo.ruta}
            element={
              <RutaProtegidaAdmin>
                <PaginaModuloPlaceholder
                  rol="admin"
                  titulo={modulo.titulo}
                  descripcion={modulo.descripcion}
                />
              </RutaProtegidaAdmin>
            }
          />
        ))}

        <Route
          path="/fontanero/dashboard"
          element={
            <RutaProtegidaFontanero>
              <FontaneroDashboard />
            </RutaProtegidaFontanero>
          }
        />
        <Route
          path="/fontanero/averias-asignadas"
          element={
            <RutaProtegidaFontanero>
              <PaginaFontaneroAverias />
            </RutaProtegidaFontanero>
          }
        />
        <Route path="/fontanero/averias" element={<Navigate to="/fontanero/averias-asignadas" replace />} />
        <Route
          path="/fontanero/actividades"
          element={
            <RutaProtegidaFontanero>
              <PaginaFontaneroActividades />
            </RutaProtegidaFontanero>
          }
        />
        <Route
          path="/fontanero/lecturas-medidores"
          element={
            <RutaProtegidaFontanero>
              <PaginaFontaneroLecturas />
            </RutaProtegidaFontanero>
          }
        />
        <Route path="/fontanero/lecturas" element={<Navigate to="/fontanero/lecturas-medidores" replace />} />
        {placeholdersFontanero.map((modulo) => (
          <Route
            key={modulo.id}
            path={modulo.ruta}
            element={
              <RutaProtegidaFontanero>
                <PaginaModuloPlaceholder
                  rol="fontanero"
                  titulo={modulo.titulo}
                  descripcion={modulo.descripcion}
                />
              </RutaProtegidaFontanero>
            }
          />
        ))}

        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/fontanero/*" element={<Navigate to="/fontanero/dashboard" replace />} />
        <Route path="*" element={<PaginaInicio />} />
      </Routes>
    </BrowserRouter>
  )
}

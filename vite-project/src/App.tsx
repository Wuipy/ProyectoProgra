import { RoleRoute } from './componentes/routing/RoleRoute'

import { AdminDashboard } from './paginas/admin/AdminDashboard'

import { PaginaAdminActividadesFontanero } from './paginas/admin/PaginaAdminActividadesFontanero'

import { PaginaAdminAverias } from './paginas/admin/PaginaAdminAverias'

import { PaginaAdminLecturasMedidor } from './paginas/admin/PaginaAdminLecturasMedidor'

import { PaginaModuloEnDesarrollo } from './paginas/admin/PaginaModuloEnDesarrollo'

import { FontaneroDashboard } from './paginas/fontanero/FontaneroDashboard'

import { PaginaModuloFontaneroPlaceholder } from './paginas/fontanero/PaginaModuloFontaneroPlaceholder'

import { PaginaFontaneroActividades } from './paginas/PaginaFontaneroActividades'

import { PaginaFontaneroAverias } from './paginas/PaginaFontaneroAverias'

import { PaginaFontaneroLecturas } from './paginas/PaginaFontaneroLecturas'

import { PaginaLoginAdmin } from './paginas/PaginaLoginAdmin'

import { PaginaReportarAveria } from './paginas/PaginaReportarAveria'

import { PublicPortal } from './paginas/PublicPortal'

import './App.css'
import './estilos/modulosInternos.css'



function App() {

  const ruta = window.location.pathname



  if (ruta === '/login') {

    return <PaginaLoginAdmin />

  }



  if (ruta === '/' || ruta === '') {

    return <PublicPortal />

  }



  if (ruta === '/reportar-averia') {

    return <PaginaReportarAveria />

  }



  if (ruta === '/admin/dashboard') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <AdminDashboard />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/averias') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaAdminAverias />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/actividades-fontanero') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaAdminActividadesFontanero />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/lecturas-medidores') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaAdminLecturasMedidor />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/abonados') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaModuloEnDesarrollo

          titulo="Gestion de abonados"

          descripcion="Administracion de abonados, medidores y datos de facturacion comunal."

        />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/solicitudes') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaModuloEnDesarrollo

          titulo="Gestion de solicitudes de servicio"

          descripcion="Bandeja administrativa para revisar y dar seguimiento a solicitudes publicas."

        />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/proyectos') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaModuloEnDesarrollo

          titulo="Gestion de proyectos"

          descripcion="Publicacion y mantenimiento de proyectos comunitarios visibles en el portal."

        />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/inventario') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaModuloEnDesarrollo

          titulo="Gestion de inventario"

          descripcion="Control de materiales, repuestos y movimientos de almacen."

        />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/reportes') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaModuloEnDesarrollo

          titulo="Reportes generales"

          descripcion="Indicadores operativos y reportes consolidados del acueducto."

        />

      </RoleRoute>

    )

  }



  if (ruta === '/admin/usuarios') {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <PaginaModuloEnDesarrollo

          titulo="Usuarios y roles"

          descripcion="Administracion de cuentas internas, roles y permisos del sistema."

        />

      </RoleRoute>

    )

  }



  if (ruta === '/fontanero/dashboard') {

    return (

      <RoleRoute rolesPermitidos={['fontanero']}>

        <FontaneroDashboard />

      </RoleRoute>

    )

  }



  if (ruta === '/fontanero/averias-asignadas' || ruta === '/fontanero/averias') {

    return (

      <RoleRoute rolesPermitidos={['fontanero']}>

        <PaginaFontaneroAverias />

      </RoleRoute>

    )

  }



  if (ruta === '/fontanero/actividades') {

    return (

      <RoleRoute rolesPermitidos={['fontanero']}>

        <PaginaFontaneroActividades />

      </RoleRoute>

    )

  }



  if (ruta === '/fontanero/lecturas-medidores' || ruta === '/fontanero/lecturas') {

    return (

      <RoleRoute rolesPermitidos={['fontanero']}>

        <PaginaFontaneroLecturas />

      </RoleRoute>

    )

  }



  if (ruta === '/fontanero/materiales') {

    return (

      <RoleRoute rolesPermitidos={['fontanero']}>

        <PaginaModuloFontaneroPlaceholder

          titulo="Materiales utilizados"

          descripcion="Control de salidas y consumo de materiales por intervencion."

        />

      </RoleRoute>

    )

  }



  if (ruta === '/fontanero/trabajos') {

    return (

      <RoleRoute rolesPermitidos={['fontanero']}>

        <PaginaModuloFontaneroPlaceholder

          titulo="Estado de trabajos realizados"

          descripcion="Resumen del avance y cierre de trabajos en campo."

        />

      </RoleRoute>

    )

  }



  if (ruta.startsWith('/admin/')) {

    return (

      <RoleRoute rolesPermitidos={['admin']}>

        <AdminDashboard />

      </RoleRoute>

    )

  }



  if (ruta.startsWith('/fontanero/')) {

    return (

      <RoleRoute rolesPermitidos={['fontanero']}>

        <FontaneroDashboard />

      </RoleRoute>

    )

  }



  return <PublicPortal />

}



export default App



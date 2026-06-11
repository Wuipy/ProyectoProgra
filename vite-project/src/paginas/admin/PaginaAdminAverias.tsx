import { GestionAveriasAdmin } from '../../componentes/GestionAveriasAdmin'
import { HeroModuloInterno } from '../../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_ADMIN } from '../../config/navegacionInterna'

export function PaginaAdminAverias() {
  return (
    <LayoutPanelInterno
      rol="admin"
      tituloPanel="Panel administrativo"
      modulos={MODULOS_ADMIN}
      rutaDashboard="/admin/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Modulo administrativo"
        titulo="Gestion de reportes de averias"
        descripcion="Supervise los reportes recibidos, revise asignaciones y el avance del equipo de fontaneros."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Reportes AV"
        resumenDescripcion="Seguimiento de fugas, rupturas, baja presion y otros incidentes reportados."
      />

      <GestionAveriasAdmin />
    </LayoutPanelInterno>
  )
}

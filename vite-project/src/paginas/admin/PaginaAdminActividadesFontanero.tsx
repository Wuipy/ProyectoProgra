import { GestionActividadesFontaneroAdmin } from '../../componentes/GestionActividadesFontaneroAdmin'
import { HeroModuloInterno } from '../../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_ADMIN } from '../../config/navegacionInterna'

export function PaginaAdminActividadesFontanero() {
  return (
    <LayoutPanelInterno
      rol="admin"
      tituloPanel="Panel administrativo"
      modulos={MODULOS_ADMIN}
      rutaDashboard="/admin/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Supervision de campo"
        titulo="Actividades de campo"
        descripcion="Consulte y valide las actividades que el fontanero registra en terreno con los formularios de bitacora."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Bitacora unificada"
        resumenDescripcion="Visita de campo, toma de presion, control operativo y actividades generales."
      />
      <GestionActividadesFontaneroAdmin />
    </LayoutPanelInterno>
  )
}

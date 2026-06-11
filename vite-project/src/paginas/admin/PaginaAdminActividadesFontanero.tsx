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
        titulo="Validacion de bitacora"
        descripcion="Consulte los registros que el fontanero envia desde su panel. Solo puede validar o rechazar; no crear actividades aqui."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Bitacora fontanero"
        resumenDescripcion="Reparaciones, lecturas, mantenimiento y otros trabajos registrados en terreno."
      />
      <GestionActividadesFontaneroAdmin />
    </LayoutPanelInterno>
  )
}

import { GestionLecturasMedidorAdmin } from '../../componentes/GestionLecturasMedidorAdmin'
import { HeroModuloInterno } from '../../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_ADMIN } from '../../config/navegacionInterna'

export function PaginaAdminLecturasMedidor() {
  return (
    <LayoutPanelInterno
      rol="admin"
      tituloPanel="Panel administrativo"
      modulos={MODULOS_ADMIN}
      rutaDashboard="/admin/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Control de consumo"
        titulo="Lecturas de medidores"
        descripcion="Revise lecturas registradas, inconsistencias e historial por abonado."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Lecturas"
        resumenDescripcion="Gestion de consumo, alertas y correccion administrativa."
      />
      <GestionLecturasMedidorAdmin />
    </LayoutPanelInterno>
  )
}

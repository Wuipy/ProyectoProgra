import { RegistroActividadesPlomeria } from '../componentes/RegistroActividadesPlomeria'
import { HeroModuloInterno } from '../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../componentes/layout/LayoutPanelInterno'
import { MODULOS_ADMIN } from '../config/navegacionInterna'

export function PaginaAdminPlomeria() {
  return (
    <LayoutPanelInterno
      rol="admin"
      tituloPanel="Panel administrativo"
      modulos={MODULOS_ADMIN}
      rutaDashboard="/admin/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Gestion interna"
        titulo="Trabajos internos ASADA"
        descripcion="Planificacion y seguimiento de la oficina administrativa. Es independiente de la bitacora que el fontanero registra en su panel."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Plomeria interna"
        resumenDescripcion="Fugas, presion, aforos y control operativo gestionados por la administracion."
      />

      <RegistroActividadesPlomeria />
    </LayoutPanelInterno>
  )
}

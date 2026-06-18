import { RegistroActividadesFontanero } from '../../componentes/RegistroActividadesFontanero'
import { HeroModuloInterno } from '../../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_FONTANERO } from '../../config/navegacionInterna'

export function PaginaFontaneroActividades() {
  return (
    <LayoutPanelInterno
      rol="fontanero"
      tituloPanel="Panel operativo"
      modulos={MODULOS_FONTANERO}
      rutaDashboard="/fontanero/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Bitacora diaria"
        titulo="Actividades de campo"
        descripcion="Registre trabajos realizados, vincule averias o lecturas y documente materiales utilizados."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Actividades"
        resumenDescripcion="Registro personal de trabajo en terreno."
      />
      <RegistroActividadesFontanero />
    </LayoutPanelInterno>
  )
}

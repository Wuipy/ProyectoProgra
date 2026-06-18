import { GestionAveriasFontanero } from '../../componentes/GestionAveriasFontanero'
import { HeroModuloInterno } from '../../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_FONTANERO } from '../../config/navegacionInterna'

export function PaginaFontaneroAverias() {
  return (
    <LayoutPanelInterno
      rol="fontanero"
      tituloPanel="Panel operativo"
      modulos={MODULOS_FONTANERO}
      rutaDashboard="/fontanero/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Modulo operativo"
        titulo="Averias asignadas"
        descripcion="Atienda los reportes que la administradora le asigno. Registre trabajo, materiales y evidencia."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Reportes AV"
        resumenDescripcion="Solo averias asignadas a su usuario."
      />
      <GestionAveriasFontanero />
    </LayoutPanelInterno>
  )
}

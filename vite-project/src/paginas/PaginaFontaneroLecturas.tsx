import { RegistroLecturasMedidor } from '../componentes/RegistroLecturasMedidor'
import { HeroModuloInterno } from '../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../componentes/layout/LayoutPanelInterno'
import { MODULOS_FONTANERO } from '../config/navegacionInterna'

export function PaginaFontaneroLecturas() {
  return (
    <LayoutPanelInterno
      rol="fontanero"
      tituloPanel="Panel operativo"
      modulos={MODULOS_FONTANERO}
      rutaDashboard="/fontanero/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Lecturas de campo"
        titulo="Lecturas de medidores"
        descripcion="Registre lecturas asignadas. El consumo se calcula automaticamente."
        resumenEtiqueta="Modulo activo"
        resumenTitulo="Medidores"
        resumenDescripcion="Control de consumo por abonado."
      />
      <RegistroLecturasMedidor />
    </LayoutPanelInterno>
  )
}

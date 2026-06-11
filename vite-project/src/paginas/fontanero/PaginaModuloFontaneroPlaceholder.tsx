import { HeroModuloInterno } from '../../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_FONTANERO } from '../../config/navegacionInterna'

type PaginaModuloFontaneroPlaceholderProps = {
  titulo: string
  descripcion: string
}

export function PaginaModuloFontaneroPlaceholder({
  titulo,
  descripcion,
}: PaginaModuloFontaneroPlaceholderProps) {
  return (
    <LayoutPanelInterno
      rol="fontanero"
      tituloPanel="Panel operativo"
      modulos={MODULOS_FONTANERO}
      rutaDashboard="/fontanero/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Modulo operativo"
        titulo={titulo}
        descripcion={descripcion}
        resumenEtiqueta="Estado"
        resumenTitulo="En desarrollo"
        resumenDescripcion="Este modulo sera habilitado para el equipo de campo proximamente."
      />

      <section className="banda-modulo-placeholder contenedor">
        <div className="panel-modulo-placeholder">
          <h2>Modulo en preparacion</h2>
          <p>
            La funcionalidad de <strong>{titulo}</strong> aun no esta disponible. Puede volver al
            dashboard operativo para acceder a sus tareas activas.
          </p>
          <a className="boton primario" href="/fontanero/dashboard">
            Volver al dashboard
          </a>
        </div>
      </section>
    </LayoutPanelInterno>
  )
}

import { HeroModuloInterno } from '../../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_ADMIN } from '../../config/navegacionInterna'

type PaginaModuloEnDesarrolloProps = {
  titulo: string
  descripcion: string
}

export function PaginaModuloEnDesarrollo({ titulo, descripcion }: PaginaModuloEnDesarrolloProps) {
  return (
    <LayoutPanelInterno
      rol="admin"
      tituloPanel="Panel administrativo"
      modulos={MODULOS_ADMIN}
      rutaDashboard="/admin/dashboard"
    >
      <HeroModuloInterno
        etiqueta="Modulo administrativo"
        titulo={titulo}
        descripcion={descripcion}
        resumenEtiqueta="Estado"
        resumenTitulo="En desarrollo"
        resumenDescripcion="Este modulo sera habilitado en una proxima version del sistema."
      />

      <section className="banda-modulo-placeholder contenedor">
        <div className="panel-modulo-placeholder">
          <h2>Modulo en preparacion</h2>
          <p>
            La funcionalidad de <strong>{titulo}</strong> aun no esta disponible. Puede volver al
            dashboard administrativo para acceder a los modulos activos.
          </p>
          <a className="boton primario" href="/admin/dashboard">
            Volver al dashboard
          </a>
        </div>
      </section>
    </LayoutPanelInterno>
  )
}

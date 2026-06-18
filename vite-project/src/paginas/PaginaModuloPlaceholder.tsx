import { Link } from 'react-router-dom'
import { HeroModuloInterno } from '../componentes/layout/HeroModuloInterno'
import { LayoutPanelInterno } from '../componentes/layout/LayoutPanelInterno'
import { MODULOS_ADMIN, MODULOS_FONTANERO } from '../config/navegacionInterna'
import type { RolUsuario } from '../lib/auth'

type PaginaModuloPlaceholderProps = {
  rol: RolUsuario
  titulo: string
  descripcion: string
}

export function PaginaModuloPlaceholder({ rol, titulo, descripcion }: PaginaModuloPlaceholderProps) {
  const esAdmin = rol === 'admin'
  const rutaDashboard = esAdmin ? '/admin/dashboard' : '/fontanero/dashboard'

  return (
    <LayoutPanelInterno
      rol={rol}
      tituloPanel={esAdmin ? 'Panel administrativo' : 'Panel operativo'}
      modulos={esAdmin ? MODULOS_ADMIN : MODULOS_FONTANERO}
      rutaDashboard={rutaDashboard}
    >
      <HeroModuloInterno
        etiqueta={esAdmin ? 'Modulo administrativo' : 'Modulo operativo'}
        titulo={titulo}
        descripcion={descripcion}
        resumenEtiqueta="Estado"
        resumenTitulo="En desarrollo"
        resumenDescripcion={
          esAdmin
            ? 'Este modulo sera habilitado en una proxima version del sistema.'
            : 'Este modulo sera habilitado para el equipo de campo proximamente.'
        }
      />

      <section className="banda-modulo-placeholder contenedor">
        <div className="panel-modulo-placeholder">
          <h2>Modulo en preparacion</h2>
          <p>
            La funcionalidad de <strong>{titulo}</strong> aun no esta disponible. Puede volver al
            dashboard para acceder a los modulos activos.
          </p>
          <Link className="boton primario" to={rutaDashboard}>
            Volver al dashboard
          </Link>
        </div>
      </section>
    </LayoutPanelInterno>
  )
}

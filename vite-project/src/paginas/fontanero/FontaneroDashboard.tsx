import { LayoutPanelInterno } from '../../componentes/layout/LayoutPanelInterno'
import { MODULOS_FONTANERO } from '../../config/navegacionInterna'

export function FontaneroDashboard() {
  return (
    <LayoutPanelInterno
      rol="fontanero"
      tituloPanel="Panel operativo"
      modulos={MODULOS_FONTANERO}
      rutaDashboard="/fontanero/dashboard"
    >
      <section className="dashboard-interno dashboard-fontanero">
        <div className="dashboard-interno-encabezado">
          <p className="etiqueta">Dashboard operativo</p>
          <h1>Trabajos y actividades de campo</h1>
          <p>
            Consulte sus averias asignadas, registre actividades y lleve el control de materiales y
            lecturas correspondientes a su jornada.
          </p>
        </div>

        <div className="grilla-modulos-dashboard">
          {MODULOS_FONTANERO.map((modulo) => (
            <article key={modulo.id} className="tarjeta-modulo-dashboard">
              <span className="tarjeta-modulo-etiqueta">
                {modulo.disponible ? 'Disponible' : 'En desarrollo'}
              </span>
              <h2>{modulo.titulo}</h2>
              <p>{modulo.descripcion}</p>
              {modulo.disponible ? (
                <a className="boton primario" href={modulo.ruta}>
                  Abrir modulo
                </a>
              ) : (
                <span className="boton secundario deshabilitado" aria-disabled="true">
                  Proximamente
                </span>
              )}
            </article>
          ))}
        </div>
      </section>
    </LayoutPanelInterno>
  )
}

export function SeccionQuienesSomos() {
  return (
    <section className="seccion seccion-dividida" id="quienes-somos">
      <div className="contenedor bloque-quienes">
        <div>
          <p className="etiqueta">Quienes somos</p>
          <h2>ASADA San Juan de Santa Cruz</h2>
        </div>
        <div>
          <p>
            La ASADA San Juan administra, opera y mantiene el sistema de acueducto
            comunal, garantizando el suministro de agua potable a sus abonados y
            fortaleciendo la atencion de tramites mediante herramientas digitales.
          </p>
          <div className="indicadores-asada" aria-label="Indicadores generales de la ASADA">
            <div>
              <strong>Digital</strong>
              <span>Tramites publicos centralizados</span>
            </div>
            <div>
              <strong>Comunal</strong>
              <span>Servicio administrado localmente</span>
            </div>
            <div>
              <strong>Transparente</strong>
              <span>Consulta de seguimiento disponible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

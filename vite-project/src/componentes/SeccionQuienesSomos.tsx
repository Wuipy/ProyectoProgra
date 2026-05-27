import logoAsadaSanJuan from '../assets/logo-asada-san-juan.png'

export function SeccionQuienesSomos() {
  return (
    <section className="seccion seccion-dividida" id="quienes-somos">
      <div className="contenedor bloque-quienes">
        <div className="quienes-titulo">
          <img className="quienes-logo" src={logoAsadaSanJuan} alt="Logo ASADA San Juan" />
          <p className="etiqueta">Quienes somos</p>
          <h2>ASADA San Juan de Santa Cruz</h2>
          <span>Acueducto comunal</span>
        </div>
        <div className="quienes-detalle">
          <p>
            La ASADA San Juan administra, opera y mantiene el sistema de acueducto
            comunal, garantizando el suministro de agua potable a sus abonados y
            fortaleciendo la atencion de tramites mediante herramientas digitales.
          </p>
          <div className="indicadores-asada" aria-label="Indicadores generales de la ASADA">
            <div>
              <strong>Digital</strong>
              <span>Tramites publicos centralizados para reportar, solicitar y consultar.</span>
            </div>
            <div>
              <strong>Comunal</strong>
              <span>Servicio administrado localmente con atencion cercana al abonado.</span>
            </div>
            <div>
              <strong>Transparente</strong>
              <span>Seguimiento disponible para solicitudes y reportes enviados.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

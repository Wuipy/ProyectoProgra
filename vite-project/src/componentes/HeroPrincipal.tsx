import mascotaAsada from '../assets/gotin-transparente.png'

export function HeroPrincipal() {
  return (
    <section className="hero-principal" id="inicio">
      <div className="contenedor hero-contenido">
        <div className="hero-texto">
          <p className="etiqueta">Gestion publica del acueducto comunal</p>
          <h1>
            Sistema de Gestion del Acueducto <span>ASADA San Juan</span>
          </h1>
          <p>
            SIGASJ mejora la atencion, la comunicacion y la gestion de tramites
            para los abonados de la ASADA San Juan de Santa Cruz.
          </p>
          <div className="hero-puntos" aria-label="Beneficios principales de SIGASJ">
            <span>Atencion comunal</span>
            <span>Reportes en linea</span>
            <span>Seguimiento publico</span>
          </div>
          <div className="acciones-hero">
            <a className="boton primario boton-solicitar" href="#solicitar-servicio">
              Solicitar servicio
            </a>
            <a className="boton secundario boton-averia" href="#reportar-averia">
              Reportar averia
            </a>
            <a className="boton claro boton-ingresar" href="/login">
              Panel administrativo
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Resumen de servicios SIGASJ">
          <div className="tarjeta-operativa">
            <div className="cabecera-operativa">
              <span>SIGASJ</span>
              <strong>Portal publico</strong>
            </div>
            <div className="escena-operativa">
              <div className="estado-acueducto" aria-hidden="true">
                <svg className="tanque-svg" viewBox="0 0 260 165">
                  <rect className="tanque-soporte" x="56" y="132" width="148" height="10" rx="5" />
                  <line className="tanque-pata" x1="78" y1="142" x2="62" y2="160" />
                  <line className="tanque-pata" x1="182" y1="142" x2="198" y2="160" />
                  <rect className="tanque-cuerpo" x="54" y="24" width="152" height="112" rx="18" />
                  <path className="tanque-agua" d="M55 92c23-12 46-12 68 0s45 12 82-3v29c0 10-8 18-18 18H73c-10 0-18-8-18-18V92Z" />
                  <path className="tanque-brillo" d="M78 45h76" />
                  <circle className="gota-estado" cx="223" cy="73" r="18" />
                  <path className="gota-icono" d="M223 58c-9 11-13 18-13 24a13 13 0 0 0 26 0c0-6-4-13-13-24Z" />
                  <path className="tuberia" d="M206 123h24c8 0 14 6 14 14v14" />
                  <circle className="valvula" cx="230" cy="123" r="8" />
                </svg>
                <div className="lectura-acueducto">
                  <strong>Servicio activo</strong>
                  <span>Nivel de tanque: 82%</span>
                </div>
              </div>
              <img className="mascota-asada" src={mascotaAsada} alt="Mascota ASADA San Juan" />
            </div>
            <p className="estado-agua">Monitoreo comunal del abastecimiento</p>
          </div>

        </div>
      </div>
      <div className="panel-hero" aria-label="Indicadores publicos de SIGASJ">
        <div className="contenedor panel-hero-contenido">
          <div>
            <span>24/7</span>
            <p>Recepcion de reportes publicos</p>
          </div>
          <div>
            <span>AV-0001</span>
            <p>Seguimiento de averias en linea</p>
          </div>
          <div>
            <span>SOL-0001</span>
            <p>Solicitudes listas para revision</p>
          </div>
        </div>
      </div>
    </section>
  )
}

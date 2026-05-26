import logoAsada from '../assets/logo-asada.svg'

export function SeccionContacto() {
  return (
    <section className="seccion contacto" id="contacto">
      <div className="contenedor contacto-contenido">
        <div>
          <p className="etiqueta">Contacto</p>
          <h2>ASADA San Juan de Santa Cruz</h2>
          <p>
            Para consultas administrativas, reportes urgentes o informacion de tramites,
            puede comunicarse por los canales oficiales.
          </p>
        </div>

        <div className="tarjeta datos-contacto">
          <div className="identidad-contacto">
            <img src={logoAsada} alt="Logo ASADA San Juan" />
          </div>
          <p>
            <strong>Telefono:</strong> 8560-7584
          </p>
          <p>
            <strong>Correo:</strong> asadasanjuan24@gmail.com
          </p>
          <p>
            <strong>Horario:</strong> Lunes a Sabado, 8:00 a.m. a 11:30 p.m.
          </p>
          <p>
            <strong>Direccion:</strong> San Juan de Santa Cruz, Guanacaste.
          </p>
          <a className="boton whatsapp" href="https://wa.me/50600000000" target="_blank" rel="noreferrer">
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

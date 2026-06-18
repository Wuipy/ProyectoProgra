import { Encabezado } from '../../componentes/Encabezado'
import { FormularioAveria } from '../../componentes/FormularioAveria'
import { PiePagina } from '../../componentes/PiePagina'

export function PaginaReportarAveria() {
  return (
    <div className="pagina pagina-landing">
      <Encabezado />
      <main className="contenedor pagina-reportar-averia">
        <section className="encabezado-seccion">
          <p className="etiqueta">Portal publico</p>
          <h1>Reportar averia</h1>
          <p>Registre un incidente del servicio de agua. Recibira un numero de seguimiento al enviar el formulario.</p>
        </section>
        <FormularioAveria />
      </main>
      <PiePagina />
    </div>
  )
}

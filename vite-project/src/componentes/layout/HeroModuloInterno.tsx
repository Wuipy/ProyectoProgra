type HeroModuloInternoProps = {
  etiqueta: string
  titulo: string
  descripcion: string
  resumenEtiqueta: string
  resumenTitulo: string
  resumenDescripcion: string
}

export function HeroModuloInterno({
  etiqueta,
  titulo,
  descripcion,
  resumenEtiqueta,
  resumenTitulo,
  resumenDescripcion,
}: HeroModuloInternoProps) {
  return (
    <section className="hero-admin">
      <div className="contenedor hero-admin-contenido">
        <div>
          <p className="etiqueta">{etiqueta}</p>
          <h1>{titulo}</h1>
          <p>{descripcion}</p>
        </div>

        <aside className="tarjeta-admin-resumen" aria-label="Resumen del modulo">
          <span>{resumenEtiqueta}</span>
          <strong>{resumenTitulo}</strong>
          <p>{resumenDescripcion}</p>
        </aside>
      </div>
    </section>
  )
}

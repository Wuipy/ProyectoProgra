import { useEffect, useState } from 'react'
import { ConsultaPublica } from '../componentes/ConsultaPublica'
import { Encabezado } from '../componentes/Encabezado'
import { FormularioAveria, ReporteAveria } from '../componentes/FormularioAveria'
import { FormularioSolicitud } from '../componentes/FormularioSolicitud'
import { HeroPrincipal } from '../componentes/HeroPrincipal'
import { PiePagina } from '../componentes/PiePagina'
import { SeccionComunicados } from '../componentes/SeccionComunicados'
import { SeccionContacto } from '../componentes/SeccionContacto'
import { SeccionProyectos } from '../componentes/SeccionProyectos'
import { SeccionQuienesSomos } from '../componentes/SeccionQuienesSomos'
import { SeccionReportesAveria } from '../componentes/SeccionReportesAveria'
import { RegistroActividadesPlomeria } from '../componentes/RegistroActividadesPlomeria'
import { SeccionServicios } from '../componentes/SeccionServicios'

const CLAVE_REPORTES_AVERIA = 'sigasj-reportes-averia'

export function PaginaInicio() {
  const [reportesAveria, setReportesAveria] = useState<ReporteAveria[]>(() => {
    const reportesGuardados = window.localStorage.getItem(CLAVE_REPORTES_AVERIA)

    if (!reportesGuardados) return []

    try {
      return JSON.parse(reportesGuardados) as ReporteAveria[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(CLAVE_REPORTES_AVERIA, JSON.stringify(reportesAveria))
  }, [reportesAveria])

  const registrarReporteVisible = (reporte: ReporteAveria) => {
    setReportesAveria((actuales) => [reporte, ...actuales])
  }

  return (
    <div className="pagina">
      <Encabezado />
      <main>
        <HeroPrincipal />
        <SeccionQuienesSomos />
        <SeccionServicios />
        <SeccionComunicados />
        <section className="banda-formularios" aria-label="Tramites publicos">
          <div className="contenedor grilla-formularios">
            <FormularioAveria onReporteCreado={registrarReporteVisible} />
            <FormularioSolicitud />
          </div>
        </section>
        <SeccionReportesAveria reportes={reportesAveria} />
        <RegistroActividadesPlomeria />
        <ConsultaPublica reportesAveria={reportesAveria} />
        <SeccionProyectos />
        <SeccionContacto />
      </main>
      <PiePagina />
    </div>
  )
}

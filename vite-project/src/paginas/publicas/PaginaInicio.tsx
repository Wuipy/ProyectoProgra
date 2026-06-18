import { useEffect, useState } from 'react'
import { ConsultaPublica } from '../../componentes/ConsultaPublica'
import { Encabezado } from '../../componentes/Encabezado'
import { FormularioAveria, ReporteAveria } from '../../componentes/FormularioAveria'
import { FormularioSolicitud } from '../../componentes/FormularioSolicitud'
import { HeroPrincipal } from '../../componentes/HeroPrincipal'
import { PiePagina } from '../../componentes/PiePagina'
import { SeccionComunicados } from '../../componentes/SeccionComunicados'
import { SeccionContacto } from '../../componentes/SeccionContacto'
import { SeccionProyectos } from '../../componentes/SeccionProyectos'
import { SeccionQuienesSomos } from '../../componentes/SeccionQuienesSomos'
import { SeccionReportesAveria } from '../../componentes/SeccionReportesAveria'
import { SeccionServicios } from '../../componentes/SeccionServicios'
import { listarAverias } from '../../servicios/averiasService'

export function PaginaInicio() {
  const [reportesAveria, setReportesAveria] = useState<ReporteAveria[]>([])
  const [cargandoReportes, setCargandoReportes] = useState(true)

  useEffect(() => {
    let activo = true

    const cargarReportes = async () => {
      try {
        const reportes = await listarAverias()
        if (activo) {
          setReportesAveria(reportes)
        }
      } catch {
        if (activo) {
          setReportesAveria([])
        }
      } finally {
        if (activo) {
          setCargandoReportes(false)
        }
      }
    }

    cargarReportes()

    return () => {
      activo = false
    }
  }, [])

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
        <SeccionReportesAveria reportes={reportesAveria} cargando={cargandoReportes} />
        <ConsultaPublica reportesAveria={reportesAveria} />
        <SeccionProyectos />
        <SeccionContacto />
      </main>
      <PiePagina />
    </div>
  )
}

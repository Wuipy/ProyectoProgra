import { useEffect, useMemo, useState } from 'react'
import {
  actualizarReporteAveria,
  crearReporteAveria,
  eliminarReporteAveria,
  obtenerReportesAverias,
} from '../services/reporteAveriasService'

export function useReporteAverias() {
  const [reportes, setReportes] = useState([])
  const [reporteEditando, setReporteEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarReportes = async () => {
      try {
        setCargando(true)
        setError('')
        const reportesApi = await obtenerReportesAverias()
        setReportes(reportesApi)
      } catch {
        setError('No se pudieron cargar los reportes desde la API.')
      } finally {
        setCargando(false)
      }
    }

    cargarReportes()
  }, [])

  const reportesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    if (!texto) return reportes

    return reportes.filter((reporte) =>
      [reporte.id, reporte.nombre, reporte.direccion, reporte.tipo, reporte.prioridad, reporte.estado]
        .join(' ')
        .toLowerCase()
        .includes(texto),
    )
  }, [busqueda, reportes])

  const guardarReporte = async (datosReporte) => {
    if (reporteEditando) {
      const reporteActualizado = await actualizarReporteAveria(reporteEditando.id, {
        ...datosReporte,
        estado: reporteEditando.estado,
      })
      setReportes((reportesActuales) =>
        reportesActuales.map((reporte) =>
          reporte.id === reporteActualizado.id ? reporteActualizado : reporte,
        ),
      )
      setReporteEditando(null)
      return
    }

    const nuevoReporte = await crearReporteAveria(datosReporte)
    setReportes((reportesActuales) => [nuevoReporte, ...reportesActuales])
  }

  const cambiarEstado = async (id, estado) => {
    const reporte = reportes.find((item) => item.id === id)
    if (!reporte) return

    const reporteActualizado = await actualizarReporteAveria(id, { ...reporte, estado })
    setReportes((reportesActuales) =>
      reportesActuales.map((item) => (item.id === id ? reporteActualizado : item)),
    )
  }

  const eliminarReporte = async (id) => {
    await eliminarReporteAveria(id)
    setReportes((reportesActuales) => reportesActuales.filter((reporte) => reporte.id !== id))
  }

  return {
    busqueda,
    cambiarEstado,
    cargando,
    eliminarReporte,
    error,
    guardarReporte,
    reporteEditando,
    reportes,
    reportesFiltrados,
    setBusqueda,
    setReporteEditando,
  }
}

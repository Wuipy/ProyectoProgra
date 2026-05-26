import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5214/api'

const api = axios.create({
  baseURL: `${API_URL}/reportes-averias`,
})

export const obtenerReportesAverias = async () => {
  const { data } = await api.get()
  return data
}

export const obtenerReporteAveria = async (id) => {
  const { data } = await api.get(`/${id}`)
  return data
}

export const crearReporteAveria = async (datosReporte) => {
  const { data } = await api.post('', datosReporte)
  return data
}

export const actualizarReporteAveria = async (id, datosReporte) => {
  const { data } = await api.put(`/${id}`, datosReporte)
  return data
}

export const eliminarReporteAveria = async (id) => {
  await api.delete(`/${id}`)
}

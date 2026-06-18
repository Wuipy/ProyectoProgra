import axios from 'axios'
import { obtenerTokenAdmin } from '../lib/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = obtenerTokenAdmin()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function extraerMensajeError(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  const payload = data as {
    message?: string
    Message?: string
    title?: string
    errors?: Record<string, string[]>
    Errors?: Record<string, string[]>
  }

  if (payload.message) return payload.message
  if (payload.Message) return payload.Message

  const errores = payload.errors ?? payload.Errors
  if (errores) {
    const detalles = Object.values(errores).flat().filter(Boolean)
    if (detalles.length > 0) return detalles.join(' ')
  }

  if (payload.title && payload.title !== 'One or more validation errors occurred.') {
    return payload.title
  }

  return undefined
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      extraerMensajeError(error.response?.data) ??
      error.message ??
      'No se pudo completar la solicitud. Verifique que el backend este activo.'

    return Promise.reject(new Error(message))
  },
)

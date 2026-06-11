import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_LECTURA,
  PAGINA_TAMANIO,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  LecturaMedidorForm,
  LecturaMedidorItem,
  crearLecturaMedidor,
  listarMisLecturasMedidor,
} from '../servicios/landingService'

const formularioInicial = (): LecturaMedidorForm => ({
  nombreAbonado: '',
  numeroMedidor: '',
  cedulaAbonado: '',
  lecturaAnterior: 0,
  lecturaActual: 0,
  fechaLectura: new Date().toISOString().slice(0, 10),
  observaciones: '',
})

export function RegistroLecturasMedidor() {
  const [lecturas, setLecturas] = useState<LecturaMedidorItem[]>([])
  const [formulario, setFormulario] = useState<LecturaMedidorForm>(formularioInicial())
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [pagina, setPagina] = useState(1)

  const consumoCalculado = Math.max(0, formulario.lecturaActual - formulario.lecturaAnterior)
  const lecturaInvalida = formulario.lecturaActual < formulario.lecturaAnterior

  const cargar = async () => {
    setCargando(true)
    try {
      setLecturas(await listarMisLecturasMedidor())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las lecturas.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const totalPaginas = Math.max(1, Math.ceil(lecturas.length / PAGINA_TAMANIO))
  const paginadas = lecturas.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!formulario.nombreAbonado.trim() || !formulario.numeroMedidor.trim()) {
      setError('Abonado y numero de medidor son obligatorios.')
      return
    }
    setEnviando(true)
    setMensaje('')
    setError('')
    try {
      await crearLecturaMedidor(formulario)
      setMensaje(lecturaInvalida ? 'Lectura registrada con inconsistencia.' : 'Lectura registrada correctamente.')
      setFormulario(formularioInicial())
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar la lectura.')
    } finally {
      setEnviando(false)
    }
  }

  const sugerirLecturaAnterior = (numeroMedidor: string) => {
    const ultima = lecturas.find((l) => l.numeroMedidor === numeroMedidor)
    if (ultima) {
      setFormulario((f) => ({ ...f, lecturaAnterior: ultima.lecturaActual }))
    }
  }

  return (
    <section className="seccion banda-actividades modulo-bitacora modulo-lecturas modulo-layout-horizontal">
      <div className="contenedor modulo-layout-horizontal-contenedor">
        <form className="panel-formulario modulo-formulario modulo-formulario-horizontal" onSubmit={enviar}>
          <div className="encabezado-formulario encabezado-formulario-horizontal">
            <div>
              <p className="etiqueta">Lecturas de campo</p>
              <h2>Registrar lectura de medidor</h2>
            </div>
            <p>Complete los datos del abonado. El consumo se calcula automaticamente.</p>
          </div>

          <div className="grilla-formulario-modulo grilla-lecturas-horizontal">
            <label className="campo">
              <span>Abonado</span>
              <input
                required
                value={formulario.nombreAbonado}
                onChange={(e) => setFormulario({ ...formulario, nombreAbonado: e.target.value })}
              />
            </label>
            <label className="campo">
              <span>Numero de medidor</span>
              <input
                required
                value={formulario.numeroMedidor}
                onChange={(e) => setFormulario({ ...formulario, numeroMedidor: e.target.value })}
                onBlur={(e) => sugerirLecturaAnterior(e.target.value)}
              />
            </label>
            <label className="campo">
              <span>Cedula (opcional)</span>
              <input
                value={formulario.cedulaAbonado}
                onChange={(e) => setFormulario({ ...formulario, cedulaAbonado: e.target.value })}
              />
            </label>
            <label className="campo">
              <span>Fecha de lectura</span>
              <input
                type="date"
                required
                value={formulario.fechaLectura}
                onChange={(e) => setFormulario({ ...formulario, fechaLectura: e.target.value })}
              />
            </label>

            <div className="grilla-lecturas-consumo">
              <label className="campo">
                <span>Lectura anterior</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={formulario.lecturaAnterior}
                  onChange={(e) =>
                    setFormulario({ ...formulario, lecturaAnterior: Number(e.target.value) })
                  }
                />
              </label>
              <label className="campo">
                <span>Lectura actual</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={formulario.lecturaActual}
                  onChange={(e) =>
                    setFormulario({ ...formulario, lecturaActual: Number(e.target.value) })
                  }
                />
              </label>
              <div className={`panel-consumo-calculado panel-consumo-inline ${lecturaInvalida ? 'alerta' : ''}`}>
                <span>Consumo</span>
                <strong>
                  {lecturaInvalida
                    ? formulario.lecturaActual - formulario.lecturaAnterior
                    : consumoCalculado}
                </strong>
                <small>m³</small>
              </div>
            </div>

            {lecturaInvalida && (
              <p className="aviso-formulario-modulo campo-ancho-completo">
                La lectura actual es menor que la anterior. Se marcara como inconsistencia.
              </p>
            )}

            <label className="campo campo-ancho-completo">
              <span>Observaciones</span>
              <textarea
                rows={3}
                placeholder="Medidor dañado, inaccesible, lectura dudosa..."
                value={formulario.observaciones}
                onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
              />
            </label>
          </div>

          {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
          {error && <div className="mensaje-error" role="alert">{error}</div>}

          <div className="fila-accion-formulario-horizontal">
            <button className="boton primario" type="submit" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Registrar lectura'}
            </button>
          </div>
        </form>

        <div className="panel-actividades modulo-listado modulo-listado-horizontal">
          <div className="encabezado-seccion encabezado-listado-modulo">
            <h3>Mis lecturas registradas</h3>
          </div>
          {cargando ? (
            <p className="sin-reportes">Cargando...</p>
          ) : paginadas.length === 0 ? (
            <p className="sin-reportes">No tiene lecturas registradas.</p>
          ) : (
            paginadas.map((lectura) => (
              <article key={lectura.id} className="tarjeta-actividad">
                <div className="actividad-meta">
                  <strong>{lectura.numeroMedidor}</strong>
                  <span className={claseEtiquetaEstado(lectura.estado)}>{lectura.estado}</span>
                </div>
                <p>{lectura.nombreAbonado}</p>
                <p>Consumo: <strong>{lectura.consumo}</strong> m³</p>
                {lectura.alertaConsumoAlto && <p className="alerta-consumo">Consumo alto respecto al mes anterior.</p>}
                <small>{lectura.fechaLectura}</small>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

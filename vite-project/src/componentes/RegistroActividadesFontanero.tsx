import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_ACTIVIDAD_FONTANERO,
  PAGINA_TAMANIO,
  TIPOS_ACTIVIDAD_FONTANERO,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  ActividadFontaneroForm,
  ActividadFontaneroItem,
  actualizarActividadFontanero,
  crearActividadFontanero,
  listarMisActividadesFontanero,
} from '../servicios/landingService'

const formularioInicial = (): ActividadFontaneroForm => ({
  fechaActividad: new Date().toISOString().slice(0, 10),
  horaInicio: '',
  horaFin: '',
  tipo: '',
  descripcion: '',
  ubicacion: '',
  numeroAveriaVinculada: '',
  materialesUtilizados: '',
  observaciones: '',
  estado: 'Pendiente',
})

export function RegistroActividadesFontanero() {
  const [actividades, setActividades] = useState<ActividadFontaneroItem[]>([])
  const [formulario, setFormulario] = useState<ActividadFontaneroForm>(formularioInicial())
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)

  const cargar = async () => {
    setCargando(true)
    try {
      setActividades(await listarMisActividadesFontanero())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar las actividades.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return actividades.filter(
      (a) =>
        !termino ||
        a.tipo.toLowerCase().includes(termino) ||
        a.ubicacion.toLowerCase().includes(termino) ||
        a.descripcion.toLowerCase().includes(termino),
    )
  }, [actividades, busqueda])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / PAGINA_TAMANIO))
  const paginadas = filtradas.slice((pagina - 1) * PAGINA_TAMANIO, pagina * PAGINA_TAMANIO)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setEnviando(true)
    setMensaje('')
    setError('')
    try {
      if (editandoId) {
        await actualizarActividadFontanero(editandoId, formulario)
        setMensaje('Actividad actualizada.')
      } else {
        await crearActividadFontanero(formulario)
        setMensaje('Actividad registrada en su bitacora.')
      }
      setFormulario(formularioInicial())
      setEditandoId(null)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la actividad.')
    } finally {
      setEnviando(false)
    }
  }

  const iniciarEdicion = (actividad: ActividadFontaneroItem) => {
    if (actividad.estadoValidacion !== 'Pendiente') {
      setError('No puede editar una actividad ya validada o rechazada.')
      return
    }
    setEditandoId(actividad.id)
    setFormulario({
      fechaActividad: actividad.fechaActividadIso ?? actividad.fechaActividad.slice(0, 10),
      horaInicio: actividad.horaInicio ?? '',
      horaFin: actividad.horaFin ?? '',
      tipo: actividad.tipo,
      descripcion: actividad.descripcion,
      ubicacion: actividad.ubicacion,
      numeroAveriaVinculada: actividad.numeroAveriaVinculada ?? '',
      lecturaMedidorId: actividad.lecturaMedidorId ?? undefined,
      materialesUtilizados: actividad.materialesUtilizados ?? '',
      observaciones: actividad.observaciones ?? '',
      estado: actividad.estado,
    })
  }

  return (
    <section className="seccion banda-actividades modulo-bitacora modulo-actividades modulo-layout-horizontal">
      <div className="contenedor modulo-layout-horizontal-contenedor">
        <form className="panel-formulario modulo-formulario modulo-formulario-horizontal" onSubmit={enviar}>
          <div className="encabezado-formulario encabezado-formulario-horizontal">
            <div>
              <p className="etiqueta">Bitacora diaria</p>
              <h2>{editandoId ? 'Editar actividad' : 'Registrar actividad'}</h2>
            </div>
            <p>Documente trabajos de campo, materiales y vinculos con averias o lecturas.</p>
          </div>

          <div className="grilla-formulario-modulo grilla-formulario-horizontal">
            <label className="campo">
              <span>Fecha</span>
              <input
                type="date"
                required
                value={formulario.fechaActividad}
                onChange={(e) => setFormulario({ ...formulario, fechaActividad: e.target.value })}
              />
            </label>
            <label className="campo">
              <span>Tipo de actividad</span>
              <select
                required
                value={formulario.tipo}
                onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value })}
              >
                <option value="">Seleccione</option>
                {TIPOS_ACTIVIDAD_FONTANERO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="campo">
              <span>Hora inicio</span>
              <input
                type="time"
                value={formulario.horaInicio}
                onChange={(e) => setFormulario({ ...formulario, horaInicio: e.target.value })}
              />
            </label>
            <label className="campo">
              <span>Hora fin</span>
              <input
                type="time"
                value={formulario.horaFin}
                onChange={(e) => setFormulario({ ...formulario, horaFin: e.target.value })}
              />
            </label>
            <label className="campo">
              <span>Ubicacion</span>
              <input
                required
                value={formulario.ubicacion}
                onChange={(e) => setFormulario({ ...formulario, ubicacion: e.target.value })}
              />
            </label>
            <label className="campo">
              <span>Estado</span>
              <select
                value={formulario.estado}
                onChange={(e) => setFormulario({ ...formulario, estado: e.target.value })}
              >
                {ESTADOS_ACTIVIDAD_FONTANERO.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </label>
            <label className="campo campo-ancho-completo">
              <span>Descripcion del trabajo</span>
              <textarea
                rows={3}
                required
                value={formulario.descripcion}
                onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              />
            </label>
            <label className="campo">
              <span>Averia vinculada (AV-XXXX)</span>
              <input
                value={formulario.numeroAveriaVinculada}
                onChange={(e) =>
                  setFormulario({ ...formulario, numeroAveriaVinculada: e.target.value })
                }
              />
            </label>
            <label className="campo campo-span-2">
              <span>Materiales utilizados</span>
              <textarea
                rows={2}
                value={formulario.materialesUtilizados}
                onChange={(e) =>
                  setFormulario({ ...formulario, materialesUtilizados: e.target.value })
                }
              />
            </label>
            <label className="campo campo-span-2">
              <span>Observaciones</span>
              <textarea
                rows={2}
                value={formulario.observaciones}
                onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
              />
            </label>
          </div>

          {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
          {error && <div className="mensaje-error" role="alert">{error}</div>}

          <div className="fila-accion-formulario-horizontal">
            <button className="boton primario" type="submit" disabled={enviando}>
              {enviando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Registrar'}
            </button>
            {editandoId && (
              <button
                className="boton secundario"
                type="button"
                onClick={() => {
                  setEditandoId(null)
                  setFormulario(formularioInicial())
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="panel-actividades modulo-listado modulo-listado-horizontal">
          <div className="encabezado-seccion encabezado-listado-modulo">
            <h3>Mis actividades</h3>
            <label className="campo busqueda-modulo">
              <span>Buscar</span>
              <input placeholder="Tipo, ubicacion..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </label>
          </div>

          {cargando ? (
            <p className="sin-reportes">Cargando...</p>
          ) : paginadas.length === 0 ? (
            <p className="sin-reportes">Aun no tiene actividades registradas.</p>
          ) : (
            paginadas.map((actividad) => (
              <article key={actividad.id} className="tarjeta-actividad">
                <div className="actividad-meta">
                  <strong>{actividad.tipo}</strong>
                  <span className={claseEtiquetaEstado(actividad.estado)}>{actividad.estado}</span>
                  <span className={`etiqueta-estado etiqueta-${actividad.estadoValidacion.toLowerCase()}`}>{actividad.estadoValidacion}</span>
                </div>
                <p>{actividad.descripcion}</p>
                <small>{actividad.fechaActividad} · {actividad.ubicacion}</small>
                {actividad.estadoValidacion === 'Pendiente' && (
                  <button className="boton secundario" type="button" onClick={() => iniciarEdicion(actividad)}>Editar</button>
                )}
              </article>
            ))
          )}

          {totalPaginas > 1 && (
            <div className="paginacion-modulo">
              <button type="button" className="boton secundario" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>Anterior</button>
              <span>{pagina}/{totalPaginas}</span>
              <button type="button" className="boton secundario" disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>Siguiente</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

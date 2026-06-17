import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  PAGINA_TAMANIO,
  TIPOS_ACTIVIDAD_FONTANERO,
  claseEtiquetaEstado,
} from '../config/constantesModulos'
import {
  actividadItemAFormulario,
  formularioInicialActividad,
  obtenerCategoriaFormulario,
  prepararPayloadActividad,
  tituloFormularioEspecifico,
  validarFormularioActividad,
} from '../config/formulariosActividadFontanero'
import {
  ActividadFontaneroForm,
  ActividadFontaneroItem,
  actualizarActividadFontanero,
  crearActividadFontanero,
  listarMisActividadesFontanero,
} from '../servicios/landingService'
import { FormularioActividadGeneral } from './actividadesFontanero/FormularioActividadGeneral'
import { FormularioControlOperativo } from './actividadesFontanero/FormularioControlOperativo'
import { FormularioTomaPresion } from './actividadesFontanero/FormularioTomaPresion'
import { FormularioVisitaCampo } from './actividadesFontanero/FormularioVisitaCampo'

export function RegistroActividadesFontanero() {
  const [actividades, setActividades] = useState<ActividadFontaneroItem[]>([])
  const [formulario, setFormulario] = useState<ActividadFontaneroForm>(formularioInicialActividad())
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)

  const categoriaFormulario = obtenerCategoriaFormulario(formulario.tipo)
  const tipoSeleccionado = Boolean(categoriaFormulario)

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

  const cambiarTipo = (tipo: string) => {
    setFormulario(formularioInicialActividad(tipo))
    setError('')
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setEnviando(true)
    setMensaje('')
    setError('')

    const errorValidacion = validarFormularioActividad(formulario)
    if (errorValidacion) {
      setError(errorValidacion)
      setEnviando(false)
      return
    }

    const payload = prepararPayloadActividad(formulario)

    try {
      if (editandoId) {
        await actualizarActividadFontanero(editandoId, payload)
        setMensaje('Actividad actualizada.')
      } else {
        await crearActividadFontanero(payload)
        setMensaje('Actividad registrada en su bitacora.')
      }
      setFormulario(formularioInicialActividad())
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
    setFormulario(actividadItemAFormulario(actividad))
    setError('')
  }

  const renderFormulario = () => {
    if (!categoriaFormulario) return null

    const props = { formulario, onChange: setFormulario }

    return (
      <section className="formulario-especifico-actividad" aria-live="polite">
        <h3 className="titulo-formulario-especifico">{tituloFormularioEspecifico(categoriaFormulario)}</h3>
        <div className="grilla-formulario-modulo grilla-formulario-especifico">
          {categoriaFormulario === 'visita-campo' && <FormularioVisitaCampo {...props} />}
          {categoriaFormulario === 'toma-presion' && <FormularioTomaPresion {...props} />}
          {categoriaFormulario === 'control-operativo' && <FormularioControlOperativo {...props} />}
          {categoriaFormulario === 'actividad-general' && <FormularioActividadGeneral {...props} />}
        </div>
      </section>
    )
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
            <p>Seleccione el tipo y complete unicamente el formulario correspondiente.</p>
          </div>

          <div className="selector-tipo-actividad">
            <label className="campo campo-tipo-actividad">
              <span>Tipo de actividad</span>
              <select
                required
                value={formulario.tipo}
                onChange={(e) => cambiarTipo(e.target.value)}
              >
                <option value="">Seleccione el tipo de actividad</option>
                {TIPOS_ACTIVIDAD_FONTANERO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {!tipoSeleccionado ? (
            <p className="aviso-formulario-modulo aviso-seleccion-tipo" role="status">
              Elija un tipo para abrir la bitacora de visita de campo, toma de presion, control operativo
              o actividad general.
            </p>
          ) : (
            renderFormulario()
          )}

          {mensaje && <div className="mensaje-exito" role="status">{mensaje}</div>}
          {error && <div className="mensaje-error" role="alert">{error}</div>}

          <div className="fila-accion-formulario-horizontal">
            <button className="boton primario" type="submit" disabled={enviando || !tipoSeleccionado}>
              {enviando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Registrar'}
            </button>
            {editandoId && (
              <button
                className="boton secundario"
                type="button"
                onClick={() => {
                  setEditandoId(null)
                  setFormulario(formularioInicialActividad())
                  setError('')
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

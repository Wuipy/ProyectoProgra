import { useEffect, useMemo, useState } from 'react'
import './PlumberActivityLog.css'

const ACTIVITY_TYPES = [
  'Control de Fugas',
  'Toma de presión',
  'Visita de Campo',
  'Control de Aforos',
  'Control Operativo',
]

const STORAGE_KEY = 'plumber-activity-log'
const defaultFormState = {
  date: '',
  location: '',
  task: '',
  activityType: ACTIVITY_TYPES[0],
  notes: '',
  attachment: '',
  status: 'pendiente',
}

function newEntry(form) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: form.date || new Date().toISOString().slice(0, 10),
    location: form.location.trim(),
    task: form.task.trim(),
    activityType: form.activityType,
    notes: form.notes.trim(),
    attachment: form.attachment.trim(),
    status: form.status,
  }
}

export default function PlumberActivityLog() {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(defaultFormState)
  const [entries, setEntries] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const summary = useMemo(() => {
    const totals = { pendiente: 0, 'en-progreso': 0, completado: 0 }
    entries.forEach((entry) => {
      totals[entry.status] += 1
    })
    return totals
  }, [entries])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.task.trim()) {
      return
    }

    if (editId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editId
            ? {
                ...entry,
                date: form.date || new Date().toISOString().slice(0, 10),
                location: form.location.trim(),
                task: form.task.trim(),
                activityType: form.activityType,
                notes: form.notes.trim(),
                attachment: form.attachment.trim(),
                status: form.status,
              }
            : entry,
        ),
      )
      setEditId(null)
    } else {
      setEntries((prev) => [newEntry(form), ...prev])
    }

    setForm({ ...defaultFormState, activityType: form.activityType })
    setSelectedActivity(null)
  }

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    if (editId === id) {
      setEditId(null)
      setForm(defaultFormState)
      setSelectedActivity(null)
    }
  }

  const handleStatusChange = (id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status:
                entry.status === 'pendiente'
                  ? 'en-progreso'
                  : entry.status === 'en-progreso'
                  ? 'completado'
                  : 'pendiente',
            }
          : entry,
      ),
    )
  }

  const handleEdit = (entry) => {
    setSelectedActivity(entry.activityType)
    setEditId(entry.id)
    setForm({
      date: entry.date,
      location: entry.location,
      task: entry.task,
      activityType: entry.activityType,
      notes: entry.notes,
      attachment: entry.attachment,
      status: entry.status,
    })
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setForm(defaultFormState)
    setSelectedActivity(null)
  }

  const chooseActivity = (type) => {
    setSelectedActivity(type)
    setForm((prev) => ({ ...prev, activityType: type }))
  }

  return (
    <section className="plumber-activity-log">
      <header className="activity-header">
        <div>
          <p className="module-label">Módulo del fontanero</p>
          <h1>Gestión de actividades</h1>
          <p className="module-description">
            Registra cada tarea, ubicación y nota de la bitácora durante la hornada.
          </p>
        </div>
        <div className="activity-status">
          <div>
            <strong>{entries.length}</strong>
            <span>Registros</span>
          </div>
          <div>
            <strong>{summary.completado}</strong>
            <span>Completados</span>
          </div>
          <div>
            <strong>{summary['en-progreso']}</strong>
            <span>En progreso</span>
          </div>
        </div>
      </header>

      {!selectedActivity ? (
        <div className="activity-selector">
          <p className="selector-instruction">Selecciona el tipo de actividad que vas a registrar:</p>
          <div className="selector-grid">
            {ACTIVITY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className="activity-option"
                onClick={() => chooseActivity(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form className="activity-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Fecha
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>
            <label>
              Cliente / Lugar
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ej. Sector 3, casa 12"
              />
            </label>
          </div>

          <label>
            Tipo de actividad
            <input type="text" name="activityType" value={form.activityType} readOnly />
          </label>

          <label>
            Tarea realizada
            <input
              type="text"
              name="task"
              value={form.task}
              onChange={handleChange}
              placeholder="Descripción breve de la intervención"
              required
            />
          </label>

          <label>
            Notas / detalles
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Ej. cambio de válvula, revisión de líneas, prueba de presión"
            />
          </label>

          <label className="select-label">
            Estado
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={handleCancelEdit}>
              {editId ? 'Cancelar' : 'Cambiar actividad'}
            </button>
            <button type="submit" className="primary-button">
              {editId ? 'Guardar cambios' : 'Guardar actividad'}
            </button>
          </div>
        </form>
      )}

      <div className="activity-list-section">
        <h2>Bitácora</h2>
        {entries.length === 0 ? (
          <p className="empty-state">No hay entradas aún. Agrega la primera actividad.</p>
        ) : (
          <ul className="activity-list">
            {entries.map((entry) => (
              <li key={entry.id} className="activity-card">
                <div className="card-main">
                  <div>
                    <strong>{entry.task}</strong>
                    <p>{entry.location || 'Ubicación no especificada'}</p>
                    <p className="entry-type">Tipo: {entry.activityType}</p>
                  </div>
                  <span className={`status-badge status-${entry.status}`}>
                    {entry.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="card-meta">
                  <span>{entry.date}</span>
                  <button
                    type="button"
                    className="status-button"
                    onClick={() => handleStatusChange(entry.id)}
                  >
                    Cambiar estado
                  </button>
                </div>
                {entry.notes ? <p className="card-notes">{entry.notes}</p> : null}
                {entry.attachment ? (
                  <p className="card-attachment">{entry.attachment}</p>
                ) : null}
                <div className="card-actions">
                  <button type="button" className="secondary-button" onClick={() => handleEdit(entry)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => handleDelete(entry.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

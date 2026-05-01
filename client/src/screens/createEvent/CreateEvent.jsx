import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvent } from '../../hooks/tests/useCreateEvent'
import { useEvents } from '../../hooks/tests/useEvents'
import { useDeleteEvent } from '../../hooks/tests/useDeleteEvent'
import { useUpdateEvent } from '../../hooks/tests/useUpdateEvent'

function CreateEvent() {
  const navigate = useNavigate()
  const { createEvent, loading, error } = useCreateEvent()
  const { events, loading: eventsLoading } = useEvents()
  const { deleteEvent, loading: deleting } = useDeleteEvent()
  const { updateEvent, loading: updating } = useUpdateEvent()

  const [fields, setFields] = useState({ name: '', description: '', eventDate: '' })
  const [localEvents, setLocalEvents] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editFields, setEditFields] = useState({ name: '', description: '' })

  const displayed = localEvents ?? events

  const set = key => e => setFields(prev => ({ ...prev, [key]: e.target.value }))
  const setEdit = key => e => setEditFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await createEvent({
      name:        fields.name.trim(),
      description: fields.description.trim(),
      event_date:  fields.eventDate ? new Date(fields.eventDate).toISOString() : undefined,
    })
    if (data) {
      setLocalEvents(prev => [data, ...(prev ?? events)])
      setFields({ name: '', description: '', eventDate: '' })
    }
  }

  const handleDelete = async (id) => {
    const ok = await deleteEvent(id)
    if (ok) setLocalEvents(prev => (prev ?? events).filter(ev => ev.id !== id))
  }

  const startEdit = (ev) => {
    setEditingId(ev.id)
    setEditFields({ name: ev.name, description: ev.description ?? '' })
  }

  const cancelEdit = () => setEditingId(null)

  const handleUpdate = async (id) => {
    const data = await updateEvent(id, {
      name:        editFields.name.trim(),
      description: editFields.description.trim(),
    })
    if (data) {
      setLocalEvents(prev => (prev ?? events).map(ev => ev.id === id ? data : ev))
      setEditingId(null)
    }
  }

  return (
    <div className="create-test-wrapper">
      <div className="create-test-container">

        <div className="create-test-header">
          <button className="ongoing-back-btn" onClick={() => navigate('/home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            უკან
          </button>
          <h1 className="create-test-title">ოლიმპიადის შექმნა</h1>
        </div>

        <form className="create-test-form" onSubmit={handleSubmit}>

          <div className="ct-field">
            <label className="ct-label">სახელი</label>
            <input
              type="text"
              className="ct-input"
              placeholder="ოლიმპიადის სახელი..."
              value={fields.name}
              onChange={set('name')}
              required
            />
          </div>

          <div className="ct-field">
            <label className="ct-label">აღწერა (არასავალდებულო)</label>
            <textarea
              className="ct-input"
              placeholder="ოლიმპიადის აღწერა..."
              rows={3}
              value={fields.description}
              onChange={set('description')}
              style={{ resize: 'vertical' }}
            />
          </div>

          {error && <p className="ct-error">{error}</p>}

          <button type="submit" className="ct-submit-btn" disabled={loading}>
            {loading ? 'იქმნება...' : 'ოლიმპიადის შექმნა'}
          </button>

        </form>

        <div className="events-section">
          <h2 className="events-section-title">ოლიმპიადები</h2>
          {eventsLoading ? (
            <p className="events-empty">იტვირთება...</p>
          ) : displayed.length === 0 ? (
            <p className="events-empty">ოლიმპიადები არ მოიძებნა</p>
          ) : (
            <div className="events-grid">
              {displayed.map(ev => (
                <div key={ev.id} className={`event-card${editingId === ev.id ? ' event-card--editing' : ''}`}>
                  {editingId === ev.id ? (
                    <>
                      <input
                        className="ct-input event-edit-input"
                        value={editFields.name}
                        onChange={setEdit('name')}
                        placeholder="სახელი"
                      />
                      <textarea
                        className="ct-input event-edit-input"
                        value={editFields.description}
                        onChange={setEdit('description')}
                        placeholder="აღწერა"
                        rows={2}
                        style={{ resize: 'vertical' }}
                      />
                      <div className="event-card-actions">
                        <button
                          className="event-action-btn event-action-btn--save"
                          onClick={() => handleUpdate(ev.id)}
                          disabled={updating}
                        >
                          {updating ? '...' : 'შენახვა'}
                        </button>
                        <button
                          className="event-action-btn event-action-btn--cancel"
                          onClick={cancelEdit}
                          disabled={updating}
                        >
                          გაუქმება
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="event-card-name">{ev.name}</div>
                      {ev.description && (
                        <div className="event-card-desc">{ev.description}</div>
                      )}
                      {ev.event_date && (
                        <div className="event-card-date">
                          {new Date(ev.event_date).toLocaleDateString('ka-GE', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </div>
                      )}
                      <div className="event-card-actions">
                        <button
                          className="event-action-btn event-action-btn--edit"
                          onClick={() => startEdit(ev)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          რედაქტირება
                        </button>
                        <button
                          className="event-action-btn event-action-btn--delete"
                          onClick={() => handleDelete(ev.id)}
                          disabled={deleting}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                          </svg>
                          წაშლა
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CreateEvent

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvent } from '../../hooks/tests/useCreateEvent'
import DateTime24Picker from '../../components/DateTime24Picker'

function CreateEvent() {
  const navigate = useNavigate()
  const { createEvent, loading, error } = useCreateEvent()

  const [fields, setFields] = useState({
    name:        '',
    description: '',
    eventDate:   '',
  })

  const set = key => e => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await createEvent({
      name:        fields.name.trim(),
      description: fields.description.trim(),
      event_date:  new Date(fields.eventDate).toISOString(),
    })
    if (data) navigate('/home')
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
          <h1 className="create-test-title">ღონისძიების შექმნა</h1>
        </div>

        <form className="create-test-form" onSubmit={handleSubmit}>

          <div className="ct-field">
            <label className="ct-label">სახელი</label>
            <input
              type="text"
              className="ct-input"
              placeholder="ღონისძიების სახელი..."
              value={fields.name}
              onChange={set('name')}
              required
            />
          </div>

          <div className="ct-field">
            <label className="ct-label">აღწერა (არასავალდებულო)</label>
            <textarea
              className="ct-input"
              placeholder="ღონისძიების აღწერა..."
              rows={3}
              value={fields.description}
              onChange={set('description')}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="ct-field">
            <label className="ct-label">თარიღი და საათი</label>
            <DateTime24Picker
              value={fields.eventDate}
              onChange={val => setFields(prev => ({ ...prev, eventDate: val }))}
              required
            />
          </div>

          {error && <p className="ct-error">{error}</p>}

          <button type="submit" className="ct-submit-btn" disabled={loading}>
            {loading ? 'იქმნება...' : 'ღონისძიების შექმნა'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateEvent

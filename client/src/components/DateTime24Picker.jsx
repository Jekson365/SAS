import { useMemo } from 'react'

const pad = n => String(n).padStart(2, '0')
const HOURS   = Array.from({ length: 24 }, (_, i) => pad(i))
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i))

function splitValue(value) {
  if (!value) return { date: '', hour: '', minute: '' }
  const [datePart, timePart = ''] = value.split('T')
  const [h = '', m = ''] = timePart.split(':')
  return { date: datePart || '', hour: h, minute: m }
}

function joinValue(date, hour, minute) {
  if (!date || hour === '' || minute === '') return ''
  return `${date}T${pad(hour)}:${pad(minute)}`
}

function DateTime24Picker({ value, onChange, required = false, id }) {
  const { date, hour, minute } = useMemo(() => splitValue(value), [value])

  const emit = (nextDate, nextHour, nextMinute) =>
    onChange(joinValue(nextDate, nextHour, nextMinute))

  return (
    <div className="dt24-picker">
      <input
        id={id}
        type="date"
        className="dt24-date"
        value={date}
        onChange={e => emit(e.target.value, hour, minute)}
        required={required}
      />
      <div className="dt24-time">
        <select
          className="dt24-select"
          value={hour}
          onChange={e => emit(date, e.target.value, minute || '00')}
          required={required}
          aria-label="საათი"
        >
          <option value="" disabled>სთ</option>
          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <span className="dt24-colon">:</span>
        <select
          className="dt24-select"
          value={minute}
          onChange={e => emit(date, hour || '00', e.target.value)}
          required={required}
          aria-label="წუთი"
        >
          <option value="" disabled>წთ</option>
          {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>
  )
}

export default DateTime24Picker

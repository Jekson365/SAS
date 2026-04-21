import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import JsBarcode from 'jsbarcode'
import './PrintBarcodes.scss'

const FORMATS = [
  { value: 'CODE128', label: 'Code 128' },
  { value: 'EAN13',   label: 'EAN-13' },
  { value: 'EAN8',    label: 'EAN-8' },
  { value: 'UPC',     label: 'UPC-A' },
  { value: 'CODE39',  label: 'Code 39' },
]

function BarcodeItem({ entry, format, width, height, fontSize, showText }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !entry.value.trim()) return
    try {
      JsBarcode(ref.current, entry.value.trim(), {
        format,
        width,
        height,
        fontSize,
        displayValue: showText,
        margin: 6,
      })
    } catch {
      // invalid barcode for selected format — leave blank
    }
  }, [entry.value, format, width, height, fontSize, showText])

  return (
    <div className="barcode-card">
      {entry.label && <div className="barcode-label">{entry.label}</div>}
      <svg ref={ref} />
    </div>
  )
}

function PrintBarcodes() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([{ id: 1, value: '', label: '', qty: 1 }])
  const [format, setFormat]   = useState('CODE128')
  const [barWidth, setBarWidth]   = useState(2)
  const [barHeight, setBarHeight] = useState(60)
  const [fontSize, setFontSize]   = useState(12)
  const [showText, setShowText]   = useState(true)
  const nextId = useRef(2)

  const addRow = () => {
    setEntries(e => [...e, { id: nextId.current++, value: '', label: '', qty: 1 }])
  }

  const removeRow = (id) => setEntries(e => e.filter(x => x.id !== id))

  const updateRow = (id, field, value) =>
    setEntries(e => e.map(x => x.id === id ? { ...x, [field]: value } : x))

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text')
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    if (lines.length < 2) return
    e.preventDefault()
    setEntries(lines.map(line => ({ id: nextId.current++, value: line, label: '', qty: 1 })))
  }

  const expandedEntries = entries.flatMap(e =>
    Array.from({ length: Math.max(1, Number(e.qty) || 1) }, (_, i) => ({ ...e, id: `${e.id}_${i}` }))
  )

  const handlePrint = () => window.print()

  return (
    <div className="pb-wrapper">
      <div className="pb-sidebar no-print">
        <button className="pb-back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          უკან
        </button>

        <h2 className="pb-title">შტრიხკოდის ბეჭდვა</h2>

        <div className="pb-section-label">ფორმატი</div>
        <select className="pb-select" value={format} onChange={e => setFormat(e.target.value)}>
          {FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        <div className="pb-settings-grid">
          <label>
            ზოლის სიგანე
            <input type="number" min="1" max="4" value={barWidth}
              onChange={e => setBarWidth(Number(e.target.value))} />
          </label>
          <label>
            სიმაღლე
            <input type="number" min="20" max="200" value={barHeight}
              onChange={e => setBarHeight(Number(e.target.value))} />
          </label>
          <label>
            შრიფტი
            <input type="number" min="8" max="24" value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))} />
          </label>
          <label className="pb-checkbox-label">
            <input type="checkbox" checked={showText}
              onChange={e => setShowText(e.target.checked)} />
            ტექსტი
          </label>
        </div>

        <div className="pb-section-label">შტრიხკოდები</div>
        <div className="pb-rows">
          {entries.map(entry => (
            <div key={entry.id} className="pb-row">
              <input
                className="pb-input-main"
                placeholder="შტრიხკოდი"
                value={entry.value}
                onChange={e => updateRow(entry.id, 'value', e.target.value)}
                onPaste={handlePaste}
              />
              <input
                className="pb-input-label"
                placeholder="სახელი"
                value={entry.label}
                onChange={e => updateRow(entry.id, 'label', e.target.value)}
              />
              <input
                className="pb-input-qty"
                type="number"
                min="1"
                max="100"
                value={entry.qty}
                onChange={e => updateRow(entry.id, 'qty', e.target.value)}
              />
              <button className="pb-remove" onClick={() => removeRow(entry.id)}>✕</button>
            </div>
          ))}
        </div>

        <button className="pb-add" onClick={addRow}>+ დამატება</button>
        <button className="pb-print" onClick={handlePrint}>ბეჭდვა</button>
      </div>

      <div className="pb-preview">
        {expandedEntries.filter(e => e.value.trim()).length === 0
          ? <div className="pb-empty">შტრიხკოდები აქ გამოჩნდება</div>
          : <div className="pb-grid">
              {expandedEntries.filter(e => e.value.trim()).map(entry => (
                <BarcodeItem
                  key={entry.id}
                  entry={entry}
                  format={format}
                  width={barWidth}
                  height={barHeight}
                  fontSize={fontSize}
                  showText={showText}
                />
              ))}
            </div>
        }
      </div>
    </div>
  )
}

export default PrintBarcodes

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTest } from '../../hooks/tests/useCreateTest'
import { useSubjects } from '../../hooks/tests/useSubjects'

const ETAPI_OPTIONS = ['I ეტაპი', 'II ეტაპი', 'III ეტაპი', 'IV ეტაპი']
const OPTION_LABELS = ['A', 'B', 'C', 'D']

const emptyQuestion = () => ({
  question_text: '',
  options: ['', '', '', ''],
  correct_index: 0,
})

function CreateTest() {
  const navigate = useNavigate()
  const { createTest, loading, error } = useCreateTest()
  const { subjects, loading: subjectsLoading } = useSubjects()

  const [fields, setFields] = useState({
    subjectId:     '',
    etapi:         '',
    testTakenDate: '',
    maxScore:      '',
    passScore:     '',
  })

  const [questions, setQuestions] = useState([emptyQuestion()])

  const set = key => e => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const setQText = (qi, val) =>
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, question_text: val } : q))

  const setQOption = (qi, oi, val) =>
    setQuestions(prev => prev.map((q, i) =>
      i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q
    ))

  const setQCorrect = (qi, val) =>
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, correct_index: Number(val) } : q))

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()])

  const removeQuestion = (qi) =>
    setQuestions(prev => prev.length > 1 ? prev.filter((_, i) => i !== qi) : prev)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      subject_id:      Number(fields.subjectId),
      etapi:           fields.etapi,
      test_taken_date: fields.testTakenDate,
      max_score:       Number(fields.maxScore),
      pass_score:      Number(fields.passScore),
      questions:       questions,
    }
    const data = await createTest(payload)
    if (data) navigate('/home')
  }

  return (
    <div className="create-test-wrapper">
      <div className="create-test-container">

        {/* Header */}
        <div className="create-test-header">
          <button className="ongoing-back-btn" onClick={() => navigate('/home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            უკან
          </button>
          <h1 className="create-test-title">ახალი ტესტი</h1>
        </div>

        {/* Form */}
        <form className="create-test-form" onSubmit={handleSubmit}>

          <div className="ct-field">
            <label className="ct-label">საგანი</label>
            <select
              className="ct-input ct-select"
              value={fields.subjectId}
              onChange={set('subjectId')}
              required
            >
              <option value="" disabled>აირჩიე საგანი</option>
              {subjectsLoading
                ? <option disabled>იტვირთება...</option>
                : subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))
              }
            </select>
          </div>

          <div className="ct-field">
            <label className="ct-label">ეტაპი</label>
            <select
              className="ct-input ct-select"
              value={fields.etapi}
              onChange={set('etapi')}
              required
            >
              <option value="" disabled>აირჩიე ეტაპი</option>
              {ETAPI_OPTIONS.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="ct-field">
            <label className="ct-label">ტესტის თარიღი</label>
            <input
              type="date"
              className="ct-input"
              value={fields.testTakenDate}
              onChange={set('testTakenDate')}
              required
            />
          </div>

          <div className="ct-row">
            <div className="ct-field">
              <label className="ct-label">მაქსიმალური ქულა</label>
              <input
                type="number"
                className="ct-input"
                placeholder="100"
                min="1"
                value={fields.maxScore}
                onChange={set('maxScore')}
                required
              />
            </div>
            <div className="ct-field">
              <label className="ct-label">გასვლის ქულა</label>
              <input
                type="number"
                className="ct-input"
                placeholder="60"
                min="1"
                value={fields.passScore}
                onChange={set('passScore')}
                required
              />
            </div>
          </div>

          {/* Questions */}
          <div className="ct-questions-section">
            <div className="ct-questions-header">
              <span className="ct-label">კითხვები ({questions.length})</span>
              <button type="button" className="ct-add-question-btn" onClick={addQuestion}>
                + კითხვის დამატება
              </button>
            </div>

            {questions.map((q, qi) => (
              <div key={qi} className="ct-question-card">
                <div className="ct-question-card-header">
                  <span className="ct-question-number">კითხვა {qi + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="ct-remove-question-btn"
                      onClick={() => removeQuestion(qi)}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="ct-field">
                  <label className="ct-label">კითხვის ტექსტი</label>
                  <input
                    type="text"
                    className="ct-input"
                    placeholder="შეიყვანე კითხვა..."
                    value={q.question_text}
                    onChange={e => setQText(qi, e.target.value)}
                    required
                  />
                </div>

                <div className="ct-options-grid">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="ct-option-field">
                      <label className="ct-option-label">{OPTION_LABELS[oi]}</label>
                      <input
                        type="text"
                        className="ct-input ct-option-input"
                        placeholder={`პასუხი ${OPTION_LABELS[oi]}...`}
                        value={opt}
                        onChange={e => setQOption(qi, oi, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="ct-correct-section">
                  <label className="ct-label">სწორი პასუხი</label>
                  <div className="ct-correct-options">
                    {OPTION_LABELS.map((label, oi) => (
                      <label key={oi} className={`ct-correct-option ${q.correct_index === oi ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name={`correct-${qi}`}
                          value={oi}
                          checked={q.correct_index === oi}
                          onChange={() => setQCorrect(qi, oi)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="ct-error">{error}</p>}

          <button type="submit" className="ct-submit-btn" disabled={loading}>
            {loading ? 'იქმნება...' : 'ტესტის შექმნა'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateTest

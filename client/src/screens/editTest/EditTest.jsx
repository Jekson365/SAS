import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUpdateTest } from '../../hooks/tests/useUpdateTest'
import { useSubjects } from '../../hooks/tests/useSubjects'
import { useTest } from '../../hooks/tests/useTest'
import { useTestQuestions } from '../../hooks/tests/useTestQuestions'

const ETAPI_OPTIONS = ['I ეტაპი', 'II ეტაპი', 'III ეტაპი', 'IV ეტაპი']
const OPTION_LABELS = ['A', 'B', 'C', 'D']

const emptyQuestion = () => ({
  question_text: '',
  options: ['', '', '', ''],
  correct_index: 0,
})

function toLocalDateTimeInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function EditTest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateTest, loading: saving, error } = useUpdateTest()
  const { subjects, loading: subjectsLoading } = useSubjects()
  const { test, loading: testLoading } = useTest(id)
  const { questions: loadedQuestions, loading: questionsLoading } = useTestQuestions(id)

  const [fields, setFields] = useState({
    subjectId:     '',
    etapi:         '',
    testStartDate: '',
    maxScore:      '',
    passScore:     '',
  })

  const [questions, setQuestions] = useState([emptyQuestion()])

  useEffect(() => {
    if (!test) return
    setFields({
      subjectId:     String(test.subject_id ?? test.subject?.id ?? ''),
      etapi:         test.etapi ?? '',
      testStartDate: toLocalDateTimeInput(test.test_start_date),
      maxScore:      String(test.max_score ?? ''),
      passScore:     String(test.pass_score ?? ''),
    })
  }, [test])

  useEffect(() => {
    if (!loadedQuestions || loadedQuestions.length === 0) return
    setQuestions(
      loadedQuestions.map(q => ({
        question_text: q.question_text ?? '',
        options:       Array.isArray(q.options) && q.options.length === 4
                         ? q.options
                         : ['', '', '', ''],
        correct_index: q.correct_index ?? 0,
      }))
    )
  }, [loadedQuestions])

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
      test_start_date: fields.testStartDate,
      max_score:       Number(fields.maxScore),
      pass_score:      Number(fields.passScore),
      questions:       questions,
    }
    const ok = await updateTest(id, payload)
    if (ok) navigate('/home')
  }

  const initialLoading = testLoading || questionsLoading

  if (initialLoading) {
    return (
      <div className="create-test-wrapper">
        <div className="create-test-container">
          <p className="section-empty">იტვირთება...</p>
        </div>
      </div>
    )
  }

  if (!test) {
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
            <h1 className="create-test-title">ტესტი ვერ მოიძებნა</h1>
          </div>
        </div>
      </div>
    )
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
          <h1 className="create-test-title">ტესტის რედაქტირება</h1>
        </div>

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
            <label className="ct-label">ტესტის თარიღი და საათი</label>
            <input
              type="datetime-local"
              className="ct-input"
              value={fields.testStartDate}
              onChange={set('testStartDate')}
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

          <button type="submit" className="ct-submit-btn" disabled={saving}>
            {saving ? 'ინახება...' : 'შენახვა'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default EditTest

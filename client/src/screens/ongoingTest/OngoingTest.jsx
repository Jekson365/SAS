import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTest } from '../../hooks/tests/useTest'
import { useTakeTestQuestions } from '../../hooks/tests/useTakeTestQuestions'
import { useSubmitTestResult } from '../../hooks/useSubmitTestResult'
import { resolveImageUrl } from '../../api/questionImage'

function normalizeText(s) {
  return (s ?? '').toString().trim().toLocaleLowerCase()
}

function isQuestionCorrect(q, answer) {
  if (q.type === 'open') {
    return normalizeText(answer) !== '' &&
           normalizeText(answer) === normalizeText(q.correct_answer)
  }
  return answer === q.correct_index
}

function isAnswered(q, answer) {
  if (q.type === 'open') return normalizeText(answer) !== ''
  return answer !== undefined
}

function formatRemaining(ms) {
  if (ms <= 0) return '00:00'
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = n => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

function OngoingTest() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { test,      loading: testLoading }      = useTest(id)
  const { questions, loading: questionsLoading, forbidden } = useTakeTestQuestions(id)

  const { submitResult, loading: saving, error: saveError } = useSubmitTestResult()

  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result,    setResult]    = useState(null)
  const [now,       setNow]       = useState(() => Date.now())

  const deadlineMs = test?.started_at && test?.duration_minutes
    ? new Date(test.started_at).getTime() + Number(test.duration_minutes) * 60_000
    : null

  const remainingMs = deadlineMs ? Math.max(0, deadlineMs - now) : null
  const timeExpired = deadlineMs !== null && remainingMs === 0

  useEffect(() => {
    if (!deadlineMs || submitted) return
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [deadlineMs, submitted])

  const answersRef   = useRef(answers)
  const questionsRef = useRef(questions)
  useEffect(() => { answersRef.current   = answers   }, [answers])
  useEffect(() => { questionsRef.current = questions }, [questions])

  const autoSubmittedRef = useRef(false)
  useEffect(() => {
    if (!timeExpired || submitted || autoSubmittedRef.current) return
    if (!questionsRef.current || questionsRef.current.length === 0) return
    autoSubmittedRef.current = true
    const qs = questionsRef.current
    const as = answersRef.current
    const score = qs.reduce((sum, q) => (
      isQuestionCorrect(q, as[q.id]) ? sum + (Number(q.point) || 1) : sum
    ), 0)
    const passed = score >= (test?.pass_score ?? 0)
    const startedAtMs = test?.started_at ? new Date(test.started_at).getTime() : null
    const durationSeconds = startedAtMs ? Math.floor((Date.now() - startedAtMs) / 1000) : 0
    submitResult({ testId: Number(id), score, passed, durationSeconds }).then(saved => {
      setResult({ score, passed, saved })
      setSubmitted(true)
    })
  }, [timeExpired, submitted, submitResult, id, test])

  if (testLoading || questionsLoading) {
    return (
      <div className="ongoing-test-wrapper">
        <div className="ongoing-test-not-found">
          <p>იტვირთება...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="ongoing-test-wrapper">
        <div className="ongoing-test-not-found">
          <p>ტესტი ვერ მოიძებნა.</p>
          <button className="ongoing-back-btn" onClick={() => navigate('/home')}>მთავარზე დაბრუნება</button>
        </div>
      </div>
    )
  }

  if (forbidden) {
    return (
      <div className="ongoing-test-wrapper">
        <div className="ongoing-test-not-found">
          <p>{forbidden}</p>
          <button className="ongoing-back-btn" onClick={() => navigate('/home')}>მთავარზე დაბრუნება</button>
        </div>
      </div>
    )
  }

  const subjectName    = test.subject?.name ?? test.subject ?? '—'
  const q              = questions[current]
  const totalAnswered  = questions.filter(qq => isAnswered(qq, answers[qq.id])).length
  const isLast         = current === questions.length - 1

  function selectAnswer(optionIndex) {
    if (submitted || timeExpired) return
    setAnswers(prev => ({ ...prev, [q.id]: optionIndex }))
  }

  function setOpenAnswer(text) {
    if (submitted || timeExpired) return
    setAnswers(prev => ({ ...prev, [q.id]: text }))
  }

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.point) || 1), 0)

  function calcScore() {
    return questions.reduce((sum, q) => (
      isQuestionCorrect(q, answers[q.id]) ? sum + (Number(q.point) || 1) : sum
    ), 0)
  }

  async function handleSubmit() {
    if (totalAnswered < questions.length) return
    const score  = calcScore()
    const passed = score >= test.pass_score
    const startedAtMs = test?.started_at ? new Date(test.started_at).getTime() : null
    const durationSeconds = startedAtMs ? Math.floor((Date.now() - startedAtMs) / 1000) : 0
    const saved = await submitResult({ testId: Number(id), score, passed, durationSeconds })
    setResult({ score, passed, saved })
    setSubmitted(true)
  }

  if (submitted) {
    const score  = result?.score  ?? calcScore()
    const passed = result?.passed ?? score >= test.pass_score
    return (
      <div className="ongoing-test-wrapper">
        <div className="ongoing-test-container">
          <div className="ongoing-test-header">
            <button className="ongoing-back-btn" onClick={() => navigate('/home')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              მთავარი
            </button>
            <div className="ongoing-test-title-block">
              <h1 className="ongoing-test-title">{subjectName}</h1>
              <span className="ongoing-test-etapi">{test.etapi}</span>
            </div>
          </div>

          <div className="ongoing-result-card">
            <div className={`ongoing-result-icon ${passed ? 'passed' : 'failed'}`}>
              {passed ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2h12v6a6 6 0 0 1-12 0V2z"/>
                  <path d="M6 4H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4"/>
                  <path d="M18 4h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4"/>
                  <path d="M12 14v4"/><path d="M8 22h8"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
            </div>
            <div className={`ongoing-result-label ${passed ? 'passed' : 'failed'}`}>
              {passed ? 'გავიდა!' : 'ვერ გავიდა'}
            </div>
            <div className="ongoing-result-score">
              <span className={passed ? 'score-green' : 'score-red'}>{score}</span>
              <span className="score-max"> / {totalPoints}</span>
            </div>
            <div className="ongoing-result-meta">
              გასვლის ქულა: <strong>{test.pass_score}</strong>
            </div>

            <div className="ongoing-result-save-status">
              {saving && <span className="save-saving">შედეგი ინახება...</span>}
              {!saving && result?.saved && <span className="save-ok">✓ შედეგი შენახულია</span>}
              {!saving && saveError && <span className="save-err">{saveError}</span>}
            </div>

            <div className="ongoing-result-breakdown">
              {questions.map((q, i) => {
                const ok = isQuestionCorrect(q, answers[q.id])
                return (
                  <div key={q.id} className={`result-row ${ok ? 'correct' : 'wrong'}`}>
                    <span className="result-row-num">{i + 1}</span>
                    <span className="result-row-q">{q.question_text}</span>
                    <span className="result-row-badge">{ok ? '✓' : '✗'}</span>
                  </div>
                )
              })}
            </div>

            <button className="ongoing-submit-btn" onClick={() => navigate('/home')}>
              მთავარზე დაბრუნება
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="ongoing-test-wrapper">
        <div className="ongoing-test-not-found">
          <p>ამ ტესტს კითხვები არ აქვს.</p>
          <button className="ongoing-back-btn" onClick={() => navigate('/home')}>მთავარზე დაბრუნება</button>
        </div>
      </div>
    )
  }

  return (
    <div className="ongoing-test-wrapper">
      <div className="ongoing-test-container">

        {/* Header */}
        <div className="ongoing-test-header">
          <button className="ongoing-back-btn" onClick={() => navigate('/home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            უკან
          </button>

          <div className="ongoing-test-title-block">
            <div className="ongoing-live-badge">
              <span className="ongoing-pulse" />
              მიმდინარე
            </div>
            <h1 className="ongoing-test-title">{subjectName}</h1>
            <span className="ongoing-test-etapi">{test.etapi}</span>
          </div>

          <div className="ongoing-test-meta">
            <div className="ongoing-meta-item">
              <span className="ongoing-meta-label">მაქს. ქულა</span>
              <strong className="ongoing-meta-value">{test.max_score}</strong>
            </div>
            <div className="ongoing-meta-item">
              <span className="ongoing-meta-label">გასვლის ქულა</span>
              <strong className="ongoing-meta-value">{test.pass_score}</strong>
            </div>
            <div className="ongoing-meta-item">
              <span className="ongoing-meta-label">პასუხი</span>
              <strong className="ongoing-meta-value">{totalAnswered} / {questions.length}</strong>
            </div>
            {remainingMs !== null && (
              <div className="ongoing-meta-item">
                <span className="ongoing-meta-label">დარჩენილი დრო</span>
                <strong className={`ongoing-meta-value ${remainingMs <= 60_000 ? 'time-critical' : ''}`}>
                  {formatRemaining(remainingMs)}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="ongoing-progress-bar">
          <div
            className="ongoing-progress-fill"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question dots */}
        <div className="ongoing-question-dots">
          {questions.map((qItem, i) => (
            <button
              key={qItem.id}
              className={`q-dot ${i === current ? 'active' : ''} ${isAnswered(qItem, answers[qItem.id]) ? 'answered' : ''}`}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="ongoing-test-body">
          <div className="ongoing-question-card">
            <div className="ongoing-question-number">კითხვა {current + 1} / {questions.length}</div>
            <p className="ongoing-question-text">{q.question_text}</p>

            {q.image_url && (
              <div className="ongoing-question-image">
                <img src={resolveImageUrl(q.image_url)} alt="" />
              </div>
            )}

            {q.type === 'open' ? (
              <div className="ongoing-open-answer">
                <input
                  type="text"
                  className="ongoing-open-input"
                  placeholder="შენი პასუხი..."
                  value={answers[q.id] ?? ''}
                  onChange={e => setOpenAnswer(e.target.value)}
                  disabled={submitted || timeExpired}
                />
              </div>
            ) : (
              <div className="ongoing-options">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`ongoing-option ${answers[q.id] === i ? 'selected' : ''}`}
                    onClick={() => selectAnswer(i)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="option-text">{opt}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="ongoing-nav">
              <button
                className="ongoing-nav-btn"
                onClick={() => setCurrent(c => c - 1)}
                disabled={current === 0}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                წინა
              </button>

              {isLast ? (
                <button
                  className="ongoing-submit-btn"
                  onClick={handleSubmit}
                  disabled={totalAnswered < questions.length || saving}
                >
                  {saving ? 'ინახება...' : 'დასრულება'}
                </button>
              ) : (
                <button
                  className="ongoing-nav-btn next"
                  onClick={() => setCurrent(c => c + 1)}
                >
                  შემდეგი
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OngoingTest

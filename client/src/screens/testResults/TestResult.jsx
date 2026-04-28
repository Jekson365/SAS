import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useCurrentUser } from '../../hooks/users/useCurrentUser'
import { useTests } from '../../hooks/tests/useTests'
import { useTestResultsByTest } from '../../hooks/tests/useTestResultsByTest'
import { useTestQuestions } from '../../hooks/tests/useTestQuestions'
import { resolveImageUrl } from '../../api/questionImage'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrophyIcon,
  TrophyBrokenIcon,
  UserIcon,
} from '../../assets/icons'

const GE_MONTHS = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
]

function formatTestDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const pad = n => String(n).padStart(2, '0')
  return `${d.getDate()} ${GE_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s} წმ`
  return `${m} წთ ${s} წმ`
}

function fullName(user) {
  if (!user) return '—'
  return `${user.name ?? ''} ${user.surname ?? ''}`.trim() || '—'
}

function TestRow({ test, expanded, onToggle, onPickStudent }) {
  const subjectName = test.subject?.name ?? test.subject ?? '—'
  const { results, loading } = useTestResultsByTest(expanded ? test.id : null)

  const sorted = useMemo(
    () => [...results].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [results]
  )
  const passedCount = sorted.filter(r => r.passed).length

  return (
    <div className={`results-test-row ${expanded ? 'open' : ''}`}>
      <button className="results-test-head" onClick={onToggle}>
        <div className="results-test-chev">
          {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </div>
        <div className="results-test-meta">
          <span className="results-test-subject">{subjectName}</span>
          <span className="results-test-etapi">{test.etapi}</span>
        </div>
        <div className="results-test-date">{formatTestDate(test.test_start_date)}</div>
        <div className="results-test-scores">
          <span>მაქს: <strong>{test.max_score}</strong></span>
          <span>გასვლა: <strong>{test.pass_score}</strong></span>
        </div>
        {expanded && (
          <div className="results-test-summary">
            {loading
              ? <span className="results-muted">იტვირთება...</span>
              : <>
                  <span className="results-pill total">სულ: {sorted.length}</span>
                  <span className="results-pill passed">გავიდა: {passedCount}</span>
                  <span className="results-pill failed">ვერ გავიდა: {sorted.length - passedCount}</span>
                </>
            }
          </div>
        )}
      </button>

      {expanded && (
        <div className="results-students-wrap">
          {loading ? (
            <div className="results-empty">იტვირთება...</div>
          ) : sorted.length === 0 ? (
            <div className="results-empty">ამ ტესტს ჯერ არავინ ჩააბარა.</div>
          ) : (
            <div className="results-students">
              {sorted.map(r => (
                <button
                  key={r.id}
                  className={`results-student ${r.passed ? 'passed' : 'failed'}`}
                  onClick={() => onPickStudent({ test, result: r })}
                >
                  <div className="results-student-avatar">
                    <UserIcon />
                  </div>
                  <div className="results-student-info">
                    <span className="results-student-name">{fullName(r.user)}</span>
                    <span className="results-student-email">{r.user?.email ?? ''}</span>
                  </div>
                  <div className="results-student-score">
                    <span className="results-student-score-num">{r.score}</span>
                    <span className="results-student-score-max">/ {test.max_score}</span>
                  </div>
                  <div className="results-student-meta">
                    <span className="results-student-duration">⏱ {formatDuration(r.duration_seconds)}</span>
                    <span className="results-student-date">{formatTestDate(r.submitted_at)}</span>
                  </div>
                  <div className={`results-student-badge ${r.passed ? 'passed' : 'failed'}`}>
                    {r.passed
                      ? <><TrophyIcon /> გავიდა</>
                      : <><TrophyBrokenIcon /> ვერ გავიდა</>
                    }
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StudentDetailModal({ test, result, onClose }) {
  const { questions, loading } = useTestQuestions(test?.id)
  const subjectName = test?.subject?.name ?? test?.subject ?? '—'

  return (
    <div className="results-modal-overlay" onClick={onClose}>
      <div className="results-modal" onClick={e => e.stopPropagation()}>
        <button className="results-modal-close" onClick={onClose} aria-label="დახურვა">×</button>

        <div className="results-modal-header">
          <h3 className="results-modal-title">{fullName(result.user)}</h3>
          <p className="results-modal-sub">
            {subjectName} — {test.etapi}
          </p>

          <div className="results-modal-stats">
            <div className="results-modal-stat">
              <span className="results-modal-stat-label">საბოლოო ქულა</span>
              <strong className={`results-modal-stat-value ${result.passed ? 'green' : 'red'}`}>
                {result.score} / {test.max_score}
              </strong>
            </div>
            <div className="results-modal-stat">
              <span className="results-modal-stat-label">გასვლის ქულა</span>
              <strong className="results-modal-stat-value">{test.pass_score}</strong>
            </div>
            <div className="results-modal-stat">
              <span className="results-modal-stat-label">სტატუსი</span>
              <strong className={`results-modal-stat-value ${result.passed ? 'green' : 'red'}`}>
                {result.passed ? 'გავიდა' : 'ვერ გავიდა'}
              </strong>
            </div>
            <div className="results-modal-stat">
              <span className="results-modal-stat-label">ხანგრძლივობა</span>
              <strong className="results-modal-stat-value">{formatDuration(result.duration_seconds)}</strong>
            </div>
          </div>
        </div>

        <div className="results-modal-body">
          {loading ? (
            <div className="results-empty">იტვირთება...</div>
          ) : questions.length === 0 ? (
            <div className="results-empty">ამ ტესტს კითხვები არ აქვს.</div>
          ) : (
            <ol className="results-questions">
              {questions.map((q, i) => {
                const correctText = q.type === 'open'
                  ? (q.correct_answer ?? '')
                  : (q.options?.[q.correct_index] ?? '')
                return (
                  <li key={q.id} className="results-question">
                    <div className="results-question-head">
                      <span className="results-question-num">კითხვა {i + 1}</span>
                      <span className="results-question-point">{q.point} ქ.</span>
                    </div>
                    <p className="results-question-text">{q.question_text}</p>
                    {q.image_url && (
                      <div className="results-question-image">
                        <img src={resolveImageUrl(q.image_url)} alt="" />
                      </div>
                    )}

                    {q.type === 'open' ? (
                      <div className="results-correct-open">
                        <span className="results-correct-label">სწორი პასუხი:</span>
                        <span className="results-correct-text">{correctText || '—'}</span>
                      </div>
                    ) : (
                      <div className="results-options">
                        {q.options?.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`results-option ${oi === q.correct_index ? 'correct' : ''}`}
                          >
                            <span className="results-option-letter">{String.fromCharCode(65 + oi)}</span>
                            <span className="results-option-text">{opt}</span>
                            {oi === q.correct_index && <span className="results-option-tag">სწორი</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          )}

          <p className="results-note">
            შენიშვნა: მონაცემთა ბაზაში ინახება მხოლოდ საბოლოო ქულა და სტატუსი.
            მოსწავლის თითოეული პასუხი (რა მონიშნა) ცალკე არ ინახება, ამიტომ აქ ნაჩვენებია ტესტის სწორი პასუხები.
          </p>
        </div>
      </div>
    </div>
  )
}

export function TestResult() {
  const navigate = useNavigate()
  const { user, loading: userLoading } = useCurrentUser()
  const { tests, loading: testsLoading } = useTests()

  const [expandedId, setExpandedId] = useState(null)
  const [picked, setPicked] = useState(null)

  const isAdmin = user?.role === 1 || user?.role === 'Admin'

  useEffect(() => {
    if (userLoading) return
    if (!user || !isAdmin) navigate('/home', { replace: true })
  }, [user, userLoading, isAdmin, navigate])

  const sortedTests = useMemo(
    () => [...tests].sort((a, b) => {
      const ta = new Date(a.test_start_date).getTime() || 0
      const tb = new Date(b.test_start_date).getTime() || 0
      return tb - ta
    }),
    [tests]
  )

  if (userLoading || !isAdmin) {
    return (
      <div className="dashboard">
        <Sidebar active="results" mobileTitle="შედეგები" />
        <main className="dashboard-main">
          <div className="results-empty">იტვირთება...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Sidebar active="results" mobileTitle="შედეგები" />

      <main className="dashboard-main">
        <div className="results-container">
          <div className="results-header">
            <h1 className="results-title">ტესტების შედეგები</h1>
            <span className="results-subtitle">ადმინისტრატორის პანელი</span>
          </div>

          {testsLoading ? (
            <div className="results-empty">იტვირთება...</div>
          ) : sortedTests.length === 0 ? (
            <div className="results-empty">ტესტები ვერ მოიძებნა.</div>
          ) : (
            <div className="results-list">
              {sortedTests.map(test => (
                <TestRow
                  key={test.id}
                  test={test}
                  expanded={expandedId === test.id}
                  onToggle={() => setExpandedId(prev => prev === test.id ? null : test.id)}
                  onPickStudent={setPicked}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {picked && (
        <StudentDetailModal
          test={picked.test}
          result={picked.result}
          onClose={() => setPicked(null)}
        />
      )}
    </div>
  )
}

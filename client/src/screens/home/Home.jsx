import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import practiceTests from '../../data/practiceTests.json'
import { useCurrentUser } from '../../hooks/users/useCurrentUser'
import { useLogout } from '../../hooks/users/useLogout'
import { useTests } from '../../hooks/tests/useTests'
import { useStartTest } from '../../hooks/tests/useStartTest'
import { useUserTestResults } from '../../hooks/tests/useUserTestResults'

const NEWS_SLIDES = [
  { id: 1, title: 'სიახლე პირველი', text: 'მოკლე აღწერა პირველი სიახლისთვის.' },
  { id: 2, title: 'სიახლე მეორე',  text: 'მოკლე აღწერა მეორე სიახლისთვის.' },
  { id: 3, title: 'სიახლე მესამე', text: 'მოკლე აღწერა მესამე სიახლისთვის.' },
]

const SIDE_BOXES = Array.from({ length: 6 }, (_, i) => i + 1)

const GE_MONTHS = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
]

function formatTestDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const pad = n => String(n).padStart(2, '0')
  return `${d.getDate()} ${GE_MONTHS[d.getMonth()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatRelativeTime(iso) {
  if (!iso) return ''
  const target = new Date(iso).getTime()
  if (isNaN(target)) return ''
  const diffMs = target - Date.now()
  const past = diffMs < 0
  const absSec = Math.floor(Math.abs(diffMs) / 1000)
  const days = Math.floor(absSec / 86400)
  const hours = Math.floor((absSec % 86400) / 3600)
  const minutes = Math.floor((absSec % 3600) / 60)

  let parts
  if (days > 0)       parts = `${days} დღე ${hours} სთ`
  else if (hours > 0) parts = `${hours} სთ ${minutes} წთ`
  else                parts = `${Math.max(minutes, 1)} წთ`

  return past ? `${parts} წინ` : `${parts}-ში`
}

function TrophyIcon() {
  return (
    <svg className="trophy succeed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2h12v6a6 6 0 0 1-12 0V2z"/>
      <path d="M6 4H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4"/>
      <path d="M18 4h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4"/>
      <path d="M12 14v4"/>
      <path d="M8 22h8"/>
      <path d="M12 18h0"/>
    </svg>
  )
} 

function BrokenTrophyIcon() {
  return (
    <svg className="trophy failed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2h12v6a6 6 0 0 1-12 0V2z"/>
      <path d="M6 4H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4"/>
      <path d="M18 4h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4"/>
      <path d="M12 14v4"/>
      <path d="M8 22h8"/>
      <line x1="4" y1="4" x2="20" y2="20" strokeDasharray="3 2"/>
    </svg>
  )
}

function PracticeCard({ test }) {
  return (
    <div className="box test-card practice">
      <div className="practice-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>

      <span className="test-subject">{test.subject}</span>
      <span className="test-etapi-pill">{test.etapi}</span>

      <div className="test-card-scores">
        <div className="score-row">
          <span>მაქს. ქულა</span>
          <strong>{test.max_score}</strong>
        </div>
        <div className="score-row">
          <span>გასვლის ქულა</span>
          <strong>{test.pass_score}</strong>
        </div>
      </div>

      <button className="register-btn practice-start-btn">ტესტის დაწყება</button>
    </div>
  )
}

function TestCard({ test, upcoming, isAdmin, onStart }) {
  const navigate = useNavigate()
  const subjectName = test.subject?.name ?? test.subject ?? '—'
  return (
    <div className={`box test-card ${upcoming ? 'upcoming' : test.succeed ? 'success' : 'failed'}`}>
      <div className="test-card-top">
        <span className="test-subject">{subjectName}</span>
        {!upcoming && (test.succeed ? <TrophyIcon /> : <BrokenTrophyIcon />)}
      </div>

      <div className="test-card-meta">
        <span className="test-etapi">{test.etapi}</span>
        <span className="test-card-date">{upcoming ? '📅' : '✅'} {formatTestDate(test.test_start_date)}</span>
      </div>

      {upcoming && (
        <div className="test-card-relative">⏳ {formatRelativeTime(test.test_start_date)}</div>
      )}

      <div className="test-card-scores">
        <div className="score-row">
          <span>მაქს. ქულა</span>
          <strong>{test.max_score}</strong>
        </div>
        <div className="score-row">
          <span>გასვლის ქულა</span>
          <strong>{test.pass_score}</strong>
        </div>
        {!upcoming && (
          <div className={`score-row final ${test.succeed ? 'green' : 'red'}`}>
            <span>საბოლოო ქულა</span>
            <strong>{test.final_score}</strong>
          </div>
        )}
      </div>

      {!upcoming && (
        <div className={`test-result-badge ${test.succeed ? 'passed' : 'not-passed'}`}>
          {test.succeed ? 'გავიდა' : 'ვერ გავიდა'}
        </div>
      )}
      {upcoming && (
        isAdmin
          ? (
            <div className="test-card-actions">
              <button
                className="register-btn"
                disabled={test.on_going}
                title={test.on_going ? 'ვერ რედაქტირდება მიმდინარე ტესტი' : undefined}
                onClick={() => !test.on_going && navigate(`/edit-test/${test.id}`)}
              >
                რედაქტირება
              </button>
              {!test.on_going && (
                <button className="register-btn start-test-btn" onClick={() => onStart?.(test.id)}>ტესტის დაწყება</button>
              )}
            </div>
          )
          : <button className="register-btn">რეგისტრაცია</button>
      )}
    </div>
  )
}

function OngoingCard({ test, taken, isAdmin, onStop }) {
  const navigate = useNavigate()
  const subjectName = test.subject?.name ?? test.subject ?? '—'
  return (
    <div className={`box test-card ongoing ${taken ? 'taken' : ''}`}>
      <div className="test-card-top">
        <span className="test-subject">{subjectName}</span>
        {taken
          ? <span className="taken-badge">✓ ჩაბარებული</span>
          : <span className="ongoing-badge">
              <span className="ongoing-pulse" />
              მიმდინარე
            </span>
        }
      </div>

      <div className="test-card-meta">
        <span className="test-etapi">{test.etapi}</span>
        <span className="test-card-date">🕐 {formatTestDate(test.test_start_date)}</span>
      </div>

      <div className="test-card-relative">⏱ დაწყებულია {formatRelativeTime(test.test_start_date)}</div>

      <div className="test-card-scores">
        <div className="score-row">
          <span>მაქს. ქულა</span>
          <strong>{test.max_score}</strong>
        </div>
        <div className="score-row">
          <span>გასვლის ქულა</span>
          <strong>{test.pass_score}</strong>
        </div>
      </div>

      {isAdmin ? (
        <div className="test-card-actions">
          <button className="register-btn" disabled title="ვერ რედაქტირდება მიმდინარე ტესტი">რედაქტირება</button>
          <button className="register-btn stop-test-btn" onClick={() => onStop?.(test.id)}>ტესტის შეწყვეტა</button>
        </div>
      ) : taken
        ? <div className="ongoing-taken-label">ტესტი უკვე ჩაბარებულია</div>
        : <button className="register-btn ongoing-enter-btn" onClick={() => navigate(`/test/${test.id}`)}>ტესტში შესვლა</button>
      }
    </div>
  )
}

function Home() {
  const [slide, setSlide] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const navigate = useNavigate()

  const { user } = useCurrentUser()
  const isAdmin = user?.role === 1 || user?.role === 'Admin'
  const { logout, loading: loggingOut } = useLogout()
  const { tests, loading: testsLoading, refetch: refetchTests } = useTests()
  const { startTest, stopTest } = useStartTest()
  const { results: userResults } = useUserTestResults()

  const handleStartTest = async (id) => {
    const ok = await startTest(id)
    if (ok) await refetchTests()
  }

  const handleStopTest = async (id) => {
    const ok = await stopTest(id)
    if (ok) await refetchTests()
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const takenTestIds = new Set(userResults.map(r => r.test_id))

  const now = Date.now()
  const ongoingTests = tests.filter(t => t.on_going === true)
  
  console.log(tests)

  const futureTests = tests.filter(t => {
    if (t.on_going === false) return true
    const start = new Date(t.test_start_date).getTime()
    return !isNaN(start)
  })

  console.log(ongoingTests)
  console.log(futureTests)

  const completedTests = userResults.map(r => ({
    id:             r.test_id,
    subject:        r.test?.subject ?? '—',
    etapi:          r.test?.etapi ?? '',
    test_start_date: r.test?.test_start_date ?? '',
    max_score:      r.test?.max_score ?? 0,
    pass_score:     r.test?.pass_score ?? 0,
    final_score:    r.score,
    succeed:        r.passed,
  }))

  const prev = () => setSlide(s => (s === 0 ? NEWS_SLIDES.length - 1 : s - 1))
  const next = () => setSlide(s => (s === NEWS_SLIDES.length - 1 ? 0 : s + 1))

  return (
    <div className="dashboard">

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      {rightOpen   && <div className="sidebar-overlay" onClick={() => setRightOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-dot" />
          აპლიკაცია
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <div className="profile-info">
            <span className="profile-name">
              {user ? `${user.name} ${user.surname.charAt(0)}.` : '...'}
            </span>
            <span className="profile-email">{user?.email ?? ''}</span>
            <span className="profile-status">
              <span className="status-dot" />
              აქტიური
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            მთავარი
          </button>
          {isAdmin && (
            <button className="nav-item" onClick={() => navigate('/create-test')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              ტესტის შექმნა
            </button>
          )}
        </nav>

        <button className="nav-item logout" onClick={handleLogout} disabled={loggingOut}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {loggingOut ? '...' : 'გასვლა'}
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="dashboard-main">

        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="topbar-title">მთავარი</span>
          <button className="hamburger" onClick={() => setRightOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>
        </div>

        {/* News Slider */}
        <section className="news-slider">
          <div className="slide-content">
            <h2>{NEWS_SLIDES[slide].title}</h2>
            <p>{NEWS_SLIDES[slide].text}</p>
          </div>
          <div className="slide-controls">
            <button onClick={prev} className="slide-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div className="slide-dots">
              {NEWS_SLIDES.map((_, i) => (
                <span key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
              ))}
            </div>
            <button onClick={next} className="slide-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </section>

        {/* Ongoing tests */}
        {(testsLoading || ongoingTests.length > 0) && (
          <section className="boxes-section">
            <h3 className="section-title">მიმდინარე ტესტები</h3>
            {testsLoading
              ? <p className="section-empty">იტვირთება...</p>
              : <div className="boxes-grid">
                  {ongoingTests.map(test => (
                    <OngoingCard key={test.id} test={test} taken={takenTestIds.has(test.id)} isAdmin={isAdmin} onStop={handleStopTest} />
                  ))}
                </div>
            }
          </section>
        )}

        {/* Upcoming tests */}
        <section className="boxes-section">
          <h3 className="section-title">სამომავლო ტესტები</h3>
          <div className="boxes-grid">
            {futureTests.map(test => (
              <TestCard key={test.id} test={test} upcoming isAdmin={isAdmin} onStart={handleStartTest} />
            ))}
          </div>
        </section>

        {/* Completed tests */}
        {completedTests.length > 0 && (
          <section className="boxes-section">
            <h3 className="section-title">დასრულებული ტესტები</h3>
            <div className="boxes-grid">
              {completedTests.map(test => (
                <TestCard key={test.id} test={test} upcoming={false} />
              ))}
            </div>
          </section>
        )}

        {/* Practice tests */}
        <section className="boxes-section">
          <h3 className="section-title">საცდელი ტესტები</h3>
          <div className="boxes-grid">
            {practiceTests.map(test => (
              <PracticeCard key={test.id} test={test} />
            ))}
          </div>
        </section>

      </main>

      {/* ── Right column ── */}
      <aside className={`dashboard-right ${rightOpen ? 'open' : ''}`}>
        {SIDE_BOXES.map(n => (
          <div key={n} className="side-box" />
        ))}
      </aside>

    </div>
  )
}

export default Home

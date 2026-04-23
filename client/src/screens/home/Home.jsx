import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconLight from '../../assets/icon-light.png'
import practiceTests from '../../data/practiceTests.json'
import { useCurrentUser } from '../../hooks/users/useCurrentUser'
import { useLogout } from '../../hooks/users/useLogout'
import { useTests } from '../../hooks/tests/useTests'
import { useStartTest } from '../../hooks/tests/useStartTest'
import { useUserTestResults } from '../../hooks/tests/useUserTestResults'
import { useRegisterForTest } from '../../hooks/tests/useRegisterForTest'
import { useUserRegistrations } from '../../hooks/tests/useUserRegistrations'
import { useDeleteTest } from '../../hooks/tests/useDeleteTest'
import {
  TrophyIcon,
  TrophyBrokenIcon,
  TrashIcon,
  FileIcon,
  UserIcon,
  HomeIcon,
  PlusCircleIcon,
  LogoutIcon,
  MenuIcon,
  GridIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../assets/icons'

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

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function formatCountdown(diffMs) {
  if (!Number.isFinite(diffMs) || diffMs <= 0) return '00:00:00'
  const total = Math.floor(diffMs / 1000)
  const days  = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const mins  = Math.floor((total % 3600) / 60)
  const secs  = total % 60
  const pad   = n => String(n).padStart(2, '0')
  const hms   = `${pad(hours)}:${pad(mins)}:${pad(secs)}`
  return days > 0 ? `${days} დღე ${hms}` : hms
}

function PracticeCard({ test }) {
  return (
    <div className="box test-card practice">
      <div className="practice-icon">
        <FileIcon />
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

function TestCard({ test, upcoming, isAdmin, onStart, onRegister, onDelete, registered }) {
  const navigate = useNavigate()
  const subjectName = test.subject?.name ?? test.subject ?? '—'
  const now = useNow(upcoming ? 1000 : 60_000)
  const startMs = test.test_start_date ? new Date(test.test_start_date).getTime() : null
  const untilStartMs = startMs ? startMs - now : null
  return (
    <div className={`box test-card ${upcoming ? 'upcoming' : test.succeed ? 'success' : 'failed'}`}>
      {isAdmin && upcoming && onDelete && (
        <button
          className="test-delete-btn"
          onClick={() => onDelete(test)}
          title="ტესტის წაშლა"
          aria-label="ტესტის წაშლა"
        >
          <TrashIcon />
        </button>
      )}
      <div className="test-card-top">
        <span className="test-subject">{subjectName}</span>
        {!upcoming && (test.succeed ? <TrophyIcon className="trophy succeed" /> : <TrophyBrokenIcon className="trophy failed" />)}
      </div>

      <div className="test-card-meta">
        <span className="test-etapi">{test.etapi}</span>
        <span className="test-card-date">{upcoming ? '📅' : '✅'} {formatTestDate(test.test_start_date)}</span>
      </div>

      {upcoming && (
        <div className="test-card-relative">
          ⏳ {untilStartMs !== null && untilStartMs > 0
            ? `დაიწყება ${formatCountdown(untilStartMs)}-ში`
            : formatRelativeTime(test.test_start_date)}
        </div>
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
                className="register-btn practice-start-btn"
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
          : registered
            ? <button className="register-btn" disabled>რეგისრირებული</button>
            : <button className="register-btn" onClick={() => onRegister?.(test)}>რეგისტრაცია</button>
      )}
    </div>
  )
}

function OngoingCard({ test, taken, isAdmin, onStop, registration }) {
  const navigate = useNavigate()
  const subjectName = test.subject?.name ?? test.subject ?? '—'
  const isRegistered = Boolean(registration)
  const isPaid       = Boolean(registration?.is_paid)
  const now = useNow(1000)
  const endMs = test.started_at && test.duration_minutes
    ? new Date(test.started_at).getTime() + Number(test.duration_minutes) * 60_000
    : null
  const remainingMs = endMs !== null ? endMs - now : null
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

      <div className={`test-card-relative ${remainingMs !== null && remainingMs <= 60_000 ? 'time-critical' : ''}`}>
        ⏱ {remainingMs !== null
          ? (remainingMs > 0 ? `დარჩენილია ${formatCountdown(remainingMs)}` : 'დრო ამოიწურა')
          : `დაწყებულია ${formatRelativeTime(test.test_start_date)}`}
      </div>

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
        : !isRegistered
          ? <button className="register-btn" disabled>არ ხართ რეგისტრირებული</button>
          : !isPaid
            ? <button className="register-btn" disabled>გადახდა არ არის დასრულებული</button>
            : <button className="register-btn ongoing-enter-btn" onClick={() => navigate(`/test/${test.id}`)}>ტესტში შესვლა</button>
      }
    </div>
  )
}

function Home() {
  const [slide, setSlide] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const [registerModal, setRegisterModal] = useState({ test: null, stage: 'confirm', done: false })
  const navigate = useNavigate()

  const { user } = useCurrentUser()
  const isAdmin = user?.role === 1 || user?.role === 'Admin'
  const { logout, loading: loggingOut } = useLogout()
  const { tests, loading: testsLoading, refetch: refetchTests } = useTests()
  const { startTest, stopTest } = useStartTest()
  const { results: userResults } = useUserTestResults()
  const { registerAndPay, loading: registering, error: registerError } = useRegisterForTest()
  const { registrations, refetch: refetchRegistrations } = useUserRegistrations()
  const { deleteTest } = useDeleteTest()
  const registeredTestIds   = new Set(registrations.map(r => r.test_id))
  const registrationsByTest = new Map(registrations.map(r => [r.test_id, r]))

  const handleStartTest = async (id) => {
    const ok = await startTest(id)
    if (ok) await refetchTests()
  }

  const handleStopTest = async (id) => {
    const ok = await stopTest(id)
    if (ok) await refetchTests()
  }

  const handleDeleteTest = async (test) => {
    const subjectName = test.subject?.name ?? test.subject ?? ''
    const label = [subjectName, test.etapi].filter(Boolean).join(' — ')
    const confirmMsg = label
      ? `წავშალოთ ტესტი "${label}"?`
      : 'წავშალოთ ეს ტესტი?'
    if (!window.confirm(confirmMsg)) return
    const ok = await deleteTest(test.id)
    if (ok) await refetchTests()
  }

  const openRegisterModal = (test) =>
    setRegisterModal({ test, stage: 'confirm', done: false })

  const closeRegisterModal = () =>
    setRegisterModal({ test: null, stage: 'confirm', done: false })

  const handleConfirmRegister = () =>
    setRegisterModal(prev => ({ ...prev, stage: 'pay' }))

  const handlePay = async () => {
    if (!registerModal.test) return
    const saved = await registerAndPay(registerModal.test.id)
    if (saved) {
      await refetchRegistrations()
      setRegisterModal(prev => ({ ...prev, done: true }))
    }
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


  console.log(completedTests)

  const prev = () => setSlide(s => (s === 0 ? NEWS_SLIDES.length - 1 : s - 1))
  const next = () => setSlide(s => (s === NEWS_SLIDES.length - 1 ? 0 : s + 1))

  return (
    <div className="dashboard">

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      {rightOpen   && <div className="sidebar-overlay" onClick={() => setRightOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={iconLight} alt="" className="logo-icon" />
          ინოვატორი
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            <UserIcon />
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
            <HomeIcon />
            მთავარი
          </button>
          {isAdmin && (
            <button className="nav-item" onClick={() => navigate('/create-test')}>
              <PlusCircleIcon />
              ტესტის შექმნა
            </button>
          )}
        </nav>

        <button className="nav-item logout" onClick={handleLogout} disabled={loggingOut}>
          <LogoutIcon />
          {loggingOut ? '...' : 'გასვლა'}
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="dashboard-main">

        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>
            <MenuIcon />
          </button>
          <span className="topbar-title">მთავარი</span>
          <button className="hamburger" onClick={() => setRightOpen(o => !o)}>
            <GridIcon />
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
              <ChevronLeftIcon />
            </button>
            <div className="slide-dots">
              {NEWS_SLIDES.map((_, i) => (
                <span key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
              ))}
            </div>
            <button onClick={next} className="slide-btn">
              <ChevronRightIcon />
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
                    <OngoingCard
                      key={test.id}
                      test={test}
                      taken={takenTestIds.has(test.id)}
                      isAdmin={isAdmin}
                      onStop={handleStopTest}
                      registration={registrationsByTest.get(test.id) ?? null}
                    />
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
              <TestCard
                key={test.id}
                test={test}
                upcoming
                isAdmin={isAdmin}
                onStart={handleStartTest}
                onRegister={openRegisterModal}
                onDelete={handleDeleteTest}
                registered={registeredTestIds.has(test.id)}
              />
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

      {/* ── Registration modal ── */}
      {registerModal.test && (
        <div className="reg-modal-overlay" onClick={closeRegisterModal}>
          <div className="reg-modal" onClick={e => e.stopPropagation()}>
            <button className="reg-modal-close" onClick={closeRegisterModal} aria-label="დახურვა">×</button>

            {registerModal.done ? (
              <>
                <h3 className="reg-modal-title">რეგისტრაცია დასრულდა ✓</h3>
                <p className="reg-modal-sub">
                  {registerModal.test.subject?.name ?? registerModal.test.subject ?? ''} — {registerModal.test.etapi}
                </p>
                <button className="reg-modal-primary" onClick={closeRegisterModal}>დახურვა</button>
              </>
            ) : registerModal.stage === 'confirm' ? (
              <>
                <h3 className="reg-modal-title">გსურთ რეგისტრაცია?</h3>
                <p className="reg-modal-sub">
                  {registerModal.test.subject?.name ?? registerModal.test.subject ?? ''} — {registerModal.test.etapi}
                </p>
                <div className="reg-modal-actions">
                  <button className="reg-modal-secondary" onClick={closeRegisterModal}>არა</button>
                  <button className="reg-modal-primary" onClick={handleConfirmRegister}>კი</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="reg-modal-title">გადახდა</h3>
                <p className="reg-modal-sub">
                  {registerModal.test.subject?.name ?? registerModal.test.subject ?? ''} — {registerModal.test.etapi}
                </p>
                {registerError && <p className="reg-modal-error">{registerError}</p>}
                <button className="reg-modal-primary" onClick={handlePay} disabled={registering}>
                  {registering ? 'მიმდინარეობს...' : 'გადახდა'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default Home

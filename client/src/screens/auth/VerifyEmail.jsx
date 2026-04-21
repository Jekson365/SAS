import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useVerifyEmail } from '../../hooks/users/useVerifyEmail'

const AUTH_IMAGE = 'https://images.pexels.com/photos/5306476/pexels-photo-5306476.jpeg'
const EXPIRY_SECONDS = 120

function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const email    = location.state?.email

  const { verify, loading, error } = useVerifyEmail()
  const [code,      setCode]      = useState('')
  const [remaining, setRemaining] = useState(EXPIRY_SECONDS)
  const expiresAt = useRef(Date.now() + EXPIRY_SECONDS * 1000)

  useEffect(() => {
    if (!email) navigate('/register', { replace: true })
  }, [email, navigate])

  useEffect(() => {
    const tick = () => {
      const secs = Math.max(0, Math.round((expiresAt.current - Date.now()) / 1000))
      setRemaining(secs)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const expired = remaining <= 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (expired) return
    const data = await verify(email, code.trim())
    if (data) navigate('/home')
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <img src={AUTH_IMAGE} alt="auth visual" />
        </div>

        <div className="auth-right">
          <h1>ვერიფიკაცია</h1>
          <p className="auth-subtitle">
            კოდი გამოგზავნილია მეილზე <strong>{email}</strong>. კოდი მოქმედია 2 წუთი.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="6-ნიშნა კოდი"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
                required
                disabled={expired}
              />
            </div>

            <p className="auth-subtitle">
              {expired ? 'კოდის ვადა ამოიწურა.' : `დარჩენილი დრო: ${mm}:${ss}`}
            </p>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading || expired || code.length === 0}>
              {loading ? 'იტვირთება...' : 'დადასტურება'}
            </button>

            <p className="auth-switch">
              {expired
                ? <Link to="/register">დაბრუნდი რეგისტრაციაზე</Link>
                : <Link to="/register">შეცვალე მეილი</Link>}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail

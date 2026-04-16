import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../../hooks/users/useLogin'

const AUTH_IMAGE = 'https://images.pexels.com/photos/5306476/pexels-photo-5306476.jpeg'

function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useLogin()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await login(email, password)
    if (data) navigate('/home')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-left">
          <img src={AUTH_IMAGE} alt="auth visual" />
        </div>

        <div className="auth-right">
          <h1>შესვლა</h1>
          <p className="auth-subtitle">გამარჯობა! შედი შენს ანგარიშზე.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
              <input
                type="email"
                placeholder="მეილი"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                placeholder="პაროლი"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'იტვირთება...' : 'შესვლა'}
            </button>

            <p className="auth-switch">
              არ გაქვს ანგარიში? <Link to="/register">რეგისტრაცია</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Login

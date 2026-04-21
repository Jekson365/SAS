import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../../hooks/users/useRegister'

const AUTH_IMAGE = 'https://images.pexels.com/photos/5306476/pexels-photo-5306476.jpeg'

function Register() {
  const navigate = useNavigate()
  const { register, loading, error } = useRegister()

  const [fields, setFields] = useState({
    name:           '',
    surname:        '',
    private_number: '',
    mobile_number:  '',
    email:          '',
    password:       '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmError,    setConfirmError]    = useState(null)

  const set = key => e => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (fields.password !== confirmPassword) {
      setConfirmError('პაროლები არ ემთხვევა.')
      return
    }
    setConfirmError(null)
    const data = await register(fields)
    if (data) navigate('/verify-email', { state: { email: fields.email } })
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-left">
          <img src={AUTH_IMAGE} alt="auth visual" />
        </div>

        <div className="auth-right">
          <h1>რეგისტრაცია</h1>
          <p className="auth-subtitle">შექმენი ანგარიში და დაიწყე.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <input type="text" placeholder="სახელი" value={fields.name} onChange={set('name')} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <input type="text" placeholder="გვარი" value={fields.surname} onChange={set('surname')} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <input type="text" placeholder="პირადი ნომერი" value={fields.private_number} onChange={set('private_number')} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.09 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.97.72 2.9a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.18-1.18a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0 1 22 16.92z"/>
              </svg>
              <input type="tel" placeholder="მობილური ნომერი" value={fields.mobile_number} onChange={set('mobile_number')} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
              <input type="email" placeholder="მეილი" value={fields.email} onChange={set('email')} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type="password" placeholder="პაროლი" value={fields.password} onChange={set('password')} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type="password" placeholder="გაიმეორე პაროლი" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>

            {(error || confirmError) && (
              <p className="auth-error">{confirmError ?? error}</p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'იტვირთება...' : 'რეგისტრაცია'}
            </button>

            <p className="auth-switch">
              უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Register

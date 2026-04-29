import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconLight from '../assets/icon-light.png'
import { useCurrentUser } from '../hooks/users/useCurrentUser'
import { useLogout } from '../hooks/users/useLogout'
import {
  UserIcon,
  HomeIcon,
  PlusCircleIcon,
  LogoutIcon,
  MenuIcon,
  GridIcon,
} from '../assets/icons'

export function Sidebar({ active = 'home', mobileTitle = '', onToggleRight }) {
  const navigate = useNavigate()
  const { user } = useCurrentUser()
  const { logout, loading: loggingOut } = useLogout()
  const [open, setOpen] = useState(false)

  const isAdmin = user?.role === 1 || user?.role === 'Admin'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
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
              {user ? `${user.name} ${user.surname?.charAt(0) ?? ''}.` : '...'}
            </span>
            <span className="profile-email">{user?.email ?? ''}</span>
            <span className="profile-status">
              <span className="status-dot" />
              აქტიური
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${active === 'home' ? 'active' : ''}`}
            onClick={() => go('/home')}
          >
            <HomeIcon />
            მთავარი
          </button>
          {isAdmin && (
            <>
              <button
                className={`nav-item ${active === 'create-test' ? 'active' : ''}`}
                onClick={() => go('/create-test')}
              >
                <PlusCircleIcon />
                ტესტის შექმნა
              </button>
              <button
                className={`nav-item ${active === 'create-event' ? 'active' : ''}`}
                onClick={() => go('/create-event')}
              >
                <PlusCircleIcon />
                ოლიმპიადა
              </button>
              <button
                className={`nav-item ${active === 'results' ? 'active' : ''}`}
                onClick={() => go('/test-results')}
              >
                <PlusCircleIcon />
                შედეგები
              </button>
            </>
          )}
        </nav>

        <button className="nav-item logout" onClick={handleLogout} disabled={loggingOut}>
          <LogoutIcon />
          {loggingOut ? '...' : 'გასვლა'}
        </button>
      </aside>

      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setOpen(o => !o)}>
          <MenuIcon />
        </button>
        <span className="topbar-title">{mobileTitle}</span>
        {onToggleRight && (
          <button className="hamburger" onClick={onToggleRight}>
            <GridIcon />
          </button>
        )}
      </div>
    </>
  )
}

export default Sidebar

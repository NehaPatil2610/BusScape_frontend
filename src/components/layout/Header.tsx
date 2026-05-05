import { useLogto } from '@logto/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogtoUser } from '../../hooks/useLogtoUser'
import type { ThemeMode } from '../../types/app'

const SIGN_IN_REDIRECT = `${window.location.origin}/callback`
const POST_SIGN_OUT_REDIRECT = `${window.location.origin}/`

interface HeaderProps {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { signIn, signOut } = useLogto()
  const { isAuthenticated, user } = useLogtoUser()
  const userLabel = user?.name ?? user?.username ?? user?.email ?? ''

  const themeIcon = theme === 'dark' ? 'light_mode' : 'dark_mode'

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="top-header">
      <div className="header-content">
        <Link className="brand" to="/" onClick={closeMobileMenu}>
          <span className="material-symbols-outlined brand-icon">directions_bus</span>
          <span className="brand-name">BusScape</span>
        </Link>

        <div className="header-right">
          <button
            type="button"
            aria-label="Toggle navigation"
            className="icon-button mobile-menu-button"
            onClick={() => {
              setIsMobileMenuOpen((previousState) => !previousState)
            }}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/bookings" onClick={closeMobileMenu}>
              Bookings
            </Link>
            <Link to="/about" onClick={closeMobileMenu}>
              About
            </Link>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              aria-label="Toggle theme"
              className="icon-button"
              onClick={onToggleTheme}
            >
              <span className="material-symbols-outlined">{themeIcon}</span>
            </button>
            <Link
              to="/bookings"
              aria-label="Open profile actions"
              className="icon-button"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
            {isAuthenticated ? (
              <>
                {userLabel && (
                  <span
                    className="header-user-label"
                    style={{ fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    {userLabel}
                  </span>
                )}
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Sign out"
                  onClick={() => signOut(POST_SIGN_OUT_REDIRECT)}
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="icon-button"
                aria-label="Sign in"
                onClick={() => signIn(SIGN_IN_REDIRECT)}
              >
                <span className="material-symbols-outlined">login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

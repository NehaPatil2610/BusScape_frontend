import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ThemeMode } from '../../types/app'

interface HeaderProps {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            <Link to="/bookings" onClick={closeMobileMenu}>
              Bookings
            </Link>
            <Link to="/" onClick={closeMobileMenu}>
              Home
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

          </div>
        </div>
      </div>
    </header>
  )
}

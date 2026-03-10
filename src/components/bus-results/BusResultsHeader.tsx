import { Link } from 'react-router-dom'
import type { ThemeMode } from '../../types/app'

interface BusResultsHeaderProps {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function BusResultsHeader({ theme, onToggleTheme }: BusResultsHeaderProps) {
  return (
    <header className="results-header">
      <div className="results-header-inner">
        <div className="results-header-left">
          <Link className="results-brand" to="/">
            <span className="material-symbols-outlined">directions_bus</span>
            <h2>BusScape</h2>
          </Link>
          <label className="results-top-search" htmlFor="results-route-search">
            <span className="material-symbols-outlined">search</span>
            <input id="results-route-search" type="text" placeholder="Search routes..." />
          </label>
        </div>

        <nav className="results-header-right">
          <div className="results-links">
            <Link to="/bookings">My Bookings</Link>
          </div>

          <div className="results-header-actions">
            <button type="button" className="results-icon-btn" aria-label="Toggle theme" onClick={onToggleTheme}>
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button type="button" className="results-icon-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link to="/bookings" aria-label="Open profile">
              <img
                className="results-avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLXNUrn2p6Cyh2tYKik7fqm8rYN-4gOUC5fSZYdOVFnju9sp3s8cw378meEgIrSdzbF-cZbckPcVi5Ja5LtJT3Jkxitj87dRZjxhT7b0HgaEPwP3mC9BiyKYBK29jdeaIt5QjCNHe4jUVdttr0zXsDt_RWbYkQ6MQJDBlX7IbZ_jBiLBhVIRMfpk_zT-rVyjj6bL8fTzSPy_UZjSfpTKvvvmvgC1e462t2z1YmAdrSa4E7-K8_HMgVql_wXyOe2Ma8uD9Hg_CuLqS1"
                alt="User profile avatar"
              />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

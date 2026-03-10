import { Link } from 'react-router-dom'
import type { ThemeMode } from '../../types/app'
import { formatIsoDateLabel } from '../../utils/formatters'

interface BusDetailsHeaderProps {
  theme: ThemeMode
  onToggleTheme: () => void
  departureCity: string
  arrivalCity: string
  date: string
  departureTime: string
}

export function BusDetailsHeader({
  theme,
  onToggleTheme,
  departureCity,
  arrivalCity,
  date,
  departureTime,
}: BusDetailsHeaderProps) {
  return (
    <header className="seat-header">
      <div className="seat-header-inner">
        <div className="seat-brand-wrap">
          <div className="seat-brand-icon">
            <span className="material-symbols-outlined">directions_bus</span>
          </div>
          <div>
            <h2>BusScape</h2>
            <p>Premium Travel</p>
          </div>
        </div>

        <div className="seat-route-chip-wrap">
          <div className="seat-route-chip">
            <span>{departureCity || '--'}</span>
            <span className="material-symbols-outlined">trending_flat</span>
            <span>{arrivalCity || '--'}</span>
          </div>
          <div className="seat-mini-chip">{formatIsoDateLabel(date)}</div>
          <div className="seat-mini-chip">{departureTime}</div>
        </div>

        <div className="seat-header-actions">
          <button type="button" className="seat-icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button type="button" className="seat-icon-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link to="/bookings" aria-label="Open profile">
            <img
              className="seat-avatar"
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwimeZa9cew4pLpx08eBLDOrcYx93TU40juKmmsLznptEXy1cYHMU_4uj8cFOgIelWtWY3ZrxvjwPLxQNKmM72BEOfAH4AYCuPz3PRfWz-4jwkRz-I7MYNBZY0kHzHLUI0VqV9mOWis9hw7jXbQId9RoGTB4iWdpJFe7f1kkR-Gd6gjS2UI__WWQuM6Vz1M5mckP3kaFiDW0BLSPb0DWg-ahmGWjy0TdXKyiBxm83b_LGasOgi9xBhQKCIceob4aTfSUaDXgsHzMzo"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}

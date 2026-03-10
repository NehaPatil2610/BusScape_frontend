import { Link } from 'react-router-dom'

interface BookingsErrorStateProps {
  message: string
  onRetry: () => void
}

export function BookingsLoadingState() {
  return (
    <div className="bookings-skeleton-list" aria-label="Loading bookings">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="bookings-skeleton-card" key={`bookings-skeleton-${index}`}>
          <div className="skeleton-box bookings-skeleton-row short" />
          <div className="skeleton-box bookings-skeleton-row medium" />
          <div className="skeleton-box bookings-skeleton-row long" />
          <div className="skeleton-box bookings-skeleton-row medium" />
        </div>
      ))}
    </div>
  )
}

export function BookingsEmptyState() {
  return (
    <div className="bookings-state">
      <h3>No bookings yet</h3>
      <p>You don’t have any bookings in this section right now.</p>
      <Link to="/">Explore Buses</Link>
    </div>
  )
}

export function BookingsErrorState({ message, onRetry }: BookingsErrorStateProps) {
  return (
    <div className="bookings-state">
      <h3>Unable to fetch bookings</h3>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

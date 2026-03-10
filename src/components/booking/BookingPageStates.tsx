import { Link } from 'react-router-dom'

interface BookingPageErrorStateProps {
  message: string
  onRetry: () => void
}

interface MissingBookingContextStateProps {
  detailsUrl: string
}

export function BookingPageLoadingState() {
  return (
    <div className="booking-page-loader-grid" aria-label="Loading booking details">
      <div className="booking-page-loader-left">
        <div className="skeleton-box booking-skeleton-line booking-skeleton-title" />
        <div className="skeleton-box booking-skeleton-line booking-skeleton-subtitle" />
        <div className="skeleton-box booking-skeleton-card" />
        <div className="skeleton-box booking-skeleton-card" />
      </div>
      <div className="skeleton-box booking-skeleton-summary" />
    </div>
  )
}

export function MissingBookingContextState({
  detailsUrl,
}: MissingBookingContextStateProps) {
  return (
    <div className="booking-page-state">
      <h3>Missing booking details</h3>
      <p>Select seats first, then proceed to passenger details.</p>
      <Link to={detailsUrl}>Back to Seat Selection</Link>
    </div>
  )
}

export function BookingPageErrorState({
  message,
  onRetry,
}: BookingPageErrorStateProps) {
  return (
    <div className="booking-page-state">
      <h3>Unable to load booking information</h3>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

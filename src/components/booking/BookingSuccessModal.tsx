interface BookingSuccessModalProps {
  isOpen: boolean
  seatNumbers: number[]
  totalAmountLabel: string
  redirectInSeconds: number
  onGoHome: () => void
}

export function BookingSuccessModal({
  isOpen,
  seatNumbers,
  totalAmountLabel,
  redirectInSeconds,
  onGoHome,
}: BookingSuccessModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="booking-success-overlay" role="dialog" aria-modal="true">
      <div className="booking-success-modal">
        <div className="booking-success-icon">
          <span className="material-symbols-outlined">check_circle</span>
        </div>

        <h3>Booking Confirmed</h3>
        <p>Your booking was successful. Ticket details are being sent to your email.</p>

        <div className="booking-success-meta">
          <div>
            <span>Seats</span>
            <strong>{seatNumbers.join(', ')}</strong>
          </div>
          <div>
            <span>Total Paid</span>
            <strong>{totalAmountLabel}</strong>
          </div>
        </div>

        <button type="button" onClick={onGoHome}>
          Go to Home
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        <small>Redirecting to home in {redirectInSeconds}s...</small>
      </div>
    </div>
  )
}

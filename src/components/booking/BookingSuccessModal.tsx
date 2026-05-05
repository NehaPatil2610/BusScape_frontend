interface BookingSuccessModalProps {
  isOpen: boolean
  seatNumbers: number[]
  totalAmountLabel: string
  redirectInSeconds: number
  onGoHome: () => void
  onDownloadTicket?: () => void
}

export function BookingSuccessModal({
  isOpen,
  seatNumbers,
  totalAmountLabel,
  redirectInSeconds,
  onGoHome,
  onDownloadTicket,
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

        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onDownloadTicket && (
            <button
              type="button"
              onClick={onDownloadTicket}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span className="material-symbols-outlined">download</span>
              Download Ticket
            </button>
          )}
          <button type="button" onClick={onGoHome}>
            Go to Home
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <small>Redirecting to home in {redirectInSeconds}s...</small>
      </div>
    </div>
  )
}

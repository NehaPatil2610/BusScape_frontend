export type BookingStatusTone =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'default'

export interface BookingPassengerRow {
  name: string
  seatLabel: string
}

interface BookingHistoryCardProps {
  bookingId: string
  statusLabel: string
  statusTone: BookingStatusTone
  busName: string
  busSubtitle: string
  routeLabel: string
  dateLabel: string
  amountLabel: string
  passengerRows: BookingPassengerRow[]
  isPast: boolean
  isExpanded: boolean
  onToggleExpanded: () => void
  canReview?: boolean
  onRate?: () => void
  onDownloadTicket?: () => void
}

export function BookingHistoryCard({
  bookingId,
  statusLabel,
  statusTone,
  busName,
  busSubtitle,
  routeLabel,
  dateLabel,
  amountLabel,
  passengerRows,
  isPast,
  isExpanded,
  onToggleExpanded,
  canReview,
  onRate,
  onDownloadTicket,
}: BookingHistoryCardProps) {
  return (
    <article className={`booking-history-card ${isPast ? 'past' : ''}`}>
      <div className="booking-history-main">
        <div className="booking-history-icon-wrap">
          <span className="material-symbols-outlined">directions_bus</span>
        </div>

        <div className="booking-history-info">
          <div className="booking-history-top-row">
            <span className={`booking-status-chip tone-${statusTone}`}>{statusLabel}</span>
            <span className="booking-id-label">Booking ID: {bookingId}</span>
          </div>

          <h3>{busName}</h3>
          <p className="booking-bus-subtitle">{busSubtitle}</p>

          <div className="booking-route-meta">
            <span>
              <span className="material-symbols-outlined">location_on</span>
              {routeLabel}
            </span>
            <span>
              <span className="material-symbols-outlined">calendar_today</span>
              {dateLabel}
            </span>
          </div>
        </div>

        <div className="booking-history-actions">
          <strong>{amountLabel}</strong>
          {onDownloadTicket && (
            <button
              type="button"
              onClick={onDownloadTicket}
              style={{
                marginTop: '0.5rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                download
              </span>
              Ticket
            </button>
          )}
          {canReview && onRate && (
            <button
              type="button"
              onClick={onRate}
              style={{
                marginTop: '0.5rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              ★ Rate this trip
            </button>
          )}
        </div>
      </div>

      {passengerRows.length > 0 ? (
        <div className="booking-passengers-wrap">
          <button
            type="button"
            className="booking-passengers-head"
            onClick={onToggleExpanded}
          >
            <span>
              <span className="material-symbols-outlined">group</span>
              Passenger Details
            </span>
            <span className="material-symbols-outlined">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isExpanded ? (
            <div className="booking-passengers-grid">
              {passengerRows.map((passenger, index) => (
                <div className="booking-passenger-row" key={`${passenger.name}-${index}`}>
                  <div>
                    <p>Passenger {index + 1}</p>
                    <h4>{passenger.name}</h4>
                  </div>
                  <div>
                    <p>Seat</p>
                    <h5>{passenger.seatLabel}</h5>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

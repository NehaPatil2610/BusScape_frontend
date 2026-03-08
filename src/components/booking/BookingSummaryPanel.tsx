import type { Bus } from '../../types/home'
import {
  formatIsoDateLabel,
  formatStopTimeLabel,
  inrCurrencyFormatter,
} from '../../utils/formatters'

interface BookingSummaryPanelProps {
  bus: Bus | null
  departureCity: string
  arrivalCity: string
  date: string
  seatNumbers: number[]
  isSubmitting: boolean
  onConfirmBooking: () => void
}

export function BookingSummaryPanel({
  bus,
  departureCity,
  arrivalCity,
  date,
  seatNumbers,
  isSubmitting,
  onConfirmBooking,
}: BookingSummaryPanelProps) {
  const origin = bus?.stops[0]
  const destination = bus?.stops[bus.stops.length - 1]
  const departureLabel = origin?.stopName ?? (departureCity || '--')
  const arrivalLabel = destination?.stopName ?? (arrivalCity || '--')
  const departureTimeLabel = formatStopTimeLabel(origin?.departureTime ?? origin?.arrivalTime)
  const arrivalTimeLabel = formatStopTimeLabel(destination?.arrivalTime ?? destination?.departureTime)

  const baseFare = bus ? seatNumbers.length * bus.price : 0
  const taxesAndFees = Math.round(baseFare * 0.05)
  const totalAmount = baseFare + taxesAndFees

  return (
    <aside className="booking-summary-wrap">
      <div className="booking-summary-card">
        <div className="booking-summary-head">
          <h3>Booking Summary</h3>
        </div>

        <div className="booking-summary-body">
          <div className="booking-bus-title-block">
            <div>
              <h4>{bus?.name ?? 'Bus details loading...'}</h4>
              <p>{bus ? `${bus.seatTypes.join(', ')} • ${bus.isAC ? 'AC' : 'Non-AC'}` : '--'}</p>
            </div>
            <span>{bus?.isAC ? 'Luxury A/C' : 'Standard'}</span>
          </div>

          <div className="booking-route-points">
            <div className="booking-route-node">
              <p>Departure</p>
              <h5>{departureLabel}</h5>
              <span>
                {formatIsoDateLabel(date)} • {departureTimeLabel}
              </span>
            </div>
            <div className="booking-route-node">
              <p>Arrival</p>
              <h5>{arrivalLabel}</h5>
              <span>
                {formatIsoDateLabel(date)} • {arrivalTimeLabel}
              </span>
            </div>
          </div>

          <div className="booking-seat-row">
            <span>Seat Numbers</span>
            <strong>{seatNumbers.length > 0 ? seatNumbers.join(', ') : '--'}</strong>
          </div>

          <div className="booking-price-breakdown">
            <div>
              <span>Base Fare ({seatNumbers.length} seat(s))</span>
              <strong>{inrCurrencyFormatter.format(baseFare)}</strong>
            </div>
            <div>
              <span>Taxes &amp; Fees</span>
              <strong>{inrCurrencyFormatter.format(taxesAndFees)}</strong>
            </div>
            <div className="booking-total-row">
              <span>Total Amount</span>
              <strong>{inrCurrencyFormatter.format(totalAmount)}</strong>
            </div>
          </div>

          <button
            type="button"
            className="booking-confirm-btn"
            onClick={onConfirmBooking}
            disabled={isSubmitting || seatNumbers.length === 0 || !bus}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          <p className="booking-terms-note">
            By clicking confirm, you agree to Terms of Service and Cancellation
            Policy.
          </p>
        </div>
      </div>

      <div className="booking-secure-badge">
        <span className="material-symbols-outlined">verified_user</span>
        <span>Secure 256-bit SSL Payment</span>
      </div>
    </aside>
  )
}

import type { Bus, BusSeat } from '../../types/home'
import {
  formatIsoDateLabel,
  formatStopTimeLabel,
  inrCurrencyFormatter,
} from '../../utils/formatters'

interface BusBookingSummaryProps {
  bus: Bus
  selectedSeats: BusSeat[]
  departureCity: string
  arrivalCity: string
  date: string
  onProceedToPayment: () => void
}

function getRouteEndpoints(bus: Bus) {
  const origin = bus.stops[0]
  const destination = bus.stops[bus.stops.length - 1]

  return {
    origin,
    destination,
  }
}

function getSeatLabel(seat: BusSeat) {
  const prefix = seat.seatType === 'sleeper' ? 'S' : 'L'
  const seatTypeLabel = seat.seatType === 'sleeper' ? 'Sleeper' : 'Seater'

  return `${prefix}${seat.seatNumber} (${seatTypeLabel})`
}

export function BusBookingSummary({
  bus,
  selectedSeats,
  departureCity,
  arrivalCity,
  date,
  onProceedToPayment,
}: BusBookingSummaryProps) {
  const { origin, destination } = getRouteEndpoints(bus)

  const baseFare = selectedSeats.length * bus.price
  const taxesAndFees = Math.round(baseFare * 0.05)
  const totalAmount = baseFare + taxesAndFees

  return (
    <aside className="seat-summary-wrap">
      <div className="seat-summary-card">
        <h2>Booking Summary</h2>

        <div className="route-summary-box">
          <div className="route-points">
            <div className="route-point-dot start" />
            <div className="route-point-line" />
            <span className="material-symbols-outlined">location_on</span>
          </div>

          <div className="route-point-labels">
            <div>
              <p>Departure</p>
              <h4>{origin?.stopName ?? (departureCity || '--')}</h4>
            </div>
            <div>
              <p>Arrival</p>
              <h4>{destination?.stopName ?? (arrivalCity || '--')}</h4>
            </div>
          </div>
        </div>

        <div className="route-meta-row">
          <div>
            <p>Date</p>
            <h5>{formatIsoDateLabel(date)}</h5>
          </div>
          <div>
            <p>Time</p>
            <h5>{formatStopTimeLabel(origin?.departureTime ?? origin?.arrivalTime)}</h5>
          </div>
        </div>

        <div className="summary-section">
          <h3>Selected Seats</h3>
          <div className="selected-seat-pills">
            {selectedSeats.length === 0 ? (
              <p className="empty-selected-seats">No seats selected yet.</p>
            ) : (
              selectedSeats.map((seat) => (
                <div key={seat.seatNumber} className="selected-seat-pill">
                  <span>{getSeatLabel(seat)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="summary-pricing">
          <div>
            <span>Base Fare</span>
            <strong>{inrCurrencyFormatter.format(baseFare)}</strong>
          </div>
          <div>
            <span>Taxes &amp; Fees</span>
            <strong>{inrCurrencyFormatter.format(taxesAndFees)}</strong>
          </div>
          <div className="summary-total-row">
            <span>Total Amount</span>
            <strong>{inrCurrencyFormatter.format(totalAmount)}</strong>
          </div>
        </div>

        <button
          type="button"
          className="proceed-btn"
          disabled={selectedSeats.length === 0}
          onClick={onProceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>

      <div className="travel-note-box">
        <span className="material-symbols-outlined">info</span>
        <p>
          Free cancellation available until 4 hours before departure. Policy
          applies as of 2026.
        </p>
      </div>

      <div className="mobile-summary-bar">
        <div>
          <p>{selectedSeats.length} seat(s) selected</p>
          <strong>{inrCurrencyFormatter.format(totalAmount)}</strong>
        </div>
        <button
          type="button"
          disabled={selectedSeats.length === 0}
          onClick={onProceedToPayment}
        >
          Continue
        </button>
      </div>
    </aside>
  )
}

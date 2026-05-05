import { Link } from 'react-router-dom'
import type { Bus } from '../../types/home'
import { formatStopTimeLabel, inrCurrencyFormatter } from '../../utils/formatters'

interface BusResultCardProps {
  bus: Bus
  detailsUrl: string
}

function getOriginAndDestination(bus: Bus) {
  const origin = bus.stops[0]
  const destination = bus.stops[bus.stops.length - 1]

  return {
    origin,
    destination,
  }
}

export function BusResultCard({ bus, detailsUrl }: BusResultCardProps) {
  const { origin, destination } = getOriginAndDestination(bus)

  const departureTime = formatStopTimeLabel(origin?.departureTime ?? origin?.arrivalTime)
  const arrivalTime = formatStopTimeLabel(destination?.arrivalTime ?? destination?.departureTime)
  const seatTypeLabel = bus.seatTypes.join(', ')
  const stopInfo = bus.stops.length <= 2 ? 'Non-stop' : `${bus.stops.length - 2} stop(s)`

  return (
    <article className="result-card">
      <div className="result-card-main">
        <div className="result-card-info">
          <div className="result-card-title-row">
            <h3>{bus.name}</h3>
            <span className={`ac-badge ${bus.isAC ? 'ac' : 'non-ac'}`}>
              {bus.isAC ? 'AC' : 'Non-AC'}
            </span>
          </div>
          <p className="result-card-subtitle">
            {seatTypeLabel || 'N/A'} • {stopInfo}
          </p>
          <p className="result-card-rating" style={{ margin: '0.15rem 0 0', fontSize: '0.85rem' }}>
            {bus.reviewCount && bus.reviewCount > 0 && bus.averageRating !== undefined ? (
              <>
                <span style={{ color: '#f59e0b' }}>★ {bus.averageRating.toFixed(1)}</span>
                <span style={{ opacity: 0.7 }}> ({bus.reviewCount} review{bus.reviewCount === 1 ? '' : 's'})</span>
              </>
            ) : (
              <span style={{ opacity: 0.6 }}>No reviews yet</span>
            )}
          </p>

          <div className="result-timing-row">
            <div className="time-node">
              <strong>{departureTime}</strong>
              <span>{origin?.stopName ?? '--'}</span>
            </div>
            <div className="time-path">
              <span>{stopInfo}</span>
              <div className="path-line" />
            </div>
            <div className="time-node align-right">
              <strong>{arrivalTime}</strong>
              <span>{destination?.stopName ?? '--'}</span>
            </div>
          </div>
        </div>

        <div className="result-card-price">
          <p>Starting from</p>
          <h4>{inrCurrencyFormatter.format(bus.price)}</h4>
          <Link to={detailsUrl} className="select-seats-link">
            Select Seats
          </Link>
          <small>{bus.availableSeats} seat(s) left</small>
        </div>
      </div>
    </article>
  )
}

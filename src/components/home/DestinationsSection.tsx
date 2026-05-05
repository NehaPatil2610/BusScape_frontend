import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Destination } from '../../types/home'
import { inrCurrencyFormatter } from '../../utils/formatters'

interface DestinationsSectionProps {
  destinations: Destination[]
  extraDestinations?: Destination[]
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function DestinationsSection({
  destinations,
  extraDestinations = [],
}: DestinationsSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()

  const visible = showAll ? [...destinations, ...extraDestinations] : destinations
  const canExpand = extraDestinations.length > 0

  const handleClick = (destination: Destination) => {
    const params = new URLSearchParams({
      arrivalCity: destination.name.split(',')[0].trim(),
      date: todayIso(),
      page: '1',
      pageSize: '20',
    })
    navigate(`/buses?${params.toString()}`)
  }

  return (
    <section className="destinations-section" id="destinations">
      <div className="section-head">
        <div>
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Trending routes this month</p>
        </div>
        {canExpand && (
          <button
            type="button"
            className="view-all"
            onClick={() => setShowAll((value) => !value)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--color-primary)',
              fontWeight: 600,
            }}
          >
            {showAll ? 'Show Less' : 'View All'}
            <span className="material-symbols-outlined">
              {showAll ? 'arrow_back' : 'arrow_forward'}
            </span>
          </button>
        )}
      </div>

      <div className="destination-grid">
        {visible.map((destination) => (
          <article
            className="destination-card"
            key={destination.id}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(destination)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleClick(destination)
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="destination-media">
              <img
                src={destination.imageUrl}
                alt={destination.imageAlt}
                loading="lazy"
                onError={(event) => {
                  ;(event.target as HTMLImageElement).src =
                    `https://source.unsplash.com/600x400/?${encodeURIComponent(destination.name + ',india')}`
                }}
              />
              <div className="destination-overlay" />
              <div className="destination-info">
                <p className="destination-price">
                  Starting from {inrCurrencyFormatter.format(destination.startingPrice)}
                </p>
                <h3 className="destination-name">{destination.name}</h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

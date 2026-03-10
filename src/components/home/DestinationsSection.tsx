import type { Destination } from '../../types/home'
import { inrCurrencyFormatter } from '../../utils/formatters'

interface DestinationsSectionProps {
  destinations: Destination[]
}

export function DestinationsSection({ destinations }: DestinationsSectionProps) {
  return (
    <section className="destinations-section" id="destinations">
      <div className="section-head">
        <div>
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Trending routes this month</p>
        </div>
        <a className="view-all" href="#destinations">
          View All
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>

      <div className="destination-grid">
        {destinations.map((destination) => (
          <article className="destination-card" key={destination.id}>
            <div className="destination-media">
              <img src={destination.imageUrl} alt={destination.imageAlt} />
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

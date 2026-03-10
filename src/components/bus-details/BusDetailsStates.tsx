import { Link } from 'react-router-dom'

interface BusDetailsErrorStateProps {
  message: string
  onRetry: () => void
}

export function BusDetailsLoadingState() {
  const rowSkeletonIndexes = [1, 2, 3, 4, 5]
  const sleeperSkeletonIndexes = [1, 2, 3]

  return (
    <>
      <section className="seat-selection-col">
        <div className="seat-breadcrumbs-row">
          <div className="skeleton-box seat-skeleton-line seat-skeleton-line-sm" />
          <div className="skeleton-box seat-skeleton-line seat-skeleton-line-lg" />
          <div className="skeleton-box seat-skeleton-line seat-skeleton-line-md" />
        </div>

        <div className="seat-map-card seat-loading-map-card">
          <div className="seat-skeleton-legend-row">
            <div className="skeleton-box seat-skeleton-chip" />
            <div className="skeleton-box seat-skeleton-chip" />
            <div className="skeleton-box seat-skeleton-chip" />
            <div className="skeleton-box seat-skeleton-chip" />
          </div>

          <div className="seat-skeleton-tab-row">
            <div className="skeleton-box seat-skeleton-tab" />
            <div className="skeleton-box seat-skeleton-tab" />
          </div>

          <div className="seat-layout-shell seat-loading-layout-shell">
            <div className="seat-skeleton-title-row">
              <div className="skeleton-box seat-skeleton-title" />
              <div className="skeleton-box seat-skeleton-title" />
            </div>

            <div className="seat-skeleton-grid">
              {rowSkeletonIndexes.map((rowIndex) => (
                <div className="seat-skeleton-grid-row" key={`row-${rowIndex}`}>
                  <div className="seat-skeleton-side">
                    <div className="skeleton-box seat-skeleton-seat seat-skeleton-seat-seater" />
                    <div className="skeleton-box seat-skeleton-seat seat-skeleton-seat-seater" />
                  </div>
                  <div className="seat-skeleton-aisle" />
                  <div className="seat-skeleton-side">
                    <div className="skeleton-box seat-skeleton-seat seat-skeleton-seat-seater" />
                    <div className="skeleton-box seat-skeleton-seat seat-skeleton-seat-seater" />
                  </div>
                </div>
              ))}
            </div>

            <div className="seat-skeleton-sleeper-grid">
              {sleeperSkeletonIndexes.map((sleeperIndex) => (
                <div className="seat-skeleton-grid-row" key={`sleeper-${sleeperIndex}`}>
                  <div className="seat-skeleton-side">
                    <div className="skeleton-box seat-skeleton-seat seat-skeleton-seat-sleeper" />
                  </div>
                  <div className="seat-skeleton-aisle" />
                  <div className="seat-skeleton-side">
                    <div className="skeleton-box seat-skeleton-seat seat-skeleton-seat-sleeper" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="seat-summary-wrap">
        <div className="seat-summary-card seat-loading-summary-card">
          <div className="skeleton-box seat-skeleton-line seat-skeleton-line-title" />
          <div className="skeleton-box seat-skeleton-summary-block" />

          <div className="seat-skeleton-summary-rows">
            <div className="skeleton-box seat-skeleton-line seat-skeleton-line-sm" />
            <div className="skeleton-box seat-skeleton-pill-row" />
            <div className="skeleton-box seat-skeleton-divider" />
            <div className="skeleton-box seat-skeleton-line seat-skeleton-line-lg" />
            <div className="skeleton-box seat-skeleton-line seat-skeleton-line-lg" />
            <div className="skeleton-box seat-skeleton-total-row" />
            <div className="skeleton-box seat-skeleton-button" />
            <div className="skeleton-box seat-skeleton-note" />
          </div>
        </div>
      </div>
    </>
  )
}

export function MissingBusIdState() {
  return (
    <div className="seat-page-state">
      <h3>Missing bus details</h3>
      <p>Please select a bus again from the results page.</p>
      <Link to="/buses">Back to Results</Link>
    </div>
  )
}

export function BusDetailsErrorState({
  message,
  onRetry,
}: BusDetailsErrorStateProps) {
  return (
    <div className="seat-page-state">
      <h3>Could not load bus details</h3>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

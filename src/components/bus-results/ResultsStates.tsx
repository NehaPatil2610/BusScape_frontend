import { Link } from 'react-router-dom'

interface ResultsErrorProps {
  message: string
  onRetry: () => void
}

export function ResultsLoadingState() {
  return (
    <div className="results-skeleton-list" aria-label="Loading buses">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="result-skeleton-card" key={`skeleton-${index}`}>
          <div className="skeleton-left">
            <div className="skeleton-line short shimmer" />
            <div className="skeleton-line medium shimmer" />
            <div className="skeleton-line long shimmer" />
          </div>
          <div className="skeleton-right">
            <div className="skeleton-line short shimmer" />
            <div className="skeleton-line medium shimmer" />
            <div className="skeleton-button shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ResultsEmptyState() {
  return (
    <div className="results-state">
      <h3>No buses found</h3>
      <p>Try changing filters or search with a different route/date.</p>
    </div>
  )
}

export function MissingSearchState() {
  return (
    <div className="results-state">
      <h3>Missing search details</h3>
      <p>Please start your search from the home page.</p>
      <Link to="/">Back to Home</Link>
    </div>
  )
}

export function ResultsErrorState({ message, onRetry }: ResultsErrorProps) {
  return (
    <div className="results-state">
      <h3>Unable to fetch buses</h3>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

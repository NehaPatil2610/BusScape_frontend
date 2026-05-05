import type { DepartureSlot, SeatType } from '../../types/home'

export interface BusFiltersState {
  seatType?: SeatType
  isAC?: boolean
  departureSlot?: DepartureSlot
  minRating?: number
}

interface BusFiltersSidebarProps {
  filters: BusFiltersState
  onSeatTypeChange: (seatType?: SeatType) => void
  onIsAcChange: (isAC?: boolean) => void
  onDepartureSlotChange: (departureSlot?: DepartureSlot) => void
  onMinRatingChange: (minRating?: number) => void
  onReset: () => void
}

const seatTypeOptions: Array<{ label: string; value: SeatType }> = [
  { label: 'Sleeper', value: 'sleeper' },
  { label: 'Seater', value: 'seater' },
  { label: 'Semi-Sleeper', value: 'semi-sleeper' },
]

const departureSlotOptions: Array<{
  label: string
  subtitle: string
  value: DepartureSlot
}> = [
  { label: 'Morning', subtitle: '6 AM - 12 PM', value: 'morning' },
  { label: 'Afternoon', subtitle: '12 PM - 6 PM', value: 'afternoon' },
  { label: 'Evening', subtitle: '6 PM - 10 PM', value: 'evening' },
  { label: 'Night', subtitle: 'After 10 PM', value: 'night' },
]

export function BusFiltersSidebar({
  filters,
  onSeatTypeChange,
  onIsAcChange,
  onDepartureSlotChange,
  onMinRatingChange,
  onReset,
}: BusFiltersSidebarProps) {
  return (
    <aside className="results-sidebar">
      <div className="filters-card">
        <div className="filters-header">
          <h3>Filters</h3>
          <button type="button" onClick={onReset}>
            Reset
          </button>
        </div>

        <div className="filters-section">
          <h4>Seat Type</h4>
          <div className="filters-options">
            {seatTypeOptions.map((option) => {
              const checked = filters.seatType === option.value

              return (
                <label className="filter-check-row" key={option.value} htmlFor={`seat-${option.value}`}>
                  <input
                    id={`seat-${option.value}`}
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      onSeatTypeChange(checked ? undefined : option.value)
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="filters-section">
          <h4>Bus Preference</h4>
          <div className="filters-pill-group">
            <button
              type="button"
              className={filters.isAC === undefined ? 'active' : ''}
              onClick={() => {
                onIsAcChange(undefined)
              }}
            >
              Any
            </button>
            <button
              type="button"
              className={filters.isAC === true ? 'active' : ''}
              onClick={() => {
                onIsAcChange(true)
              }}
            >
              AC
            </button>
            <button
              type="button"
              className={filters.isAC === false ? 'active' : ''}
              onClick={() => {
                onIsAcChange(false)
              }}
            >
              Non-AC
            </button>
          </div>
        </div>

        <div className="filters-section">
          <h4>Minimum Rating</h4>
          <div className="filters-pill-group">
            {[undefined, 3, 4, 5].map((value) => (
              <button
                key={String(value)}
                type="button"
                className={filters.minRating === value ? 'active' : ''}
                onClick={() => onMinRatingChange(value)}
              >
                {value === undefined ? 'Any' : `${value}★ & up`}
              </button>
            ))}
          </div>
        </div>

        <div className="filters-section">
          <h4>Departure Time</h4>
          <div className="filters-options">
            {departureSlotOptions.map((option) => (
              <label className="filter-radio-row" key={option.value} htmlFor={`slot-${option.value}`}>
                <input
                  id={`slot-${option.value}`}
                  type="radio"
                  name="departure-slot"
                  checked={filters.departureSlot === option.value}
                  onChange={() => {
                    onDepartureSlotChange(option.value)
                  }}
                />
                <div>
                  <span>{option.label}</span>
                  <small>{option.subtitle}</small>
                </div>
              </label>
            ))}
            <button
              type="button"
              className="clear-slot-btn"
              onClick={() => {
                onDepartureSlotChange(undefined)
              }}
            >
              Clear Departure Time
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

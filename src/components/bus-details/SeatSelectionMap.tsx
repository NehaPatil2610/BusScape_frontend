import type { BusSeat } from '../../types/home'

export type DeckType = 'lower' | 'upper'

interface SeatSelectionMapProps {
  seats: BusSeat[]
  activeDeck: DeckType
  selectedSeatNumbers: number[]
  lockingSeatNumbers: number[]
  onDeckChange: (deck: DeckType) => void
  onSeatClick: (seat: BusSeat) => void
}

function splitDeckSeats(seats: BusSeat[]) {
  const sortedSeats = [...seats].sort((leftSeat, rightSeat) => {
    return leftSeat.seatNumber - rightSeat.seatNumber
  })

  const halfIndex = Math.ceil(sortedSeats.length / 2)

  return {
    lower: sortedSeats.slice(0, halfIndex),
    upper: sortedSeats.slice(halfIndex),
  }
}

function groupByRow(seats: BusSeat[]) {
  const groupedRows = new Map<number, BusSeat[]>()

  seats.forEach((seat) => {
    const currentRowSeats = groupedRows.get(seat.row) ?? []
    currentRowSeats.push(seat)
    groupedRows.set(seat.row, currentRowSeats)
  })

  return [...groupedRows.entries()]
    .sort((leftEntry, rightEntry) => leftEntry[0] - rightEntry[0])
    .map(([, rowSeats]) => rowSeats.sort((leftSeat, rightSeat) => leftSeat.column - rightSeat.column))
}

function getSeatVisualState(
  seat: BusSeat,
  selectedSeatNumbers: number[],
  lockingSeatNumbers: number[],
): 'selected' | 'booked' | 'locked' | 'available' {
  if (selectedSeatNumbers.includes(seat.seatNumber)) {
    return 'selected'
  }

  if (lockingSeatNumbers.includes(seat.seatNumber)) {
    return 'selected'
  }

  if (seat.status === 'confirmed') {
    return 'booked'
  }

  if (seat.status === 'locked') {
    return 'locked'
  }

  return 'available'
}

function isSeatDisabled(seat: BusSeat, lockingSeatNumbers: number[]): boolean {
  return (
    seat.status === 'confirmed' ||
    seat.status === 'locked' ||
    lockingSeatNumbers.includes(seat.seatNumber)
  )
}

function splitRowByAisle(rowSeats: BusSeat[]) {
  const maxColumn = Math.max(...rowSeats.map((seat) => seat.column), 1)
  const aisleCutoff = Math.ceil(maxColumn / 2)

  const leftSeats = rowSeats.filter((seat) => seat.column <= aisleCutoff)
  const rightSeats = rowSeats.filter((seat) => seat.column > aisleCutoff)

  return {
    leftSeats,
    rightSeats,
  }
}

function getSeatLabel(seat: BusSeat) {
  const seatTypePrefix = seat.seatType === 'sleeper' ? 'S' : 'L'

  return `${seatTypePrefix}${seat.seatNumber}`
}

function renderSeatButton(
  seat: BusSeat,
  selectedSeatNumbers: number[],
  lockingSeatNumbers: number[],
  onSeatClick: (seat: BusSeat) => void,
) {
  const visualState = getSeatVisualState(seat, selectedSeatNumbers, lockingSeatNumbers)
  const disabled = isSeatDisabled(seat, lockingSeatNumbers)
  const isSleeper = seat.seatType === 'sleeper'

  return (
    <button
      key={seat.seatNumber}
      type="button"
      className={`seat-unit ${isSleeper ? 'sleeper' : 'seater'} ${visualState}`}
      onClick={() => {
        if (!disabled) {
          onSeatClick(seat)
        }
      }}
      disabled={disabled}
      aria-label={`Seat ${seat.seatNumber} ${visualState}`}
    >
      {visualState === 'booked' ? (
        <span className="material-symbols-outlined">close</span>
      ) : visualState === 'locked' ? (
        <span className="material-symbols-outlined">lock</span>
      ) : (
        <span>{getSeatLabel(seat)}</span>
      )}
    </button>
  )
}

export function SeatSelectionMap({
  seats,
  activeDeck,
  selectedSeatNumbers,
  lockingSeatNumbers,
  onDeckChange,
  onSeatClick,
}: SeatSelectionMapProps) {
  const deckSeats = splitDeckSeats(seats)
  const currentDeckSeats = activeDeck === 'lower' ? deckSeats.lower : deckSeats.upper

  const seaterSeats = currentDeckSeats.filter((seat) => seat.seatType !== 'sleeper')
  const sleeperSeats = currentDeckSeats.filter((seat) => seat.seatType === 'sleeper')

  const seaterRows = groupByRow(seaterSeats)
  const sleeperRows = groupByRow(sleeperSeats)

  return (
    <section className="seat-map-card">
      <div className="seat-map-legend">
        <div className="legend-item">
          <div className="legend-box available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked" />
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-box locked" />
          <span>Locked</span>
        </div>
      </div>

      <div className="deck-tabs">
        <button
          type="button"
          className={activeDeck === 'lower' ? 'active' : ''}
          onClick={() => {
            onDeckChange('lower')
          }}
        >
          Lower Deck
        </button>
        <button
          type="button"
          className={activeDeck === 'upper' ? 'active' : ''}
          onClick={() => {
            onDeckChange('upper')
          }}
        >
          Upper Deck
        </button>
      </div>

      <div className="seat-layout-shell">
        <div className="seat-wheel">
          <span className="material-symbols-outlined">radio_button_checked</span>
        </div>

        {seaterRows.length > 0 ? (
          <div className="seat-section">
            <h3>Seater Section</h3>
            <div className="seat-grid-layout">
              {seaterRows.map((rowSeats, rowIndex) => {
                const { leftSeats, rightSeats } = splitRowByAisle(rowSeats)

                return (
                  <div className="seat-grid-row" key={`seater-row-${rowIndex}`}>
                    <div className="seat-side">
                      {leftSeats.map((seat) =>
                        renderSeatButton(
                          seat,
                          selectedSeatNumbers,
                          lockingSeatNumbers,
                          onSeatClick,
                        ),
                      )}
                    </div>
                    <div className="seat-aisle" />
                    <div className="seat-side">
                      {rightSeats.map((seat) =>
                        renderSeatButton(
                          seat,
                          selectedSeatNumbers,
                          lockingSeatNumbers,
                          onSeatClick,
                        ),
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {sleeperRows.length > 0 ? (
          <div className="seat-section">
            <h3>Sleeper Section</h3>
            <div className="seat-grid-layout sleeper-layout">
              {sleeperRows.map((rowSeats, rowIndex) => {
                const { leftSeats, rightSeats } = splitRowByAisle(rowSeats)

                return (
                  <div className="seat-grid-row" key={`sleeper-row-${rowIndex}`}>
                    <div className="seat-side">
                      {leftSeats.map((seat) =>
                        renderSeatButton(
                          seat,
                          selectedSeatNumbers,
                          lockingSeatNumbers,
                          onSeatClick,
                        ),
                      )}
                    </div>
                    <div className="seat-aisle" />
                    <div className="seat-side">
                      {rightSeats.map((seat) =>
                        renderSeatButton(
                          seat,
                          selectedSeatNumbers,
                          lockingSeatNumbers,
                          onSeatClick,
                        ),
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {currentDeckSeats.length === 0 ? (
          <div className="seat-empty-deck">No seats available on this deck.</div>
        ) : null}
      </div>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { fetchBusDetails, lockBusSeat } from '../api/searchApi'
import { BusBookingSummary } from '../components/bus-details/BusBookingSummary'
import {
  BusDetailsErrorState,
  BusDetailsLoadingState,
  MissingBusIdState,
} from '../components/bus-details/BusDetailsStates'
import { BusDetailsHeader } from '../components/bus-details/BusDetailsHeader'
import { ReviewsSection } from '../components/reviews/ReviewsSection'
import {
  SeatSelectionMap,
  type DeckType,
} from '../components/bus-details/SeatSelectionMap'
import { useTheme } from '../hooks/useAppState'
import type { Bus, BusSeat } from '../types/home'
import { formatStopTimeLabel } from '../utils/formatters'
import './BusDetailsPage.css'

export function BusDetailsPage() {
  const { busId = '' } = useParams()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const [bus, setBus] = useState<Bus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)
  const [activeDeck, setActiveDeck] = useState<DeckType>('lower')
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([])
  const [lockingSeatNumbers, setLockingSeatNumbers] = useState<number[]>([])
  const [seatLockErrorMessage, setSeatLockErrorMessage] = useState<string | null>(null)

  const departureCity = searchParams.get('departureCity')?.trim() ?? ''
  const arrivalCity = searchParams.get('arrivalCity')?.trim() ?? ''
  const date = searchParams.get('date')?.trim() ?? ''

  useEffect(() => {
    if (!busId) {
      return
    }

    const controller = new AbortController()

    Promise.resolve().then(() => {
      setBus(null)
      setIsLoading(true)
      setErrorMessage(null)
      setSeatLockErrorMessage(null)
    })

    fetchBusDetails(busId, controller.signal)
      .then((response) => {
        setBus(response.data)
        setSelectedSeatNumbers([])
      })
      .catch((error: unknown) => {
        if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          error.name === 'AbortError'
        ) {
          return
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong',
        )
      })
      .finally(() => {
        setIsLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [busId, retryCounter])

  const selectedSeats = useMemo(() => {
    if (!bus) {
      return []
    }

    return bus.seats.filter((seat) => selectedSeatNumbers.includes(seat.seatNumber))
  }, [bus, selectedSeatNumbers])

  const handleSeatClick = (seat: BusSeat) => {
    if (!busId || !bus || seat.status !== 'available') {
      return
    }

    if (lockingSeatNumbers.includes(seat.seatNumber)) {
      return
    }

    setSeatLockErrorMessage(null)
    setLockingSeatNumbers((previousSeats) => [...previousSeats, seat.seatNumber])

    lockBusSeat({
      busId,
      seatNumber: seat.seatNumber,
    })
      .then((response) => {
        if (!response.data.locked) {
          throw new Error(`Seat ${seat.seatNumber} could not be locked.`)
        }

        setBus((previousBus) => {
          if (!previousBus) {
            return previousBus
          }

          return {
            ...previousBus,
            availableSeats: Math.max(previousBus.availableSeats - 1, 0),
            seats: previousBus.seats.map((currentSeat) => {
              if (currentSeat.seatNumber === response.data.seatNo) {
                return {
                  ...currentSeat,
                  status: 'locked',
                }
              }

              return currentSeat
            }),
          }
        })

        setSelectedSeatNumbers((previousSeats) => {
          if (previousSeats.includes(response.data.seatNo)) {
            return previousSeats
          }

          return [...previousSeats, response.data.seatNo]
        })
      })
      .catch((error: unknown) => {
        setSeatLockErrorMessage(
          error instanceof Error ? error.message : 'Unable to lock this seat.',
        )
      })
      .finally(() => {
        setLockingSeatNumbers((previousSeats) =>
          previousSeats.filter((seatNumber) => seatNumber !== seat.seatNumber),
        )
      })
  }

  const departureTimeLabel = formatStopTimeLabel(
    bus?.stops[0]?.departureTime ?? bus?.stops[0]?.arrivalTime,
  )

  const resultsUrl = useMemo(() => {
    const currentQuery = searchParams.toString()

    if (currentQuery.length > 0) {
      return `/buses?${currentQuery}`
    }

    const fallbackParams = new URLSearchParams()
    fallbackParams.set('departureCity', departureCity)
    fallbackParams.set('arrivalCity', arrivalCity)
    fallbackParams.set('date', date)
    fallbackParams.set('page', '1')
    fallbackParams.set('pageSize', '20')

    return `/buses?${fallbackParams.toString()}`
  }, [arrivalCity, date, departureCity, searchParams])

  const handleProceedToPayment = () => {
    if (!busId || selectedSeatNumbers.length === 0) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('seatNumbers', selectedSeatNumbers.join(','))

    navigate(`/buses/${busId}/booking?${nextParams.toString()}`)
  }

  return (
    <div className="seat-page">
      <BusDetailsHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        departureCity={departureCity}
        arrivalCity={arrivalCity}
        date={date}
        departureTime={departureTimeLabel}
      />

      <main className="seat-page-main">
        {!busId ? <MissingBusIdState /> : null}

        {busId && isLoading ? <BusDetailsLoadingState /> : null}

        {busId && !isLoading && errorMessage ? (
          <BusDetailsErrorState
            message={errorMessage}
            onRetry={() => {
              setRetryCounter((previousCounter) => previousCounter + 1)
            }}
          />
        ) : null}

        {busId && !isLoading && !errorMessage && bus ? (
          <>
            <section className="seat-selection-col">
              <div className="seat-breadcrumbs-row">
                <nav>
                  <Link to={resultsUrl}>Search</Link>
                  <span>/</span>
                  <span>Seat Selection</span>
                </nav>
                <h1>Select Your Seats</h1>
                <p>
                  {bus.name} • {bus.isAC ? 'AC' : 'Non-AC'} • {bus.seatTypes.join(', ')}
                </p>
              </div>

              {seatLockErrorMessage ? (
                <div className="seat-lock-error" role="alert">
                  {seatLockErrorMessage}
                </div>
              ) : null}

              <SeatSelectionMap
                seats={bus.seats}
                activeDeck={activeDeck}
                selectedSeatNumbers={selectedSeatNumbers}
                lockingSeatNumbers={lockingSeatNumbers}
                onDeckChange={setActiveDeck}
                onSeatClick={handleSeatClick}
              />
            </section>

            <BusBookingSummary
              bus={bus}
              selectedSeats={selectedSeats}
              departureCity={departureCity}
              arrivalCity={arrivalCity}
              date={date}
              onProceedToPayment={handleProceedToPayment}
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <ReviewsSection busId={busId} />
            </div>
          </>
        ) : null}
      </main>

      <footer className="seat-page-footer">
        © 2026 BusScape Premium Travel Services. All rights reserved.
      </footer>
    </div>
  )
}

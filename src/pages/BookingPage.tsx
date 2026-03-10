import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { createBooking, fetchBusDetails } from '../api/searchApi'
import { BookingSummaryPanel } from '../components/booking/BookingSummaryPanel'
import {
  BookingPageErrorState,
  BookingPageLoadingState,
  MissingBookingContextState,
} from '../components/booking/BookingPageStates'
import { BookingSuccessModal } from '../components/booking/BookingSuccessModal'
import {
  PassengerDetailsCard,
  type PassengerFormValues,
} from '../components/booking/PassengerDetailsCard'
import { useTheme } from '../hooks/useAppState'
import type { BookingPassenger, Bus, PassengerGender } from '../types/home'
import { inrCurrencyFormatter } from '../utils/formatters'
import './BookingPage.css'

function parseSeatNumbersParam(value: string | null): number[] {
  if (!value) {
    return []
  }

  const uniqueSeats = new Set<number>()

  value
    .split(',')
    .map((seatNumber) => Number(seatNumber.trim()))
    .forEach((seatNumber) => {
      if (Number.isInteger(seatNumber) && seatNumber > 0) {
        uniqueSeats.add(seatNumber)
      }
    })

  return [...uniqueSeats]
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isValidPhone(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, '')
  return digitsOnly.length >= 7
}

export function BookingPage() {
  const { busId = '' } = useParams()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [searchParams] = useSearchParams()

  const departureCity = searchParams.get('departureCity')?.trim() ?? ''
  const arrivalCity = searchParams.get('arrivalCity')?.trim() ?? ''
  const travelDate = searchParams.get('date')?.trim() ?? ''
  const seatNumbers = useMemo(
    () => parseSeatNumbersParam(searchParams.get('seatNumbers')),
    [searchParams],
  )

  const [bus, setBus] = useState<Bus | null>(null)
  const [isLoadingBus, setIsLoadingBus] = useState(false)
  const [busErrorMessage, setBusErrorMessage] = useState<string | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)

  const [passengerBySeatNumber, setPassengerBySeatNumber] = useState<
    Record<number, PassengerFormValues>
  >({})
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [redirectInSeconds, setRedirectInSeconds] = useState(3)

  const hasBookingContext = busId.length > 0 && seatNumbers.length > 0
  const baseFare = bus ? seatNumbers.length * bus.price : 0
  const taxesAndFees = Math.round(baseFare * 0.05)
  const totalAmount = baseFare + taxesAndFees

  useEffect(() => {
    if (!isSuccessModalOpen) {
      return
    }

    if (redirectInSeconds <= 0) {
      navigate('/')
      return
    }

    const timeout = window.setTimeout(() => {
      setRedirectInSeconds((previousSeconds) => previousSeconds - 1)
    }, 1000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isSuccessModalOpen, navigate, redirectInSeconds])

  useEffect(() => {
    if (!busId || !hasBookingContext) {
      return
    }

    const controller = new AbortController()

    Promise.resolve().then(() => {
      setIsLoadingBus(true)
      setBusErrorMessage(null)
    })

    fetchBusDetails(busId, controller.signal)
      .then((response) => {
        setBus(response.data)
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

        setBusErrorMessage(
          error instanceof Error ? error.message : 'Failed to load booking data.',
        )
      })
      .finally(() => {
        setIsLoadingBus(false)
      })

    return () => {
      controller.abort()
    }
  }, [busId, hasBookingContext, retryCounter])

  const detailsUrl = useMemo(() => {
    if (!busId) {
      return '/buses'
    }

    const params = new URLSearchParams(searchParams)
    params.delete('seatNumbers')

    const queryString = params.toString()

    return queryString ? `/buses/${busId}?${queryString}` : `/buses/${busId}`
  }, [busId, searchParams])

  const resultsUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('seatNumbers')
    const queryString = params.toString()

    return queryString ? `/buses?${queryString}` : '/buses'
  }, [searchParams])

  const handlePassengerChange = (
    index: number,
    field: keyof PassengerFormValues,
    nextValue: string,
  ) => {
    const seatNumber = seatNumbers[index]

    if (!seatNumber) {
      return
    }

    setPassengerBySeatNumber((previousPassengers) => {
      const currentPassenger = previousPassengers[seatNumber] ?? {
        name: '',
        age: '',
        gender: '',
      }

      if (field === 'gender') {
        return {
          ...previousPassengers,
          [seatNumber]: {
            ...currentPassenger,
            gender: nextValue as PassengerGender,
          },
        }
      }

      return {
        ...previousPassengers,
        [seatNumber]: {
          ...currentPassenger,
          [field]: nextValue,
        },
      }
    })
  }

  const createPassengersPayload = (): BookingPassenger[] | null => {
    const normalizedPassengers = seatNumbers.map((seatNumber) => {
      const passenger = passengerBySeatNumber[seatNumber] ?? {
        name: '',
        age: '',
        gender: '',
      }
      const age = Number(passenger.age)

      if (!passenger.name.trim() || !Number.isInteger(age) || age <= 0 || !passenger.gender) {
        return null
      }

      return {
        name: passenger.name.trim(),
        age,
        gender: passenger.gender as PassengerGender,
      }
    })

    if (normalizedPassengers.some((passenger) => passenger === null)) {
      return null
    }

    return normalizedPassengers as BookingPassenger[]
  }

  const handleConfirmBooking = () => {
    if (!busId || !bus) {
      return
    }

    const passengersPayload = createPassengersPayload()

    if (!passengersPayload) {
      setSubmitErrorMessage('Please fill valid name, age and gender for all passengers.')
      return
    }

    if (!isValidEmail(email)) {
      setSubmitErrorMessage('Please enter a valid email address.')
      return
    }

    if (!isValidPhone(phone)) {
      setSubmitErrorMessage('Please enter a valid phone number.')
      return
    }

    const departureValue = departureCity || bus.stops[0]?.stopName || ''
    const arrivalValue = arrivalCity || bus.stops[bus.stops.length - 1]?.stopName || ''

    if (!departureValue || !arrivalValue) {
      setSubmitErrorMessage('Departure and arrival details are missing.')
      return
    }

    setIsSubmitting(true)
    setSubmitErrorMessage(null)

    createBooking({
      busId,
      passengers: passengersPayload,
      seatNumbers,
      departure: departureValue,
      arrival: arrivalValue,
    })
      .then(() => {
        setRedirectInSeconds(3)
        setIsSuccessModalOpen(true)
      })
      .catch((error: unknown) => {
        setSubmitErrorMessage(
          error instanceof Error ? error.message : 'Failed to confirm booking.',
        )
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="booking-page">
      <header className="booking-header">
        <div className="booking-header-inner">
          <div className="booking-brand">
            <span className="material-symbols-outlined">directions_bus</span>
            <h1>BusScape</h1>
          </div>

          <div className="booking-header-right">
            <nav className="booking-links">
              <Link to={resultsUrl}>Trips</Link>
              <Link to="/bookings">Bookings</Link>
            </nav>

            <div className="booking-header-actions">
              <button
                type="button"
                className="booking-icon-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <span className="material-symbols-outlined">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
              <button type="button" className="booking-icon-btn" aria-label="Notifications">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <img
                className="booking-avatar"
                alt="User profile avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLXNUrn2p6Cyh2tYKik7fqm8rYN-4gOUC5fSZYdOVFnju9sp3s8cw378meEgIrSdzbF-cZbckPcVi5Ja5LtJT3Jkxitj87dRZjxhT7b0HgaEPwP3mC9BiyKYBK29jdeaIt5QjCNHe4jUVdttr0zXsDt_RWbYkQ6MQJDBlX7IbZ_jBiLBhVIRMfpk_zT-rVyjj6bL8fTzSPy_UZjSfpTKvvvmvgC1e462t2z1YmAdrSa4E7-K8_HMgVql_wXyOe2Ma8uD9Hg_CuLqS1"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="booking-main">
        {!hasBookingContext ? <MissingBookingContextState detailsUrl={detailsUrl} /> : null}

        {hasBookingContext && isLoadingBus ? <BookingPageLoadingState /> : null}

        {hasBookingContext && !isLoadingBus && busErrorMessage ? (
          <BookingPageErrorState
            message={busErrorMessage}
            onRetry={() => {
              setRetryCounter((previousCounter) => previousCounter + 1)
            }}
          />
        ) : null}

        {hasBookingContext && !isLoadingBus && !busErrorMessage && bus ? (
          <>
            <div className="booking-content-grid">
              <section className="booking-forms-col">
                <div className="booking-page-title">
                  <h2>Passenger Details</h2>
                  <p>Enter details exactly as per government-issued ID proof.</p>
                </div>

                {seatNumbers.map((seatNumber, index) => (
                  <PassengerDetailsCard
                    key={`passenger-${seatNumber}`}
                    index={index}
                    seatNumber={seatNumber}
                    value={
                      passengerBySeatNumber[seatNumber] ?? {
                        name: '',
                        age: '',
                        gender: '',
                      }
                    }
                    onChange={handlePassengerChange}
                  />
                ))}

                <section className="booking-contact-card">
                  <div className="booking-contact-title">
                    <span className="material-symbols-outlined">contact_mail</span>
                    <h3>Contact Details</h3>
                  </div>

                  <div className="booking-form-grid">
                    <label className="booking-field">
                      <span>Email Address</span>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value)
                        }}
                        required
                      />
                    </label>

                    <label className="booking-field">
                      <span>Phone Number</span>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value)
                        }}
                        required
                      />
                    </label>
                  </div>
                </section>

                {submitErrorMessage ? (
                  <div className="booking-submit-error" role="alert">
                    {submitErrorMessage}
                  </div>
                ) : null}
              </section>

              <BookingSummaryPanel
                bus={bus}
                departureCity={departureCity}
                arrivalCity={arrivalCity}
                date={travelDate}
                seatNumbers={seatNumbers}
                isSubmitting={isSubmitting}
                onConfirmBooking={handleConfirmBooking}
              />
            </div>
          </>
        ) : null}
      </main>

      <footer className="booking-footer">
        <p>BusScape © 2026. All rights reserved.</p>
      </footer>

      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        seatNumbers={seatNumbers}
        totalAmountLabel={inrCurrencyFormatter.format(totalAmount)}
        redirectInSeconds={redirectInSeconds}
        onGoHome={() => {
          navigate('/')
        }}
      />
    </div>
  )
}

import { useLogto, type IdTokenClaims } from '@logto/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchBookings } from '../api/searchApi'
import {
  BookingHistoryCard,
  type BookingPassengerRow,
  type BookingStatusTone,
} from '../components/bookings/BookingHistoryCard'
import {
  BookingsEmptyState,
  BookingsErrorState,
  BookingsLoadingState,
} from '../components/bookings/BookingsStates'
import { useTheme } from '../hooks/useAppState'
import type { BookingRecord, BookingStatus, PaginationMeta } from '../types/home'
import { formatIsoDateLabel, inrCurrencyFormatter } from '../utils/formatters'
import './BookingsPage.css'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

type BookingTab = 'current' | 'past'

interface NormalizedBookingsResult {
  records: BookingRecord[]
  pagination: PaginationMeta
}

interface BookingCardView {
  id: string
  statusLabel: string
  statusTone: BookingStatusTone
  busName: string
  busSubtitle: string
  routeLabel: string
  dateLabel: string
  amountLabel: string
  passengerRows: BookingPassengerRow[]
  isPast: boolean
}

function parsePositiveNumber(value: string | null, fallback: number): number {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback
  }

  return Math.floor(parsedValue)
}

function toPositiveInteger(value: unknown): number | undefined {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return undefined
  }

  return Math.floor(numericValue)
}

function toNonNegativeInteger(value: unknown): number | undefined {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return undefined
  }

  return Math.floor(numericValue)
}

function extractRecordsFromPayload(value: unknown, depth = 0): BookingRecord[] {
  if (Array.isArray(value)) {
    return value as BookingRecord[]
  }

  if (!value || typeof value !== 'object' || depth > 4) {
    return []
  }

  const payload = value as Record<string, unknown>

  for (const key of ['data', 'bookings', 'records', 'results', 'items']) {
    const keyValue = payload[key]

    if (Array.isArray(keyValue)) {
      return keyValue as BookingRecord[]
    }
  }

  for (const key of ['data', 'payload', 'result', 'response']) {
    const nestedValue = payload[key]

    if (nestedValue && typeof nestedValue === 'object') {
      const nestedRecords = extractRecordsFromPayload(nestedValue, depth + 1)

      if (nestedRecords.length > 0) {
        return nestedRecords
      }
    }
  }

  return []
}

function extractPaginationFromPayload(
  value: unknown,
  depth = 0,
): Partial<PaginationMeta> | undefined {
  if (!value || typeof value !== 'object' || depth > 4) {
    return undefined
  }

  const payload = value as Record<string, unknown>
  const directPagination = payload.pagination

  if (directPagination && typeof directPagination === 'object') {
    return extractPaginationFromPayload(directPagination, depth + 1)
  }

  const page = toPositiveInteger(payload.page)
  const pageSize = toPositiveInteger(payload.pageSize)
  const total = toNonNegativeInteger(payload.total)
  const totalPages = toPositiveInteger(payload.totalPages)

  if (page || pageSize || total !== undefined || totalPages) {
    return {
      page,
      pageSize,
      total,
      totalPages,
    }
  }

  for (const key of ['meta', 'data', 'payload', 'result', 'response']) {
    const nestedValue = payload[key]

    if (nestedValue && typeof nestedValue === 'object') {
      const nestedPagination = extractPaginationFromPayload(nestedValue, depth + 1)

      if (nestedPagination) {
        return nestedPagination
      }
    }
  }

  return undefined
}

function normalizeBookingsResponse(
  value: unknown,
  page: number,
  pageSize: number,
): NormalizedBookingsResult {
  const records = extractRecordsFromPayload(value)
  const extractedPagination = extractPaginationFromPayload(value)
  const normalizedPage = extractedPagination?.page ?? page
  const normalizedPageSize = extractedPagination?.pageSize ?? pageSize
  const normalizedTotal = extractedPagination?.total ?? records.length
  const normalizedTotalPages =
    extractedPagination?.totalPages ??
    Math.max(1, Math.ceil(normalizedTotal / normalizedPageSize))

  return {
    records,
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      total: normalizedTotal,
      totalPages: normalizedTotalPages,
    },
  }
}

function getStatusTone(status: BookingStatus | undefined): BookingStatusTone {
  const normalizedStatus = status?.toString().toLowerCase() ?? ''

  if (normalizedStatus.includes('confirm')) {
    return 'confirmed'
  }

  if (normalizedStatus.includes('pending')) {
    return 'pending'
  }

  if (normalizedStatus.includes('complete')) {
    return 'completed'
  }

  if (normalizedStatus.includes('cancel')) {
    return 'cancelled'
  }

  return 'default'
}

function toStatusLabel(status: BookingStatus | undefined, isPast: boolean): string {
  const rawStatus = status?.toString().trim()

  if (!rawStatus) {
    return isPast ? 'Completed' : 'Confirmed'
  }

  return rawStatus
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')
}

function toSafeAmount(value: unknown): number {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue)) {
    return 0
  }

  return parsedValue
}

function formatBookingDateLabel(record: BookingRecord): string {
  const dateCandidate =
    record.travelDate ??
    record.travel_date ??
    record.journeyDate ??
    record.journey_date ??
    record.date ??
    record.departureDateTime ??
    record.departure_datetime ??
    record.createdAt

  if (!dateCandidate) {
    return 'Date not available'
  }

  if (dateCandidate.includes(',')) {
    return dateCandidate
  }

  const parsedDate = new Date(dateCandidate)

  if (Number.isNaN(parsedDate.getTime())) {
    return dateCandidate
  }

  const dateLabel = formatIsoDateLabel(parsedDate.toISOString().slice(0, 10))
  const hasTimeComponent =
    parsedDate.getHours() !== 0 || parsedDate.getMinutes() !== 0

  if (!hasTimeComponent) {
    return dateLabel
  }

  const timeLabel = parsedDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return `${dateLabel} • ${timeLabel}`
}

function getBookingDateForPastCheck(record: BookingRecord): Date | null {
  const dateCandidate =
    record.departureDateTime ??
    record.departure_datetime ??
    record.travelDate ??
    record.travel_date ??
    record.journeyDate ??
    record.journey_date ??
    record.date

  if (!dateCandidate) {
    return null
  }

  const parsedDate = new Date(dateCandidate)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

function isPastBooking(record: BookingRecord): boolean {
  const normalizedStatus = record.status?.toString().toLowerCase() ?? ''

  if (
    normalizedStatus.includes('complete') ||
    normalizedStatus.includes('cancel') ||
    normalizedStatus.includes('expired')
  ) {
    return true
  }

  const bookingDate = getBookingDateForPastCheck(record)

  if (!bookingDate) {
    return false
  }

  return bookingDate.getTime() < Date.now()
}

function getBookingCardView(record: BookingRecord): BookingCardView {
  const busInfo =
    (typeof record.busId === 'object' ? record.busId : undefined) ?? record.bus
    ?? (typeof record.bus_id === 'object' ? record.bus_id : undefined)

  const statusTone = getStatusTone(record.status)
  const isPast = isPastBooking(record)
  const bookingIdFallback = [record.departure, record.arrival, record.createdAt]
    .filter(Boolean)
    .join('-')
    .replace(/\s+/g, '')
    .slice(0, 16)
  const bookingId =
    record.bookingId ??
    record.id ??
    record._id ??
    (bookingIdFallback ? `BS-${bookingIdFallback.toUpperCase()}` : 'BS-UNAVAILABLE')

  const routeLabel = `${record.departure ?? '--'} → ${record.arrival ?? '--'}`
  const seatNumbers =
    record.seatNumbers ??
    record.seat_numbers ??
    record.seatsbooked ??
    record.seatsBooked ??
    []
  const passengers = record.passengers ?? []
  const passengerRows =
    passengers.length > 0
      ? passengers.map((passenger, index) => ({
          name: passenger.name,
          seatLabel: seatNumbers[index] ? `${seatNumbers[index]}` : '--',
        }))
      : seatNumbers.map((seatNumber, index) => ({
          name: `Passenger ${index + 1}`,
          seatLabel: `${seatNumber}`,
        }))

  const seatTypeLabel =
    busInfo?.seatTypes && busInfo.seatTypes.length > 0
      ? busInfo.seatTypes.join(', ')
      : 'Standard'

  const amount = toSafeAmount(
    record.totalAmount ?? record.total_amount ?? record.amount ?? record.price,
  )

  return {
    id: bookingId,
    statusLabel: toStatusLabel(record.status, isPast),
    statusTone,
    busName: busInfo?.name ?? 'Booked Bus',
    busSubtitle: busInfo ? `${busInfo.isAC ? 'A/C' : 'Non-A/C'} • ${seatTypeLabel}` : 'Bus journey',
    routeLabel,
    dateLabel: formatBookingDateLabel(record),
    amountLabel: inrCurrencyFormatter.format(amount),
    passengerRows,
    isPast,
  }
}

export function BookingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, getIdTokenClaims, signIn } = useLogto()
  const [user, setUser] = useState<IdTokenClaims>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<BookingTab>('current')
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCounter, setRetryCounter] = useState(0)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let isActive = true
    if (isAuthenticated) {
      getIdTokenClaims().then((claims) => {
        if (isActive) setUser(claims)
      })
    } else {
      setUser(undefined)
    }
    return () => {
      isActive = false
    }
  }, [isAuthenticated, getIdTokenClaims])

  const userDisplayName =
    user?.name ?? user?.username ?? user?.email ?? (isAuthenticated ? 'BusScape User' : 'Guest')
  const userSubtitle = isAuthenticated ? user?.email ?? 'Signed in' : 'Not signed in'
  const userAvatarUrl = user?.picture
  const userInitial = (userDisplayName || 'G').trim().charAt(0).toUpperCase()

  const page = parsePositiveNumber(searchParams.get('page'), DEFAULT_PAGE)
  const pageSize = parsePositiveNumber(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE)

  useEffect(() => {
    const controller = new AbortController()
    const fetchStartTime = Date.now()
    let isEffectActive = true
    let hideLoadingTimeout: number | undefined

    Promise.resolve().then(() => {
      if (!isEffectActive) {
        return
      }

      setIsLoading(true)
      setErrorMessage(null)
    })

    fetchBookings({ page, pageSize }, controller.signal)
      .then((response) => {
        if (!isEffectActive) {
          return
        }

        const normalizedResponse = normalizeBookingsResponse(response.data, page, pageSize)
        setBookings(normalizedResponse.records)
        setPagination(normalizedResponse.pagination)
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

        if (!isEffectActive) {
          return
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong',
        )
      })
      .finally(() => {
        if (!isEffectActive) {
          return
        }

        const elapsedTime = Date.now() - fetchStartTime
        const minSkeletonDuration = 300
        const remainingDuration = Math.max(minSkeletonDuration - elapsedTime, 0)

        if (remainingDuration === 0) {
          setIsLoading(false)
          return
        }

        hideLoadingTimeout = window.setTimeout(() => {
          if (!isEffectActive) {
            return
          }

          setIsLoading(false)
        }, remainingDuration)
      })

    return () => {
      isEffectActive = false
      controller.abort()

      if (hideLoadingTimeout !== undefined) {
        window.clearTimeout(hideLoadingTimeout)
      }
    }
  }, [page, pageSize, retryCounter])

  const bookingCardViews = useMemo(() => bookings.map(getBookingCardView), [bookings])

  const currentBookings = useMemo(
    () => bookingCardViews.filter((booking) => !booking.isPast),
    [bookingCardViews],
  )
  const pastBookings = useMemo(
    () => bookingCardViews.filter((booking) => booking.isPast),
    [bookingCardViews],
  )

  const resolvedActiveTab: BookingTab =
    activeTab === 'current' && currentBookings.length === 0 && pastBookings.length > 0
      ? 'past'
      : activeTab

  const activeBookings = resolvedActiveTab === 'current' ? currentBookings : pastBookings
  const shouldShowSkeleton = isLoading
  const hasNextPage = pagination.page < pagination.totalPages

  const updatePage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(nextPage))
    nextParams.set('pageSize', String(pageSize))
    setIsLoading(true)
    setErrorMessage(null)
    setSearchParams(nextParams)
  }

  return (
    <div className="bookings-page">
      <header className="bookings-header">
        <div className="bookings-header-inner">
          <Link className="bookings-brand" to="/">
            <span className="material-symbols-outlined">directions_bus</span>
            <h2>BusScape</h2>
          </Link>

          <div className="bookings-header-actions">
            <button type="button" className="bookings-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button type="button" className="bookings-icon-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link to="/bookings" className="bookings-icon-btn" aria-label="Account">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="bookings-main">
        <aside className="bookings-sidebar">
          <div className="bookings-profile">
            <div className="bookings-profile-avatar">
              {userAvatarUrl ? (
                <img alt="User avatar" src={userAvatarUrl} />
              ) : (
                <div
                  aria-label="User avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  {userInitial}
                </div>
              )}
            </div>
            <div>
              <h3>{userDisplayName}</h3>
              <p>{userSubtitle}</p>
              {!isAuthenticated && (
                <button
                  type="button"
                  className="bookings-icon-btn"
                  style={{ marginTop: '0.5rem', width: 'auto', padding: '0.25rem 0.75rem' }}
                  onClick={() => signIn(`${window.location.origin}/callback`)}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>

          <nav className="bookings-nav">
            <Link to="/" className="bookings-nav-item">
              <span className="material-symbols-outlined">home</span>
              Dashboard
            </Link>
            <span className="bookings-nav-item active">
              <span className="material-symbols-outlined">confirmation_number</span>
              My Bookings
            </span>
            <Link to="/" className="bookings-nav-item">
              <span className="material-symbols-outlined">explore</span>
              Explore Routes
            </Link>
          </nav>
        </aside>

        <section className="bookings-content">
          <div className="bookings-title-row">
            <h1>Booking History</h1>
            <p>Manage your current and past bus journeys.</p>
          </div>

          <div className="bookings-tabs">
            <button
              type="button"
              className={resolvedActiveTab === 'current' ? 'active' : ''}
              onClick={() => {
                setActiveTab('current')
              }}
            >
              Current ({currentBookings.length})
            </button>
            <button
              type="button"
              className={resolvedActiveTab === 'past' ? 'active' : ''}
              onClick={() => {
                setActiveTab('past')
              }}
            >
              Past ({pastBookings.length})
            </button>
          </div>

          {shouldShowSkeleton ? <BookingsLoadingState /> : null}

          {!shouldShowSkeleton && errorMessage ? (
            <BookingsErrorState
              message={errorMessage}
              onRetry={() => {
                setIsLoading(true)
                setErrorMessage(null)
                setRetryCounter((previousCounter) => previousCounter + 1)
              }}
            />
          ) : null}

          {!shouldShowSkeleton && !errorMessage && activeBookings.length === 0 ? (
            <BookingsEmptyState />
          ) : null}

          {!shouldShowSkeleton && !errorMessage && activeBookings.length > 0 ? (
            <div className="bookings-list">
              {activeBookings.map((booking) => (
                <BookingHistoryCard
                  key={booking.id}
                  bookingId={booking.id}
                  statusLabel={booking.statusLabel}
                  statusTone={booking.statusTone}
                  busName={booking.busName}
                  busSubtitle={booking.busSubtitle}
                  routeLabel={booking.routeLabel}
                  dateLabel={booking.dateLabel}
                  amountLabel={booking.amountLabel}
                  passengerRows={booking.passengerRows}
                  isPast={booking.isPast}
                  isExpanded={expandedCards[booking.id] ?? !booking.isPast}
                  onToggleExpanded={() => {
                    setExpandedCards((previousCards) => ({
                      ...previousCards,
                      [booking.id]: !(previousCards[booking.id] ?? !booking.isPast),
                    }))
                  }}
                />
              ))}
            </div>
          ) : null}

          <div className="bookings-pagination">
            <button
              type="button"
              onClick={() => {
                updatePage(Math.max(page - 1, DEFAULT_PAGE))
              }}
              disabled={page <= DEFAULT_PAGE || isLoading}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
            </span>
            <button
              type="button"
              onClick={() => {
                updatePage(page + 1)
              }}
              disabled={!hasNextPage || isLoading}
            >
              Next
            </button>
          </div>
        </section>
      </main>

      <footer className="bookings-footer">
        <p>© 2026 BusScape Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}

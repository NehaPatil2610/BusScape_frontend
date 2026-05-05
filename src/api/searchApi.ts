import type {
  BookingsQuery,
  BookingsResponse,
  Bus,
  BusReview,
  BusSearchQuery,
  BusSearchResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  CreateReviewRequest,
  SavedPassenger,
  SavedPassengerInput,
  SeatLockRequest,
  SeatLockResponse,
} from '../types/home'
import { serializeBusSearchQuery } from '../utils/queryParams'
import { httpRequest } from './httpClient'

export function searchBuses(query: BusSearchQuery, signal?: AbortSignal) {
  const queryString = serializeBusSearchQuery(query)

  return httpRequest<BusSearchResponse>(`/api/buses?${queryString}`, {
    method: 'GET',
    signal,
  })
}

export function fetchBusDetails(busId: string, signal?: AbortSignal) {
  return httpRequest<Bus>(`/api/bus/${busId}`, {
    method: 'GET',
    signal,
  })
}

export function lockBusSeat(payload: SeatLockRequest, signal?: AbortSignal) {
  return httpRequest<SeatLockResponse>('/api/bus/lock-seat', {
    method: 'POST',
    body: payload,
    signal,
  })
}

export function createBooking(payload: CreateBookingRequest, signal?: AbortSignal) {
  return httpRequest<CreateBookingResponse>('/api/bookings', {
    method: 'POST',
    body: payload,
    signal,
  })
}

export function fetchBookings(query: BookingsQuery, signal?: AbortSignal) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  })

  return httpRequest<BookingsResponse | BookingsResponse['data']>(
    `/api/bookings?${params.toString()}`,
    {
      method: 'GET',
      signal,
    },
  )
}

export function updateBookingStatus(
  bookingId: string,
  status: 'upcoming' | 'completed' | 'cancelled',
  signal?: AbortSignal,
) {
  return httpRequest<unknown>(`/api/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: { status },
    signal,
  })
}

export function listSavedPassengers(signal?: AbortSignal) {
  return httpRequest<SavedPassenger[] | { data: SavedPassenger[] }>(
    '/api/saved-passengers',
    { method: 'GET', signal },
  )
}

export function createSavedPassenger(payload: SavedPassengerInput, signal?: AbortSignal) {
  return httpRequest<SavedPassenger>('/api/saved-passengers', {
    method: 'POST',
    body: payload,
    signal,
  })
}

export function updateSavedPassenger(
  id: string,
  payload: Partial<SavedPassengerInput>,
  signal?: AbortSignal,
) {
  return httpRequest<SavedPassenger>(`/api/saved-passengers/${id}`, {
    method: 'PATCH',
    body: payload,
    signal,
  })
}

export function deleteSavedPassenger(id: string, signal?: AbortSignal) {
  return httpRequest<unknown>(`/api/saved-passengers/${id}`, {
    method: 'DELETE',
    signal,
  })
}

export interface BusReviewsResponse {
  data: BusReview[]
  pagination?: { page: number; pageSize: number; total: number; totalPages: number }
}

export function fetchBusReviews(
  busId: string,
  page = 1,
  pageSize = 10,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  return httpRequest<BusReviewsResponse | BusReview[]>(
    `/api/reviews/bus/${busId}?${params.toString()}`,
    { method: 'GET', signal },
  )
}

export function createReview(payload: CreateReviewRequest, signal?: AbortSignal) {
  return httpRequest<BusReview>('/api/reviews', {
    method: 'POST',
    body: payload,
    signal,
  })
}

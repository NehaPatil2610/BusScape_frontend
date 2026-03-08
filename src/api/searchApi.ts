import type {
  BookingsQuery,
  BookingsResponse,
  Bus,
  BusSearchQuery,
  BusSearchResponse,
  CreateBookingRequest,
  CreateBookingResponse,
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

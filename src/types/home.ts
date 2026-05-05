export type SeatType = 'sleeper' | 'seater' | 'semi-sleeper'

export type DepartureSlot = 'morning' | 'afternoon' | 'evening' | 'night'

export type BusSeatStatus = 'available' | 'locked' | 'confirmed'

export interface Destination {
  id: string
  name: string
  startingPrice: number
  imageUrl: string
  imageAlt: string
}

export interface HomeSearchPayload {
  departureCity: string
  arrivalCity: string
  travelDate: string
}

export interface FeatureItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface BusSeat {
  seatNumber: number
  status: BusSeatStatus | string
  row: number
  column: number
  seatType: SeatType | string
}

export interface BusStop {
  stopName: string
  arrivalTime?: string
  departureTime?: string
}

export interface Bus {
  _id: string
  name: string
  availableSeats: number
  price: number
  seatTypes: string[]
  isAC: boolean
  stops: BusStop[]
  seats: BusSeat[]
  createdAt: string
  updatedAt: string
  __v: number
  averageRating?: number
  reviewCount?: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface BusSearchResponse {
  data: Bus[]
  pagination: PaginationMeta
}

export interface BusSearchQuery {
  departureCity: string
  arrivalCity: string
  date: string
  seatType?: SeatType
  isAC?: boolean
  departureSlot?: DepartureSlot
  minRating?: number
  page: number
  pageSize: number
}

export interface SavedPassenger {
  _id?: string
  id?: string
  name: string
  age: number
  gender: PassengerGender
  idType?: string
  idNumber?: string
  isDefault?: boolean
}

export interface SavedPassengerInput {
  name: string
  age: number
  gender: PassengerGender
  idType?: string
  idNumber?: string
  isDefault?: boolean
}

export interface BusReview {
  _id?: string
  id?: string
  reviewId?: string
  bookingId: string
  busId: string
  userSub?: string
  userName?: string
  rating: number
  comment?: string
  photos?: string[]
  verifiedTrip?: boolean
  createdAt?: string
  moderationStatus?: 'pending' | 'approved' | 'rejected'
}

export interface CreateReviewRequest {
  bookingId: string
  rating: number
  comment?: string
  photos?: string[]
}

export interface SeatLockRequest {
  busId: string
  seatNumber: number
}

export interface SeatLockResponse {
  seatNo: number
  locked: boolean
}

export type PassengerGender = 'male' | 'female' | 'other'

export interface BookingPassenger {
  name: string
  age: number
  gender: PassengerGender
}

export interface CreateBookingRequest {
  busId: string
  passengers: BookingPassenger[]
  seatNumbers: number[]
  departure: string
  arrival: string
}

export type CreateBookingResponse = Record<string, unknown>

export type BookingStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | string

export interface BookingBusInfo {
  _id?: string
  id?: string
  name?: string
  isAC?: boolean
  seatTypes?: string[]
}

export interface BookingRecord {
  _id?: string
  id?: string
  bookingId?: string
  status?: BookingStatus
  busId?: string | BookingBusInfo
  bus_id?: string | BookingBusInfo
  bus?: BookingBusInfo
  passengers?: BookingPassenger[]
  seatNumbers?: number[]
  seat_numbers?: number[]
  seatsbooked?: number[]
  seatsBooked?: number[]
  departure?: string
  arrival?: string
  date?: string
  travelDate?: string
  travel_date?: string
  journeyDate?: string
  journey_date?: string
  departureTime?: string
  arrivalTime?: string
  departureDateTime?: string
  departure_datetime?: string
  arrivalDateTime?: string
  arrival_datetime?: string
  totalAmount?: number
  total_amount?: number
  amount?: number
  price?: number
  createdAt?: string
  updatedAt?: string
}

export interface BookingsQuery {
  page: number
  pageSize: number
}

export interface BookingsResponse {
  data: BookingRecord[]
  pagination?: PaginationMeta
}

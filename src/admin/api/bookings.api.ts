import adminClient from './adminClient';
import type { Pagination } from './buses.api';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface BookingPassenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface Booking {
  _id: string;
  bus_id: { _id: string; name: string; price: number } | string;
  userSub?: string;
  status: BookingStatus;
  passengers: BookingPassenger[];
  seatsbooked: number[];
  departure: string;
  arrival: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingListParams {
  page?: number;
  pageSize?: number;
  status?: BookingStatus;
  userSub?: string;
  busId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export const fetchAdminBookings = async (
  params: BookingListParams
): Promise<{ data: Booking[]; pagination: Pagination }> => {
  const { data } = await adminClient.get('/bookings', { params });
  return data;
};

export const fetchAdminBookingById = async (bookingId: string): Promise<Booking> => {
  const { data } = await adminClient.get(`/bookings/${bookingId}`);
  return data.data;
};

export const updateAdminBookingStatus = async (
  bookingId: string,
  status: BookingStatus
): Promise<Booking> => {
  const { data } = await adminClient.patch(`/bookings/${bookingId}/status`, { status });
  return data.data;
};

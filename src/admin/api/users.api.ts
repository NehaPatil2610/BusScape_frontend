import adminClient from './adminClient';
import type { Pagination } from './buses.api';

export interface UserSummary {
  _id: string; // userSub
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  statuses: string[];
}

export interface SavedPassenger {
  _id: string;
  userSub: string;
  name: string;
  age: number;
  gender: string;
  idType?: string;
  idNumber?: string;
  isDefault: boolean;
}

export interface UserDetail {
  userSub: string;
  totalBookings: number;
  totalSpent: number;
  bookings: unknown[];
  savedPassengers: SavedPassenger[];
}

export const fetchAdminUsers = async (params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<{ data: UserSummary[]; pagination: Pagination }> => {
  const { data } = await adminClient.get('/users', { params });
  return data;
};

export const fetchAdminUserDetails = async (userSub: string): Promise<UserDetail> => {
  const { data } = await adminClient.get(`/users/${encodeURIComponent(userSub)}`);
  return data.data;
};

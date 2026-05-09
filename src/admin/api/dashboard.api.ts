import adminClient from './adminClient';

export interface BookingsByStatus {
  upcoming: number;
  completed: number;
  cancelled: number;
}

export interface RecentBooking {
  _id: string;
  bus_id: { _id: string; name: string };
  departure: string;
  arrival: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface TopBus {
  _id: string;
  name: string;
  averageRating: number;
  reviewCount: number;
  availableSeats: number;
  price: number;
}

export interface RevenuDay {
  date: string;
  revenue: number;
}

export interface DashboardStats {
  totalBuses: number;
  totalBookings: number;
  totalRevenue: number;
  totalReviews: number;
  pendingReviews: number;
  bookingsByStatus: BookingsByStatus;
  recentBookings: RecentBooking[];
  topRatedBuses: TopBus[];
  revenueLast7Days: RevenuDay[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await adminClient.get('/dashboard');
  return data.data;
};

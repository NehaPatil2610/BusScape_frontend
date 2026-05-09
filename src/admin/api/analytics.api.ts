import adminClient from './adminClient';

export interface DailyRevenue {
  _id: string;
  revenue: number;
  bookingCount: number;
}

export interface BusRevenue {
  _id: string;
  busName: string;
  revenue: number;
  bookingCount: number;
}

export interface RouteRevenue {
  _id: { departure: string; arrival: string };
  revenue: number;
  bookingCount: number;
}

export interface RevenueAnalytics {
  dailyRevenue: DailyRevenue[];
  busRevenue: BusRevenue[];
  routeRevenue: RouteRevenue[];
}

export interface DailyBookings {
  _id: string;
  count: number;
}

export interface StatusBreakdown {
  _id: string;
  count: number;
}

export interface PopularRoute {
  _id: { departure: string; arrival: string };
  count: number;
}

export interface BookingAnalytics {
  dailyBookings: DailyBookings[];
  statusBreakdown: StatusBreakdown[];
  popularRoutes: PopularRoute[];
}

export const fetchRevenueAnalytics = async (days = 30): Promise<RevenueAnalytics> => {
  const { data } = await adminClient.get('/analytics/revenue', { params: { days } });
  return data.data;
};

export const fetchBookingAnalytics = async (days = 30): Promise<BookingAnalytics> => {
  const { data } = await adminClient.get('/analytics/bookings', { params: { days } });
  return data.data;
};

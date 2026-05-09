import adminClient from './adminClient';

export type SeatStatus = 'available' | 'confirmed';
export type SeatType = 'normal' | 'sleeper' | 'semi-sleeper';

export interface BusStop {
  stopName: string;
  arrivalTime?: string;
  departureTime?: string;
}

export interface BusSeat {
  seatNumber: number;
  status: SeatStatus;
  row: number;
  column: number;
  seatType: SeatType;
}

export interface Bus {
  _id: string;
  name: string;
  availableSeats: number;
  price: number;
  seatTypes: SeatType[];
  isAC: boolean;
  stops: BusStop[];
  seats: BusSeat[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface BusListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isAC?: boolean;
  seatType?: SeatType;
  minRating?: number;
  sortBy?: 'name' | 'price' | 'averageRating' | 'createdAt' | 'availableSeats';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateBusPayload {
  name: string;
  price: number;
  isAC: boolean;
  seatTypes: SeatType[];
  stops: BusStop[];
  seats: BusSeat[];
}

export const fetchAdminBuses = async (
  params: BusListParams
): Promise<{ data: Bus[]; pagination: Pagination }> => {
  const { data } = await adminClient.get('/buses', { params });
  return data;
};

export const fetchAdminBusById = async (busId: string): Promise<Bus> => {
  const { data } = await adminClient.get(`/buses/${busId}`);
  return data.data;
};

export const createBus = async (payload: CreateBusPayload): Promise<Bus> => {
  const { data } = await adminClient.post('/buses', payload);
  return data.data;
};

export const updateBus = async (
  busId: string,
  payload: Partial<CreateBusPayload>
): Promise<Bus> => {
  const { data } = await adminClient.patch(`/buses/${busId}`, payload);
  return data.data;
};

export const deleteBus = async (busId: string): Promise<void> => {
  await adminClient.delete(`/buses/${busId}`);
};

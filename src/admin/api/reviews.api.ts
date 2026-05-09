import adminClient from './adminClient';
import type { Pagination } from './buses.api';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  _id: string;
  bus_id: { _id: string; name: string } | string;
  booking_id: { _id: string; departure: string; arrival: string } | string;
  userSub?: string;
  rating: number;
  comment?: string;
  photos: string[];
  verifiedTrip: boolean;
  moderationStatus: ModerationStatus;
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListParams {
  page?: number;
  pageSize?: number;
  moderationStatus?: ModerationStatus;
  busId?: string;
  userSub?: string;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export const fetchAdminReviews = async (
  params: ReviewListParams
): Promise<{ data: Review[]; pagination: Pagination }> => {
  const { data } = await adminClient.get('/reviews', { params });
  return data;
};

export const fetchAdminReviewById = async (reviewId: string): Promise<Review> => {
  const { data } = await adminClient.get(`/reviews/${reviewId}`);
  return data.data;
};

export const moderateReview = async (
  reviewId: string,
  moderationStatus: ModerationStatus,
  moderationNote?: string
): Promise<Review> => {
  const { data } = await adminClient.patch(`/reviews/${reviewId}/moderate`, {
    moderationStatus,
    moderationNote,
  });
  return data.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await adminClient.delete(`/reviews/${reviewId}`);
};

import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { BackendPendingRating, BackendRating, mapPendingRating, mapRating } from '@/api/mappers';
import { Rating } from '@/types';

export interface SubmitRatingPayload {
  rideId: string;
  rateeId: string;
  score: number;
  comment?: string;
}

export async function submitRating(payload: SubmitRatingPayload): Promise<Rating> {
  const response = await apiClient.post<BackendRating>(Endpoints.RATING_CREATE, {
    ride_id: payload.rideId,
    ratee_id: payload.rateeId,
    score: payload.score,
    comment: payload.comment,
  });
  return mapRating(response.data);
}

export async function getUserRatings(userId: string): Promise<Rating[]> {
  const response = await apiClient.get<{
    ratings: BackendRating[];
    averageScore: number | null;
    totalCount: number;
  }>(Endpoints.RATINGS_USER(userId));
  return response.data.ratings.map(mapRating);
}

export async function hasRatedRide(rideId: string): Promise<boolean> {
  const response = await apiClient.get<{ hasRated: boolean }>(Endpoints.RIDE_MY_RATING(rideId));
  return response.data.hasRated;
}

export async function getPendingRatings(): Promise<
  Array<{
    rideId: string;
    rateeId: string;
    rateeName: string;
    rateePhotoUrl?: string;
    departureAt: string;
    originCity: string;
    destinationCity: string;
  }>
> {
  const response = await apiClient.get<{ pending: BackendPendingRating[] }>(
    Endpoints.RATINGS_PENDING,
  );
  return response.data.pending.map(mapPendingRating);
}

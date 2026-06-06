import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { Rating } from '@/types';

export interface SubmitRatingPayload {
  rideId: string;
  rateeId: string;
  score: number;
  comment?: string;
}

/** Submit a post-ride rating */
export async function submitRating(payload: SubmitRatingPayload): Promise<Rating> {
  const response = await apiClient.post(Endpoints.RATING_CREATE, {
    ride_id: payload.rideId,
    ratee_id: payload.rateeId,
    score: payload.score,
    comment: payload.comment,
  });
  return response.data.rating;
}

/**
 * Fetch ratings received by a user.
 * Used to populate the profile ratings list.
 */
export async function getUserRatings(userId: string): Promise<Rating[]> {
  const response = await apiClient.get(Endpoints.USER_RATINGS(userId));
  return response.data.ratings;
}

/**
 * Check if current user has already rated a specific ride.
 * Prevents double-rating.
 */
export async function hasRatedRide(rideId: string): Promise<boolean> {
  const response = await apiClient.get(Endpoints.RIDE_MY_RATING(rideId));
  return response.data.has_rated;
}

/**
 * Fetch rides pending rating for current user.
 * Called on app open to show rating prompts.
 */
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
  const response = await apiClient.get(Endpoints.RATINGS_PENDING);
  return response.data.pending;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submitRating,
  getUserRatings,
  getPendingRatings,
  SubmitRatingPayload,
} from '@/services/ratings.service';
import { PROFILE_KEYS } from './useProfile';
import { BOOKING_KEYS } from './useBooking';

export const RATING_KEYS = {
  userRatings: (userId: string) => ['ratings', 'user', userId] as const,
  pendingRatings: ['ratings', 'pending'] as const,
};

/** Ratings received by a user — shown on profile page */
export function useUserRatings(userId: string) {
  return useQuery({
    queryKey: RATING_KEYS.userRatings(userId),
    queryFn: () => getUserRatings(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

/** Rides awaiting rating from the current user */
export function usePendingRatings() {
  return useQuery({
    queryKey: RATING_KEYS.pendingRatings,
    queryFn: getPendingRatings,
    staleTime: 1000 * 60,
  });
}

/** Submit a rating — invalidates profile + pending list */
export function useSubmitRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitRatingPayload) => submitRating(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: RATING_KEYS.pendingRatings,
      });
      queryClient.invalidateQueries({
        queryKey: RATING_KEYS.userRatings(variables.rateeId),
      });
      queryClient.invalidateQueries({
        queryKey: PROFILE_KEYS.profile,
      });
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.myBookings,
      });
    },
  });
}

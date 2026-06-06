/**
 * useBooking — passenger booking state management.
 *
 * Covers:
 *  - Fetching a single ride for the booking screen
 *  - Requesting a booking (POST)
 *  - Fetching all passenger bookings
 *  - Cancelling a booking
 *  - Optimistic status updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRideDetail } from '@/services/rides.service';
import { getMyBookings, updateBookingStatus } from '@/services/bookings.service';
import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { Booking } from '@/types';

export const BOOKING_KEYS = {
  myBookings: ['passenger', 'bookings'] as const,
  rideForBooking: (id: string) => ['passenger', 'ride', id] as const,
};

export function useRideForBooking(rideId: string) {
  return useQuery({
    queryKey: BOOKING_KEYS.rideForBooking(rideId),
    queryFn: () => getRideDetail(rideId),
    enabled: !!rideId,
    staleTime: 1000 * 30,
  });
}

export function useRequestBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rideId,
      seatsRequested,
    }: {
      rideId: string;
      seatsRequested: number;
    }): Promise<Booking> => {
      const response = await apiClient.post(Endpoints.BOOKING_CREATE(rideId), {
        seats_requested: seatsRequested,
      });
      return response.data.booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.myBookings });
    },
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: BOOKING_KEYS.myBookings,
    queryFn: getMyBookings,
    select: (bookings: Booking[]) => ({
      active: bookings
        .filter((b) => b.status === 'pending' || b.status === 'confirmed')
        .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()),
      past: bookings
        .filter(
          (b) =>
            b.status === 'completed' ||
            b.status === 'cancelled_by_passenger' ||
            b.status === 'cancelled_by_driver',
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    }),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => updateBookingStatus(bookingId, 'cancelled_by_passenger'),

    onMutate: async (bookingId: string) => {
      await queryClient.cancelQueries({
        queryKey: BOOKING_KEYS.myBookings,
      });

      const previous = queryClient.getQueryData<Booking[]>(BOOKING_KEYS.myBookings);

      queryClient.setQueryData<Booking[]>(
        BOOKING_KEYS.myBookings,
        (old) =>
          old?.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled_by_passenger' as const } : b,
          ) ?? [],
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BOOKING_KEYS.myBookings, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.myBookings });
    },
  });
}

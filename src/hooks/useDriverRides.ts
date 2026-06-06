/**
 * useDriverRides — data layer for the driver's rides + booking management.
 *
 * Uses TanStack Query for caching and refetch-on-focus.
 * Optimistic updates on accept/decline so UI responds instantly.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyRides, getRideDetail } from '@/services/rides.service';
import {
  getRideBookings,
  updateBookingStatus,
  cancelRideWithBookings,
  BookingAction,
} from '@/services/bookings.service';
import { Ride, Booking } from '@/types';

// ── Query keys ──────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  myRides: ['driver', 'rides'] as const,
  rideDetail: (id: string) => ['driver', 'ride', id] as const,
  rideBookings: (id: string) => ['driver', 'ride', id, 'bookings'] as const,
};

// ── My Rides list ───────────────────────────────────────────────────────────
export function useMyRides() {
  return useQuery({
    queryKey: QUERY_KEYS.myRides,
    queryFn: getMyRides,
    select: (rides: Ride[]) => ({
      upcoming: rides
        .filter((r) => r.status === 'active' && new Date(r.departureAt) > new Date())
        .sort((a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()),
      past: rides
        .filter((r) => r.status !== 'active' || new Date(r.departureAt) <= new Date())
        .sort((a, b) => new Date(b.departureAt).getTime() - new Date(a.departureAt).getTime()),
    }),
  });
}

// ── Single ride detail ───────────────────────────────────────────────────────
export function useRideDetail(rideId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.rideDetail(rideId),
    queryFn: () => getRideDetail(rideId),
    enabled: !!rideId,
  });
}

// ── Ride bookings ────────────────────────────────────────────────────────────
export function useRideBookings(rideId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.rideBookings(rideId),
    queryFn: () => getRideBookings(rideId),
    enabled: !!rideId,
    select: (bookings: Booking[]) => ({
      pending: bookings.filter((b) => b.status === 'pending'),
      confirmed: bookings.filter((b) => b.status === 'confirmed'),
      declined: bookings.filter((b) => b.status === 'cancelled_by_driver'),
      all: bookings,
    }),
  });
}

// ── Accept / decline mutation ────────────────────────────────────────────────
export function useBookingAction(rideId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, action }: { bookingId: string; action: BookingAction }) =>
      updateBookingStatus(bookingId, action),

    onMutate: async ({ bookingId, action }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.rideBookings(rideId),
      });

      const previous = queryClient.getQueryData<Booking[]>(QUERY_KEYS.rideBookings(rideId));

      queryClient.setQueryData<Booking[]>(
        QUERY_KEYS.rideBookings(rideId),
        (old) => old?.map((b) => (b.id === bookingId ? { ...b, status: action } : b)) ?? [],
      );

      if (action === 'confirmed') {
        queryClient.setQueryData<Ride>(QUERY_KEYS.rideDetail(rideId), (old) =>
          old ? { ...old, seatsAvailable: Math.max(0, old.seatsAvailable - 1) } : old,
        );
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.rideBookings(rideId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.rideBookings(rideId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myRides,
      });
    },
  });
}

// ── Cancel ride mutation ─────────────────────────────────────────────────────
export function useCancelRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelRideWithBookings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRides });
    },
  });
}

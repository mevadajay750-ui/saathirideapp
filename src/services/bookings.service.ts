import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { Booking } from '@/types';

export type BookingAction = 'confirmed' | 'cancelled_by_driver' | 'cancelled_by_passenger';

/**
 * Get all bookings for a specific ride (driver view).
 * Returns all passengers who have requested, been accepted, or declined.
 */
export async function getRideBookings(rideId: string): Promise<Booking[]> {
  const response = await apiClient.get(Endpoints.RIDE_BOOKINGS(rideId));
  return response.data.bookings;
}

/**
 * Driver accepts or declines a booking request.
 * action: 'confirmed' | 'cancelled_by_driver'
 */
export async function updateBookingStatus(
  bookingId: string,
  action: BookingAction,
): Promise<Booking> {
  const response = await apiClient.put(Endpoints.BOOKING_UPDATE(bookingId), {
    status: action,
  });
  return response.data.booking;
}

/**
 * Get all bookings for the current user (passenger view — used later).
 */
export async function getMyBookings(): Promise<Booking[]> {
  const response = await apiClient.get(Endpoints.BOOKINGS_MY);
  return response.data.bookings;
}

/**
 * Driver cancels an entire ride (cascades cancel to all confirmed bookings).
 */
export async function cancelRideWithBookings(rideId: string): Promise<void> {
  await apiClient.put(Endpoints.RIDE_UPDATE(rideId), {
    status: 'cancelled',
  });
}

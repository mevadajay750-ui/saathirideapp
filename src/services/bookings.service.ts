import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { BackendBooking, mapBooking, mapBookings } from '@/api/mappers';
import { Booking } from '@/types';

export type BookingAction = 'confirmed' | 'cancelled_by_driver' | 'cancelled_by_passenger';

export async function createBooking(rideId: string, seats: number): Promise<Booking> {
  const response = await apiClient.post<BackendBooking>(Endpoints.BOOKINGS_CREATE, {
    ride_id: rideId,
    seats,
  });
  return mapBooking(response.data, 'passenger');
}

export async function getRideBookings(rideId: string): Promise<Booking[]> {
  const response = await apiClient.get<BackendBooking[]>(Endpoints.RIDE_BOOKINGS(rideId));
  return mapBookings(response.data, 'driver');
}

export async function acceptBooking(bookingId: string): Promise<Booking> {
  const response = await apiClient.patch<BackendBooking>(Endpoints.BOOKING_ACCEPT(bookingId));
  return mapBooking(response.data, 'driver');
}

export async function declineBooking(bookingId: string): Promise<void> {
  await apiClient.patch(Endpoints.BOOKING_DECLINE(bookingId));
}

export async function updateBookingStatus(
  bookingId: string,
  action: BookingAction,
): Promise<Booking> {
  if (action === 'confirmed') {
    return acceptBooking(bookingId);
  }
  if (action === 'cancelled_by_driver') {
    await declineBooking(bookingId);
    return {
      id: bookingId,
      rideId: '',
      passengerId: '',
      passengerName: '',
      passengerRating: 0,
      seatsRequested: 0,
      status: 'cancelled_by_driver',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  await apiClient.patch(Endpoints.BOOKING_CANCEL(bookingId));
  return {
    id: bookingId,
    rideId: '',
    passengerId: '',
    passengerName: '',
    passengerRating: 0,
    seatsRequested: 0,
    status: 'cancelled_by_passenger',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getMyBookings(): Promise<Booking[]> {
  const response = await apiClient.get<BackendBooking[]>(Endpoints.BOOKINGS_MY);
  return mapBookings(response.data, 'passenger');
}

export async function cancelRideWithBookings(rideId: string): Promise<void> {
  await apiClient.delete(Endpoints.RIDE_DETAIL(rideId));
}

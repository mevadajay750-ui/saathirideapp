import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { Ride, RideSearchParams } from '@/types';

export interface CreateRidePayload {
  originCity: string;
  originLandmark?: string;
  destinationCity: string;
  destinationLandmark?: string;
  departureDate: string;
  departureTime: string;
  totalSeats: number;
  pricePerSeat: number;
  notes?: string;
}

export async function createRide(payload: CreateRidePayload): Promise<Ride> {
  const departureAt = new Date(
    `${payload.departureDate}T${payload.departureTime}:00`,
  ).toISOString();

  const response = await apiClient.post(Endpoints.RIDES_CREATE, {
    origin_city: payload.originCity,
    origin_landmark: payload.originLandmark,
    destination_city: payload.destinationCity,
    destination_landmark: payload.destinationLandmark,
    departure_at: departureAt,
    total_seats: payload.totalSeats,
    price_per_seat: payload.pricePerSeat,
    notes: payload.notes,
  });

  return response.data.ride;
}

export async function getMyRides(): Promise<Ride[]> {
  const response = await apiClient.get(Endpoints.RIDES_MY);
  return response.data.rides;
}

export async function getRideDetail(rideId: string): Promise<Ride> {
  const response = await apiClient.get(Endpoints.RIDE_DETAIL(rideId));
  return response.data.ride;
}

export async function cancelRide(rideId: string): Promise<void> {
  await apiClient.put(Endpoints.RIDE_UPDATE(rideId), { status: 'cancelled' });
}

export async function searchRides(params: RideSearchParams): Promise<Ride[]> {
  const response = await apiClient.get(Endpoints.RIDES_SEARCH, {
    params: {
      origin_city: params.originCity,
      destination_city: params.destinationCity,
      date: params.date,
      seats: params.seats ?? 1,
    },
  });
  return response.data.rides;
}

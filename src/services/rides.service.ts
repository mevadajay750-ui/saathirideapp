import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import {
  BackendBooking,
  BackendRide,
  mapBooking,
  mapBookings,
  mapRide,
  mapRides,
} from '@/api/mappers';
import { Ride, RideSearchParams } from '@/types';

export interface CreateRidePayload {
  originCity: string;
  destinationCity: string;
  departureDate: string;
  departureTime: string;
  totalSeats: number;
  pricePerSeat: number;
  notes?: string;
}

export async function createRide(payload: CreateRidePayload): Promise<Ride> {
  const departureTime = new Date(
    `${payload.departureDate}T${payload.departureTime}:00`,
  ).toISOString();

  const response = await apiClient.post<BackendRide>(Endpoints.RIDES_CREATE, {
    origin_city: payload.originCity,
    destination_city: payload.destinationCity,
    departure_time: departureTime,
    total_seats: payload.totalSeats,
    price_per_seat: payload.pricePerSeat,
    notes: payload.notes,
  });

  return mapRide(response.data);
}

export async function getMyRides(): Promise<Ride[]> {
  const response = await apiClient.get<BackendRide[]>(Endpoints.RIDES_MY);
  return mapRides(response.data);
}

export async function getRideDetail(rideId: string): Promise<Ride> {
  const response = await apiClient.get<BackendRide>(Endpoints.RIDE_DETAIL(rideId));
  return mapRide(response.data);
}

export async function cancelRide(rideId: string): Promise<void> {
  await apiClient.delete(Endpoints.RIDE_DETAIL(rideId));
}

export async function searchRides(params: RideSearchParams): Promise<Ride[]> {
  const response = await apiClient.get<BackendRide[]>(Endpoints.RIDES_SEARCH, {
    params: {
      origin: params.originCity,
      destination: params.destinationCity,
      date: params.date,
      seats: params.seats ?? 1,
    },
  });
  return mapRides(response.data);
}

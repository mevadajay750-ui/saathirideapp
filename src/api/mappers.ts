import { AuthUser, Booking, BookingStatus, Rating, Ride, UserRole, Vehicle } from '@/types';

// ── Backend DTO shapes ───────────────────────────────────────────────────────

export interface BackendUser {
  id: string;
  phone: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
  vehicle?: BackendVehicle | null;
  avgRating?: number;
  totalRides?: number;
}

export interface BackendVehicle {
  id: string;
  userId?: string;
  make: string;
  model: string;
  year?: number;
  color: string;
  plateNumber: string;
  totalSeats?: number;
}

export interface BackendRide {
  id: string;
  driverId?: string;
  originCity: string;
  destinationCity: string;
  departureTime: string;
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  status: Ride['status'];
  notes?: string | null;
  createdAt: string;
  driver?: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    vehicle?: BackendVehicle | null;
  };
  bookings?: BackendBooking[];
}

export interface BackendBooking {
  id: string;
  rideId: string;
  seats: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  passenger?: {
    id: string;
    name: string | null;
    phone?: string;
    avatarUrl: string | null;
  };
  ride?: {
    id: string;
    originCity: string;
    destinationCity: string;
    departureTime: string;
    pricePerSeat: number;
    driver?: {
      id: string;
      name: string | null;
      avatarUrl: string | null;
    };
  };
}

export interface BackendRating {
  id: string;
  rideId: string;
  raterId: string;
  rateeId: string;
  score: number;
  comment?: string | null;
  createdAt: string;
  rater?: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

export interface BackendPendingRating {
  rideId: string;
  rateeId: string;
  rateeName: string;
  rateePhotoUrl?: string | null;
  departureAt: string;
  originCity: string;
  destinationCity: string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function emptyVehicle(): Ride['vehicle'] {
  return { make: '', model: '', color: '', plateNumber: '' };
}

export function mapUser(dto: BackendUser): AuthUser {
  return {
    id: dto.id,
    phone: dto.phone,
    name: dto.name ?? '',
    photoUrl: dto.avatarUrl ?? undefined,
    role: dto.role,
    avgRating: dto.avgRating ?? 0,
    totalRides: dto.totalRides ?? 0,
    createdAt: dto.createdAt,
    isVerified: true,
    vehicle: dto.vehicle ? mapVehicle(dto.vehicle) : undefined,
  };
}

export function mapVehicle(dto: BackendVehicle): Vehicle {
  return {
    id: dto.id,
    userId: dto.userId ?? '',
    make: dto.make,
    model: dto.model,
    color: dto.color,
    plateNumber: dto.plateNumber,
    year: dto.year,
    totalSeats: dto.totalSeats,
  };
}

export function mapRide(dto: BackendRide): Ride {
  const driver = dto.driver;
  const vehicle = driver?.vehicle;

  return {
    id: dto.id,
    driverId: dto.driverId ?? driver?.id ?? '',
    driverName: driver?.name ?? '',
    driverPhotoUrl: driver?.avatarUrl ?? undefined,
    driverRating: 0,
    vehicle: vehicle
      ? {
          make: vehicle.make,
          model: vehicle.model,
          color: vehicle.color,
          plateNumber: vehicle.plateNumber,
        }
      : emptyVehicle(),
    origin: { city: dto.originCity },
    destination: { city: dto.destinationCity },
    departureAt: dto.departureTime,
    totalSeats: dto.totalSeats,
    seatsAvailable: dto.availableSeats,
    pricePerSeat: dto.pricePerSeat,
    notes: dto.notes ?? undefined,
    status: dto.status,
    createdAt: dto.createdAt,
  };
}

export function mapRides(dtos: BackendRide[]): Ride[] {
  return dtos.map(mapRide);
}

export function mapBookingStatus(
  status: BackendBooking['status'],
  context?: 'driver' | 'passenger',
): BookingStatus {
  if (status === 'cancelled') {
    return context === 'driver' ? 'cancelled_by_driver' : 'cancelled_by_passenger';
  }
  return status;
}

export function mapBooking(dto: BackendBooking, context?: 'driver' | 'passenger'): Booking {
  return {
    id: dto.id,
    rideId: dto.rideId,
    passengerId: dto.passenger?.id ?? '',
    passengerName: dto.passenger?.name ?? '',
    passengerPhotoUrl: dto.passenger?.avatarUrl ?? undefined,
    passengerRating: 0,
    seatsRequested: dto.seats,
    status: mapBookingStatus(dto.status, context),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    ride: dto.ride
      ? {
          originCity: dto.ride.originCity,
          destinationCity: dto.ride.destinationCity,
          departureAt: dto.ride.departureTime,
          pricePerSeat: dto.ride.pricePerSeat,
          driverName: dto.ride.driver?.name ?? '',
          driverPhotoUrl: dto.ride.driver?.avatarUrl ?? undefined,
          driverRating: 0,
          driverPhone: dto.passenger?.phone,
        }
      : undefined,
  };
}

export function mapBookings(dtos: BackendBooking[], context?: 'driver' | 'passenger'): Booking[] {
  return dtos.map((dto) => mapBooking(dto, context));
}

export function mapRating(dto: BackendRating): Rating {
  return {
    id: dto.id,
    rideId: dto.rideId,
    raterId: dto.raterId,
    rateeId: dto.rateeId,
    score: dto.score,
    comment: dto.comment ?? undefined,
    createdAt: dto.createdAt,
  };
}

export function mapPendingRating(dto: BackendPendingRating) {
  return {
    rideId: dto.rideId,
    rateeId: dto.rateeId,
    rateeName: dto.rateeName,
    rateePhotoUrl: dto.rateePhotoUrl ?? undefined,
    departureAt: dto.departureAt,
    originCity: dto.originCity,
    destinationCity: dto.destinationCity,
  };
}

export function toApiRole(role: UserRole): UserRole {
  return role;
}

export function toApiVehiclePayload(payload: {
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  totalSeats: number;
}) {
  return {
    make: payload.make,
    model: payload.model,
    year: payload.year,
    color: payload.color,
    plate_number: payload.plateNumber.toUpperCase(),
    total_seats: payload.totalSeats,
  };
}

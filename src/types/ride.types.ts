export type RideStatus = 'active' | 'completed' | 'cancelled';

export interface RideLocation {
  city: string;
  landmark?: string;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverPhotoUrl?: string;
  driverRating: number;
  vehicle: {
    make: string;
    model: string;
    color: string;
    plateNumber: string;
  };
  origin: RideLocation;
  destination: RideLocation;
  departureAt: string;
  totalSeats: number;
  seatsAvailable: number;
  pricePerSeat: number;
  notes?: string;
  status: RideStatus;
  createdAt: string;
}

export interface RideSearchParams {
  originCity: string;
  destinationCity: string;
  date: string;
  seats?: number;
}

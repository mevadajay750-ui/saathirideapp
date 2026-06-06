export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled_by_passenger'
  | 'cancelled_by_driver'
  | 'completed';

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  passengerPhotoUrl?: string;
  passengerRating: number;
  seatsRequested: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  rideId: string;
  raterId: string;
  rateeId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

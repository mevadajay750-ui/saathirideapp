export type UserRole = 'driver' | 'passenger';

export interface User {
  id: string;
  phone: string;
  name: string;
  photoUrl?: string;
  role: UserRole;
  avgRating: number;
  totalRides: number;
  createdAt: string;
  isVerified: boolean;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  color: string;
  plateNumber: string;
}

export interface AuthUser extends User {
  vehicle?: Vehicle;
}

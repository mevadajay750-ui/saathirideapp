import { storage } from '@/utils/storage';

export type UserRole = 'driver' | 'passenger' | 'both';

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
  year?: number;
  totalSeats?: number;
}

export interface AuthUser extends User {
  vehicle?: Vehicle;
}

export function getNavigationRole(role: UserRole): 'driver' | 'passenger' {
  if (role === 'both') {
    const preferred = storage.getString('preferred_nav_role');
    return preferred === 'driver' ? 'driver' : 'passenger';
  }
  return role;
}

export function setNavigationRole(role: 'driver' | 'passenger'): void {
  storage.set('preferred_nav_role', role);
}

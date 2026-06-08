import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { AuthUser, Vehicle, UserRole } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  photoUrl?: string;
  role?: UserRole;
}

export interface UpdateVehiclePayload {
  make: string;
  model: string;
  color: string;
  plateNumber: string;
}

/** Fetch latest profile from server */
export async function fetchProfile(): Promise<AuthUser> {
  const response = await apiClient.get(Endpoints.USER_ME);
  return response.data.user;
}

/** Update name / photo / role */
export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const response = await apiClient.put(Endpoints.USER_UPDATE, {
    name: payload.name,
    photo_url: payload.photoUrl,
    role: payload.role,
  });
  return response.data.user;
}

/** Save / update vehicle details (drivers only) */
export async function upsertVehicle(payload: UpdateVehiclePayload): Promise<Vehicle> {
  const response = await apiClient.post(Endpoints.VEHICLES_CREATE, {
    make: payload.make,
    model: payload.model,
    color: payload.color,
    plate_number: payload.plateNumber.toUpperCase(),
  });
  return response.data.vehicle;
}

/** Upload profile photo, return CDN URL */
export async function uploadPhoto(localUri: string, userId: string): Promise<string> {
  const storage = (await import('@react-native-firebase/storage')).default;
  const ref = storage().ref(`profile_photos/${userId}_${Date.now()}.jpg`);
  await ref.putFile(localUri);
  return ref.getDownloadURL();
}

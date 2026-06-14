import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { BackendUser, BackendVehicle, mapUser, mapVehicle, toApiVehiclePayload } from '@/api/mappers';
import { AuthUser, Vehicle, UserRole } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  photoUrl?: string;
  role?: UserRole;
}

export interface UpdateVehiclePayload {
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  totalSeats: number;
}

export async function fetchProfile(): Promise<AuthUser> {
  const response = await apiClient.get<BackendUser>(Endpoints.USER_ME);
  return mapUser(response.data);
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const response = await apiClient.put<BackendUser>(Endpoints.USER_UPDATE, {
    name: payload.name,
    avatar_url: payload.photoUrl,
    role: payload.role,
  });
  return mapUser(response.data);
}

export async function upsertVehicle(payload: UpdateVehiclePayload): Promise<Vehicle> {
  const response = await apiClient.put<BackendVehicle>(
    Endpoints.VEHICLE_UPSERT,
    toApiVehiclePayload(payload),
  );
  return mapVehicle(response.data);
}

export async function uploadPhoto(localUri: string, userId: string): Promise<string> {
  const storage = (await import('@react-native-firebase/storage')).default;
  const ref = storage().ref(`profile_photos/${userId}_${Date.now()}.jpg`);
  await ref.putFile(localUri);
  return ref.getDownloadURL();
}

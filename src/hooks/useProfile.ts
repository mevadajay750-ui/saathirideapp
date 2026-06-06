import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProfile,
  updateProfile,
  upsertVehicle,
  uploadPhoto,
} from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';
import { AuthUser, UserRole } from '@/types';

export const PROFILE_KEYS = {
  profile: ['profile'] as const,
};

/** Fetch & cache the current user's profile */
export function useProfileData() {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: PROFILE_KEYS.profile,
    queryFn: async () => {
      const user = await fetchProfile();
      setUser(user);
      return user;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/** Update name, photo URL, or role */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser: AuthUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(PROFILE_KEYS.profile, updatedUser);
    },
  });
}

/** Upload photo then save URL to profile */
export function useUploadAndSavePhoto() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (localUri: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      const photoUrl = await uploadPhoto(localUri, user.id);
      const updatedUser = await updateProfile({ photoUrl });
      return updatedUser;
    },
    onSuccess: (updatedUser: AuthUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(PROFILE_KEYS.profile, updatedUser);
    },
  });
}

/** Save vehicle details */
export function useUpsertVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.profile });
    },
  });
}

/** Switch role between driver and passenger */
export function useSwitchRole() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (role: UserRole) => updateProfile({ role }),
    onSuccess: (updatedUser: AuthUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(PROFILE_KEYS.profile, updatedUser);
      queryClient.clear();
    },
  });
}

import { useAuthStore } from '@/store/auth.store';

/**
 * Returns whether the authenticated user has completed their profile.
 * Profile is complete when: name is set AND role is set.
 * Drivers additionally need a vehicle — but that's enforced at
 * feature level (post-ride), not at app entry level.
 */
export function useProfileComplete(): boolean {
  const user = useAuthStore((s) => s.user);
  if (!user) return false;
  return Boolean(user.name?.trim() && user.role);
}

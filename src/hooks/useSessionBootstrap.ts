import { useEffect } from 'react';
import { auth, isFirebaseConfigured } from '@/config/firebase';
import { BYPASS_AUTH, DEV_MOCK_TOKEN, DEV_MOCK_USER, MOCK_OTP_IN_DEV } from '@/config/dev.auth';
import { fetchProfile } from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';
import { storage } from '@/utils/storage';
import type { AuthUser } from '@/types';

export function useSessionBootstrap() {
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    if (BYPASS_AUTH) {
      setAuth(DEV_MOCK_USER, DEV_MOCK_TOKEN, {
        refreshToken: DEV_MOCK_TOKEN,
        needsProfileSetup: false,
      });
      return;
    }

    const storedToken = storage.getString('auth_token');
    const storedRefreshToken = storage.getString('auth_refresh_token');
    const storedUserJson = storage.getString('auth_user');
    let needsProfileSetup = storage.getBoolean('needs_profile_setup') ?? false;

    if (!storedToken || !storedUserJson) {
      setLoading(false);
      return;
    }

    let user: AuthUser;
    try {
      user = JSON.parse(storedUserJson) as AuthUser;
    } catch {
      clearAuth();
      return;
    }

    if (!user.name?.trim()) {
      needsProfileSetup = true;
    }

    async function restoreSession() {
      const isMockSession =
        MOCK_OTP_IN_DEV &&
        (storedToken!.startsWith('dev-mock-token-') || storedToken === DEV_MOCK_TOKEN);

      if (isMockSession) {
        setAuth(user, storedToken!, {
          refreshToken: storedRefreshToken ?? storedToken!,
          needsProfileSetup,
        });
        return;
      }

      try {
        const profile = await fetchProfile();
        setAuth(profile, storedToken!, {
          refreshToken: storedRefreshToken ?? undefined,
          needsProfileSetup: needsProfileSetup || !profile.name?.trim(),
        });
      } catch {
        clearAuth();
      }
    }

    if (!isFirebaseConfigured) {
      setAuth(user, storedToken, {
        refreshToken: storedRefreshToken ?? undefined,
        needsProfileSetup,
      });
      void restoreSession();
      return;
    }

    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!firebaseUser) {
        clearAuth();
        return;
      }
      void restoreSession();
    });
  }, [setAuth, clearAuth, setLoading]);
}

import { useEffect } from 'react';
import { auth, isFirebaseConfigured } from '@/config/firebase';
import { BYPASS_AUTH, DEV_MOCK_TOKEN, DEV_MOCK_USER } from '@/config/dev.auth';
import { useAuthStore } from '@/store/auth.store';
import { storage } from '@/utils/storage';
import type { AuthUser } from '@/types';

export function useSessionBootstrap() {
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    if (BYPASS_AUTH) {
      setAuth(DEV_MOCK_USER, DEV_MOCK_TOKEN, { needsProfileSetup: false });
      return;
    }

    const storedToken = storage.getString('auth_token');
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

    if (!isFirebaseConfigured) {
      setAuth(user, storedToken, { needsProfileSetup });
      return;
    }

    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!firebaseUser) {
        clearAuth();
        return;
      }
      setAuth(user, storedToken, { needsProfileSetup });
    });
  }, [setAuth, clearAuth, setLoading]);
}

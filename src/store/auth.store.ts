import { create } from 'zustand';
import { AuthUser, UserRole } from '@/types';
import { storage } from '@/utils/storage';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
const AUTH_USER_KEY = 'auth_user';
const NEEDS_PROFILE_SETUP_KEY = 'needs_profile_setup';

function persistSession(
  user: AuthUser | null,
  token: string | null,
  refreshToken: string | null,
  needsProfileSetup: boolean,
) {
  if (token) {
    storage.set(AUTH_TOKEN_KEY, token);
  } else {
    storage.remove(AUTH_TOKEN_KEY);
  }

  if (refreshToken) {
    storage.set(AUTH_REFRESH_TOKEN_KEY, refreshToken);
  } else {
    storage.remove(AUTH_REFRESH_TOKEN_KEY);
  }

  if (user) {
    storage.set(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    storage.remove(AUTH_USER_KEY);
  }

  storage.set(NEEDS_PROFILE_SETUP_KEY, needsProfileSetup);
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsProfileSetup: boolean;

  setAuth: (
    user: AuthUser,
    token: string,
    options?: { refreshToken?: string; needsProfileSetup?: boolean },
  ) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  setRole: (role: UserRole) => void;
  completeProfileSetup: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: storage.getString(AUTH_TOKEN_KEY) ?? null,
  refreshToken: storage.getString(AUTH_REFRESH_TOKEN_KEY) ?? null,
  isAuthenticated: false,
  isLoading: true,
  needsProfileSetup: storage.getBoolean(NEEDS_PROFILE_SETUP_KEY) ?? false,

  setAuth: (user, token, options) => {
    const needsProfileSetup = options?.needsProfileSetup ?? false;
    const refreshToken = options?.refreshToken ?? get().refreshToken;
    persistSession(user, token, refreshToken, needsProfileSetup);
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: !needsProfileSetup,
      needsProfileSetup,
      isLoading: false,
    });
  },

  setTokens: (token, refreshToken) => {
    const { user, needsProfileSetup } = get();
    persistSession(user, token, refreshToken, needsProfileSetup);
    set({ token, refreshToken });
  },

  setUser: (user) => {
    const { token, refreshToken, needsProfileSetup } = get();
    persistSession(user, token, refreshToken, needsProfileSetup);
    set({ user });
  },

  setRole: (role) =>
    set((state) => {
      const user = state.user ? { ...state.user, role } : null;
      if (user) {
        persistSession(user, state.token, state.refreshToken, state.needsProfileSetup);
      }
      return { user };
    }),

  completeProfileSetup: () => {
    const { user, token, refreshToken } = get();
    if (user) {
      storage.set(`profile_complete_${user.id}`, true);
    }
    persistSession(user, token, refreshToken, false);
    set({ needsProfileSetup: false, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    const { user } = get();
    if (user?.id) {
      storage.remove(`profile_complete_${user.id}`);
    }
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(AUTH_REFRESH_TOKEN_KEY);
    storage.remove(AUTH_USER_KEY);
    storage.remove(NEEDS_PROFILE_SETUP_KEY);
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      needsProfileSetup: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

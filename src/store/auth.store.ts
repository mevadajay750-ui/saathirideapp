import { create } from 'zustand';
import { AuthUser, UserRole } from '@/types';
import { storage } from '@/utils/storage';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  setRole: (role: UserRole) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storage.getString('auth_token') ?? null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    storage.set('auth_token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => set({ user }),

  setRole: (role) =>
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    })),

  clearAuth: () => {
    storage.remove('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

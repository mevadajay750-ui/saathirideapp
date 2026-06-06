import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { storage } from '@/utils/storage';

export function useAuth() {
  const { token, setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = token ?? storage.getString('auth_token');

      if (storedToken) {
        setAuth(
          {
            id: 'stub-user',
            phone: '9876543210',
            name: 'Guest User',
            role: 'passenger',
            avgRating: 0,
            totalRides: 0,
            createdAt: new Date().toISOString(),
            isVerified: false,
          },
          storedToken,
        );
      } else {
        setLoading(false);
      }
    };

    bootstrap();
  }, [setAuth, setLoading, token]);
}

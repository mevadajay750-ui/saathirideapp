import type { AuthUser } from '@/types';

/** Skip phone OTP and open the main app. Dev builds only — flip to false to test auth. */
export const BYPASS_AUTH = __DEV__;

export const DEV_MOCK_USER: AuthUser = {
  id: 'dev-user-1',
  phone: '9876543210',
  name: 'Dev User',
  role: 'passenger',
  avgRating: 4.5,
  totalRides: 12,
  createdAt: new Date().toISOString(),
  isVerified: true,
};

export const DEV_MOCK_TOKEN = 'dev-bypass-token';

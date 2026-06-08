import type { AuthUser } from '@/types';

/** Skip phone OTP and open the main app. Dev builds only — flip to false to test auth. */
export const BYPASS_AUTH = false;

/**
 * Simulate OTP in dev without Firebase SMS (use code below on the OTP screen).
 * Set to false once Firebase Phone Auth is fully configured (SHA keys, APNs, test numbers).
 */
export const MOCK_OTP_IN_DEV = __DEV__;

/** Fixed OTP accepted when MOCK_OTP_IN_DEV is enabled */
export const DEV_OTP_CODE = '123456';

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

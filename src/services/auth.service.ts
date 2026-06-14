/**
 * Auth service — Firebase Phone Auth + backend JWT exchange
 */

import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';
import { BackendUser, mapUser } from '@/api/mappers';
import { auth, isFirebaseConfigured, storage as firebaseStorage } from '@/config/firebase';
import { DEV_OTP_CODE, MOCK_OTP_IN_DEV } from '@/config/dev.auth';
import { AuthUser, UserRole } from '@/types';
import { INDIA_PHONE_PREFIX } from '@/config/constants';
import { storage } from '@/utils/storage';

const FIREBASE_NOT_CONFIGURED =
  'Firebase is not configured. Add google-services.json and GoogleService-Info.plist from Firebase Console.';

function ensureFirebaseReady() {
  if (!isFirebaseConfigured) {
    throw new Error(FIREBASE_NOT_CONFIGURED);
  }
}

let _confirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null;
let _mockOtpPhone: string | null = null;

export function isMockOtpActive(): boolean {
  return MOCK_OTP_IN_DEV;
}

function configureFirebaseAuthForDev(): void {
  if (!__DEV__ || MOCK_OTP_IN_DEV || !isFirebaseConfigured) {
    return;
  }

  auth().settings.appVerificationDisabledForTesting = true;
}

configureFirebaseAuthForDev();

function normalizeIndianPhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

function buildMockAuthUser(phone: string, overrides?: Partial<AuthUser>): AuthUser {
  return {
    id: `dev-${phone}`,
    phone,
    name: '',
    role: 'passenger',
    avgRating: 0,
    totalRides: 0,
    createdAt: new Date().toISOString(),
    isVerified: true,
    ...overrides,
  };
}

function isProfileComplete(userId: string): boolean {
  return storage.getBoolean(`profile_complete_${userId}`) ?? false;
}

interface AuthVerifyResponse {
  accessToken: string;
  refreshToken: string;
  user: BackendUser;
  isNewUser: boolean;
}

export async function sendOTP(phone: string): Promise<void> {
  const digits = normalizeIndianPhone(phone);

  if (MOCK_OTP_IN_DEV) {
    _mockOtpPhone = digits;
    _confirmationResult = null;
    return;
  }

  ensureFirebaseReady();
  const fullPhone = `${INDIA_PHONE_PREFIX}${digits}`;
  _confirmationResult = await auth().signInWithPhoneNumber(fullPhone);
}

export async function verifyOTP(code: string): Promise<string> {
  if (MOCK_OTP_IN_DEV) {
    if (!_mockOtpPhone) {
      throw new Error('No OTP confirmation found. Please request OTP again.');
    }
    if (code !== DEV_OTP_CODE) {
      const error = new Error('Invalid verification code') as Error & { code?: string };
      error.code = 'auth/invalid-verification-code';
      throw error;
    }
    return `dev-mock-token-${_mockOtpPhone}`;
  }

  ensureFirebaseReady();

  if (!_confirmationResult) {
    throw new Error('No OTP confirmation found. Please request OTP again.');
  }

  const userCredential = await _confirmationResult.confirm(code);

  if (!userCredential?.user) {
    throw new Error('OTP verification failed. Please try again.');
  }

  return userCredential.user.getIdToken();
}

export async function exchangeFirebaseToken(idToken: string): Promise<{
  token: string;
  refreshToken: string;
  user: AuthUser;
  isNewUser: boolean;
}> {
  if (MOCK_OTP_IN_DEV && idToken.startsWith('dev-mock-token-')) {
    const phone = idToken.replace('dev-mock-token-', '');
    const user = buildMockAuthUser(phone);
    const profileComplete = isProfileComplete(user.id);

    return {
      token: idToken,
      refreshToken: idToken,
      user,
      isNewUser: !profileComplete,
    };
  }

  const response = await apiClient.post<AuthVerifyResponse>(Endpoints.AUTH_VERIFY, {
    firebase_token: idToken,
  });

  const { accessToken, refreshToken, user, isNewUser } = response.data;
  const mappedUser = mapUser(user);
  const needsSetup = isNewUser || !mappedUser.name?.trim();

  return {
    token: accessToken,
    refreshToken,
    user: mappedUser,
    isNewUser: needsSetup,
  };
}

export async function setupProfile(data: {
  name: string;
  role: UserRole;
  photoUrl?: string;
}): Promise<AuthUser> {
  if (MOCK_OTP_IN_DEV && _mockOtpPhone) {
    return buildMockAuthUser(_mockOtpPhone, {
      name: data.name,
      role: data.role,
      photoUrl: data.photoUrl,
    });
  }

  const response = await apiClient.put<BackendUser>(Endpoints.USER_UPDATE, {
    name: data.name,
    role: data.role,
    avatar_url: data.photoUrl,
  });

  return mapUser(response.data);
}

export async function uploadProfilePhoto(localUri: string, userId: string): Promise<string> {
  ensureFirebaseReady();
  const ref = firebaseStorage().ref(`profile_photos/${userId}.jpg`);
  await ref.putFile(localUri);
  return ref.getDownloadURL();
}

export async function signOut(): Promise<void> {
  try {
    await apiClient.post(Endpoints.AUTH_LOGOUT);
  } catch {
    // Token may already be invalid — still clear local session.
  }

  _confirmationResult = null;
  _mockOtpPhone = null;
  if (isFirebaseConfigured && !MOCK_OTP_IN_DEV) {
    await auth().signOut();
  }
}

/**
 * Auth service — Firebase Phone Auth + backend JWT exchange
 *
 * Flow:
 *  1. sendOTP(phone)      → Firebase sends SMS, returns confirmation
 *  2. verifyOTP(code)     → Firebase verifies, returns Firebase user + ID token
 *  3. exchangeToken(...)  → Our backend validates Firebase token, returns JWT + User
 *  4. setupProfile(...)   → PUT /users/me with name, photo, role
 */

import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
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

function extractPhoneDigits(phoneNumber?: string | null): string {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/\D/g, '').slice(-10);
}

export function buildSessionFromFirebaseUser(firebaseUser: FirebaseAuthTypes.User): AuthUser {
  return {
    id: firebaseUser.uid,
    phone: extractPhoneDigits(firebaseUser.phoneNumber),
    name: firebaseUser.displayName ?? '',
    photoUrl: firebaseUser.photoURL ?? undefined,
    role: 'passenger',
    avgRating: 0,
    totalRides: 0,
    createdAt: firebaseUser.metadata.creationTime ?? new Date().toISOString(),
    isVerified: firebaseUser.phoneNumber != null,
  };
}

function isProfileComplete(userId: string): boolean {
  return storage.getBoolean(`profile_complete_${userId}`) ?? false;
}

/**
 * Step 1 — Send OTP via Firebase Phone Auth
 * @param phone  10-digit Indian number (without +91)
 */
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

/**
 * Step 2 — Verify OTP entered by user
 * @param code  6-digit OTP
 * @returns Firebase ID token (used to exchange for our JWT)
 */
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

  const idToken = await userCredential.user.getIdToken();
  return idToken;
}

/**
 * Step 3 — Exchange Firebase ID token for our backend JWT + user data
 * Backend: POST /auth/otp/verify  { firebase_token }
 * Response: { token, user, is_new_user }
 *
 * TODO: Replace Firebase-only stub with real backend call when API is ready.
 */
export async function exchangeFirebaseToken(idToken: string): Promise<{
  token: string;
  user: AuthUser;
  isNewUser: boolean;
}> {
  if (MOCK_OTP_IN_DEV && idToken.startsWith('dev-mock-token-')) {
    const phone = idToken.replace('dev-mock-token-', '');
    const user = buildMockAuthUser(phone);
    const profileComplete = isProfileComplete(user.id);

    return {
      token: idToken,
      user,
      isNewUser: !profileComplete,
    };
  }

  const currentUser = auth().currentUser;

  if (!currentUser) {
    throw new Error('No authenticated Firebase user found.');
  }

  // TODO: Wire to backend when available:
  // const response = await apiClient.post(Endpoints.AUTH_VERIFY_OTP, {
  //   firebase_token: idToken,
  // });
  // return {
  //   token: response.data.token,
  //   user: response.data.user,
  //   isNewUser: response.data.is_new_user,
  // };

  const user = buildSessionFromFirebaseUser(currentUser);
  const profileComplete = isProfileComplete(user.id);

  return {
    token: idToken,
    user,
    isNewUser: !profileComplete,
  };
}

/**
 * Step 4 — Save profile (name, photo, role) after first login
 * Backend: PUT /users/me  { name, role, photo_url? }
 *
 * TODO: Replace Firebase-only stub with real backend call when API is ready.
 */
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

  const currentUser = auth().currentUser;

  if (!currentUser) {
    throw new Error('No authenticated Firebase user found.');
  }

  // TODO: Wire to backend when available:
  // const response = await apiClient.put(Endpoints.USER_UPDATE, {
  //   name: data.name,
  //   role: data.role,
  //   photo_url: data.photoUrl,
  // });
  // return response.data.user;

  const user = buildSessionFromFirebaseUser(currentUser);
  return {
    ...user,
    name: data.name,
    role: data.role,
    photoUrl: data.photoUrl,
  };
}

/**
 * Upload profile photo to Firebase Storage, return public URL
 */
export async function uploadProfilePhoto(localUri: string, userId: string): Promise<string> {
  ensureFirebaseReady();
  const ref = firebaseStorage().ref(`profile_photos/${userId}.jpg`);
  await ref.putFile(localUri);
  const url = await ref.getDownloadURL();
  return url;
}

/**
 * Sign out — clears Firebase session
 */
export async function signOut(): Promise<void> {
  _confirmationResult = null;
  _mockOtpPhone = null;
  if (isFirebaseConfigured && !MOCK_OTP_IN_DEV) {
    await auth().signOut();
  }
}

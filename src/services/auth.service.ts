import { auth, isFirebaseConfigured } from '@/config/firebase';
import { INDIA_PHONE_PREFIX } from '@/config/constants';

const FIREBASE_NOT_CONFIGURED =
  'Firebase is not configured. Add google-services.json and GoogleService-Info.plist from Firebase Console.';

function ensureFirebaseReady() {
  if (!isFirebaseConfigured) {
    throw new Error(FIREBASE_NOT_CONFIGURED);
  }
}

export const authService = {
  async sendOtp(phone: string): Promise<void> {
    ensureFirebaseReady();
    const fullPhone = `${INDIA_PHONE_PREFIX}${phone}`;
    await auth().signInWithPhoneNumber(fullPhone);
  },

  async verifyOtp(_phone: string, _code: string): Promise<void> {
    ensureFirebaseReady();
    throw new Error('OTP verification will be implemented in Prompt 2.');
  },

  async signOut(): Promise<void> {
    ensureFirebaseReady();
    await auth().signOut();
  },
};

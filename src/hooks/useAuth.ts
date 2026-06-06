/**
 * useAuth — orchestrates the full auth flow
 * Used by PhoneScreen, OTPScreen, ProfileSetupScreen
 */

import { useState, useCallback } from 'react';
import {
  sendOTP,
  verifyOTP,
  exchangeFirebaseToken,
  setupProfile,
  uploadProfilePhoto,
} from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';

export function useAuth() {
  const { setAuth, setUser, completeProfileSetup } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleSendOTP = useCallback(async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await sendOTP(phone);
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Please check and try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else if (code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later.');
      } else {
        setError('Failed to send OTP. Please check your connection.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleVerifyOTP = useCallback(
    async (code: string): Promise<{ isNewUser: boolean } | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const idToken = await verifyOTP(code);
        const { token, user, isNewUser } = await exchangeFirebaseToken(idToken);

        if (isNewUser) {
          setAuth(user, token, { needsProfileSetup: true });
        } else {
          setAuth(user, token);
        }

        return { isNewUser };
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
        if (firebaseErr.code === 'auth/invalid-verification-code') {
          setError('Incorrect OTP. Please check and try again.');
        } else if (firebaseErr.code === 'auth/code-expired') {
          setError('OTP expired. Please request a new one.');
        } else if (firebaseErr.message?.includes('No OTP confirmation')) {
          setError('Session expired. Please go back and request OTP again.');
        } else {
          setError('Verification failed. Please try again.');
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth],
  );

  const handleSetupProfile = useCallback(
    async (data: {
      name: string;
      role: UserRole;
      localPhotoUri?: string;
      userId: string;
    }): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        let photoUrl: string | undefined;
        if (data.localPhotoUri) {
          photoUrl = await uploadProfilePhoto(data.localPhotoUri, data.userId);
        }
        const updatedUser = await setupProfile({
          name: data.name,
          role: data.role,
          photoUrl,
        });
        setUser(updatedUser);
        completeProfileSetup();
        return true;
      } catch {
        setError('Failed to save profile. Please try again.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, completeProfileSetup],
  );

  return {
    isLoading,
    error,
    clearError,
    handleSendOTP,
    handleVerifyOTP,
    handleSetupProfile,
  };
}

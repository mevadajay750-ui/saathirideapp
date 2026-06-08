type FirebaseLikeError = { code?: string; message?: string };

export function getOtpSendErrorMessage(err: unknown): string {
  const { code, message = '' } = (err ?? {}) as FirebaseLikeError;

  if (message.includes('Firebase is not configured')) {
    return 'Firebase is not set up yet. Add google-services.json and GoogleService-Info.plist, or use dev mock OTP.';
  }

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'Invalid phone number. Please check and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    case 'auth/missing-client-identifier':
      return 'Add your Android debug SHA-1 in Firebase Console → Project settings → Your apps → Android.';
    case 'auth/app-not-authorized':
      return 'App not authorized for Firebase Auth. Verify package name, bundle ID, and SHA keys in Firebase Console.';
    case 'auth/invalid-app-credential':
      return 'iOS verification failed. Upload an APNs key in Firebase Console or test on a physical device.';
    case 'auth/captcha-check-failed':
      return 'Phone verification check failed. Try again on a physical device.';
    case 'auth/billing-not-enabled':
      return 'Firebase billing must be enabled for phone auth on this project.';
    default:
      if (__DEV__ && message) {
        return `Failed to send OTP: ${message}`;
      }
      return 'Failed to send OTP. Please check your connection and try again.';
  }
}

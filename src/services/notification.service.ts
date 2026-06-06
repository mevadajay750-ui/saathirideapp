import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export async function requestNotificationPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function getFcmToken(): Promise<string | null> {
  try {
    return await messaging().getToken();
  } catch {
    return null;
  }
}

export function onForegroundMessage(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => void,
): () => void {
  return messaging().onMessage(handler);
}

export function registerBackgroundMessageHandler(
  handler: (message: FirebaseMessagingTypes.RemoteMessage) => Promise<void>,
): void {
  messaging().setBackgroundMessageHandler(handler);
}

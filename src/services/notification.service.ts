/**
 * Notification service — FCM push + channel setup + token management.
 */

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { apiClient } from '@/api/client';
import { Endpoints } from '@/api/endpoints';

export const CHANNELS = {
  DEFAULT: 'saathiride_default',
  BOOKINGS: 'saathiride_bookings',
  RATINGS: 'saathiride_ratings',
} as const;

export type NotifType =
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_declined'
  | 'booking_cancelled'
  | 'ride_reminder'
  | 'rating_prompt'
  | 'general';

export interface NotifPayload {
  type: NotifType;
  rideId?: string;
  bookingId?: string;
  rateeId?: string;
  rateeName?: string;
  title: string;
  body: string;
}

let _onForegroundNotif: ((payload: NotifPayload) => void) | null = null;

export function setForegroundNotifHandler(cb: (payload: NotifPayload) => void): void {
  _onForegroundNotif = cb;
}

export function triggerForegroundNotif(payload: NotifPayload): void {
  _onForegroundNotif?.(payload);
}

export async function requestPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function createAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
}

export async function reportPermissionStatus(): Promise<void> {
  try {
    const authStatus = await messaging().hasPermission();
    const granted =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    await apiClient.patch(Endpoints.DEVICE_TOKEN, {
      push_enabled: granted,
    });
  } catch {
    console.warn('[Notifications] Permission status report failed');
  }
}

export async function registerDeviceToken(): Promise<void> {
  try {
    const token = await messaging().getToken();
    if (!token) return;

    if (__DEV__) {
      console.log('[Notifications] FCM token:', token);
    }

    await apiClient.post(Endpoints.DEVICE_TOKEN, {
      token,
      platform: Platform.OS,
    });

    await reportPermissionStatus();
  } catch (error) {
    console.warn('[Notifications] Token registration failed:', error);
  }
}

export function subscribeToTokenRefresh(): () => void {
  return messaging().onTokenRefresh(async (newToken) => {
    try {
      await apiClient.post(Endpoints.DEVICE_TOKEN, {
        token: newToken,
        platform: Platform.OS,
      });
      await reportPermissionStatus();
    } catch {
      console.warn('[Notifications] Token refresh registration failed');
    }
  });
}

export function parseMessage(message: FirebaseMessagingTypes.RemoteMessage): NotifPayload | null {
  const data = message.data ?? {};
  const notif = message.notification;

  return {
    type: (data.type as NotifType) ?? 'general',
    rideId: data.ride_id as string | undefined,
    bookingId: data.booking_id as string | undefined,
    rateeId: data.ratee_id as string | undefined,
    rateeName: data.ratee_name as string | undefined,
    title: (notif?.title ?? data.title ?? 'SaathiRide') as string,
    body: (notif?.body ?? data.body ?? '') as string,
  };
}

export function setBackgroundMessageHandler(): void {
  messaging().setBackgroundMessageHandler(async () => {
    // Background processing — display handled by FCM for notification messages.
  });
}

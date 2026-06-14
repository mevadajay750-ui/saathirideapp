/**
 * useNotifications — bootstraps the full notification system.
 * Call once at the app root inside AppBootstrap.
 */

import { useEffect, useRef } from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  requestPermission,
  registerDeviceToken,
  subscribeToTokenRefresh,
  parseMessage,
  triggerForegroundNotif,
} from '@/services/notification.service';
import { useNotificationStore } from '@/hooks/useNotificationStore';
import { navigateFromNotification } from '@/utils/notificationNavigation';
import { useAuthStore } from '@/store/auth.store';

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const needsProfileSetup = useAuthStore((s) => s.needsProfileSetup);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const initialHandled = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || needsProfileSetup) return;

    let unsubForeground: (() => void) | undefined;
    let unsubOnOpen: (() => void) | undefined;
    let unsubTokenRefresh: (() => void) | undefined;

    async function setup() {
      const granted = await requestPermission();
      if (!granted) {
        return;
      }

      await registerDeviceToken();
      unsubTokenRefresh = subscribeToTokenRefresh();

      unsubForeground = messaging().onMessage(async (remoteMessage) => {
        const payload = parseMessage(remoteMessage);
        if (!payload) return;
        addNotification(payload);
        triggerForegroundNotif(payload);
      });

      unsubOnOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
        const payload = parseMessage(remoteMessage);
        if (payload) {
          addNotification(payload);
          navigateFromNotification(payload);
        }
      });

      if (!initialHandled.current) {
        initialHandled.current = true;
        const initial = await messaging().getInitialNotification();
        if (initial) {
          const payload = parseMessage(initial);
          if (payload) {
            addNotification(payload);
            setTimeout(() => navigateFromNotification(payload), 1000);
          }
        }
      }
    }

    setup();

    return () => {
      unsubForeground?.();
      unsubOnOpen?.();
      unsubTokenRefresh?.();
    };
  }, [isAuthenticated, needsProfileSetup, addNotification]);
}

import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { NotifPayload, NotifType } from '@/services/notification.service';
import { useAuthStore } from '@/store/auth.store';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateFromNotification(payload: NotifPayload): void {
  if (!navigationRef.isReady()) {
    setTimeout(() => navigateFromNotification(payload), 500);
    return;
  }

  const role = useAuthStore.getState().user?.role;

  switch (payload.type as NotifType) {
    case 'booking_request':
      if (payload.rideId && role === 'driver') {
        navigationRef.navigate('RideDetail', { rideId: payload.rideId });
      }
      break;

    case 'booking_confirmed':
    case 'booking_declined':
    case 'booking_cancelled':
      if (role === 'passenger') {
        navigationRef.navigate('PassengerTabs', { screen: 'MyBookings' });
      }
      break;

    case 'ride_reminder':
      if (role === 'driver' && payload.rideId) {
        navigationRef.navigate('RideDetail', { rideId: payload.rideId });
      } else if (role === 'passenger') {
        navigationRef.navigate('PassengerTabs', { screen: 'MyBookings' });
      }
      break;

    case 'rating_prompt':
      if (payload.rideId && payload.rateeId && payload.rateeName) {
        navigationRef.navigate('RateRide', {
          rideId: payload.rideId,
          rateeId: payload.rateeId,
          rateeName: payload.rateeName,
        });
      }
      break;

    case 'general':
    default:
      navigationRef.navigate('Notifications');
      break;
  }
}

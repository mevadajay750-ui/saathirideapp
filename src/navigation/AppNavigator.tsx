import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/auth.store';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import DriverNavigator from './DriverNavigator';
import PassengerNavigator from './PassengerNavigator';
import SplashScreen from '@/screens/shared/SplashScreen';
import RideDetailScreen from '@/screens/driver/RideDetailScreen';
import SearchResultsScreen from '@/screens/passenger/SearchResultsScreen';
import RideBookingScreen from '@/screens/passenger/RideBookingScreen';
import RateRideScreen from '@/screens/shared/RateRideScreen';
import EditProfileScreen from '@/screens/shared/EditProfileScreen';
import NotificationsScreen from '@/screens/shared/NotificationsScreen';
import { navigationRef } from '@/utils/notificationNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const sharedScreens = (
  <>
    <Stack.Screen
      name="RateRide"
      component={RateRideScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </>
);

export default function AppNavigator() {
  const { isAuthenticated, isLoading, user, needsProfileSetup } = useAuthStore();

  if (isLoading) return <SplashScreen />;

  const showAuth = !isAuthenticated || needsProfileSetup;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showAuth ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'driver' ? (
          <>
            <Stack.Screen name="DriverTabs" component={DriverNavigator} />
            <Stack.Screen
              name="RideDetail"
              component={RideDetailScreen}
              options={{ animation: 'slide_from_right' }}
            />
            {sharedScreens}
          </>
        ) : (
          <>
            <Stack.Screen name="PassengerTabs" component={PassengerNavigator} />
            <Stack.Screen
              name="SearchResults"
              component={SearchResultsScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="RideBooking"
              component={RideBookingScreen}
              options={{ animation: 'slide_from_right' }}
            />
            {sharedScreens}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

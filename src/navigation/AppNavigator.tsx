import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/auth.store';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import DriverNavigator from './DriverNavigator';
import PassengerNavigator from './PassengerNavigator';
import SplashScreen from '@/screens/shared/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'driver' ? (
          <Stack.Screen name="DriverTabs" component={DriverNavigator} />
        ) : (
          <Stack.Screen name="PassengerTabs" component={PassengerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

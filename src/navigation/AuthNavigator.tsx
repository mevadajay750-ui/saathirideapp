import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/auth.store';
import { AuthStackParamList } from './types';
import WelcomeScreen from '@/screens/auth/WelcomeScreen';
import PhoneScreen from '@/screens/auth/PhoneScreen';
import OTPScreen from '@/screens/auth/OTPScreen';
import ProfileSetupScreen from '@/screens/auth/ProfileSetupScreen';
import VehicleSetupScreen from '@/screens/auth/VehicleSetupScreen';
import FontTestScreen from '@/screens/shared/FontTestScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {
  initialRoute?: keyof AuthStackParamList;
}

export default function AuthNavigator({ initialRoute }: Props) {
  const needsProfileSetup = useAuthStore((s) => s.needsProfileSetup);
  const token = useAuthStore((s) => s.token);
  const resolvedInitialRoute =
    initialRoute ?? (needsProfileSetup && token ? 'ProfileSetup' : 'Welcome');

  return (
    <Stack.Navigator
      initialRouteName={resolvedInitialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="VehicleSetup" component={VehicleSetupScreen} />
      <Stack.Screen name="FontTest" component={FontTestScreen} />
    </Stack.Navigator>
  );
}

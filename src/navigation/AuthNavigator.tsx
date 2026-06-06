import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import WelcomeScreen from '@/screens/auth/WelcomeScreen';
import PhoneScreen from '@/screens/auth/PhoneScreen';
import OTPScreen from '@/screens/auth/OTPScreen';
import FontTestScreen from '@/screens/shared/FontTestScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="FontTest" component={FontTestScreen} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { DriverTabParamList } from './types';
import { Colors } from '@/theme';
import DriverHomeScreen from '@/screens/driver/DriverHomeScreen';
import PostRideScreen from '@/screens/driver/PostRideScreen';
import DriverRidesScreen from '@/screens/driver/DriverRidesScreen';
import ProfileScreen from '@/screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator<DriverTabParamList>();

export default function DriverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof DriverTabParamList, string> = {
            DriverHome: 'home-outline',
            PostRide: 'add-circle-outline',
            DriverRides: 'car-outline',
            Profile: 'person-outline',
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DriverHome" component={DriverHomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="PostRide" component={PostRideScreen} options={{ title: 'Post Ride' }} />
      <Tab.Screen name="DriverRides" component={DriverRidesScreen} options={{ title: 'My Rides' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

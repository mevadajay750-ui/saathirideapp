import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { PassengerTabParamList } from './types';
import { Colors } from '@/theme';
import PassengerHomeScreen from '@/screens/passenger/PassengerHomeScreen';
import SearchRideScreen from '@/screens/passenger/SearchRideScreen';
import MyBookingsScreen from '@/screens/passenger/MyBookingsScreen';
import ProfileScreen from '@/screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator<PassengerTabParamList>();

export default function PassengerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof PassengerTabParamList, string> = {
            PassengerHome: 'home-outline',
            SearchRide: 'search-outline',
            MyBookings: 'ticket-outline',
            Profile: 'person-outline',
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="PassengerHome" component={PassengerHomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchRide" component={SearchRideScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

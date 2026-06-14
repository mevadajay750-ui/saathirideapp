import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PassengerTabParamList } from './types';
import PassengerHomeScreen from '@/screens/passenger/PassengerHomeScreen';
import MyBookingsScreen from '@/screens/passenger/MyBookingsScreen';
import ProfileScreen from '@/screens/shared/ProfileScreen';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { NotificationBadge } from '@/components/notifications/NotificationBadge';
import { useNotificationStore } from '@/hooks/useNotificationStore';

const Tab = createBottomTabNavigator<PassengerTabParamList>();

const TAB_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  PassengerHome: 'home-outline',
  MyBookings: 'ticket-outline',
  Profile: 'person-outline',
};

export default function PassengerNavigator() {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => (
          <View>
            <Ionicons name={TAB_ICONS[route.name]} size={size ?? 22} color={color} />
            {route.name === 'Profile' && unreadCount > 0 && (
              <NotificationBadge count={unreadCount} />
            )}
          </View>
        ),
      })}
    >
      <Tab.Screen
        name="PassengerHome"
        component={PassengerHomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    height: 60,
  },
  tabLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
  },
});

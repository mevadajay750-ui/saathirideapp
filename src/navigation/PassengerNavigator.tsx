import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { PassengerTabParamList } from './types';
import PassengerHomeScreen from '@/screens/passenger/PassengerHomeScreen';
import MyBookingsScreen from '@/screens/passenger/MyBookingsScreen';
import ProfileScreen from '@/screens/shared/ProfileScreen';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { NotificationBadge } from '@/components/notifications/NotificationBadge';
import { useNotificationStore } from '@/hooks/useNotificationStore';

const Tab = createBottomTabNavigator<PassengerTabParamList>();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  PassengerHome: { active: '🏠', inactive: '🏠' },
  MyBookings: { active: '🎟️', inactive: '🎟️' },
  Profile: { active: '👤', inactive: '👤' },
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
        tabBarIcon: ({ focused }) => (
          <View>
            <Text style={styles.tabIcon}>
              {focused ? TAB_ICONS[route.name]?.active : TAB_ICONS[route.name]?.inactive}
            </Text>
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
  tabIcon: {
    fontSize: 22,
  },
});

import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from '@/navigation/AppNavigator';
import { useSessionBootstrap } from '@/hooks/useSessionBootstrap';
import { useNotifications } from '@/hooks/useNotifications';
import { InAppNotificationBanner } from '@/components/notifications/InAppNotificationBanner';
import { Colors, ThemeProvider } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    },
  },
});

function AppBootstrap() {
  useSessionBootstrap();
  useNotifications();

  return (
    <View style={styles.root}>
      <AppNavigator />
      <InAppNotificationBanner />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
          <QueryClientProvider client={queryClient}>
            <AppBootstrap />
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

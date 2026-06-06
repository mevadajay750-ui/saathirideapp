import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from '@/navigation/AppNavigator';
import { useAuth } from '@/hooks/useAuth';
import { Colors, ThemeProvider } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60,
    },
  },
});

function AppBootstrap() {
  useAuth();
  return <AppNavigator />;
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

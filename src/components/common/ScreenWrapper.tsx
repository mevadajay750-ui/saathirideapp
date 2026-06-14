import React from 'react';
import { StatusBar, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme';

export type StatusBarVariant = 'light' | 'brand';

type Props = {
  children: React.ReactNode;
  statusBar?: StatusBarVariant;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

const STATUS_BAR_COLORS: Record<StatusBarVariant, string> = {
  light: Colors.white,
  brand: Colors.primary,
};

export function ScreenWrapper({ children, statusBar = 'light', style, contentStyle }: Props) {
  const statusBarColor = STATUS_BAR_COLORS[statusBar];

  return (
    <View style={[styles.root, { backgroundColor: statusBarColor }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={statusBarColor} translucent={false} />
      <SafeAreaView style={[styles.safe, contentStyle]} edges={['top', 'left', 'right']}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
});

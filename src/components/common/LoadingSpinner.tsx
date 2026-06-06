import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export function LoadingSpinner({
  size = 'large',
  color = Colors.primary,
  style,
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});

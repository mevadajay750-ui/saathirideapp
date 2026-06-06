import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';

export default function MyBookingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>
          Track your upcoming and past ride bookings in one place.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing['2xl'] },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    lineHeight: FontSize.base * 1.5,
  },
});

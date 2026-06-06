import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';

export default function PassengerHomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Passenger</Text>
        </View>
        <Text style={styles.title}>Find a Ride</Text>
        <Text style={styles.subtitle}>
          Search intercity rides, book seats, and travel comfortably across India.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing['2xl'] },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.base,
  },
  badgeText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.accent,
  },
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

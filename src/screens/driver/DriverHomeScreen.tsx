import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { Button } from '@/components/common';
import { useAuthStore } from '@/store/auth.store';
import type { DriverTabScreenProps } from '@/navigation/types';

type Props = DriverTabScreenProps<'DriverHome'>;

const TIPS = [
  { emoji: '💰', text: 'Drivers earn back fuel + toll costs on every shared ride' },
  { emoji: '⭐', text: 'Drivers with 4.5+ rating get 3× more booking requests' },
  { emoji: '🛡️', text: 'Passengers are verified — name and photo shown before you accept' },
];

export default function DriverHomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, {firstName} 👋</Text>
          <Text style={styles.headerSub}>Ready to share your next ride?</Text>
        </View>
        {(user?.avgRating ?? 0) > 0 && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingValue}>{user!.avgRating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.ctaCard}>
          <Text style={styles.ctaEmoji}>🚗</Text>
          <Text style={styles.ctaTitle}>Post your next ride</Text>
          <Text style={styles.ctaBody}>
            Going intercity? Add your trip and let passengers join you. Takes less than 2 minutes.
          </Text>
          <Button
            label="Post a ride"
            onPress={() => navigation.navigate('PostRide')}
            variant="primary"
            size="lg"
          />
        </View>

        {(user?.totalRides ?? 0) > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user?.totalRides ?? 0}</Text>
              <Text style={styles.statLabel}>Rides shared</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>★ {user?.avgRating?.toFixed(1) ?? '—'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        )}

        <Text style={styles.tipsTitle}>Tips for drivers</Text>
        {TIPS.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Text style={styles.tipEmoji}>{tip.emoji}</Text>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.lg,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  headerSub: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.primary200,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  ratingStar: { fontSize: 14, color: Colors.accent },
  ratingValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.accentDark,
  },
  scroll: {
    padding: Spacing.base,
    paddingBottom: Spacing['5xl'],
  },
  ctaCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderBrand,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.base,
    gap: Spacing.md,
  },
  ctaEmoji: { fontSize: 48 },
  ctaTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
    textAlign: 'center',
  },
  ctaBody: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipsTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  tipEmoji: { fontSize: 22 },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },
});

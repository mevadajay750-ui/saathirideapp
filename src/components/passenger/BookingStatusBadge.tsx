import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { BookingStatus } from '@/types';

interface Props {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

type Config = {
  label: string;
  bg: string;
  text: string;
  dot: string;
  emoji: string;
};

const CONFIG: Record<BookingStatus, Config> = {
  pending: {
    label: 'Awaiting driver',
    bg: Colors.accentLight,
    text: Colors.accentDark,
    dot: Colors.accent,
    emoji: '⏳',
  },
  confirmed: {
    label: 'Confirmed',
    bg: Colors.successLight,
    text: Colors.successDark,
    dot: Colors.success,
    emoji: '✅',
  },
  completed: {
    label: 'Completed',
    bg: Colors.gray100,
    text: Colors.gray500,
    dot: Colors.gray400,
    emoji: '🏁',
  },
  cancelled_by_passenger: {
    label: 'Cancelled by you',
    bg: Colors.errorLight,
    text: Colors.errorDark,
    dot: Colors.error,
    emoji: '❌',
  },
  cancelled_by_driver: {
    label: 'Driver cancelled',
    bg: Colors.errorLight,
    text: Colors.errorDark,
    dot: Colors.error,
    emoji: '❌',
  },
};

export function BookingStatusBadge({ status, size = 'md' }: Props) {
  const cfg = CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.text }, size === 'sm' && styles.labelSm]}>
        {cfg.label}
      </Text>
    </View>
  );
}

export function BookingStatusDisplay({ status }: { status: BookingStatus }) {
  const cfg = CONFIG[status];
  return (
    <View style={[styles.displayWrap, { backgroundColor: cfg.bg }]}>
      <Text style={styles.displayEmoji}>{cfg.emoji}</Text>
      <Text style={[styles.displayLabel, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
  },
  labelSm: {
    fontSize: 10,
  },
  displayWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  displayEmoji: { fontSize: 20 },
  displayLabel: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
  },
});

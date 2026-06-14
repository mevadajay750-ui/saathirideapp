import React from 'react';
import { View, Text } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { RideStatus } from '@/types';
import { styles } from './styles';

interface Props {
  status: RideStatus;
  seatsAvailable?: number;
}

type BadgeConfig = {
  label: string;
  bg: string;
  text: string;
  dot: string;
};

const CONFIG: Record<string, BadgeConfig> = {
  active_seats: {
    label: 'Seats available',
    bg: Colors.successLight,
    text: Colors.successDark,
    dot: Colors.success,
  },
  active_full: {
    label: 'Fully booked',
    bg: Colors.primaryLight,
    text: Colors.primaryDeep,
    dot: Colors.primary,
  },
  completed: { label: 'Completed', bg: Colors.gray100, text: Colors.gray500, dot: Colors.gray400 },
  cancelled: {
    label: 'Cancelled',
    bg: Colors.errorLight,
    text: Colors.errorDark,
    dot: Colors.error,
  },
};

export function RideStatusBadge({ status, seatsAvailable }: Props) {
  let key: string;
  if (status === 'active') {
    key = seatsAvailable && seatsAvailable > 0 ? 'active_seats' : 'active_full';
  } else {
    key = status;
  }

  const cfg = CONFIG[key] ?? CONFIG['active_seats'];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

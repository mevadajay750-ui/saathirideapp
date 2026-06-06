import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { Booking } from '@/types';

interface Props {
  bookings: Booking[];
  maxShow?: number;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

const AVATAR_COLORS = [
  Colors.primary,
  Colors.accent,
  Colors.success,
  '#7C3AED',
  '#0891B2',
  '#BE185D',
];

function avatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function PassengerChip({ bookings, maxShow = 4 }: Props) {
  if (bookings.length === 0) return null;

  const shown = bookings.slice(0, maxShow);
  const overflow = bookings.length - shown.length;

  return (
    <View style={styles.row}>
      <View style={styles.avatars}>
        {shown.map((booking, i) => (
          <View
            key={booking.id}
            style={[
              styles.avatar,
              { backgroundColor: avatarColor(booking.passengerName), marginLeft: i === 0 ? 0 : -8 },
            ]}
          >
            <Text style={styles.avatarText}>{initials(booking.passengerName)}</Text>
          </View>
        ))}
        {overflow > 0 && (
          <View style={[styles.avatar, styles.overflowAvatar, { marginLeft: -8 }]}>
            <Text style={styles.overflowText}>+{overflow}</Text>
          </View>
        )}
      </View>
      <Text style={styles.label}>
        {bookings.length} passenger{bookings.length !== 1 ? 's' : ''} confirmed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  avatarText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: Colors.white,
  },
  overflowAvatar: {
    backgroundColor: Colors.gray200,
  },
  overflowText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    color: Colors.gray700,
  },
  label: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

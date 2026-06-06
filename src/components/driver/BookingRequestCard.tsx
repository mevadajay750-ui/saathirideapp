import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { Booking } from '@/types';
import { formatRating } from '@/utils/formatters';

interface Props {
  booking: Booking;
  onAccept: (bookingId: string) => Promise<void>;
  onDecline: (bookingId: string) => Promise<void>;
  isActing?: boolean;
}

type CardState = 'idle' | 'accepting' | 'declining';

export function BookingRequestCard({ booking, onAccept, onDecline, isActing }: Props) {
  const [cardState, setCardState] = useState<CardState>('idle');

  const initials = booking.passengerName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const handleAccept = async () => {
    setCardState('accepting');
    try {
      await onAccept(booking.id);
    } finally {
      setCardState('idle');
    }
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline request',
      `Decline ${booking.passengerName}'s request? They will be notified.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            setCardState('declining');
            try {
              await onDecline(booking.id);
            } finally {
              setCardState('idle');
            }
          },
        },
      ],
    );
  };

  const isBusy = cardState !== 'idle' || isActing;

  return (
    <View style={styles.card}>
      <View style={styles.passengerRow}>
        {booking.passengerPhotoUrl ? (
          <Image source={{ uri: booking.passengerPhotoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        )}

        <View style={styles.passengerInfo}>
          <Text style={styles.passengerName}>{booking.passengerName}</Text>
          <View style={styles.ratingRow}>
            {booking.passengerRating > 0 && (
              <>
                <Text style={styles.star}>★</Text>
                <Text style={styles.rating}>{formatRating(booking.passengerRating)}</Text>
                <Text style={styles.ratingDot}>·</Text>
              </>
            )}
            <Text style={styles.seats}>
              {booking.seatsRequested} seat
              {booking.seatsRequested !== 1 ? 's' : ''} requested
            </Text>
          </View>
        </View>

        <View style={styles.seatsBadge}>
          <Text style={styles.seatsNum}>{booking.seatsRequested}</Text>
          <Text style={styles.seatsLabel}>{booking.seatsRequested === 1 ? 'seat' : 'seats'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.declineBtn, isBusy && styles.btnDisabled]}
          onPress={handleDecline}
          disabled={isBusy}
          activeOpacity={0.8}
        >
          <Text style={styles.declineBtnText}>
            {cardState === 'declining' ? 'Declining…' : 'Decline'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.acceptBtn, isBusy && styles.btnDisabled]}
          onPress={handleAccept}
          disabled={isBusy}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptBtnText}>
            {cardState === 'accepting' ? 'Accepting…' : 'Accept'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.accentLight,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  passengerInfo: { flex: 1 },
  passengerName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: { fontSize: 12, color: Colors.accent },
  rating: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  ratingDot: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  seats: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  seatsBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatsNum: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.lg,
    color: Colors.primaryDeep,
    lineHeight: FontSize.lg * 1.1,
  },
  seatsLabel: {
    fontFamily: FontFamily.body,
    fontSize: 9,
    color: Colors.primary400,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.48 },
  declineBtn: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  declineBtnText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base,
    color: Colors.errorDark,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
  },
  acceptBtnText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
});

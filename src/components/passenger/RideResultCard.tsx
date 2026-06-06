import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/theme';
import { Ride } from '@/types';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';
import { DriverAvatar } from './DriverAvatar';

interface Props {
  ride: Ride;
  seatsRequested: number;
  onPress: () => void;
}

export function RideResultCard({ ride, seatsRequested, onPress }: Props) {
  const isAlmostFull = ride.seatsAvailable <= 1;
  const totalEarned = ride.pricePerSeat * seatsRequested;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.87}>
      {isAlmostFull && ride.seatsAvailable > 0 && (
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>Last seat!</Text>
        </View>
      )}

      <View style={styles.topRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.departureTime}>{formatDepartureDate(ride.departureAt)}</Text>
          {(ride.origin.landmark || ride.destination.landmark) && (
            <Text style={styles.landmarks} numberOfLines={1}>
              {ride.origin.landmark ?? ride.origin.city}
              {' → '}
              {ride.destination.landmark ?? ride.destination.city}
            </Text>
          )}
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.price}>{formatPrice(ride.pricePerSeat)}</Text>
          <Text style={styles.perSeat}>per seat</Text>
          {seatsRequested > 1 && (
            <Text style={styles.totalPrice}>{formatPrice(totalEarned)} total</Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.driverRow}>
        <DriverAvatar
          name={ride.driverName}
          photoUrl={ride.driverPhotoUrl}
          rating={ride.driverRating}
          size="sm"
        />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>💺</Text>
          <Text style={[styles.chipText, isAlmostFull && { color: Colors.accentDark }]}>
            {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? 's' : ''} left
          </Text>
        </View>

        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>🚗</Text>
          <Text style={styles.chipText} numberOfLines={1}>
            {ride.vehicle.make} {ride.vehicle.model}
          </Text>
        </View>

        <View style={styles.chip}>
          <Text style={styles.chipEmoji}>🎨</Text>
          <Text style={styles.chipText}>{ride.vehicle.color}</Text>
        </View>
      </View>

      <View style={styles.ctaRow}>
        <Text style={styles.ctaText}>View ride →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.borderBrand,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.card,
  },
  ribbon: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderBottomRightRadius: BorderRadius.sm,
  },
  ribbonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  timeBlock: { flex: 1 },
  departureTime: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textBrand,
    marginBottom: 2,
  },
  landmarks: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  priceBlock: { alignItems: 'flex-end' },
  price: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primary,
    lineHeight: FontSize.xl * 1.1,
  },
  perSeat: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  totalPrice: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.success,
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.base,
  },
  driverRow: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    flexWrap: 'wrap',
    paddingBottom: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: Colors.gray200,
  },
  chipEmoji: { fontSize: 11 },
  chipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  ctaRow: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    alignItems: 'flex-end',
  },
  ctaText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
});

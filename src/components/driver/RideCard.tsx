import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
  IconSize,
  Icons,
} from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { Ride, Booking } from '@/types';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';
import { RideStatusBadge } from './RideStatusBadge';
import { PassengerChip } from './PassengerChip';

interface Props {
  ride: Ride;
  confirmedBookings?: Booking[];
  pendingCount?: number;
  onPress: () => void;
}

export function RideCard({ ride, confirmedBookings = [], pendingCount = 0, onPress }: Props) {
  const seatsUsed = ride.totalSeats - ride.seatsAvailable;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <View style={styles.routeBlock}>
          <Text style={styles.routeText}>
            {ride.origin.city}
            <Text style={styles.routeArrow}> → </Text>
            {ride.destination.city}
          </Text>
          {(ride.origin.landmark || ride.destination.landmark) && (
            <Text style={styles.landmark}>
              {ride.origin.landmark ?? ride.origin.city}
              {' → '}
              {ride.destination.landmark ?? ride.destination.city}
            </Text>
          )}
        </View>
        <RideStatusBadge status={ride.status} seatsAvailable={ride.seatsAvailable} />
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <AppIcon name={Icons.calendar} size={IconSize.sm} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{formatDepartureDate(ride.departureAt)}</Text>
        </View>
        <View style={styles.metaItem}>
          <AppIcon name={Icons.seat} size={IconSize.sm} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            {seatsUsed}/{ride.totalSeats} filled
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaCurrency}>₹</Text>
          <Text style={[styles.metaText, styles.price]}>{formatPrice(ride.pricePerSeat)}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${ride.totalSeats > 0 ? (seatsUsed / ride.totalSeats) * 100 : 0}%`,
              backgroundColor: seatsUsed === ride.totalSeats ? Colors.primary : Colors.success,
            },
          ]}
        />
      </View>

      <View style={styles.bottomRow}>
        <PassengerChip bookings={confirmedBookings} />

        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>{pendingCount} pending</Text>
          </View>
        )}
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
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  routeBlock: { flex: 1, marginRight: Spacing.sm },
  routeText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textBrand,
  },
  routeArrow: {
    color: Colors.primary400,
    fontFamily: FontFamily.body,
  },
  landmark: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaCurrency: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  metaText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  price: {
    color: Colors.primary,
    fontFamily: FontFamily.bodySemiBold,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#FDCFA4',
  },
  pendingText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.accentDark,
  },
});

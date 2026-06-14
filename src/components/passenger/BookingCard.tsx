import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
import { Booking } from '@/types';
import { BookingStatusBadge } from './BookingStatusBadge';
import { DriverAvatar } from './DriverAvatar';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';
import { BOOKING_CANCEL_CUTOFF_HOURS } from '@/config/constants';

interface Props {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  isCancelling?: boolean;
}

export function BookingCard({ booking, onCancel, isCancelling }: Props) {
  const ride = booking.ride;
  const isConfirmed = booking.status === 'confirmed';
  const isPending = booking.status === 'pending';
  const isCancellable = isPending || isConfirmed;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const canCancel =
    isCancellable && ride?.departureAt
      ? new Date(ride.departureAt).getTime() - now > BOOKING_CANCEL_CUTOFF_HOURS * 60 * 60 * 1000
      : false;

  const handleCancel = () => {
    Alert.alert(
      'Cancel booking?',
      'Are you sure you want to cancel this booking? The driver will be notified.',
      [
        { text: 'Keep booking', style: 'cancel' },
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: () => onCancel?.(booking.id),
        },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.routeBlock}>
          <Text style={styles.routeText}>
            {ride?.originCity ?? '—'}
            <Text style={styles.routeArrow}> → </Text>
            {ride?.destinationCity ?? '—'}
          </Text>
          {ride?.departureAt && (
            <Text style={styles.departure}>{formatDepartureDate(ride.departureAt)}</Text>
          )}
        </View>
        <BookingStatusBadge status={booking.status} />
      </View>

      <View style={styles.divider} />

      {ride && (
        <View style={styles.driverRow}>
          <DriverAvatar
            name={ride.driverName}
            photoUrl={ride.driverPhotoUrl}
            rating={ride.driverRating}
            size="sm"
          />
          <View style={styles.priceWrap}>
            <Text style={styles.price}>
              {formatPrice(ride.pricePerSeat * booking.seatsRequested)}
            </Text>
            <Text style={styles.priceNote}>cash to driver</Text>
          </View>
        </View>
      )}

      {isConfirmed && ride?.driverPhone && (
        <View style={styles.phoneRow}>
          <AppIcon name={Icons.phone} size={IconSize.sm} color={Colors.textMuted} />
          <Text style={styles.phoneLabel}>Driver&apos;s number: </Text>
          <Text style={styles.phoneNumber}>{ride.driverPhone}</Text>
        </View>
      )}

      <View style={styles.bottomRow}>
        <View style={styles.seatsChip}>
          <AppIcon name={Icons.seat} size={IconSize.sm} color={Colors.textSecondary} />
          <Text style={styles.seatsChipText}>
            {booking.seatsRequested} seat
            {booking.seatsRequested !== 1 ? 's' : ''}
          </Text>
        </View>

        {canCancel && onCancel && (
          <TouchableOpacity
            style={[styles.cancelBtn, isCancelling && { opacity: 0.5 }]}
            onPress={handleCancel}
            disabled={isCancelling}
          >
            <Text style={styles.cancelBtnText}>{isCancelling ? 'Cancelling…' : 'Cancel'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  routeBlock: { flex: 1, marginRight: Spacing.sm },
  routeText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textBrand,
    marginBottom: 3,
  },
  routeArrow: {
    color: Colors.primary400,
    fontFamily: FontFamily.body,
  },
  departure: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.divider,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  priceWrap: { alignItems: 'flex-end' },
  price: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  priceNote: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  phoneLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  phoneNumber: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.base,
  },
  seatsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seatsChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  cancelBtn: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.errorDark,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles';
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
import { BookingStatusBadge } from '../BookingStatusBadge';
import { DriverAvatar } from '../DriverAvatar';
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

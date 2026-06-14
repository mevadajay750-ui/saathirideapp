import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
import { Ride, Booking } from '@/types';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';
import { RideStatusBadge } from '../RideStatusBadge';
import { PassengerChip } from '../PassengerChip';

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

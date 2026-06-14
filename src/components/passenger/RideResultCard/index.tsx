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
import { Ride } from '@/types';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';
import { DriverAvatar } from '../DriverAvatar';

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
          <AppIcon name={Icons.seat} size={IconSize.sm} color={Colors.textSecondary} />
          <Text style={[styles.chipText, isAlmostFull && { color: Colors.accentDark }]}>
            {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? 's' : ''} left
          </Text>
        </View>

        <View style={styles.chip}>
          <AppIcon name={Icons.car} size={IconSize.sm} color={Colors.textSecondary} />
          <Text style={styles.chipText} numberOfLines={1}>
            {ride.vehicle.make} {ride.vehicle.model}
          </Text>
        </View>

        <View style={styles.chip}>
          <AppIcon name={Icons.palette} size={IconSize.sm} color={Colors.textSecondary} />
          <Text style={styles.chipText}>{ride.vehicle.color}</Text>
        </View>
      </View>

      <View style={styles.ctaRow}>
        <Text style={styles.ctaText}>View ride</Text>
        <AppIcon name={Icons.forward} size={IconSize.sm} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

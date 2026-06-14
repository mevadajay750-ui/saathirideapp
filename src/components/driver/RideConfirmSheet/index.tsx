import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { BottomSheet, BottomSheetRef } from '@/components/common/BottomSheet';
import { Button } from '@/components/common';
import { styles } from './styles';
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  TextStyles,
  IconSize,
  Icons,
} from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { Ride } from '@/types';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';

interface RideConfirmSheetProps {
  ride: Ride | null;
  onViewRide: () => void;
  onPostAnother: () => void;
}

export const RideConfirmSheet = forwardRef<BottomSheetRef, RideConfirmSheetProps>(
  ({ ride, onViewRide, onPostAnother }, ref) => {
    if (!ride) return null;

    return (
      <BottomSheet ref={ref} snapPoints={['55%']} onClose={onPostAnother}>
        <View style={styles.container}>
          <View style={styles.successIcon}>
            <AppIcon name={Icons.sparkles} size={IconSize['2xl']} color={Colors.successDark} />
          </View>

          <Text style={[TextStyles.h2, styles.title]}>Ride posted!</Text>
          <Text style={[TextStyles.body, styles.subtitle]}>
            Passengers can now find and request your ride. You&apos;ll get a notification when
            someone books.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.routeRow}>
              <Text style={styles.routeCity}>{ride.origin.city}</Text>
              <AppIcon name={Icons.forward} size={IconSize.md} color={Colors.primary400} />
              <Text style={styles.routeCity}>{ride.destination.city}</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <AppIcon name={Icons.calendar} size={IconSize.md} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{formatDepartureDate(ride.departureAt)}</Text>
              </View>
              <View style={styles.metaItem}>
                <AppIcon name={Icons.seat} size={IconSize.md} color={Colors.textSecondary} />
                <Text style={styles.metaText}>
                  {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaCurrency}>₹</Text>
                <Text style={[styles.metaText, styles.metaPrice]}>
                  {formatPrice(ride.pricePerSeat)}/seat
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Button label="View my ride" onPress={onViewRide} variant="primary" size="lg" />
            <Button label="Post another ride" onPress={onPostAnother} variant="outline" size="md" />
          </View>
        </View>
      </BottomSheet>
    );
  },
);

RideConfirmSheet.displayName = 'RideConfirmSheet';

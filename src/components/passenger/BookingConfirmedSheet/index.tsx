import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { BottomSheet, BottomSheetRef } from '@/components/common/BottomSheet';
import { Button } from '@/components/common';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { Booking } from '@/types';
import { styles } from './styles';

interface Props {
  booking: Booking | null;
  driverName: string;
  onViewBookings: () => void;
  onGoHome: () => void;
}

export const BookingConfirmedSheet = forwardRef<BottomSheetRef, Props>(
  ({ booking, driverName, onViewBookings, onGoHome }, ref) => {
    if (!booking) return null;

    const isPending = booking.status === 'pending';

    return (
      <BottomSheet ref={ref} snapPoints={['52%']}>
        <View style={styles.container}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: isPending ? Colors.accentLight : Colors.successLight },
            ]}
          >
            <AppIcon
              name={isPending ? Icons.hourglass : Icons.sparkles}
              size={IconSize['2xl']}
              color={isPending ? Colors.accentDark : Colors.successDark}
            />
          </View>

          <Text style={styles.title}>{isPending ? 'Request sent!' : 'Booking confirmed!'}</Text>

          <Text style={styles.body}>
            {isPending
              ? `Your request has been sent to ${driverName}. You'll get a notification once they respond — usually within a few hours.`
              : `${driverName} has confirmed your seat. Their number will be shared so you can coordinate your meeting point.`}
          </Text>

          <View style={styles.cashReminder}>
            <AppIcon name={Icons.cash} size={IconSize.lg} color={Colors.accentDark} />
            <Text style={styles.cashText}>
              Remember — pay in cash directly to the driver at the meeting point.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button label="View my bookings" onPress={onViewBookings} variant="primary" size="lg" />
            <Button label="Back to home" onPress={onGoHome} variant="outline" size="md" />
          </View>
        </View>
      </BottomSheet>
    );
  },
);

BookingConfirmedSheet.displayName = 'BookingConfirmedSheet';

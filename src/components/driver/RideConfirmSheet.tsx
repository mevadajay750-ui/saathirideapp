import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheet, BottomSheetRef } from '@/components/common/BottomSheet';
import { Button } from '@/components/common';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, TextStyles } from '@/theme';
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
            <Text style={styles.successEmoji}>🎉</Text>
          </View>

          <Text style={[TextStyles.h2, styles.title]}>Ride posted!</Text>
          <Text style={[TextStyles.body, styles.subtitle]}>
            Passengers can now find and request your ride. You&apos;ll get a notification when
            someone books.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.routeRow}>
              <Text style={styles.routeCity}>{ride.origin.city}</Text>
              <Text style={styles.routeArrow}>→</Text>
              <Text style={styles.routeCity}>{ride.destination.city}</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaEmoji}>📅</Text>
                <Text style={styles.metaText}>{formatDepartureDate(ride.departureAt)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaEmoji}>💺</Text>
                <Text style={styles.metaText}>
                  {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaEmoji}>₹</Text>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  successEmoji: {
    fontSize: 36,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.textBrand,
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    lineHeight: FontSize.base * 1.6,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary200,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  routeCity: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.primaryDeep,
  },
  routeArrow: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.primary400,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metaItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaEmoji: {
    fontSize: 16,
  },
  metaText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  metaPrice: {
    color: Colors.primary,
  },
  actions: {
    width: '100%',
    gap: Spacing.sm,
  },
});

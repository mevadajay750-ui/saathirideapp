import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { Ride } from '@/types';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';
import { DriverAvatar } from './DriverAvatar';

interface Props {
  ride: Ride;
  seatsRequested: number;
}

export function RideInfoCard({ ride, seatsRequested }: Props) {
  const totalPrice = ride.pricePerSeat * seatsRequested;

  return (
    <View style={styles.card}>
      <View style={styles.routeSection}>
        <View style={styles.routePoint}>
          <View style={styles.routeDot} />
          <View>
            <Text style={styles.routeCity}>{ride.origin.city}</Text>
            {ride.origin.landmark && (
              <Text style={styles.routeLandmark}>{ride.origin.landmark}</Text>
            )}
          </View>
        </View>

        <View style={styles.routeConnector}>
          <View style={styles.routeLine} />
          <Text style={styles.routeDuration}>Intercity</Text>
          <View style={styles.routeLine} />
        </View>

        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.routeDotDest]} />
          <View>
            <Text style={styles.routeCity}>{ride.destination.city}</Text>
            {ride.destination.landmark && (
              <Text style={styles.routeLandmark}>{ride.destination.landmark}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaEmoji}>📅</Text>
          <Text style={styles.metaLabel}>Departure</Text>
          <Text style={styles.metaValue}>{formatDepartureDate(ride.departureAt)}</Text>
        </View>
        <View style={styles.metaItemDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaEmoji}>💺</Text>
          <Text style={styles.metaLabel}>Your seats</Text>
          <Text style={styles.metaValue}>
            {seatsRequested} of {ride.seatsAvailable} left
          </Text>
        </View>
        <View style={styles.metaItemDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaEmoji}>💵</Text>
          <Text style={styles.metaLabel}>Total</Text>
          <Text style={[styles.metaValue, styles.metaPrice]}>{formatPrice(totalPrice)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.driverSection}>
        <Text style={styles.driverLabel}>Your driver</Text>
        <DriverAvatar
          name={ride.driverName}
          photoUrl={ride.driverPhotoUrl}
          rating={ride.driverRating}
          size="md"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.vehicleSection}>
        <Text style={styles.vehicleLabel}>Vehicle</Text>
        <View style={styles.vehicleRow}>
          <Text style={styles.vehicleEmoji}>🚗</Text>
          <View>
            <Text style={styles.vehicleName}>
              {ride.vehicle.make} {ride.vehicle.model}
            </Text>
            <Text style={styles.vehicleMeta}>
              {ride.vehicle.color} · {ride.vehicle.plateNumber}
            </Text>
          </View>
        </View>
      </View>

      {ride.notes && (
        <>
          <View style={styles.divider} />
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Driver&apos;s notes</Text>
            <Text style={styles.notesText}>{ride.notes}</Text>
          </View>
        </>
      )}

      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceRowLabel}>
            {formatPrice(ride.pricePerSeat)} × {seatsRequested} seat
            {seatsRequested !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.priceRowValue}>{formatPrice(totalPrice)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceRowLabel}>SaathiRide fee</Text>
          <Text style={[styles.priceRowValue, { color: Colors.success }]}>Free (MVP)</Text>
        </View>
        <View style={styles.priceTotalDivider} />
        <View style={styles.priceRow}>
          <Text style={styles.priceTotalLabel}>Pay driver in cash</Text>
          <Text style={styles.priceTotalValue}>{formatPrice(totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 0.5,
    borderColor: Colors.borderBrand,
    overflow: 'hidden',
  },
  routeSection: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 4,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  routeDotDest: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accentLight,
  },
  routeCity: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textBrand,
  },
  routeLandmark: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  routeConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.xs / 2 + 3,
    gap: Spacing.sm,
  },
  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  routeDuration: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.divider,
  },
  metaGrid: {
    flexDirection: 'row',
    padding: Spacing.base,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  metaItemDivider: {
    width: 0.5,
    backgroundColor: Colors.divider,
    alignSelf: 'stretch',
  },
  metaEmoji: { fontSize: 18 },
  metaLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  metaValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  metaPrice: {
    color: Colors.primary,
    fontFamily: FontFamily.heading,
    fontSize: FontSize.base,
  },
  driverSection: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  driverLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vehicleSection: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  vehicleLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  vehicleEmoji: { fontSize: 28 },
  vehicleName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  vehicleMeta: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notesSection: {
    padding: Spacing.base,
    gap: Spacing.xs,
  },
  notesLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.6,
  },
  priceBreakdown: {
    backgroundColor: Colors.primaryLight,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRowLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  priceRowValue: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  priceTotalDivider: {
    height: 0.5,
    backgroundColor: Colors.primary200,
  },
  priceTotalLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.primaryDeep,
  },
  priceTotalValue: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
});

import React from 'react';
import { View, Text } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { Ride } from '@/types';
import { formatDepartureDate, formatPrice } from '@/utils/formatters';
import { DriverAvatar } from '../DriverAvatar';
import { styles } from './styles';

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
          <AppIcon name={Icons.calendar} size={IconSize.lg} color={Colors.textSecondary} />
          <Text style={styles.metaLabel}>Departure</Text>
          <Text style={styles.metaValue}>{formatDepartureDate(ride.departureAt)}</Text>
        </View>
        <View style={styles.metaItemDivider} />
        <View style={styles.metaItem}>
          <AppIcon name={Icons.seat} size={IconSize.lg} color={Colors.textSecondary} />
          <Text style={styles.metaLabel}>Your seats</Text>
          <Text style={styles.metaValue}>
            {seatsRequested} of {ride.seatsAvailable} left
          </Text>
        </View>
        <View style={styles.metaItemDivider} />
        <View style={styles.metaItem}>
          <AppIcon name={Icons.cash} size={IconSize.lg} color={Colors.textSecondary} />
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
          <AppIcon name={Icons.carSport} size={IconSize.xl} color={Colors.primary} />
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

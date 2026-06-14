import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { BookingRequestCard } from '@/components/driver/BookingRequestCard';
import { RideStatusBadge } from '@/components/driver/RideStatusBadge';
import { styles } from './styles';
import {
  useRideDetail,
  useRideBookings,
  useBookingAction,
  useCancelRide,
} from '@/hooks/useDriverRides';
import { formatDepartureDate, formatPrice, formatRating } from '@/utils/formatters';
import type { RootScreenProps } from '@/navigation/types';

type Props = RootScreenProps<'RideDetail'>;

export default function RideDetailScreen({ route, navigation }: Props) {
  const { rideId } = route.params;

  const { data: ride, isLoading: rideLoading, refetch: refetchRide } = useRideDetail(rideId);

  const {
    data: bookings,
    isLoading: bookingsLoading,
    isRefetching,
    refetch: refetchBookings,
  } = useRideBookings(rideId);

  const { mutateAsync: actOnBooking, isPending: isActing } = useBookingAction(rideId);

  const { mutateAsync: cancelRide, isPending: isCancelling } = useCancelRide();

  const handleAccept = useCallback(
    async (bookingId: string) => {
      await actOnBooking({ bookingId, action: 'confirmed' });
    },
    [actOnBooking],
  );

  const handleDecline = useCallback(
    async (bookingId: string) => {
      await actOnBooking({ bookingId, action: 'cancelled_by_driver' });
    },
    [actOnBooking],
  );

  const handleCancelRide = useCallback(() => {
    Alert.alert(
      'Cancel this ride?',
      'All confirmed passengers will be notified. This cannot be undone.',
      [
        { text: 'Keep ride', style: 'cancel' },
        {
          text: 'Cancel ride',
          style: 'destructive',
          onPress: async () => {
            await cancelRide(rideId);
            navigation.goBack();
          },
        },
      ],
    );
  }, [cancelRide, rideId, navigation]);

  const refetch = useCallback(() => {
    refetchRide();
    refetchBookings();
  }, [refetchRide, refetchBookings]);

  if (rideLoading) {
    return (
      <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!ride) {
    return (
      <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
        <View style={styles.loader}>
          <Text style={styles.errorText}>Ride not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const seatsUsed = ride.totalSeats - ride.seatsAvailable;
  const isActive = ride.status === 'active';

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoCardTop}>
            <View>
              <Text style={styles.routeText}>
                {ride.origin.city}
                <Text style={styles.routeArrow}> → </Text>
                {ride.destination.city}
              </Text>
              {ride.origin.landmark && (
                <Text style={styles.landmark}>
                  {ride.origin.landmark} → {ride.destination.landmark ?? ride.destination.city}
                </Text>
              )}
            </View>
            <RideStatusBadge status={ride.status} seatsAvailable={ride.seatsAvailable} />
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <AppIcon name={Icons.calendar} size={IconSize.lg} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Departure</Text>
              <Text style={styles.detailValue}>{formatDepartureDate(ride.departureAt)}</Text>
            </View>
            <View style={styles.detailItem}>
              <AppIcon name={Icons.seat} size={IconSize.lg} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Seats</Text>
              <Text style={styles.detailValue}>
                {seatsUsed}/{ride.totalSeats} booked
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailCurrency}>₹</Text>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={[styles.detailValue, { color: Colors.primary }]}>
                {formatPrice(ride.pricePerSeat)}/seat
              </Text>
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
          <Text style={styles.progressLabel}>
            {ride.seatsAvailable > 0
              ? `${ride.seatsAvailable} seat${ride.seatsAvailable !== 1 ? 's' : ''} still available`
              : 'Ride is fully booked'}
          </Text>

          {ride.notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Your notes</Text>
              <Text style={styles.notesText}>{ride.notes}</Text>
            </View>
          )}
        </View>

        {isActive && (bookings?.pending?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Booking requests</Text>
              <View style={styles.pendingCountBadge}>
                <Text style={styles.pendingCountText}>{bookings!.pending.length} new</Text>
              </View>
            </View>
            <Text style={styles.sectionHint}>
              Accept to confirm their seat · Decline to free your seat for others
            </Text>

            {bookingsLoading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.base }} />
            ) : (
              bookings?.pending.map((booking) => (
                <BookingRequestCard
                  key={booking.id}
                  booking={booking}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  isActing={isActing}
                />
              ))
            )}
          </View>
        )}

        {(bookings?.confirmed?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confirmed passengers</Text>
            {bookings?.confirmed.map((booking) => (
              <View key={booking.id} style={styles.confirmedCard}>
                <View style={styles.confirmedLeft}>
                  <View style={styles.confirmedAvatar}>
                    <Text style={styles.confirmedInitials}>
                      {booking.passengerName
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.confirmedName}>{booking.passengerName}</Text>
                    <View style={styles.confirmedMeta}>
                      {booking.passengerRating > 0 && (
                        <Text style={styles.confirmedRating}>
                          ★ {formatRating(booking.passengerRating)}
                        </Text>
                      )}
                      <Text style={styles.confirmedSeats}>
                        · {booking.seatsRequested} seat{booking.seatsRequested !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.confirmedBadge}>
                  <AppIcon name={Icons.check} size={IconSize.sm} color={Colors.successDark} />
                  <Text style={styles.confirmedBadgeText}>Confirmed</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {isActive &&
          (bookings?.pending?.length ?? 0) === 0 &&
          (bookings?.confirmed?.length ?? 0) === 0 && (
            <View style={styles.noActivity}>
              <AppIcon name={Icons.hourglass} size={IconSize['2xl']} color={Colors.gray400} />
              <Text style={styles.noActivityTitle}>Waiting for passengers</Text>
              <Text style={styles.noActivityBody}>
                Your ride is live. Passengers searching this route will see it and can send booking
                requests.
              </Text>
            </View>
          )}

        {isActive && (
          <TouchableOpacity
            style={[styles.cancelRideBtn, isCancelling && { opacity: 0.5 }]}
            onPress={handleCancelRide}
            disabled={isCancelling}
          >
            <Text style={styles.cancelRideText}>
              {isCancelling ? 'Cancelling…' : 'Cancel this ride'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

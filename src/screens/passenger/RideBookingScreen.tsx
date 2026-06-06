import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { Button } from '@/components/common';
import { BottomSheetRef } from '@/components/common/BottomSheet';
import { RideInfoCard } from '@/components/passenger/RideInfoCard';
import { BookingConfirmedSheet } from '@/components/passenger/BookingConfirmedSheet';
import { useRideForBooking, useRequestBooking } from '@/hooks/useBooking';
import { formatPrice } from '@/utils/formatters';
import { Booking } from '@/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RideBooking'>;

export default function RideBookingScreen({ route, navigation }: Props) {
  const { rideId, seats } = route.params;
  const confirmSheetRef = useRef<BottomSheetRef>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const { data: ride, isLoading, error } = useRideForBooking(rideId);
  const { mutateAsync: requestBooking, isPending: isRequesting } = useRequestBooking();

  const handleBook = useCallback(async () => {
    if (!ride) return;

    if (ride.seatsAvailable < seats) {
      Alert.alert(
        'Not enough seats',
        `Only ${ride.seatsAvailable} seat${ride.seatsAvailable !== 1 ? 's' : ''} available.`,
      );
      return;
    }

    try {
      const booking = await requestBooking({
        rideId,
        seatsRequested: seats,
      });
      setCreatedBooking(booking);
      confirmSheetRef.current?.open();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to request booking. Please try again.';
      Alert.alert('Booking failed', msg);
    }
  }, [ride, seats, rideId, requestBooking]);

  const handleViewBookings = useCallback(() => {
    confirmSheetRef.current?.close();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'PassengerTabs',
          state: { routes: [{ name: 'MyBookings' }], index: 0 },
        },
      ],
    });
  }, [navigation]);

  const handleGoHome = useCallback(() => {
    confirmSheetRef.current?.close();
    navigation.reset({
      index: 0,
      routes: [{ name: 'PassengerTabs' }],
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loaderText}>Loading ride details…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !ride) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>Could not load ride details</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackBtn}>
            <Text style={styles.goBackText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = ride.pricePerSeat * seats;
  const seatsOk = ride.seatsAvailable >= seats;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ride details</Text>
            <View style={{ width: 48 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <RideInfoCard ride={ride} seatsRequested={seats} />

            {!seatsOk && (
              <View style={styles.warningBanner}>
                <Text style={styles.warningEmoji}>⚠️</Text>
                <Text style={styles.warningText}>
                  Only {ride.seatsAvailable} seat
                  {ride.seatsAvailable !== 1 ? 's' : ''} available. Adjust your search to book this
                  ride.
                </Text>
              </View>
            )}

            <View style={styles.cashNote}>
              <Text style={styles.cashNoteEmoji}>💵</Text>
              <Text style={styles.cashNoteText}>
                Payment is in cash — pay{' '}
                <Text style={{ fontFamily: FontFamily.bodySemiBold, color: Colors.accentDark }}>
                  {formatPrice(totalPrice)}
                </Text>{' '}
                directly to the driver at your pickup point. SaathiRide does not handle payments.
              </Text>
            </View>

            <View style={styles.stepsCard}>
              <Text style={styles.stepsTitle}>What happens next?</Text>
              {[
                { emoji: '📨', text: `Your request is sent to ${ride.driverName}` },
                { emoji: '🔔', text: "You'll get notified when they accept or decline" },
                { emoji: '📱', text: "Once confirmed, you'll see the driver's phone number" },
                {
                  emoji: '💵',
                  text: `Pay ${formatPrice(totalPrice)} cash to the driver at the pickup point`,
                },
              ].map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNumWrap}>
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepEmoji}>{step.emoji}</Text>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerPrice}>{formatPrice(totalPrice)}</Text>
              <Text style={styles.footerPriceNote}>
                {seats} seat{seats !== 1 ? 's' : ''} · cash
              </Text>
            </View>
            <Button
              label={isRequesting ? 'Requesting…' : 'Request booking'}
              onPress={handleBook}
              isLoading={isRequesting}
              disabled={!seatsOk}
              variant="primary"
              size="lg"
              fullWidth={false}
              style={styles.footerBtn}
            />
          </View>

          <BookingConfirmedSheet
            ref={confirmSheetRef}
            booking={createdBooking}
            driverName={ride.driverName}
            onViewBookings={handleViewBookings}
            onGoHome={handleGoHome}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loaderText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  errorEmoji: { fontSize: 48 },
  errorText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  goBackBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  goBackText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  backText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.white,
    width: 48,
  },
  headerTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  scroll: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  warningEmoji: { fontSize: 18 },
  warningText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.warningDark,
    lineHeight: FontSize.sm * 1.5,
  },
  cashNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#FDCFA4',
  },
  cashNoteEmoji: { fontSize: 18 },
  cashNoteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.accentDark,
    lineHeight: FontSize.sm * 1.6,
  },
  stepsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  stepsTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  stepNumWrap: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNum: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    color: Colors.white,
  },
  stepEmoji: { fontSize: 16 },
  stepText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  footerLeft: { gap: 2 },
  footerPrice: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  footerPriceNote: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  footerBtn: {
    minWidth: 160,
  },
});

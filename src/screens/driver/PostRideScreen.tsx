import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Colors, FontFamily, FontSize, Spacing, BorderRadius, TextStyles } from '@/theme';
import { Button, Input, ScreenWrapper } from '@/components/common';
import { BottomSheetRef } from '@/components/common/BottomSheet';
import { CityPicker } from '@/components/driver/CityPicker';
import { DateTimePicker } from '@/components/driver/DateTimePicker';
import { SeatsStepper } from '@/components/driver/SeatsStepper';
import { PriceInput } from '@/components/driver/PriceInput';
import { RideConfirmSheet } from '@/components/driver/RideConfirmSheet';
import { usePostRide } from '@/hooks/usePostRide';
import { City } from '@/data/cities';
import { MIN_PRICE_INR, MAX_PRICE_INR, MAX_SEATS } from '@/config/constants';
import type { DriverTabScreenProps } from '@/navigation/types';

type Props = DriverTabScreenProps<'PostRide'>;

const schema = z
  .object({
    originCity: z.string().min(1, 'Select origin city'),
    originLandmark: z.string().max(80).optional(),
    destinationCity: z.string().min(1, 'Select destination city'),
    destinationLandmark: z.string().max(80).optional(),
    departureDate: z.date({ error: 'Select departure date' }),
    departureTime: z.date({ error: 'Select departure time' }),
    totalSeats: z.number().min(1).max(MAX_SEATS),
    pricePerSeat: z
      .string()
      .min(1, 'Enter price')
      .refine((v) => {
        const n = Number(v);
        return !isNaN(n) && n >= MIN_PRICE_INR && n <= MAX_PRICE_INR;
      }, `Price must be between ₹${MIN_PRICE_INR} and ₹${MAX_PRICE_INR}`),
    notes: z.string().max(200).optional(),
  })
  .refine((data) => data.originCity !== data.destinationCity, {
    message: 'Origin and destination cannot be the same',
    path: ['destinationCity'],
  });

type FormData = z.infer<typeof schema>;

export default function PostRideScreen({ navigation }: Props) {
  const { isLoading, error, createdRide, postRide, reset } = usePostRide();
  const confirmSheetRef = useRef<BottomSheetRef>(null);
  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destinationCity, setDestinationCity] = useState<City | null>(null);

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      totalSeats: 1,
      pricePerSeat: '',
    },
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      await postRide({
        originCity: data.originCity,
        destinationCity: data.destinationCity,
        departureDate: format(data.departureDate, 'yyyy-MM-dd'),
        departureTime: format(data.departureTime, 'HH:mm'),
        totalSeats: data.totalSeats,
        pricePerSeat: Number(data.pricePerSeat),
        notes: data.notes,
      });
    },
    [postRide],
  );

  useEffect(() => {
    if (createdRide) {
      confirmSheetRef.current?.open();
    }
  }, [createdRide]);

  const handlePostAnother = useCallback(() => {
    confirmSheetRef.current?.close();
    reset();
    resetForm();
    setOriginCity(null);
    setDestinationCity(null);
  }, [reset, resetForm]);

  const handleViewRide = useCallback(() => {
    confirmSheetRef.current?.close();
    navigation.navigate('DriverRides');
  }, [navigation]);

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post a ride</Text>
        <Text style={styles.headerSubtitle}>Share your journey — earn while you drive</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route</Text>

            <View style={styles.routeCard}>
              <Controller
                control={control}
                name="originCity"
                render={({ field }) => (
                  <CityPicker
                    label="From"
                    placeholder="Select origin city"
                    value={originCity}
                    excludeCityId={destinationCity?.id}
                    error={errors.originCity?.message}
                    onChange={(city) => {
                      setOriginCity(city);
                      field.onChange(city.id);
                    }}
                  />
                )}
              />

              <View style={styles.routeArrow}>
                <View style={styles.routeLine} />
                <Text style={styles.routeArrowIcon}>↓</Text>
                <View style={styles.routeLine} />
              </View>

              <Controller
                control={control}
                name="destinationCity"
                render={({ field }) => (
                  <CityPicker
                    label="To"
                    placeholder="Select destination city"
                    value={destinationCity}
                    excludeCityId={originCity?.id}
                    error={errors.destinationCity?.message}
                    onChange={(city) => {
                      setDestinationCity(city);
                      field.onChange(city.id);
                    }}
                  />
                )}
              />
            </View>

            <View style={styles.landmarkRow}>
              <Controller
                control={control}
                name="originLandmark"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Pickup area (optional)"
                    placeholder="e.g. Maninagar, Satellite"
                    value={value}
                    onChangeText={onChange}
                    containerStyle={styles.landmarkInput}
                  />
                )}
              />
              <Controller
                control={control}
                name="destinationLandmark"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Drop area (optional)"
                    placeholder="e.g. Alkapuri, Akota"
                    value={value}
                    onChangeText={onChange}
                    containerStyle={styles.landmarkInput}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & time</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.dateField}>
                <Controller
                  control={control}
                  name="departureDate"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      label="Date"
                      value={value ?? null}
                      onChange={onChange}
                      mode="date"
                      minimumDate={new Date()}
                      error={errors.departureDate?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.timeField}>
                <Controller
                  control={control}
                  name="departureTime"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      label="Time"
                      value={value ?? null}
                      onChange={onChange}
                      mode="time"
                      error={errors.departureTime?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seats & price</Text>

            <Controller
              control={control}
              name="totalSeats"
              render={({ field: { onChange, value } }) => (
                <SeatsStepper value={value} onChange={onChange} />
              )}
            />

            <View style={styles.spacer} />

            <Controller
              control={control}
              name="pricePerSeat"
              render={({ field: { onChange, value } }) => (
                <PriceInput
                  value={value ?? ''}
                  onChange={onChange}
                  error={errors.pricePerSeat?.message}
                  originCity={originCity?.name}
                  destinationCity={destinationCity?.name}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional notes</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="e.g. No smoking, ladies preferred, AC car, 1 bag allowed..."
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  style={styles.notesInput}
                  maxLength={200}
                />
              )}
            />
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <Button
            label="Post my ride"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />

          <Text style={[TextStyles.caption, styles.footerNote]}>
            Once posted, passengers can request to join your ride. You&apos;ll be notified and can
            accept or decline each request.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <RideConfirmSheet
        ref={confirmSheetRef}
        ride={createdRide}
        onViewRide={handleViewRide}
        onPostAnother={handlePostAnother}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  headerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.primary200,
  },
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing['5xl'],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: Spacing.md,
  },
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderBrand,
    padding: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  routeArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  routeArrowIcon: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.lg,
    color: Colors.primary400,
  },
  landmarkRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  landmarkInput: {
    flex: 1,
    marginBottom: 0,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dateField: { flex: 3 },
  timeField: { flex: 2 },
  spacer: {
    height: Spacing.base,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorBanner: {
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.base,
  },
  errorBannerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.errorDark,
  },
  submitBtn: {
    marginBottom: Spacing.base,
  },
  footerNote: {
    textAlign: 'center',
    paddingHorizontal: Spacing.base,
    lineHeight: FontSize.xs * 1.7,
  },
});

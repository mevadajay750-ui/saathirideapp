import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Colors, FontFamily, FontSize, Spacing, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { Input } from '@/components/common';
import { Button } from '@/components/common';
import { Vehicle } from '@/types';
import { MAX_SEATS } from '@/config/constants';

const currentYear = new Date().getFullYear();

const schema = z.object({
  make: z.string().min(2, 'Enter car make (e.g. Maruti)'),
  model: z.string().min(2, 'Enter car model (e.g. Swift Dzire)'),
  year: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === 'string' ? parseInt(v, 10) : v))
    .pipe(
      z
        .number()
        .int()
        .min(1990, 'Year must be 1990 or later')
        .max(currentYear + 1, 'Enter a valid year'),
    ),
  color: z.string().min(2, 'Enter car colour'),
  plateNumber: z
    .string()
    .min(6, 'Enter a valid number plate')
    .regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, 'Format: GJ01AB1234'),
  totalSeats: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === 'string' ? parseInt(v, 10) : v))
    .pipe(z.number().int().min(1, 'At least 1 seat').max(MAX_SEATS, `Maximum ${MAX_SEATS} seats`)),
});

export type VehicleFormData = z.infer<typeof schema>;

interface Props {
  vehicle?: Vehicle;
  onSave: (data: VehicleFormData) => void;
  isLoading?: boolean;
}

export function VehicleForm({ vehicle, onSave, isLoading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.input<typeof schema>, unknown, VehicleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      make: vehicle?.make ?? '',
      model: vehicle?.model ?? '',
      year: vehicle?.year ?? currentYear,
      color: vehicle?.color ?? '',
      plateNumber: vehicle?.plateNumber ?? '',
      totalSeats: vehicle?.totalSeats ?? MAX_SEATS,
    },
  });

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        <AppIcon name={Icons.carSport} size={IconSize.xl} color={Colors.primary} />
        <View>
          <Text style={styles.headerTitle}>Vehicle details</Text>
          <Text style={styles.headerHint}>Shown to passengers after booking confirmed</Text>
        </View>
      </View>

      <View style={styles.rowFields}>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="make"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Make"
                placeholder="Maruti"
                value={value}
                onChangeText={onChange}
                error={errors.make?.message}
                autoCapitalize="words"
              />
            )}
          />
        </View>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="model"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Model"
                placeholder="Swift Dzire"
                value={value}
                onChangeText={onChange}
                error={errors.model?.message}
                autoCapitalize="words"
              />
            )}
          />
        </View>
      </View>

      <View style={styles.rowFields}>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="year"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Year"
                placeholder={String(currentYear)}
                value={value ? String(value) : ''}
                onChangeText={onChange}
                error={errors.year?.message}
                keyboardType="number-pad"
                maxLength={4}
              />
            )}
          />
        </View>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="totalSeats"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Total seats"
                placeholder={String(MAX_SEATS)}
                value={value ? String(value) : ''}
                onChangeText={onChange}
                error={errors.totalSeats?.message}
                keyboardType="number-pad"
                maxLength={1}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.rowFields}>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Colour"
                placeholder="White"
                value={value}
                onChangeText={onChange}
                error={errors.color?.message}
                autoCapitalize="words"
              />
            )}
          />
        </View>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="plateNumber"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Number plate"
                placeholder="GJ01AB1234"
                value={value}
                onChangeText={(t) => onChange(t.toUpperCase())}
                error={errors.plateNumber?.message}
                autoCapitalize="characters"
                maxLength={10}
              />
            )}
          />
        </View>
      </View>

      <Button
        label={isLoading ? 'Saving…' : vehicle ? 'Update vehicle' : 'Save vehicle'}
        onPress={handleSubmit(onSave)}
        isLoading={isLoading}
        disabled={!isDirty && !!vehicle}
        variant={isDirty ? 'primary' : 'secondary'}
        size="md"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  headerHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rowFields: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  halfField: { flex: 1 },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { Input } from '@/components/common';
import { Button } from '@/components/common';
import { Vehicle } from '@/types';

const schema = z.object({
  make: z.string().min(2, 'Enter car make (e.g. Maruti)'),
  model: z.string().min(2, 'Enter car model (e.g. Swift Dzire)'),
  color: z.string().min(2, 'Enter car colour'),
  plateNumber: z
    .string()
    .min(6, 'Enter a valid number plate')
    .regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, 'Format: GJ01AB1234'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  vehicle?: Vehicle;
  onSave: (data: FormData) => void;
  isLoading?: boolean;
}

export function VehicleForm({ vehicle, onSave, isLoading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      make: vehicle?.make ?? '',
      model: vehicle?.model ?? '',
      color: vehicle?.color ?? '',
      plateNumber: vehicle?.plateNumber ?? '',
    },
  });

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🚗</Text>
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
  headerEmoji: { fontSize: 28 },
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

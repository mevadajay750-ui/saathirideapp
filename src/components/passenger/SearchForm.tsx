import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { CityPicker } from '@/components/driver/CityPicker';
import { DateTimePicker } from '@/components/driver/DateTimePicker';
import { SeatsStepper } from '@/components/driver/SeatsStepper';
import { Button } from '@/components/common';
import { SearchParams } from '@/hooks/useRideSearch';
import { City } from '@/data/cities';

interface Props {
  params: SearchParams;
  onUpdate: <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => void;
  onSearch: () => void;
  isLoading?: boolean;
  errors?: Partial<Record<keyof SearchParams, string>>;
  compact?: boolean;
}

export function SearchForm({
  params,
  onUpdate,
  onSearch,
  isLoading,
  errors,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactBar} onPress={onSearch} activeOpacity={0.8}>
        <View style={styles.compactRoute}>
          <Text style={styles.compactCity} numberOfLines={1}>
            {params.originCity?.name ?? '—'}
          </Text>
          <Text style={styles.compactArrow}>→</Text>
          <Text style={styles.compactCity} numberOfLines={1}>
            {params.destinationCity?.name ?? '—'}
          </Text>
        </View>
        <View style={styles.compactMeta}>
          <Text style={styles.compactMetaText}>{format(params.date, 'dd MMM')}</Text>
          <View style={styles.compactDot} />
          <Text style={styles.compactMetaText}>
            {params.seats} seat{params.seats !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.compactEdit}>✏️</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.form}>
      <View style={styles.routeCard}>
        <CityPicker
          label="From"
          placeholder="Select origin city"
          value={params.originCity}
          excludeCityId={params.destinationCity?.id}
          error={errors?.originCity}
          onChange={(city: City) => onUpdate('originCity', city)}
        />

        <TouchableOpacity
          style={styles.swapBtn}
          onPress={() => {
            const orig = params.originCity;
            const dest = params.destinationCity;
            onUpdate('originCity', dest);
            onUpdate('destinationCity', orig);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.swapIcon}>⇅</Text>
        </TouchableOpacity>

        <CityPicker
          label="To"
          placeholder="Select destination city"
          value={params.destinationCity}
          excludeCityId={params.originCity?.id}
          error={errors?.destinationCity}
          onChange={(city: City) => onUpdate('destinationCity', city)}
        />
      </View>

      <DateTimePicker
        label="Travel date"
        value={params.date}
        onChange={(date) => onUpdate('date', date)}
        mode="date"
        minimumDate={new Date()}
        error={errors?.date ? 'Select a travel date' : undefined}
        icon="📅"
      />

      <View style={styles.seatsRow}>
        <Text style={styles.seatsLabel}>Passengers</Text>
        <SeatsStepper
          value={params.seats}
          onChange={(seats) => onUpdate('seats', seats)}
          min={1}
          max={4}
        />
      </View>

      <Button
        label={isLoading ? 'Searching…' : 'Search rides'}
        onPress={onSearch}
        isLoading={isLoading}
        variant="primary"
        size="lg"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.base,
  },
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderBrand,
    padding: Spacing.base,
    gap: Spacing.md,
    position: 'relative',
  },
  swapBtn: {
    position: 'absolute',
    right: Spacing.base,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  swapIcon: {
    fontSize: 18,
    color: Colors.primary,
  },
  seatsRow: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  seatsLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  compactBar: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.borderBrand,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  compactCity: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base,
    color: Colors.textBrand,
    maxWidth: 90,
  },
  compactArrow: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.primary400,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactMetaText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  compactDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
  },
  compactEdit: { fontSize: 14, marginLeft: Spacing.xs },
});

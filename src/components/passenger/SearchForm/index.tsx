import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { CityPicker } from '@/components/driver/CityPicker';
import { DateTimePicker } from '@/components/driver/DateTimePicker';
import { SeatsStepper } from '@/components/driver/SeatsStepper';
import { Button } from '@/components/common';
import { SearchParams } from '@/hooks/useRideSearch';
import { City } from '@/data/cities';
import { styles } from './styles';

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
          <AppIcon name={Icons.edit} size={IconSize.sm} color={Colors.textMuted} />
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
          <AppIcon name={Icons.swap} size={IconSize.lg} color={Colors.primary} />
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
        icon={Icons.calendar}
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

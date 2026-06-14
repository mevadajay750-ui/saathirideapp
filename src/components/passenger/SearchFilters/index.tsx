import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import type { AppIconName } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { SortOption } from '@/hooks/useRideSearch';
import { styles } from './styles';

interface FilterOption {
  key: SortOption;
  label: string;
  icon: AppIconName;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'departure', label: 'Earliest first', icon: Icons.time },
  { key: 'price_asc', label: 'Lowest price', icon: Icons.cash },
  { key: 'price_desc', label: 'Highest price', icon: Icons.diamond },
  { key: 'rating', label: 'Top rated', icon: Icons.star },
];

interface Props {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
  resultCount: number;
}

export function SearchFilters({ selected, onSelect, resultCount }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {resultCount} ride{resultCount !== 1 ? 's' : ''} found
        </Text>
        <View style={styles.cashNoteRow}>
          <AppIcon name={Icons.cash} size={IconSize.sm} color={Colors.textMuted} />
          <Text style={styles.cashNote}>Pay cash to driver</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {FILTER_OPTIONS.map((opt) => {
          const isActive = selected === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(opt.key)}
              activeOpacity={0.8}
            >
              <AppIcon
                name={opt.icon}
                size={IconSize.sm}
                color={isActive ? Colors.primaryDeep : Colors.textSecondary}
              />
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

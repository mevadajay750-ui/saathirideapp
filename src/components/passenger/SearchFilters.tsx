import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { SortOption } from '@/hooks/useRideSearch';

interface FilterOption {
  key: SortOption;
  label: string;
  emoji: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'departure', label: 'Earliest first', emoji: '🕐' },
  { key: 'price_asc', label: 'Lowest price', emoji: '💸' },
  { key: 'price_desc', label: 'Highest price', emoji: '💎' },
  { key: 'rating', label: 'Top rated', emoji: '⭐' },
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
        <Text style={styles.cashNote}>💵 Pay cash to driver</Text>
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
              <Text style={styles.chipEmoji}>{opt.emoji}</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  countText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  cashNote: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  chips: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  chipEmoji: { fontSize: 13 },
  chipLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipLabelActive: {
    color: Colors.primaryDeep,
    fontFamily: FontFamily.bodySemiBold,
  },
});

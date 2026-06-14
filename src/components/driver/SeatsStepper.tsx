import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { MAX_SEATS } from '@/config/constants';

interface SeatsStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function SeatsStepper({ value, onChange, min = 1, max = MAX_SEATS }: SeatsStepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Available seats</Text>
        <Text style={styles.hint}>Maximum {max} seats (excluding driver)</Text>
      </View>

      <View style={styles.stepper}>
        <TouchableOpacity
          style={[styles.stepBtn, !canDecrement && styles.stepBtnDisabled]}
          onPress={() => canDecrement && onChange(value - 1)}
          disabled={!canDecrement}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon
            name={Icons.remove}
            size={IconSize.lg}
            color={canDecrement ? Colors.primary : Colors.textDisabled}
          />
        </TouchableOpacity>

        <View style={styles.valueWrap}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.valueLabel}>{value === 1 ? 'seat' : 'seats'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.stepBtn, !canIncrement && styles.stepBtnDisabled]}
          onPress={() => canIncrement && onChange(value + 1)}
          disabled={!canIncrement}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon
            name={Icons.add}
            size={IconSize.lg}
            color={canIncrement ? Colors.primary : Colors.textDisabled}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 68,
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  hint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary200,
  },
  stepBtnDisabled: {
    backgroundColor: Colors.gray100,
    borderColor: Colors.gray200,
  },
  valueWrap: {
    alignItems: 'center',
    minWidth: 36,
  },
  value: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
    lineHeight: FontSize.xl * 1.1,
  },
  valueLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

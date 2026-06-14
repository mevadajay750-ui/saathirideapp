import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { MAX_SEATS } from '@/config/constants';
import { styles } from './styles';

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

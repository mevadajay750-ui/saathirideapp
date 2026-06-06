import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
}

const SIZE_MAP = { sm: 20, md: 28, lg: 40 };

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent!',
};

export function StarRating({
  value,
  onChange,
  size = 'md',
  readonly = false,
  showLabel = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const starSize = SIZE_MAP[size];
  const display = readonly ? value : hovered || value;

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= display;
          return (
            <TouchableOpacity
              key={star}
              onPress={() => !readonly && onChange?.(star)}
              onPressIn={() => !readonly && setHovered(star)}
              onPressOut={() => !readonly && setHovered(0)}
              disabled={readonly}
              activeOpacity={readonly ? 1 : 0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={[
                  styles.star,
                  { fontSize: starSize },
                  filled ? styles.starFilled : styles.starEmpty,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {showLabel && display > 0 && <Text style={styles.label}>{LABELS[display]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: Spacing.sm },
  stars: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  star: { lineHeight: undefined },
  starFilled: { color: Colors.accent },
  starEmpty: { color: Colors.gray200 },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
});

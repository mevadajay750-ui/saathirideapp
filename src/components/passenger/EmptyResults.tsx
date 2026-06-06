import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';

type Variant = 'no_results' | 'no_search' | 'error';

interface Props {
  variant: Variant;
  originCity?: string;
  destinationCity?: string;
  date?: string;
  onRetry?: () => void;
  onModifySearch?: () => void;
}

const CONTENT: Record<Variant, { emoji: string; title: string }> = {
  no_search: { emoji: '🔍', title: 'Search for a ride' },
  no_results: { emoji: '🛣️', title: 'No rides found' },
  error: { emoji: '⚠️', title: 'Something went wrong' },
};

export function EmptyResults({
  variant,
  originCity,
  destinationCity,
  date,
  onRetry,
  onModifySearch,
}: Props) {
  const content = CONTENT[variant];

  const body = () => {
    if (variant === 'no_search') {
      return 'Enter your origin, destination, and travel date above to find available rides.';
    }
    if (variant === 'no_results') {
      return [
        originCity && destinationCity
          ? `No rides available from ${originCity} to ${destinationCity}${
              date ? ` on ${date}` : ''
            }.`
          : 'No rides found for your search.',
        '\n\nTry a different date or check back later — drivers post rides daily.',
      ].join('');
    }
    return 'Could not load rides. Please check your connection and try again.';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{content.emoji}</Text>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.body}>{body()}</Text>

      {variant === 'no_results' && onModifySearch && (
        <TouchableOpacity style={styles.btn} onPress={onModifySearch}>
          <Text style={styles.btnText}>Modify search</Text>
        </TouchableOpacity>
      )}

      {variant === 'error' && onRetry && (
        <TouchableOpacity style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['4xl'],
    gap: Spacing.md,
  },
  emoji: { fontSize: 56 },
  title: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.65,
  },
  btn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  btnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
});

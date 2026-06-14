import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize } from '@/theme';
import { Icons, type AppIconName } from '@/theme/icons';
import { AppIcon } from '@/components/common/AppIcon';
import { styles } from './styles';

type Variant = 'no_results' | 'no_search' | 'error';

interface Props {
  variant: Variant;
  originCity?: string;
  destinationCity?: string;
  date?: string;
  onRetry?: () => void;
  onModifySearch?: () => void;
}

const CONTENT: Record<Variant, { icon: AppIconName; title: string }> = {
  no_search: { icon: Icons.search, title: 'Search for a ride' },
  no_results: { icon: Icons.road, title: 'No rides found' },
  error: { icon: Icons.warning, title: 'Something went wrong' },
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
      <AppIcon name={content.icon} size={IconSize['2xl']} color={Colors.gray400} />
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

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { formatRating } from '@/utils/formatters';
import { styles } from './styles';

interface DriverAvatarProps {
  name: string;
  photoUrl?: string;
  rating: number;
  totalRides?: number;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showRating?: boolean;
}

const SIZE_MAP = {
  sm: { avatar: 32, font: FontSize.xs, nameFont: FontSize.sm },
  md: { avatar: 44, font: FontSize.sm, nameFont: FontSize.base },
  lg: { avatar: 64, font: FontSize.base, nameFont: FontSize.md },
};

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function DriverAvatar({
  name,
  photoUrl,
  rating,
  totalRides,
  size = 'md',
  showName = true,
  showRating = true,
}: DriverAvatarProps) {
  const sz = SIZE_MAP[size];

  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={[
              styles.avatar,
              { width: sz.avatar, height: sz.avatar, borderRadius: sz.avatar / 2 },
            ]}
          />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              { width: sz.avatar, height: sz.avatar, borderRadius: sz.avatar / 2 },
            ]}
          >
            <Text style={[styles.avatarInitials, { fontSize: sz.font }]}>{initials(name)}</Text>
          </View>
        )}
      </View>

      {(showName || showRating) && (
        <View style={styles.info}>
          {showName && (
            <Text style={[styles.name, { fontSize: sz.nameFont }]} numberOfLines={1}>
              {name}
            </Text>
          )}
          {showRating && (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={[styles.ratingText, { fontSize: sz.font }]}>{formatRating(rating)}</Text>
              {totalRides !== undefined && totalRides > 0 && (
                <Text style={[styles.ridesText, { fontSize: sz.font }]}>
                  · {totalRides} ride{totalRides !== 1 ? 's' : ''}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

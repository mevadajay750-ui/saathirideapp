import React from 'react';
import { View, Text, Image } from 'react-native';
import { Colors, FontFamily } from '@/theme';
import { styles } from './styles';

interface AvatarProps {
  name?: string;
  photoUrl?: string;
  size?: number;
}

export function Avatar({ name = 'U', photoUrl, size = 48 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

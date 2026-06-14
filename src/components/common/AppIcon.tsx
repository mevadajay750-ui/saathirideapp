import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconSize } from '@/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type AppIconProps = {
  name: IoniconsName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/** Ionicons wrapper — fonts are loaded at startup via loadIconFonts(). */
export function AppIcon({ name, size = IconSize.lg, color, style }: AppIconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

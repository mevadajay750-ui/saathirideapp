import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius } from '@/theme';
import appIcon from '@/assets/images/app-icon.png';

type AppLogoProps = {
  size?: number;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AppLogo({
  size = 64,
  borderRadius = BorderRadius.lg,
  style,
  containerStyle,
}: AppLogoProps) {
  return (
    <Image
      source={appIcon}
      style={[
        styles.logo,
        { width: size, height: size, borderRadius },
        containerStyle as StyleProp<ImageStyle>,
        style,
      ]}
      resizeMode="cover"
      accessibilityLabel="SaathiRide logo"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    overflow: 'hidden',
  },
});

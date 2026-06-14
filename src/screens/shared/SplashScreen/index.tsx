import React from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { Colors, FontSize, FontFamily } from '@/theme';
import { ScreenWrapper } from '@/components/common';
import { styles } from './styles';

export default function SplashScreen() {
  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.container}>
      <Text style={styles.logo}>SaathiRide</Text>
      <ActivityIndicator color={Colors.white} style={styles.spinner} />
    </ScreenWrapper>
  );
}

import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/theme';
import { AppLogo, ScreenWrapper } from '@/components/common';
import { styles } from './styles';

export default function SplashScreen() {
  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.container}>
      <AppLogo size={80} borderRadius={20} />
      <ActivityIndicator color={Colors.white} style={styles.spinner} />
    </ScreenWrapper>
  );
}

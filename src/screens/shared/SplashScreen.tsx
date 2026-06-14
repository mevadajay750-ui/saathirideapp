import React from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, FontSize, FontFamily } from '@/theme';
import { ScreenWrapper } from '@/components/common';

export default function SplashScreen() {
  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.container}>
      <Text style={styles.logo}>SaathiRide</Text>
      <ActivityIndicator color={Colors.white} style={styles.spinner} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    letterSpacing: 1,
  },
  spinner: {
    marginTop: 32,
  },
});

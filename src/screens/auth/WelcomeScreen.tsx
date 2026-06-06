import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, BorderRadius, TextStyles, CommonStyles } from '@/theme';
import { Button } from '@/components/common';
import type { AuthScreenProps } from '@/navigation/types';

type Props = AuthScreenProps<'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.container}>
        {/* Hero area */}
        <View style={[CommonStyles.centerFlex, styles.hero]}>
          {/* Logo mark */}
          <View style={styles.logoMark}>
            <Text style={styles.logoEmoji}>🚗</Text>
          </View>

          {/* App name */}
          <Text style={styles.appName}>SaathiRide</Text>
          <Text style={styles.tagline}>Share the journey</Text>

          {/* Illustration placeholder */}
          <View style={styles.illustration} />

          {/* Hero copy */}
          <Text style={styles.heroTitle}>
            Travel smarter,{'\n'}share the ride
          </Text>
          <Text style={styles.heroSubtitle}>
            Connect with drivers going your way on any intercity route.
            Comfortable travel, shared costs.
          </Text>
        </View>

        {/* CTA footer */}
        <View style={styles.footer}>
          <Button
            label="Get started"
            onPress={() => navigation.navigate('Phone')}
            variant="primary"
            size="lg"
          />

          <View style={[CommonStyles.row, styles.loginRow]}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button
              label="Sign in"
              onPress={() => navigation.navigate('Phone')}
              variant="ghost"
              size="sm"
              fullWidth={false}
            />
          </View>

          <Text style={TextStyles.caption}>
            By continuing you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  hero: {
    paddingTop: Spacing['3xl'],
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    ...TextStyles.display,
    color: Colors.primaryDeep,
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...TextStyles.meta,
    color: Colors.accent,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.4,
    marginBottom: Spacing['3xl'],
  },
  illustration: {
    width: 220,
    height: 180,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryLight,
    marginBottom: Spacing['2xl'],
  },
  heroTitle: {
    ...TextStyles.h1,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    ...TextStyles.body,
    textAlign: 'center',
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  loginRow: {
    justifyContent: 'center',
  },
  loginText: {
    ...TextStyles.meta,
    color: Colors.textMuted,
  },
});

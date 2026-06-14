import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, TextStyles } from '@/theme';

export const styles = StyleSheet.create({
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
    marginBottom: Spacing.md,
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

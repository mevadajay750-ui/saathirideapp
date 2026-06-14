import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  backBtn: {
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    marginBottom: Spacing.md,
    color: Colors.textBrand,
  },
  subtitle: {
    color: Colors.textMuted,
    lineHeight: FontSize.base * 1.6,
  },
  phoneHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primaryDeep,
  },
  otpSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  verifyBtn: {
    marginBottom: Spacing.xl,
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  resendTimer: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  resendTimerCount: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
  },
  resendLink: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  wrongNumberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrongNumberText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  changeLink: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.accent,
  },
  devNote: {
    marginTop: Spacing['2xl'],
    padding: Spacing.base,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  devNoteText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.warningDark,
    lineHeight: FontSize.xs * 1.7,
  },
});

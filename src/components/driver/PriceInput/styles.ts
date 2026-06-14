import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';

export const styles = StyleSheet.create({
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    minHeight: 56,
    overflow: 'hidden',
  },
  inputWrapError: {
    borderColor: Colors.error,
  },
  prefix: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray50,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixSymbol: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
    paddingHorizontal: Spacing.base,
    letterSpacing: 1,
  },
  perSeat: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    paddingRight: Spacing.base,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  suggestLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  chips: {
    gap: Spacing.sm,
    paddingRight: Spacing.base,
  },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.primaryDeep,
    fontFamily: FontFamily.bodySemiBold,
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    padding: Spacing.base,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FDCFA4',
  },
  guidelineText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.accentDark,
    lineHeight: FontSize.xs * 1.7,
  },
});

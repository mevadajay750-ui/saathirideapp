import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, LetterSpacing } from '@/theme';

export const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.48 },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: { marginRight: Spacing.sm },
  iconRight: { marginLeft: Spacing.sm },

  // Sizes
  size_sm: { minHeight: 38, paddingVertical: Spacing.xs + 2, paddingHorizontal: Spacing.md },
  size_md: { minHeight: 50, paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.xl },
  size_lg: { minHeight: 56, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },

  // Variant backgrounds
  variant_primary: { backgroundColor: Colors.primary },
  variant_secondary: { backgroundColor: Colors.primaryLight },
  variant_outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  variant_accent: { backgroundColor: Colors.accent },
  variant_ghost: { backgroundColor: Colors.transparent },
  variant_destructive: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },

  // Labels
  label: {
    fontFamily: FontFamily.headingSemiBold,
    letterSpacing: LetterSpacing.wide,
  },
  label_sm: { fontSize: FontSize.sm },
  label_md: { fontSize: FontSize.base },
  label_lg: { fontSize: FontSize.md },

  label_primary: { color: Colors.white },
  label_secondary: { color: Colors.primary },
  label_outline: { color: Colors.primary },
  label_accent: { color: Colors.white },
  label_ghost: { color: Colors.primary },
  label_destructive: { color: Colors.errorDark },
});

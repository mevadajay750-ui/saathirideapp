import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: Spacing.sm },
  stars: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  star: { lineHeight: undefined },
  starFilled: { color: Colors.accent },
  starEmpty: { color: Colors.gray200 },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
});

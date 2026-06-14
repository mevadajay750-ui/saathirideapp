import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';

const BOX_SIZE = 52;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primaryLight,
  },
  boxFilled: {
    borderColor: Colors.primary200,
    backgroundColor: Colors.primaryLight,
  },
  boxError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  boxDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.gray100,
  },
  digit: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },
});

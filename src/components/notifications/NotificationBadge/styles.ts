import { StyleSheet } from 'react-native';
import { Colors, FontFamily, BorderRadius } from '@/theme';

export const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  count: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.white,
    lineHeight: 13,
  },
});

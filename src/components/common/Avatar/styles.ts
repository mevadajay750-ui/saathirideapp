import { StyleSheet } from 'react-native';
import { Colors, FontFamily } from '@/theme';

export const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.gray200,
  },
  placeholder: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: FontFamily.headingSemiBold,
    color: Colors.primary,
  },
});

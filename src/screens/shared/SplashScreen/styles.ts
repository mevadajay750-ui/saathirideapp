import { StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize } from '@/theme';

export const styles = StyleSheet.create({
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

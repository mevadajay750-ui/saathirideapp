import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/theme';

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
  },
  poppinsBold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.primaryDeep,
    marginBottom: 8,
  },
  poppinsSemiBold: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 8,
  },
  poppinsMedium: {
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  poppinsRegular: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  interBold: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  interSemiBold: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  interMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  interRegular: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  tokenSample: {
    marginBottom: 8,
  },
});

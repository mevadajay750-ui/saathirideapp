import { StyleSheet } from 'react-native';
import { Colors, FontFamily } from '@/theme';

export const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  image: {
    borderWidth: 2,
    borderColor: Colors.primary200,
  },
  placeholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary200,
  },
  initials: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.white,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

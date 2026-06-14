import { StyleSheet } from 'react-native';
import { Colors, FontFamily, Spacing } from '@/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: Colors.primary200,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary200,
  },
  avatarInitials: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.white,
  },
  info: { flex: 1 },
  name: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  star: { fontSize: 11, color: Colors.accent },
  ratingText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textSecondary,
  },
  ridesText: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
  },
});

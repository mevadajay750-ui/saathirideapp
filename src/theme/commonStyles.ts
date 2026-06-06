import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Spacing, BorderRadius, Shadow } from './spacing';

/**
 * Common layout styles shared across screens and components.
 * Import only what you need — do NOT spread the entire object.
 *
 * Usage:
 *   import { CommonStyles } from '@/theme/commonStyles';
 *   <View style={CommonStyles.screenContainer}>
 */
export const CommonStyles = StyleSheet.create({
  // ── Screen layouts ───────────────────────────────────────────────────────
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadded: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },

  // ── Cards ────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  cardBrand: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.borderBrand,
    padding: Spacing.base,
    ...Shadow.card,
  },
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadow.card,
  },

  // ── Rows ─────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // ── Center ───────────────────────────────────────────────────────────────
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Section ──────────────────────────────────────────────────────────────
  sectionTitle: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerHorizontal: {
    width: 1,
    backgroundColor: Colors.divider,
    alignSelf: 'stretch',
  },

  // ── Avatar ───────────────────────────────────────────────────────────────
  avatarSm: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMd: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLg: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Badges ───────────────────────────────────────────────────────────────
  badge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },

  // ── Bottom safe area padding ─────────────────────────────────────────────
  bottomSafe: {
    paddingBottom: Spacing['2xl'],
  },

  // ── Header gradient band (used in screen headers) ─────────────────────
  headerBand: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
});

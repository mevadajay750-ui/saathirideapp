import { TextStyle } from 'react-native';
import { Colors } from './colors';
import { FontFamily, FontSize, LineHeight, LetterSpacing } from './typography';

/**
 * Pre-built TextStyle presets for SaathiRide.
 *
 * Usage:
 *   import { TextStyles } from '@/theme/textStyles';
 *   <Text style={TextStyles.h1}>SaathiRide</Text>
 *   <Text style={[TextStyles.body, { color: Colors.textMuted }]}>Hello</Text>
 */

export const TextStyles = {
  // ── Display ─────────────────────────────────────────────────────────────
  display: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize['3xl'], // 34px
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tighter,
    color: Colors.textBrand,
  } as TextStyle,

  // ── Headings (Poppins) ───────────────────────────────────────────────────
  h1: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize['2xl'], // 28px
    lineHeight: FontSize['2xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
    color: Colors.textBrand,
  } as TextStyle,

  h2: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.xl, // 24px
    lineHeight: FontSize.xl * LineHeight.snug,
    letterSpacing: LetterSpacing.tight,
    color: Colors.textPrimary,
  } as TextStyle,

  h3: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.lg, // 20px
    lineHeight: FontSize.lg * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
    color: Colors.textPrimary,
  } as TextStyle,

  h4: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.md, // 17px
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.textPrimary,
  } as TextStyle,

  // ── Body (Inter) ─────────────────────────────────────────────────────────
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base, // 15px
    lineHeight: FontSize.base * LineHeight.normal,
    color: Colors.textSecondary,
  } as TextStyle,

  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base, // 15px
    lineHeight: FontSize.base * LineHeight.normal,
    color: Colors.textSecondary,
  } as TextStyle,

  bodySemiBold: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base, // 15px
    lineHeight: FontSize.base * LineHeight.normal,
    color: Colors.textPrimary,
  } as TextStyle,

  // ── Meta / supporting ────────────────────────────────────────────────────
  meta: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm, // 13px
    lineHeight: FontSize.sm * LineHeight.normal,
    color: Colors.textMuted,
  } as TextStyle,

  metaMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm, // 13px
    lineHeight: FontSize.sm * LineHeight.normal,
    color: Colors.textMuted,
  } as TextStyle,

  // ── Labels / caps ────────────────────────────────────────────────────────
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs, // 11px
    lineHeight: FontSize.xs * LineHeight.normal,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase',
    color: Colors.primary400,
  } as TextStyle,

  // ── Buttons ──────────────────────────────────────────────────────────────
  buttonLg: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md, // 17px
    letterSpacing: LetterSpacing.wide,
    color: Colors.textInverse,
  } as TextStyle,

  buttonMd: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base, // 15px
    letterSpacing: LetterSpacing.wide,
    color: Colors.textInverse,
  } as TextStyle,

  buttonSm: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm, // 13px
    color: Colors.textInverse,
  } as TextStyle,

  // ── Price ────────────────────────────────────────────────────────────────
  price: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.lg, // 20px
    letterSpacing: LetterSpacing.tight,
    color: Colors.primary,
  } as TextStyle,

  priceLg: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl, // 24px
    letterSpacing: LetterSpacing.tight,
    color: Colors.primary,
  } as TextStyle,

  // ── Rating ───────────────────────────────────────────────────────────────
  rating: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm, // 13px
    color: Colors.accent,
  } as TextStyle,

  // ── Link / interactive text ───────────────────────────────────────────────
  link: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.primary,
  } as TextStyle,

  // ── Caption / disclaimer ─────────────────────────────────────────────────
  caption: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs, // 11px
    lineHeight: FontSize.xs * LineHeight.relaxed,
    color: Colors.textDisabled,
  } as TextStyle,
} as const;

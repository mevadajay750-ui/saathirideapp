/**
 * SaathiRide — Finalized color tokens
 *
 * Primary:  Indigo  (#4B3CC7) — trust, premium, modern
 * Accent:   Saffron (#F97316) — warmth, Indian identity, ratings
 *
 * Usage rule: Always use semantic aliases (textPrimary, surface, border)
 * in components. Use raw stops (primary400, gray300) only in theme files.
 */

export const Colors = {
  // ── Primary: Indigo ────────────────────────────────────────────────────
  primary: '#4B3CC7', // Main CTA buttons, active tab, links
  primaryDark: '#3C3489', // Pressed state, dark headers
  primaryDeep: '#26215C', // Logo text, hero headings, deep contrast
  primary400: '#7F77DD', // Muted icons, secondary text on indigo bg
  primary200: '#C4BFFB', // Focused input border, dividers on tinted bg
  primaryLight: '#EEEDFE', // Chip bg, badge bg, subtle surface tints

  // ── Accent: Saffron ────────────────────────────────────────────────────
  accent: '#F97316', // Star ratings, warm CTAs, highlight badges
  accentDark: '#C2520D', // Accent text on light orange surfaces
  accentLight: '#FEF0E7', // Pending badge bg, warm tint

  // ── Semantic: Success ──────────────────────────────────────────────────
  success: '#16A34A', // Confirmed booking, completed ride, positive
  successDark: '#166534', // Text on successLight bg
  successLight: '#F0FDF4', // Confirmed state background

  // ── Semantic: Warning ──────────────────────────────────────────────────
  warning: '#D97706', // Expiring soon, attention banners
  warningDark: '#92400E', // Text on warningLight bg
  warningLight: '#FFFBEB', // Warning state background

  // ── Semantic: Error ────────────────────────────────────────────────────
  error: '#DC2626', // Validation errors, cancelled states
  errorDark: '#991B1B', // Text on errorLight bg
  errorLight: '#FEF2F2', // Error state background

  // ── Semantic: Info ─────────────────────────────────────────────────────
  info: '#0EA5E9', // Informational banners
  infoDark: '#0369A1',
  infoLight: '#F0F9FF',

  // ── Neutrals ───────────────────────────────────────────────────────────
  gray900: '#111827', // Primary text
  gray700: '#374151', // Secondary text, body
  gray500: '#6B7280', // Muted text, placeholders
  gray400: '#9CA3AF', // Disabled text, inactive icons
  gray300: '#D1D5DB', // Dividers, subtle borders
  gray200: '#E5E7EB', // Card borders, input borders
  gray100: '#F3F4F6', // Section backgrounds, separator tint
  gray50: '#F9FAFB', // App background

  // ── Base ───────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // ── Semantic aliases — USE THESE IN ALL COMPONENTS ────────────────────
  // Backgrounds
  background: '#F9FAFB', // Screen background (gray50)
  surface: '#FFFFFF', // Card, sheet, input background
  surfaceTinted: '#EEEDFE', // Lightly branded surface (primaryLight)

  // Borders
  border: '#E5E7EB', // Default border (gray200)
  borderFocus: '#C4BFFB', // Input focused border (primary200)
  borderBrand: '#E0DEFF', // Ride card border (warm indigo tint)
  divider: '#F3F4F6', // List separators (gray100)

  // Text
  textPrimary: '#111827', // Main readable text (gray900)
  textSecondary: '#374151', // Supporting text (gray700)
  textMuted: '#6B7280', // Placeholders, timestamps (gray500)
  textDisabled: '#9CA3AF', // Disabled state (gray400)
  textInverse: '#FFFFFF', // Text on dark/colored backgrounds
  textBrand: '#26215C', // Logo, hero headings (primaryDeep)
  textAccent: '#F97316', // Star ratings, warm highlights

  // Scrim
  scrim: 'rgba(26, 21, 92, 0.45)', // Bottom sheet, modal overlay
} as const;

export type ColorKey = keyof typeof Colors;

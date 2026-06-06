/**
 * SaathiRide — Typography tokens
 *
 * Poppins  → headings, buttons, bold labels  (warm, friendly, modern)
 * Inter    → body text, inputs, meta info    (clean, readable, neutral)
 *
 * These font names MUST match the .ttf filenames exactly
 * (without the extension) as registered in Info.plist and assets/fonts/.
 */

export const FontFamily = {
  // Poppins — display / headings / CTAs
  heading: 'Poppins-Bold',
  headingSemiBold: 'Poppins-SemiBold',
  headingMedium: 'Poppins-Medium',
  headingRegular: 'Poppins-Regular',

  // Inter — body / inputs / meta
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',
} as const;

/**
 * Font size scale — 4pt base unit
 * All sizes are in logical pixels (same as pt on iOS, dp on Android)
 */
export const FontSize = {
  xs: 11, // ALL CAPS section labels, legal disclaimers
  sm: 13, // Meta info, timestamps, ratings, seat counts
  base: 15, // Body text, ride notes, form helper text
  md: 17, // Card titles, section headings
  lg: 20, // Screen titles, modal headings
  xl: 24, // Large headings
  '2xl': 28, // Hero text on Welcome/Splash
  '3xl': 34, // Display / app name
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
} as const;

export const LineHeight = {
  none: 1.0,
  tight: 1.2, // Display headings
  snug: 1.35, // Card titles
  normal: 1.5, // Body paragraphs
  relaxed: 1.65, // Long-form text
  loose: 1.8, // Accessibility-friendly long content
} as const;

export const LetterSpacing = {
  tighter: -0.8, // Large display text
  tight: -0.4, // Headings
  normal: 0, // Default
  wide: 0.3, // Subtle spacing
  wider: 0.6, // ALL CAPS labels only
  widest: 1.2, // Decorative caps
} as const;

/**
 * SaathiRide — Spacing & shape tokens
 * Base unit: 4px
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;

export const BorderRadius = {
  xs: 4, // Tight: small inline badges
  sm: 6, // Compact chips, small tags
  md: 10, // DEFAULT: inputs, buttons, small cards
  lg: 14, // Cards, ride cards, bottom sheets
  xl: 20, // Large modals, prominent containers
  '2xl': 28, // Splash logo box, hero containers
  full: 9999, // Pills, avatar circles, FABs
} as const;

/**
 * Shadow presets — use sparingly, only on floating elements
 * Not for list items or flat cards (use border instead)
 */
export const Shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#26215C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#26215C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  modal: {
    shadowColor: '#26215C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  fab: {
    shadowColor: '#4B3CC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const IconSize = {
  xs: 14, // Inline with small text
  sm: 18, // Inline with body text
  md: 20, // Input prefix/suffix, compact UI
  lg: 24, // Tab bar, standard buttons
  xl: 32, // Section icons, empty state
  '2xl': 48, // Hero illustrations, onboarding
} as const;

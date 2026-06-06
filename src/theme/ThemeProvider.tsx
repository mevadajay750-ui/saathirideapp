import React, { createContext, useContext, useMemo, useState } from 'react';
import { Colors } from './colors';
import type { ColorKey } from './colors';

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = { [K in ColorKey]: string };

export type Theme = {
  colors: ThemeColors;
  colorScheme: ColorScheme;
  isDark: boolean;
};

type ThemeContextValue = Theme & {
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

/** Dark palette placeholder — extend when dark mode ships. */
const darkColors: ThemeColors = {
  ...Colors,
  background: Colors.gray900,
  surface: '#1F2937',
  textPrimary: Colors.gray50,
  textSecondary: Colors.gray200,
  textMuted: Colors.gray400,
  border: Colors.gray700,
  divider: '#1F2937',
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
  initialColorScheme?: ColorScheme;
};

export function ThemeProvider({
  children,
  initialColorScheme = 'light',
}: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(initialColorScheme);

  const value = useMemo<ThemeContextValue>(() => {
    const colors: ThemeColors = colorScheme === 'dark' ? darkColors : { ...Colors };

    return {
      colors,
      colorScheme,
      isDark: colorScheme === 'dark',
      setColorScheme,
      toggleColorScheme: () =>
        setColorScheme(prev => (prev === 'light' ? 'dark' : 'light')),
    };
  }, [colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/** Convenience hook for a single semantic color token. */
export function useThemeColor(key: ColorKey): string {
  const { colors } = useTheme();
  return colors[key];
}

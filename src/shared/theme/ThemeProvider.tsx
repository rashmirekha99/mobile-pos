import React, { createContext, useState, ReactNode } from 'react';
import { LightColors, DarkColors } from './colors';
import { metrics } from './metrics';
import { ThemeContextType, ThemeMode } from './types';

export const ThemeContext = createContext<ThemeContextType>({
  colors: LightColors,
  metrics: metrics,
  isDark: false,
  themeMode: 'light',
  setThemeMode: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  const colors = themeMode === 'dark' ? DarkColors : LightColors;
  const isDark = themeMode === 'dark';

  return (
    <ThemeContext.Provider
      value={{ colors, metrics, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

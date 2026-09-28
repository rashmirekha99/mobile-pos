import { LightColors } from './colors';
import { metrics } from './metrics';

export type ThemeMode = 'dark' | 'light';

export type ThemeColors = typeof LightColors;
export type ThemeMetrics = typeof metrics;

export type ThemeContextType = {
  colors: ThemeColors;
  metrics: ThemeMetrics;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

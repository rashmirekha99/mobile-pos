import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  padding: {
    screen: 16,
    card: 16,
  },
  icon: {
    small: 16,
    medium: 24,
    large: 32,
  },
} as const;

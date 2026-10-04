import React from 'react';
import { View, Text, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../theme/useTheme';
import GetMainButtonStyles from './MainButtonStyles';

const GRADIENT_COLORS = ['#02078A', '#010450', '#01022E'];
const GRADIENT_LOCATIONS = [0, 0.55, 1];

interface MainButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
  danger?: boolean;
  compact?: boolean;
}

const MainButton = ({ title, onPress, disabled = false, outline = false, danger = false, compact = false }: MainButtonProps) => {
  const { colors } = useTheme();
  const styles = GetMainButtonStyles(colors);

  return (
    <View style={compact ? styles.compactContainer : styles.container}>
      <Pressable
        style={({ pressed }) => [
          compact ? styles.compactButton : outline ? styles.outlineButton : styles.button,
          danger && { backgroundColor: colors.DELETE_RED, borderColor: colors.DELETE_RED },
          disabled && styles.buttonDisabled,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={onPress}
        disabled={disabled}>
        {!outline && !disabled && !danger && (
          <LinearGradient
            colors={GRADIENT_COLORS}
            locations={GRADIENT_LOCATIONS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        )}
        <Text style={compact ? styles.compactText : danger ? styles.buttonText : outline ? styles.outlineText : styles.buttonText}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

export default MainButton;

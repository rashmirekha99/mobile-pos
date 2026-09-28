import React from 'react';
import { View, Text, Pressable } from 'react-native';
import useTheme from '../theme/useTheme';
import GetMainButtonStyles from './MainButtonStyles';

interface MainButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
}

const MainButton = ({ title, onPress, disabled = false, outline = false }: MainButtonProps) => {
  const { colors } = useTheme();
  const styles = GetMainButtonStyles(colors);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          outline ? styles.outlineButton : styles.button,
          disabled && styles.buttonDisabled,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={outline ? styles.outlineText : styles.buttonText}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

export default MainButton;

import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme/types';
import { fonts } from '../theme';

const GetMainButtonStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      height: 48,
      borderRadius: 12,
      overflow: 'hidden',
    },
    compactContainer: {
      width: 164,
      height: 36,
      alignSelf: 'flex-end',
      marginTop: 8,
      borderRadius: 9,
      overflow: 'hidden',
    },
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 24,
      overflow: 'hidden',
    },
    compactButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 9,
      paddingHorizontal: 12,
      overflow: 'hidden',
    },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 12,
    },
    buttonDisabled: {
      backgroundColor: colors.TEXT_TERTIARY,
    },
    buttonText: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_WHITE,
    },
    compactText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
    outlineButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 24,
      borderWidth: 1.5,
      borderColor: colors.PRIMARY,
      backgroundColor: 'transparent',
    },
    outlineText: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.PRIMARY,
    },
  });
};

export default GetMainButtonStyles;

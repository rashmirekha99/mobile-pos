import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../theme/types';
import { fonts } from '../theme';

const GetAppBarStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      paddingTop: Platform.OS === 'ios' ? 50 : 16,
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.APPBAR_BACKGROUND,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    titleText: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '600',
      color: colors.APPBAR_TITLE,
      textAlign: 'center',
    },
    iconPlaceholder: {
      width: 36,
      height: 36,
    },
    rightButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightDangerButton: {
      minWidth: 72,
      height: 36,
      paddingHorizontal: 12,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.DELETE_RED,
    },
    rightDangerText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
  });
};

export default GetAppBarStyles;

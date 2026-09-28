import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme/types';

const GetCommonStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    card: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    emptyText: {
      fontSize: 16,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      marginTop: 40,
    },
  });
};

export default GetCommonStyles;

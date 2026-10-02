import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetProductListScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    searchInput: {
      backgroundColor: colors.INPUT_BACKGROUND,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: fonts.FONT_SIZE_14,
      color: colors.INPUT_TEXT,
      borderWidth: 1,
      borderColor: colors.INPUT_BORDER,
    },
    listContent: {
      paddingBottom: 80,
    },
    emptyText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      marginTop: 60,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 80,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      overflow: 'hidden',
    },
    fabGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
    },
    fabText: {
      fontSize: fonts.FONT_SIZE_28,
      color: '#FFFFFF',
      fontWeight: '300',
      marginTop: -2,
    },
  });
};

export default GetProductListScreenStyles;

import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/theme/types';
import { fonts } from '../../../shared/theme';

const GetProductCardStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    sku: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    price: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '700',
      color: colors.PRIMARY,
      marginTop: 4,
    },
    tagRow: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 6,
      flexWrap: 'wrap',
    },
    barcodeTag: {
      fontSize: fonts.FONT_SIZE_10,
      color: colors.TEXT_WHITE,
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      overflow: 'hidden',
    },
    stockTag: {
      fontSize: fonts.FONT_SIZE_10,
      color: colors.TEXT_WHITE,
      backgroundColor: colors.ACCENT,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      overflow: 'hidden',
    },
    stockTagLow: {
      backgroundColor: colors.WARNING,
      color: '#333',
    },
    stockTagOut: {
      backgroundColor: colors.ERROR,
      color: colors.TEXT_WHITE,
    },
    chevron: {
      fontSize: fonts.FONT_SIZE_20,
      color: colors.TEXT_TERTIARY,
      marginLeft: 8,
    },
  });
};

export default GetProductCardStyles;

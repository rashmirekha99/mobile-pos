import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/theme/types';
import { fonts } from '../../../shared/theme';

const GetCartItemRowStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.CARD_BACKGROUND,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    price: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_SECONDARY,
      marginTop: 2,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    qtyButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.QUANTITY_BUTTON,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qtyButtonText: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
    quantity: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      minWidth: 24,
      textAlign: 'center',
    },
    subtotal: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.PRIMARY,
      minWidth: 80,
      textAlign: 'right',
      marginLeft: 12,
    },
    deleteButton: {
      marginLeft: 8,
      padding: 4,
    },
    deleteText: {
      fontSize: fonts.FONT_SIZE_18,
      color: colors.DELETE_RED,
      fontWeight: '700',
    },
  });
};

export default GetCartItemRowStyles;

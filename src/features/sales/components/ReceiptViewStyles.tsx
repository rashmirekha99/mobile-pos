import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/theme/types';
import { fonts } from '../../../shared/theme';

const GetReceiptViewStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.RECEIPT_BACKGROUND,
      borderRadius: 12,
      padding: 24,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.RECEIPT_BORDER,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    storeName: {
      fontSize: fonts.FONT_SIZE_20,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    receiptTitle: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
      marginTop: 4,
    },
    dateText: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 4,
    },
    receiptId: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
      borderStyle: 'dashed',
      marginVertical: 12,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: 6,
    },
    itemName: {
      flex: 1,
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_PRIMARY,
    },
    itemQty: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
      marginHorizontal: 12,
      minWidth: 40,
      textAlign: 'center',
    },
    itemSubtotal: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      minWidth: 80,
      textAlign: 'right',
    },
    columnHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    columnHeaderText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.TEXT_SECONDARY,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    totalLabel: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    totalAmount: {
      fontSize: fonts.FONT_SIZE_20,
      fontWeight: '800',
      color: colors.PRIMARY,
    },
    footer: {
      alignItems: 'center',
      marginTop: 16,
    },
    thankYou: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    footerNote: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 4,
    },
  });
};

export default GetReceiptViewStyles;

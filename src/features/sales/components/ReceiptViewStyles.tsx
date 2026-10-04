import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/theme/types';
import { fonts } from '../../../shared/theme';

const GetReceiptViewStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.RECEIPT_BACKGROUND,
      padding: 12,
      borderRadius: 0,
      marginHorizontal: 0,
      borderWidth: 0,
    },
    header: {
      alignItems: 'center',
      marginBottom: 8,
    },
    storeName: {
      fontSize: fonts.FONT_SIZE_20,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      textAlign: 'center',
    },
    storeAddress: {
      fontSize: fonts.FONT_SIZE_10,
      color: '#000000',
      fontWeight: '700',
      marginTop: 1,
    },
    receiptTitle: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
      marginTop: 2,
    },
    dateText: {
      fontSize: fonts.FONT_SIZE_12,
      color: '#000000',
      fontWeight: '600',
      marginTop: 2,
    },
    receiptId: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: '#777777',
      borderStyle: 'dashed',
      marginVertical: 6,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: 3,
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
      paddingVertical: 3,
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
      paddingVertical: 4,
    },
    subtotalLabel: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
    },
    subtotalAmount: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
    },
    discountLabel: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.ERROR,
    },
    discountAmount: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.ERROR,
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
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 2,
    },
    paymentLabel: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_SECONDARY,
    },
    paymentAmount: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_PRIMARY,
    },
    paymentChange: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    footer: {
      alignItems: 'center',
      marginTop: 2,
    },
    thankYou: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    footerNote: {
      fontSize: fonts.FONT_SIZE_14,
      color: '#000000',
      fontWeight: '700',
      marginTop: 2,
      marginBottom: 24,
    },
  });
};

export default GetReceiptViewStyles;

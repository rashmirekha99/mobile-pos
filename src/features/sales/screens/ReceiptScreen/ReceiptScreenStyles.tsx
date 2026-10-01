import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetReceiptScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      paddingVertical: 20,
      paddingBottom: 40,
    },
    printRow: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 20,
      gap: 12,
    },
    buttonWrapper: {
      flex: 1,
    },
    loadingText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
      marginTop: 40,
    },
    editContainer: {
      marginHorizontal: 16,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.BORDER,
    },
    editTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 4,
    },
    editHint: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginBottom: 16,
    },
    editItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
    },
    editItemInfo: {
      flex: 1,
    },
    editItemName: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    editItemDetail: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_SECONDARY,
      marginTop: 2,
    },
    removeItemButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.DELETE_RED,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
    },
    removeItemButtonText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
    editTotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      marginBottom: 16,
    },
    editTotalLabel: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    editTotalValue: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '800',
      color: colors.PRIMARY,
    },
    deleteSaleButton: {
      backgroundColor: colors.DELETE_RED,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    deleteSaleButtonText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
  });
};

export default GetReceiptScreenStyles;

import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetInventoryScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryValue: {
      fontSize: fonts.FONT_SIZE_24,
      fontWeight: '800',
      color: colors.PRIMARY,
    },
    summaryValueGreen: {
      color: colors.ACCENT,
    },
    summaryValueOrange: {
      color: colors.WARNING,
    },
    summaryLabel: {
      fontSize: fonts.FONT_SIZE_10,
      color: colors.TEXT_SECONDARY,
      marginTop: 4,
      fontWeight: '500',
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 12,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 12,
    },
    viewTransactionsBtn: {
      backgroundColor: colors.PRIMARY_LIGHT,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    viewTransactionsBtnText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.PRIMARY,
    },
    tableContainer: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: colors.REPORT_HEADER,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    tableHeaderText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
    tableRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
      alignItems: 'center',
    },
    tableRowAlt: {
      backgroundColor: colors.REPORT_ROW_ALT,
    },
    colName: {
      flex: 2,
    },
    colStock: {
      flex: 1,
      textAlign: 'center',
    },
    colSold: {
      flex: 1,
      textAlign: 'center',
    },
    cellText: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_PRIMARY,
    },
    cellBold: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    stockLow: {
      color: colors.WARNING,
      fontWeight: '700',
    },
    stockOut: {
      color: colors.ERROR,
      fontWeight: '700',
    },
    emptyText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      marginTop: 40,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    actionButton: {
      flex: 1,
    },
  });
};

export default GetInventoryScreenStyles;

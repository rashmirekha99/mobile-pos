import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetDailyReportScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    dateContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    dateText: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    dateLabel: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryValue: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '800',
      color: colors.PRIMARY,
    },
    summaryLabel: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_SECONDARY,
      marginTop: 4,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 12,
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
      minWidth: '100%',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: colors.REPORT_HEADER,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    tableHeaderText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
    tableRow: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
    },
    tableRowAlt: {
      backgroundColor: colors.REPORT_ROW_ALT,
    },
    tableCell: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_PRIMARY,
    },
    tableCellBold: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    colProduct: {
      width: 120,
      paddingRight: 8,
    },
    colSupplier: {
      width: 90,
      paddingRight: 8,
    },
    colQty: {
      width: 40,
      textAlign: 'center',
    },
    colCost: {
      width: 80,
      textAlign: 'right',
    },
    colRevenue: {
      width: 80,
      textAlign: 'right',
    },
    colProfit: {
      width: 80,
      textAlign: 'right',
    },
    emptyReport: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      marginTop: 40,
    },
    transactionsContainer: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    transactionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
    },
    transactionRowLast: {
      borderBottomWidth: 0,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionId: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    transactionTime: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    transactionRight: {
      alignItems: 'flex-end',
    },
    transactionAmount: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.PRIMARY,
    },
    transactionItems: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_SECONDARY,
      marginTop: 2,
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

export default GetDailyReportScreenStyles;

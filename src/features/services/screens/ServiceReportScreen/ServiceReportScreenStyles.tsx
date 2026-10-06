import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetServiceReportScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    dateRangeRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    dateFieldContainer: {
      flex: 1,
    },
    dateFieldLabel: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '600',
      color: colors.TEXT_SECONDARY,
      marginBottom: 4,
    },
    dateFieldRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    dateArrowBtn: {
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    dateArrowText: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.PRIMARY,
    },
    dateValueBtn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
    },
    dateValueText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    calendarContainer: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      marginTop: 8,
      padding: 12,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 4,
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    calendarNavText: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.PRIMARY,
      paddingHorizontal: 8,
    },
    calendarMonthText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    calendarWeekRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    calendarWeekDay: {
      flex: 1,
      textAlign: 'center',
      fontSize: fonts.FONT_SIZE_10,
      fontWeight: '600',
      color: colors.TEXT_TERTIARY,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    calendarDayBtn: {
      width: '14.28%',
      alignItems: 'center',
      paddingVertical: 6,
      borderRadius: 8,
    },
    calendarDayActive: {
      backgroundColor: colors.PRIMARY,
    },
    calendarDayText: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_PRIMARY,
    },
    calendarDayActiveText: {
      color: colors.TEXT_WHITE,
      fontWeight: '700',
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
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
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
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_PRIMARY,
    },
    tableCellBold: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    colService: {
      flex: 1,
      paddingRight: 8,
    },
    colCount: {
      width: 60,
      textAlign: 'center',
    },
    colRevenue: {
      width: 100,
      textAlign: 'right',
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
    transactionName: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    transactionTime: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.PRIMARY,
    },
    emptyText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      marginTop: 40,
    },
  });
};

export default GetServiceReportScreenStyles;

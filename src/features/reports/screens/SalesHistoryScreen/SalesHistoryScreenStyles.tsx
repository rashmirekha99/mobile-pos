import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetSalesHistoryScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    listContent: {
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
    emptyText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      marginTop: 60,
    },
  });
};

export default GetSalesHistoryScreenStyles;

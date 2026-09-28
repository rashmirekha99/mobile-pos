import { StyleSheet, Dimensions } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const SCREEN_PADDING = 16;
const CARD_SIZE = (SCREEN_WIDTH - SCREEN_PADDING * 2 - CARD_GAP) / 2;

const GetDashboardScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    greeting: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
      marginBottom: 4,
    },
    title: {
      fontSize: fonts.FONT_SIZE_24,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      marginBottom: 20,
    },
    summaryContainer: {
      backgroundColor: colors.DASHBOARD_SUMMARY_BG,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_SECONDARY,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    summaryItem: {
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: fonts.FONT_SIZE_24,
      fontWeight: '800',
      color: colors.PRIMARY,
    },
    summaryLabel: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 12,
    },
    gridRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: CARD_GAP,
    },
    gridCard: {
      width: CARD_SIZE,
      height: CARD_SIZE,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    gridTextIcon: {
      fontSize: 42,
    },
    gridTitle: {
      marginTop: 12,
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
      textAlign: 'center',
    },
    lowStockContainer: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.WARNING,
    },
    lowStockRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
    },
    lowStockName: {
      flex: 1,
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '500',
      color: colors.TEXT_PRIMARY,
    },
    lowStockQty: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.WARNING,
      minWidth: 40,
      textAlign: 'right',
    },
    lowStockOut: {
      color: colors.ERROR,
    },
  });
};

export default GetDashboardScreenStyles;

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
      padding: SCREEN_PADDING,
      paddingBottom: 40,
    },

    // Header
    headerSection: {
      marginBottom: 20,
    },
    greeting: {
      fontSize: fonts.FONT_SIZE_24,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      marginBottom: 2,
    },
    dateText: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_TERTIARY,
    },

    // Summary cards
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 28,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    summaryCardRevenue: {
      marginRight: CARD_GAP / 2,
    },
    summaryCardSales: {
      marginLeft: CARD_GAP / 2,
    },
    summaryIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    summaryEmoji: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
    },
    summaryValue: {
      fontSize: fonts.FONT_SIZE_24,
      fontWeight: '800',
      marginBottom: 2,
    },
    summaryLabel: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      fontWeight: '500',
    },

    // Section titles
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 14,
    },

    // Action grid
    gridRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: CARD_GAP,
    },
    gridCard: {
      width: CARD_SIZE,
      height: CARD_SIZE * 0.85,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    gridCardOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#00000010',
      borderRadius: 20,
    },
    gridCardContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
    },
    gridCardTextWrap: {
      alignItems: 'center',
      marginTop: 10,
    },
    gridTextIcon: {
      fontSize: 38,
    },
    gridTitle: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
      textAlign: 'center',
    },
    gridSubtitle: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '400',
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      marginTop: 2,
    },

    // Low stock section
    lowStockSection: {
      marginTop: 28,
    },
    lowStockHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    lowStockHeaderText: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    lowStockBadge: {
      backgroundColor: colors.ERROR,
      borderRadius: 10,
      minWidth: 22,
      height: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      paddingHorizontal: 6,
    },
    lowStockBadgeText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
    lowStockContainer: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    lowStockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
    },
    lowStockRowLast: {
      borderBottomWidth: 0,
    },
    lowStockDot: {
      marginRight: 12,
    },
    lowStockDotInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    lowStockName: {
      flex: 1,
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '500',
      color: colors.TEXT_PRIMARY,
    },
    lowStockQtyBadge: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      minWidth: 40,
      alignItems: 'center',
    },
    lowStockQty: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.WARNING,
    },
    lowStockOut: {
      color: colors.ERROR,
    },
  });
};

export default GetDashboardScreenStyles;

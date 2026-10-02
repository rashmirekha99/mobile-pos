import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const SCREEN_PADDING = 16;
const CARD_GAP = 12;

const GetDashboardScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      paddingBottom: 40,
    },

    // Hero
    hero: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 74,
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
      overflow: 'hidden',
    },
    heroCircleLarge: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255,255,255,0.07)',
      right: -70,
      top: -90,
    },
    heroCircleSmall: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: 'rgba(255,255,255,0.07)',
      right: 50,
      bottom: -80,
    },
    heroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    logoBox: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor: 'rgba(255,255,255,0.16)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    brandText: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    pill: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '600',
      backgroundColor: 'rgba(255,255,255,0.16)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 99,
      color: '#FFFFFF',
      overflow: 'hidden',
    },
    heroGreeting: {
      marginTop: 26,
    },
    heroDate: {
      fontSize: fonts.FONT_SIZE_14,
      color: 'rgba(255,255,255,0.75)',
    },
    heroTitle: {
      fontSize: fonts.FONT_SIZE_28,
      fontWeight: '800',
      color: '#FFFFFF',
      marginTop: 2,
      letterSpacing: -0.3,
    },

    // Stats
    statsSection: {
      paddingHorizontal: SCREEN_PADDING,
      marginTop: -48,
    },
    statsRow: {
      flexDirection: 'row',
      gap: CARD_GAP,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 22,
      padding: 16,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 30,
      elevation: 8,
    },
    statIconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.PRIMARY + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statLabel: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      fontWeight: '600',
    },
    statValue: {
      fontSize: fonts.FONT_SIZE_24,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      marginTop: 2,
      letterSpacing: -0.4,
    },

    // Section title
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      marginTop: 26,
      marginBottom: 12,
      marginHorizontal: SCREEN_PADDING + 4,
    },

    // Action grid
    actionsGrid: {
      paddingHorizontal: SCREEN_PADDING,
      gap: CARD_GAP,
    },

    // Primary action (New Sale)
    primaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      borderRadius: 22,
      padding: 20,
      overflow: 'hidden',
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 26,
      elevation: 10,
    },
    primaryCircle: {
      position: 'absolute',
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: 'rgba(255,255,255,0.08)',
      right: -30,
      bottom: -60,
    },
    primaryIconBox: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    primaryTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    primarySubtitle: {
      fontSize: fonts.FONT_SIZE_14,
      color: '#c4c8ff',
      marginTop: 2,
    },
    primaryChevron: {
      position: 'absolute',
      right: 14,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.18)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    chevronText: {
      fontSize: fonts.FONT_SIZE_16,
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // Regular action cards
    actionsRow: {
      flexDirection: 'row',
      gap: CARD_GAP,
    },
    actionCard: {
      flex: 1,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 22,
      padding: 16,
      minHeight: 122,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    actionIconBox: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.PRIMARY + '12',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    actionTitle: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    actionSubtitle: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      fontWeight: '500',
      marginTop: 2,
    },
    actionChevron: {
      position: 'absolute',
      right: 14,
      top: 14,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.MAIN_BACKGROUND,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionChevronText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_TERTIARY,
      fontWeight: '600',
    },

    // Low stock alert
    alertSection: {
      marginTop: 26,
      marginHorizontal: SCREEN_PADDING,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 22,
      padding: 16,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6,
    },
    alertIconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: '#fde8e8',
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertTitle: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
    },
    alertItem: {
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.DIVIDER,
    },
    alertItemFirst: {
      marginTop: 8,
    },
    alertItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    alertItemName: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    alertItemQty: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.ERROR,
    },
    alertBar: {
      height: 6,
      borderRadius: 9,
      backgroundColor: colors.DIVIDER,
      overflow: 'hidden',
    },
    alertBarFill: {
      height: '100%',
      borderRadius: 9,
      backgroundColor: colors.ERROR,
    },
  });
};

export default GetDashboardScreenStyles;

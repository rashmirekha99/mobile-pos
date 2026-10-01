import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetPrinterSettingsScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    statusCard: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusLabel: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_TERTIARY,
    },
    statusValue: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      marginTop: 4,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 12,
      marginTop: 8,
    },
    scanButton: {
      backgroundColor: colors.PRIMARY,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 16,
    },
    scanButtonText: {
      color: colors.TEXT_WHITE,
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
    },
    disconnectButton: {
      backgroundColor: colors.ERROR,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 16,
    },
    disconnectButtonText: {
      color: colors.TEXT_WHITE,
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
    },
    deviceList: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 20,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    deviceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.DIVIDER,
    },
    deviceRowLast: {
      borderBottomWidth: 0,
    },
    deviceName: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '500',
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    deviceAddress: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    connectText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.PRIMARY,
    },
    paperWidthRow: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    paperWidthOption: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.BORDER,
      alignItems: 'center',
      marginHorizontal: 6,
      backgroundColor: colors.CARD_BACKGROUND,
    },
    paperWidthOptionActive: {
      borderColor: colors.PRIMARY,
      backgroundColor: colors.PRIMARY_LIGHT,
    },
    paperWidthText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_SECONDARY,
    },
    paperWidthTextActive: {
      color: colors.PRIMARY,
    },
    testButton: {
      backgroundColor: colors.ACCENT,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 16,
    },
    testButtonText: {
      color: colors.TEXT_WHITE,
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
    },
    emptyText: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      paddingVertical: 20,
    },
    loadingText: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      paddingVertical: 12,
    },
  });
};

export default GetPrinterSettingsScreenStyles;

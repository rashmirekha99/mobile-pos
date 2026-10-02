import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetPrinterSettingsScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    heroContainer: {
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
      paddingBottom: 64,
    },
    heroCircle1: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255,255,255,0.07)',
      right: -70,
      top: -90,
    },
    heroCircle2: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: 'rgba(255,255,255,0.07)',
      right: 50,
      bottom: -80,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 18,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      marginRight: 40,
    },
    scrollView: {
      marginTop: -40,
      zIndex: 1,
    },
    mainContent: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    // Status card
    statusCard: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 16,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 30,
      elevation: 6,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusLabel: {
      fontSize: 12,
      color: colors.TEXT_TERTIARY,
      fontWeight: '600',
    },
    statusValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      marginTop: 2,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.MAIN_BACKGROUND,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 99,
    },
    badgeConnected: {
      backgroundColor: '#e3f7ef',
    },
    badgeDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: colors.TEXT_TERTIARY,
    },
    badgeDotConnected: {
      backgroundColor: '#12b886',
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.TEXT_TERTIARY,
    },
    badgeTextConnected: {
      color: '#0c8a62',
    },
    // Scan button
    scanButton: {
      borderRadius: 18,
      paddingVertical: 17,
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 26,
      elevation: 8,
      overflow: 'hidden',
    },
    scanButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Disconnect button
    disconnectButton: {
      borderRadius: 18,
      paddingVertical: 17,
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: '#e5484d',
      shadowColor: '#e5484d',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 8,
    },
    disconnectButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Device list
    devicesContainer: {
      marginTop: 12,
      gap: 10,
    },
    deviceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 12,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    deviceIconBox: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: colors.PRIMARY_LIGHT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deviceInfo: {
      flex: 1,
    },
    deviceName: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    deviceAddress: {
      fontSize: 12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    connectText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.PRIMARY,
    },
    // Section title
    sectionTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.TEXT_PRIMARY,
      marginTop: 26,
      marginBottom: 12,
      marginLeft: 4,
    },
    // Paper width options
    paperWidthRow: {
      flexDirection: 'row',
      gap: 12,
    },
    paperWidthOption: {
      flex: 1,
      backgroundColor: colors.CARD_BACKGROUND,
      borderWidth: 2,
      borderColor: colors.BORDER,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 10,
      alignItems: 'center',
      gap: 8,
    },
    paperWidthOptionActive: {
      backgroundColor: colors.PRIMARY_LIGHT,
      borderColor: colors.PRIMARY,
    },
    paperStrip: {
      height: 30,
      borderRadius: 4,
    },
    paperWidthText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.TEXT_TERTIARY,
    },
    paperWidthTextActive: {
      color: colors.PRIMARY,
    },
    // Test print button
    testButton: {
      borderRadius: 18,
      paddingVertical: 17,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      shadowColor: '#00b894',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 8,
      overflow: 'hidden',
    },
    testButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Toast
    toastContainer: {
      position: 'absolute',
      bottom: 24,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    toast: {
      backgroundColor: colors.TEXT_PRIMARY,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 99,
    },
    toastText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};

export default GetPrinterSettingsScreenStyles;

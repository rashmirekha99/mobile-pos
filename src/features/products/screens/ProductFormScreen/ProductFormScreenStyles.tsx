import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetProductFormScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    flex: {
      flex: 1,
    },
    // Hero
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
    // Scroll
    scrollView: {
      marginTop: -40,
      zIndex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      gap: 14,
    },
    // Cards
    card: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 22,
      padding: 18,
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 30,
      elevation: 6,
      gap: 16,
    },
    cardSecondary: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.PRIMARY,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    // Field
    fieldContainer: {
      gap: 0,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 7,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
    },
    required: {
      color: '#e5484d',
      marginLeft: 3,
    },
    input: {
      backgroundColor: colors.MAIN_BACKGROUND,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 15,
      fontWeight: '500',
      color: colors.INPUT_TEXT,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    inputFocused: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderColor: colors.PRIMARY,
    },
    // Margin badge
    marginBadge: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 99,
      overflow: 'hidden',
    },
    marginBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Supplier dropdown
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.MAIN_BACKGROUND,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    dropdownButtonText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.INPUT_TEXT,
      flex: 1,
    },
    dropdownPlaceholder: {
      color: '#a9acc9',
    },
    dropdownArrow: {
      width: 8,
      height: 8,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      borderColor: colors.TEXT_TERTIARY,
      transform: [{ rotate: '45deg' }],
      marginLeft: 8,
    },
    // Two columns
    twoColumns: {
      flexDirection: 'row',
      gap: 12,
    },
    columnItem: {
      flex: 1,
    },
    // Barcode type options
    barcodeTypeRow: {
      flexDirection: 'row',
      gap: 10,
    },
    barcodeTypeOption: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
      borderWidth: 2,
      borderColor: 'transparent',
      borderRadius: 14,
      paddingVertical: 13,
      paddingHorizontal: 6,
      alignItems: 'center',
    },
    barcodeTypeOptionActive: {
      backgroundColor: colors.PRIMARY_LIGHT,
      borderColor: colors.PRIMARY,
    },
    barcodeTypeText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.TEXT_TERTIARY,
    },
    barcodeTypeTextActive: {
      color: colors.PRIMARY,
    },
    // Barcode value row
    barcodeValueRow: {
      flexDirection: 'row',
      gap: 10,
    },
    barcodeInput: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 15,
      fontWeight: '500',
      color: colors.INPUT_TEXT,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    autoButton: {
      borderRadius: 14,
      paddingHorizontal: 18,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    autoButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Preview
    previewContainer: {
      marginTop: 4,
      alignItems: 'center',
      paddingHorizontal: 0,
    },
    previewLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.TEXT_TERTIARY,
      marginBottom: 10,
    },
    barcodeActionsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },
    printButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.ACCENT,
      borderRadius: 12,
    },
    printButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    saveImageButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      overflow: 'hidden',
    },
    saveImageButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Save button
    saveButton: {
      borderRadius: 18,
      paddingVertical: 17,
      marginTop: 4,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 26,
      elevation: 8,
      overflow: 'hidden',
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    // Supplier modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    modalContent: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 22,
      padding: 20,
      width: '100%',
      maxHeight: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 12,
    },
    modalOption: {
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginBottom: 4,
    },
    modalOptionActive: {
      backgroundColor: colors.PRIMARY_LIGHT,
    },
    modalOptionText: {
      fontSize: 16,
      color: colors.TEXT_PRIMARY,
    },
    modalOptionTextActive: {
      color: colors.PRIMARY,
      fontWeight: '600',
    },
  });
};

export default GetProductFormScreenStyles;

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
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    label: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      marginBottom: 6,
      marginTop: 16,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
      marginBottom: 6,
    },
    marginButton: {
      backgroundColor: colors.PRIMARY,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
    },
    marginButtonText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '700',
      color: colors.TEXT_WHITE,
    },
    input: {
      backgroundColor: colors.INPUT_BACKGROUND,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: fonts.FONT_SIZE_16,
      color: colors.INPUT_TEXT,
      borderWidth: 1,
      borderColor: colors.INPUT_BORDER,
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.INPUT_BACKGROUND,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: colors.INPUT_BORDER,
    },
    dropdownButtonText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.INPUT_TEXT,
      flex: 1,
    },
    dropdownPlaceholder: {
      color: colors.INPUT_PLACEHOLDER,
    },
    dropdownArrow: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_SECONDARY,
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    modalContent: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxHeight: 400,
    },
    modalTitle: {
      fontSize: fonts.FONT_SIZE_18,
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
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_PRIMARY,
    },
    modalOptionTextActive: {
      color: colors.PRIMARY,
      fontWeight: '600',
    },
    pickerRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 4,
    },
    pickerOption: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.BORDER,
      alignItems: 'center',
    },
    pickerOptionActive: {
      borderColor: colors.PRIMARY,
      backgroundColor: colors.PRIMARY_LIGHT,
    },
    pickerText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '500',
      color: colors.TEXT_SECONDARY,
    },
    pickerTextActive: {
      color: colors.PRIMARY,
      fontWeight: '700',
    },
    barcodeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    barcodeInput: {
      flex: 1,
      backgroundColor: colors.INPUT_BACKGROUND,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: fonts.FONT_SIZE_16,
      color: colors.INPUT_TEXT,
      borderWidth: 1,
      borderColor: colors.INPUT_BORDER,
    },
    autoButton: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.PRIMARY,
      borderRadius: 12,
    },
    autoButtonText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '600',
      color: colors.TEXT_WHITE,
    },
    previewContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    previewLabel: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_SECONDARY,
      marginBottom: 10,
    },
    barcodeActionsRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },
    printButton: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      backgroundColor: colors.ACCENT,
      borderRadius: 10,
    },
    printButtonText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_WHITE,
    },
    saveImageButton: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      backgroundColor: colors.PRIMARY,
      borderRadius: 10,
    },
    saveImageButtonText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_WHITE,
    },
    saveButton: {
      marginTop: 28,
    },
  });
};

export default GetProductFormScreenStyles;

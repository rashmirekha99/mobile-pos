import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetProductFormScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
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
    printButton: {
      marginTop: 14,
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
    saveButton: {
      marginTop: 28,
    },
  });
};

export default GetProductFormScreenStyles;

import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetSupplierFormScreenStyles = (colors: ThemeColors) => {
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
    multilineInput: {
      backgroundColor: colors.INPUT_BACKGROUND,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: fonts.FONT_SIZE_16,
      color: colors.INPUT_TEXT,
      borderWidth: 1,
      borderColor: colors.INPUT_BORDER,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    saveButton: {
      marginTop: 28,
    },
  });
};

export default GetSupplierFormScreenStyles;

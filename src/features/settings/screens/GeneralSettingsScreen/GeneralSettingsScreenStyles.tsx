import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetGeneralSettingsScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginTop: 16,
      marginBottom: 6,
    },
    description: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
      marginBottom: 16,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    input: {
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
    percentSign: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    saveButton: {
      marginTop: 28,
    },
  });
};

export default GetGeneralSettingsScreenStyles;

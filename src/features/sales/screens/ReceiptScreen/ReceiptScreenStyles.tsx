import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetReceiptScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      paddingVertical: 20,
      paddingBottom: 40,
    },
    printRow: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 20,
      gap: 12,
    },
    buttonWrapper: {
      flex: 1,
    },
    loadingText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
      marginTop: 40,
    },
  });
};

export default GetReceiptScreenStyles;

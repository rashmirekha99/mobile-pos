import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../shared/theme/types';
import { fonts } from '../../../shared/theme';

const GetBarcodeDisplayStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.BORDER,
    },
    label: {
      marginTop: 8,
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_SECONDARY,
      textAlign: 'center',
    },
  });
};

export default GetBarcodeDisplayStyles;

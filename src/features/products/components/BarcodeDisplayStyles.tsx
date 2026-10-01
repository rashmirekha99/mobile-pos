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
    barcodeValue: {
      marginTop: 6,
      fontSize: fonts.FONT_SIZE_12,
      color: '#000000',
      textAlign: 'center',
      fontWeight: '500',
    },
    productName: {
      marginTop: 4,
      fontSize: fonts.FONT_SIZE_14,
      color: '#000000',
      textAlign: 'center',
      fontWeight: '700',
    },
    priceText: {
      marginTop: 2,
      fontSize: fonts.FONT_SIZE_14,
      color: '#000000',
      textAlign: 'center',
      fontWeight: '600',
    },
    companyName: {
      marginTop: 4,
      fontSize: fonts.FONT_SIZE_10,
      color: '#333333',
      textAlign: 'center',
      fontWeight: '500',
    },
  });
};

export default GetBarcodeDisplayStyles;

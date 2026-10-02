import { StyleSheet, Dimensions } from 'react-native';
import { ThemeColors } from '../../../shared/theme/types';
import { fonts } from '../../../shared/theme';

const { width } = Dimensions.get('window');

const GetScannerModalStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: '#000000',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanArea: {
      width: width * 0.7,
      height: width * 0.7,
      borderWidth: 2,
      borderColor: colors.PRIMARY,
      borderRadius: 16,
    },
    topBar: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeText: {
      fontSize: fonts.FONT_SIZE_20,
      color: '#FFFFFF',
      fontWeight: '700',
    },
    instruction: {
      position: 'absolute',
      bottom: 120,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: fonts.FONT_SIZE_16,
      color: '#FFFFFF',
      fontWeight: '500',
    },
    torchButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    torchText: {
      fontSize: fonts.FONT_SIZE_14,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
      padding: 20,
    },
    permissionText: {
      fontSize: fonts.FONT_SIZE_16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 20,
    },
    manualEntryContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
      padding: 20,
    },
    manualInput: {
      width: width * 0.8,
      height: 50,
      borderWidth: 1,
      borderColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: fonts.FONT_SIZE_16,
      color: '#FFFFFF',
      marginBottom: 20,
    },
    manualEntryButton: {
      position: 'absolute',
      bottom: 60,
      alignSelf: 'center',
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    manualEntryButtonText: {
      fontSize: fonts.FONT_SIZE_16,
      color: '#FFFFFF',
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
  });
};

export default GetScannerModalStyles;

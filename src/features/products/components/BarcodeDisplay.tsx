import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import useTheme from '../../../shared/theme/useTheme';
import GetBarcodeDisplayStyles from './BarcodeDisplayStyles';

interface BarcodeDisplayProps {
  value: string;
  type: 'QR' | 'EAN13' | 'CODE128';
  size?: number;
}

const BarcodeDisplay = ({ value, type, size = 150 }: BarcodeDisplayProps) => {
  const { colors } = useTheme();
  const styles = GetBarcodeDisplayStyles(colors);

  if (!value) {
    return null;
  }

  const renderBarcode = () => {
    switch (type) {
      case 'QR':
        return <QRCode value={value} size={size} />;
      case 'EAN13':
        return (
          <Barcode
            value={value}
            format="EAN13"
            width={2}
            height={80}
            text={value}
          />
        );
      case 'CODE128':
        return (
          <Barcode
            value={value}
            format="CODE128"
            width={1.5}
            height={80}
            text={value}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderBarcode()}
      <Text style={styles.label}>{type}</Text>
    </View>
  );
};

export default BarcodeDisplay;

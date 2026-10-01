import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import useTheme from '../../../shared/theme/useTheme';
import GetBarcodeDisplayStyles from './BarcodeDisplayStyles';
import { STORE_NAME } from '../../../configs/Constants';
import { formatCurrency } from '../../../shared/utils/format';

interface BarcodeDisplayProps {
  value: string;
  type: 'QR' | 'EAN13' | 'CODE128';
  size?: number;
  label?: string;
  price?: string;
}

const BarcodeDisplay = ({ value, type, size = 150, label, price }: BarcodeDisplayProps) => {
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
          />
        );
      case 'CODE128':
        return (
          <Barcode
            value={value}
            format="CODE128"
            width={1.5}
            height={80}
          />
        );
      default:
        return null;
    }
  };

  const parsedPrice = price ? parseFloat(price) : 0;

  return (
    <View style={styles.container}>
      {renderBarcode()}
      <Text style={styles.barcodeValue}>{value}</Text>
      {label ? <Text style={styles.productName}>{label}</Text> : null}
      {parsedPrice > 0 && (
        <Text style={styles.priceText}>{formatCurrency(parsedPrice)}</Text>
      )}
      <Text style={styles.companyName}>{STORE_NAME}</Text>
    </View>
  );
};

export default BarcodeDisplay;

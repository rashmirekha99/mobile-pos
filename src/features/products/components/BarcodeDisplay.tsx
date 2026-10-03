import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import useTheme from '../../../shared/theme/useTheme';
import GetBarcodeDisplayStyles from './BarcodeDisplayStyles';
import { formatCurrency } from '../../../shared/utils/format';

interface BarcodeDisplayProps {
  value: string;
  type: 'QR' | 'EAN13' | 'CODE128';
  size?: number;
  label?: string;
  price?: string;
  labelSizeMm?: { width: number; height: number };
}

const BarcodeDisplay = ({ value, type, size = 150, label, price, labelSizeMm }: BarcodeDisplayProps) => {
  const { colors } = useTheme();
  const styles = GetBarcodeDisplayStyles(colors);
  const labelWidth = labelSizeMm ? labelSizeMm.width * 3.78 : 0;
  const labelHeight = labelSizeMm ? labelSizeMm.height * 3.78 : 0;
  const labelContainerStyle = labelSizeMm ? { width: labelWidth, height: labelHeight, padding: 3, borderWidth: 0, borderRadius: 0, justifyContent: 'center' as const } : undefined;

  if (!value) {
    return null;
  }

  const renderBarcode = () => {
    switch (type) {
      case 'QR':
        return <QRCode value={value} size={labelSizeMm ? Math.max(24, Math.min(size, labelWidth - 8, labelHeight * 0.4)) : size} />;
      case 'EAN13':
        return (
          <Barcode
            value={value}
            format="EAN13"
            width={labelSizeMm ? 1.2 : 3}
            maxWidth={labelSizeMm ? labelWidth - 8 : undefined}
            height={labelSizeMm ? Math.min(36, labelHeight * 0.4) : 100}
          />
        );
      case 'CODE128':
        return (
          <Barcode
            value={value}
            format="CODE128"
            width={labelSizeMm ? 1.2 : 2.5}
            maxWidth={labelSizeMm ? labelWidth - 8 : undefined}
            height={labelSizeMm ? Math.min(36, labelHeight * 0.4) : 100}
          />
        );
      default:
        return null;
    }
  };

  const parsedPrice = price ? parseFloat(price) : 0;

  return (
    <View style={[styles.container, labelContainerStyle]}>
      {renderBarcode()}
      <Text style={[styles.barcodeValue, labelSizeMm && { fontSize: 7, marginTop: 1, lineHeight: 8 }]}>{value}</Text>
      {parsedPrice > 0 && (
        <Text style={[styles.priceText, labelSizeMm && { fontSize: 8, marginTop: 1, lineHeight: 9 }]}>{formatCurrency(parsedPrice)}</Text>
      )}
    </View>
  );
};

export default BarcodeDisplay;

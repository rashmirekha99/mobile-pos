import React from 'react';
import { View, Text } from 'react-native';
import useTheme from '../../../shared/theme/useTheme';
import GetReceiptViewStyles from './ReceiptViewStyles';
import { Sale, SaleItem } from '../../../shared/types';
import { STORE_NAME } from '../../../configs/Constants';
import { formatCurrency, formatDateTime } from '../../../shared/utils/format';

interface ReceiptViewProps {
  sale: Sale;
  items: Array<SaleItem & { product_name: string }>;
}

const ReceiptView = ({ sale, items }: ReceiptViewProps) => {
  const { colors } = useTheme();
  const styles = GetReceiptViewStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.storeName}>{STORE_NAME}</Text>
        <Text style={styles.receiptTitle}>Sales Receipt</Text>
        <Text style={styles.dateText}>{formatDateTime(sale.created_at)}</Text>
        <Text style={styles.receiptId}>Receipt #{sale.id}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.columnHeader}>
        <Text style={[styles.columnHeaderText, { flex: 1 }]}>Item</Text>
        <Text
          style={[
            styles.columnHeaderText,
            { minWidth: 40, textAlign: 'center' },
          ]}>
          Qty
        </Text>
        <Text
          style={[
            styles.columnHeaderText,
            { minWidth: 80, textAlign: 'right' },
          ]}>
          Subtotal
        </Text>
      </View>

      <View style={styles.divider} />

      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.product_name}
          </Text>
          <Text style={styles.itemQty}>x{item.quantity}</Text>
          <Text style={styles.itemSubtotal}>
            {formatCurrency(item.subtotal)}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalAmount}>{formatCurrency(sale.total)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.thankYou}>Thank You!</Text>
        <Text style={styles.footerNote}>Please come again</Text>
      </View>
    </View>
  );
};

export default ReceiptView;

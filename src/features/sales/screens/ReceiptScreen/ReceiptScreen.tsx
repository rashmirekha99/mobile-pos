import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNPrint from 'react-native-print';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import MainButton from '../../../../shared/components/MainButton';
import useTheme from '../../../../shared/theme/useTheme';
import GetReceiptScreenStyles from './ReceiptScreenStyles';
import ReceiptView from '../../components/ReceiptView';
import { Sale, SaleItem } from '../../../../shared/types';
import { getDatabase } from '../../../../shared/db/database';
import { getSaleById, getSaleItems } from '../../services/salesService';
import { STORE_NAME } from '../../../../configs/Constants';
import { formatCurrency, formatDateTime } from '../../../../shared/utils/format';

const ReceiptScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Receipt'>>();
  const { saleId } = route.params;

  const { colors } = useTheme();
  const styles = GetReceiptScreenStyles(colors);
  const viewShotRef = useRef<ViewShot>(null);

  const [sale, setSale] = useState<Sale | null>(null);
  const [items, setItems] = useState<Array<SaleItem & { product_name: string }>>(
    [],
  );

  useEffect(() => {
    loadReceipt();
  }, [saleId]);

  const loadReceipt = async () => {
    try {
      const db = await getDatabase();
      const saleData = await getSaleById(db, saleId);
      const saleItems = await getSaleItems(db, saleId);
      if (saleData) {
        setSale(saleData);
      }
      setItems(saleItems);
    } catch (error) {
      console.error('Failed to load receipt:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        await Share.open({
          url: `file://${uri}`,
          type: 'image/png',
          title: `Receipt #${saleId}`,
        });
      }
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        console.error('Share error:', error);
      }
    }
  };

  const handlePrint = async () => {
    if (!sale) return;
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding:6px 0;">${item.product_name}</td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">${formatCurrency(item.subtotal)}</td>
        </tr>`,
      )
      .join('');

    await RNPrint.print({
      html: `
        <html>
        <body style="font-family:monospace; max-width:320px; margin:0 auto; padding:20px;">
          <h2 style="text-align:center; margin-bottom:2px;">${STORE_NAME}</h2>
          <p style="text-align:center; color:#666; margin:4px 0;">Sales Receipt</p>
          <p style="text-align:center; color:#999; margin:2px 0;">${formatDateTime(sale.created_at)}</p>
          <p style="text-align:center; color:#999; margin:2px 0 12px;">Receipt #${sale.id}</p>
          <hr style="border:none; border-top:1px dashed #ccc;" />
          <table style="width:100%; border-collapse:collapse; margin:8px 0;">
            <tr style="border-bottom:1px solid #eee;">
              <th style="text-align:left; padding:6px 0; font-size:12px;">Item</th>
              <th style="text-align:center; font-size:12px;">Qty</th>
              <th style="text-align:right; font-size:12px;">Subtotal</th>
            </tr>
            ${itemsHtml}
          </table>
          <hr style="border:none; border-top:1px dashed #ccc;" />
          <div style="display:flex; justify-content:space-between; padding:10px 0; font-size:18px; font-weight:bold;">
            <span>TOTAL</span>
            <span>${formatCurrency(sale.total)}</span>
          </div>
          <hr style="border:none; border-top:1px dashed #ccc;" />
          <p style="text-align:center; margin-top:16px; font-weight:bold;">Thank You!</p>
          <p style="text-align:center; color:#999; font-size:12px;">Please come again</p>
        </body>
        </html>
      `,
    });
  };

  const handleNewSale = () => {
    navigation.navigate('POS');
  };

  const handleDone = () => {
    navigation.navigate('Dashboard');
  };

  if (!sale) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppBar title="Receipt" showBackButton={false} />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar
        title="Receipt"
        showBackButton={false}
        rightIcon={<Text style={{ color: '#FFFFFF', fontSize: 16 }}>Share</Text>}
        onRightPress={handleShare}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1.0 }}>
          <ReceiptView sale={sale} items={items} />
        </ViewShot>

        <View style={styles.printRow}>
          <MainButton title="Print Receipt" onPress={handlePrint} />
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <MainButton title="New Sale" onPress={handleNewSale} />
          </View>
          <View style={styles.buttonWrapper}>
            <MainButton title="Done" onPress={handleDone} outline />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiptScreen;

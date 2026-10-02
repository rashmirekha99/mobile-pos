import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
import {
  getSaleById,
  getSaleItems,
  getSaleServiceItems,
  removeSaleItem,
  removeSaleServiceItem,
  deleteSale,
  SaleServiceItem,
} from '../../services/salesService';
import { STORE_NAME } from '../../../../configs/Constants';
import { formatCurrency, formatDateTime } from '../../../../shared/utils/format';
import RNFS from 'react-native-fs';
import { usePrinterStore } from '../../../../shared/store/printerStore';
import {
  printImageBase64,
  isConnected as isPrinterConnected,
} from '../../../../shared/services/bluetoothPrinterService';

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
  const [svcItems, setSvcItems] = useState<Array<SaleServiceItem & { service_name: string }>>(
    [],
  );
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadReceipt();
  }, [saleId]);

  const loadReceipt = async () => {
    try {
      const db = await getDatabase();
      const [saleData, saleItems, saleServiceItems] = await Promise.all([
        getSaleById(db, saleId),
        getSaleItems(db, saleId),
        getSaleServiceItems(db, saleId),
      ]);
      if (saleData) {
        setSale(saleData);
      }
      setItems(saleItems);
      setSvcItems(saleServiceItems);
    } catch (error) {
      console.error('Failed to load receipt:', error);
    }
  };

  const handleRemoveItem = (item: SaleItem & { product_name: string }) => {
    Alert.alert(
      'Remove Item',
      `Remove "${item.product_name}" (x${item.quantity}) from this sale?\n\nStock will be restored.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              const saleStillExists = await removeSaleItem(db, saleId, item.id);
              if (!saleStillExists) {
                Alert.alert('Sale Deleted', 'All items removed. Sale has been deleted.', [
                  { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
                ]);
              } else {
                await loadReceipt();
              }
            } catch (error) {
              console.error('Failed to remove item:', error);
              Alert.alert('Error', 'Failed to remove item');
            }
          },
        },
      ],
    );
  };

  const handleRemoveServiceItem = (item: SaleServiceItem & { service_name: string }) => {
    Alert.alert(
      'Remove Service',
      `Remove "${item.service_name}" (x${item.quantity}) from this sale?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              const saleStillExists = await removeSaleServiceItem(db, saleId, item.id);
              if (!saleStillExists) {
                Alert.alert('Sale Deleted', 'All items removed. Sale has been deleted.', [
                  { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
                ]);
              } else {
                await loadReceipt();
              }
            } catch (error) {
              console.error('Failed to remove service item:', error);
              Alert.alert('Error', 'Failed to remove item');
            }
          },
        },
      ],
    );
  };

  const handleDeleteSale = () => {
    Alert.alert(
      'Delete Sale',
      'Are you sure you want to delete this entire sale?\n\nAll stock will be restored.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              await deleteSale(db, saleId);
              Alert.alert('Deleted', 'Sale has been deleted.', [
                { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
              ]);
            } catch (error) {
              console.error('Failed to delete sale:', error);
              Alert.alert('Error', 'Failed to delete sale');
            }
          },
        },
      ],
    );
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

  const thermalConnected = usePrinterStore((s) => s.isConnected);
  const paperWidth = usePrinterStore((s) => s.paperWidth);

  const handleNormalPrint = async () => {
    if (!sale) return;
    const allItemsHtml = [
      ...items.map(
        (item) => `
        <tr>
          <td style="padding:6px 0;">${item.product_name}</td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">${formatCurrency(item.subtotal)}</td>
        </tr>`),
      ...svcItems.map(
        (item) => `
        <tr>
          <td style="padding:6px 0;">${item.service_name}</td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">${formatCurrency(item.subtotal)}</td>
        </tr>`),
    ].join('');

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
            ${allItemsHtml}
          </table>
          <hr style="border:none; border-top:1px dashed #ccc;" />
          ${sale.discount > 0 ? `
          <div style="display:flex; justify-content:space-between; padding:4px 0; font-size:14px; color:#666;">
            <span>Subtotal</span>
            <span>${formatCurrency(sale.total + sale.discount)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:4px 0; font-size:14px; color:#e53e3e;">
            <span>Discount</span>
            <span>-${formatCurrency(sale.discount)}</span>
          </div>
          ` : ''}
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

  const handleThermalPrint = async () => {
    try {
      if (!viewShotRef.current?.capture) return;
      const uri = await viewShotRef.current.capture();
      const base64 = await RNFS.readFile(uri, 'base64');
      await printImageBase64(base64, paperWidth);
    } catch {
      Alert.alert('Print Error', 'Failed to print to thermal printer');
    }
  };

  const handlePrint = async () => {
    if (!sale) return;

    if (thermalConnected && isPrinterConnected()) {
      Alert.alert('Print Method', 'Choose how to print the receipt:', [
        {
          text: 'Thermal Printer',
          onPress: handleThermalPrint,
        },
        {
          text: 'Normal Print',
          onPress: async () => {
            try {
              await handleNormalPrint();
            } catch (error: any) {
              if (error?.message !== 'User cancelled') {
                Alert.alert('Print Error', 'Failed to print receipt');
              }
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      try {
        await handleNormalPrint();
      } catch (error: any) {
        if (error?.message !== 'User cancelled') {
          Alert.alert('Print Error', 'Failed to print receipt');
        }
      }
    }
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
        rightIcon={
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
              fill="#FFFFFF"
            />
          </Svg>
        }
        onRightPress={handleShare}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!editMode ? (
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1.0 }}>
            <ReceiptView sale={sale} items={items} serviceItems={svcItems} />
          </ViewShot>
        ) : (
          <View style={styles.editContainer}>
            <Text style={styles.editTitle}>Edit Sale #{sale.id}</Text>
            <Text style={styles.editHint}>
              Tap the X button to remove an item. Stock will be restored.
            </Text>
            {items.map((item) => (
              <View key={`p-${item.id}`} style={styles.editItemRow}>
                <View style={styles.editItemInfo}>
                  <Text style={styles.editItemName} numberOfLines={1}>
                    {item.product_name}
                  </Text>
                  <Text style={styles.editItemDetail}>
                    x{item.quantity} - {formatCurrency(item.subtotal)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeItemButton}
                  onPress={() => handleRemoveItem(item)}>
                  <Text style={styles.removeItemButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            {svcItems.map((item) => (
              <View key={`s-${item.id}`} style={styles.editItemRow}>
                <View style={styles.editItemInfo}>
                  <Text style={styles.editItemName} numberOfLines={1}>
                    {item.service_name}
                  </Text>
                  <Text style={styles.editItemDetail}>
                    x{item.quantity} - {formatCurrency(item.subtotal)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeItemButton}
                  onPress={() => handleRemoveServiceItem(item)}>
                  <Text style={styles.removeItemButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.editTotalRow}>
              <Text style={styles.editTotalLabel}>Total</Text>
              <Text style={styles.editTotalValue}>{formatCurrency(sale.total)}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteSaleButton}
              onPress={handleDeleteSale}>
              <Text style={styles.deleteSaleButtonText}>Delete Entire Sale</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.printRow}>
          {!editMode && (
            <MainButton title="Print Receipt" onPress={handlePrint} />
          )}
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <MainButton
              title={editMode ? 'Done Editing' : 'Edit Sale'}
              onPress={() => setEditMode(!editMode)}
              outline={!editMode}
            />
          </View>
          {!editMode && (
            <>
              <View style={styles.buttonWrapper}>
                <MainButton title="New Sale" onPress={handleNewSale} />
              </View>
              <View style={styles.buttonWrapper}>
                <MainButton title="Done" onPress={handleDone} outline />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiptScreen;

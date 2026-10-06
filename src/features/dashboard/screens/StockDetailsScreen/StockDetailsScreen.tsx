import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import RNPrint from 'react-native-print';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import AppBar from '../../../../shared/components/AppBar';
import SupplierFilterDropdown from '../../../../shared/components/SupplierFilterDropdown';
import useTheme from '../../../../shared/theme/useTheme';
import GetStockDetailsScreenStyles from './StockDetailsScreenStyles';
import { getDatabase } from '../../../../shared/db/database';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getAllProductCategories, ProductCategory } from '../../../products/services/categoryService';
import { getAllSuppliers } from '../../../suppliers/services/supplierService';
import { Product, Supplier } from '../../../../shared/types';
import { formatCurrency, formatDate, getTodayDateString } from '../../../../shared/utils/format';
import { STORE_NAME } from '../../../../configs/Constants';

type StockDetailsItem = Product & { supplier_name: string | null; category_name: string | null };

const getAllProductsWithFullStock = async (db: SQLiteDatabase): Promise<Product[]> => {
  const [results] = await db.executeSql(
    `SELECT p.*, p.stock + COALESCE(sold.total_sold, 0) AS stock
     FROM products p
     LEFT JOIN (
       SELECT product_id, SUM(quantity) AS total_sold
       FROM sale_items
       GROUP BY product_id
     ) sold ON sold.product_id = p.id
     ORDER BY p.created_at DESC`,
  );
  const products: Product[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    products.push(results.rows.item(i));
  }
  return products;
};

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const CategoryMultiSelect = ({
  categories,
  selectedIds,
  onToggle,
  onClear,
  colors,
}: {
  categories: ProductCategory[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onClear: () => void;
  colors: any;
}) => {
  const [visible, setVisible] = useState(false);

  const label = selectedIds.length === 0
    ? 'All Categories'
    : selectedIds.length === 1
      ? categories.find(c => c.id === selectedIds[0])?.name || 'All Categories'
      : `${selectedIds.length} categories`;

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.INPUT_BACKGROUND,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: colors.INPUT_BORDER,
          marginBottom: 16,
        }}
        onPress={() => setVisible(true)}>
        <Text
          style={{
            flex: 1,
            fontSize: 14,
            color: selectedIds.length === 0 ? colors.INPUT_PLACEHOLDER : colors.INPUT_TEXT,
          }}
          numberOfLines={1}>
          {label}
        </Text>
        <Text style={{ fontSize: 10, color: colors.TEXT_SECONDARY, marginLeft: 8 }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View
            style={{
              backgroundColor: colors.CARD_BACKGROUND,
              borderRadius: 16,
              padding: 20,
              width: '100%',
              maxHeight: 400,
            }}
            onStartShouldSetResponder={() => true}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.TEXT_PRIMARY, marginBottom: 12 }}>
              Filter by Category
            </Text>
            <TouchableOpacity
              style={{
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 10,
                marginBottom: 4,
                backgroundColor: selectedIds.length === 0 ? colors.PRIMARY_LIGHT : undefined,
              }}
              onPress={() => { onClear(); setVisible(false); }}>
              <Text style={{
                fontSize: 16,
                color: selectedIds.length === 0 ? colors.PRIMARY : colors.TEXT_PRIMARY,
                fontWeight: selectedIds.length === 0 ? '600' : 'normal',
              }}>
                All Categories
              </Text>
            </TouchableOpacity>
            <FlatList
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      marginBottom: 4,
                      backgroundColor: isSelected ? colors.PRIMARY_LIGHT : undefined,
                    }}
                    onPress={() => onToggle(item.id)}>
                    <View style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: isSelected ? colors.PRIMARY : colors.INPUT_BORDER,
                      backgroundColor: isSelected ? colors.PRIMARY : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}>
                      {isSelected && <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>✓</Text>}
                    </View>
                    <Text style={{
                      fontSize: 16,
                      color: isSelected ? colors.PRIMARY : colors.TEXT_PRIMARY,
                      fontWeight: isSelected ? '600' : 'normal',
                    }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={{
                marginTop: 12,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: colors.PRIMARY,
                alignItems: 'center',
              }}
              onPress={() => setVisible(false)}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const StockDetailsScreen = () => {
  const { colors } = useTheme();
  const styles = GetStockDetailsScreenStyles(colors);
  const [items, setItems] = useState<StockDetailsItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filterSupplierId, setFilterSupplierId] = useState<number | null>(null);
  const [filterCategoryIds, setFilterCategoryIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleCategory = (id: number) => {
    setFilterCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
    );
  };

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      (filterSupplierId === null || item.supplier_id === filterSupplierId) &&
      (filterCategoryIds.length === 0 || (item.category_id !== null && filterCategoryIds.includes(item.category_id))),
    );
  }, [items, filterSupplierId, filterCategoryIds]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setIsLoading(true);
        try {
          const db = await getDatabase();
          const [products, supplierData, categoryData] = await Promise.all([
            getAllProductsWithFullStock(db),
            getAllSuppliers(db),
            getAllProductCategories(db),
          ]);
          if (!active) return;
          const supplierNames = new Map<number, string>(
            supplierData.map((supplier: Supplier) => [supplier.id, supplier.name]),
          );
          const categoryNames = new Map<number, string>(
            categoryData.map((category: ProductCategory) => [category.id, category.name]),
          );
          setSuppliers(supplierData);
          setCategories(categoryData);
          setItems(products.map(product => ({
            ...product,
            supplier_name: product.supplier_id === null
              ? null
              : supplierNames.get(product.supplier_id) || null,
            category_name: product.category_id == null
              ? null
              : categoryNames.get(product.category_id) || null,
          })));

        } catch (error) {
          console.error('Failed to load stock details:', error);
        } finally {
          if (active) setIsLoading(false);
        }
      };
      load();
      return () => { active = false; };
    }, []),
  );

  const buildHtml = () => {
    const rows = filteredItems.map((item, index) => `
      <tr>
        <td class="row-number">${index + 1}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.category_name || '-')}</td>
        <td>${escapeHtml(item.barcode || '-')}</td>
        <td>${escapeHtml(item.supplier_name || '-')}</td>
        <td class="number">${formatCurrency(item.buying_price)}</td>
        <td class="number">${formatCurrency(item.price)}</td>
        <td class="qty">${item.stock}</td>
        <td class="number">${formatCurrency(item.buying_price * item.stock)}</td>
        <td class="number">${formatCurrency(item.price * item.stock)}</td>
      </tr>`).join('');

    const totalStockCost = filteredItems.reduce((sum, item) => sum + item.buying_price * item.stock, 0);
    const totalStockValue = filteredItems.reduce((sum, item) => sum + item.price * item.stock, 0);

    return `
      <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body style="font-family:sans-serif; padding:20px; color:#222;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:4px 16px;">
          <div>
            <span style="font-size:18px; font-weight:bold;">${escapeHtml(STORE_NAME)}</span>
            <span style="color:#555; font-size:14px; margin-left:8px;">— Stock Details</span>
          </div>
          <div style="text-align:right; font-size:12px; color:#555;">
            ${filterSupplierId !== null ? `<div style="font-weight:600;">Supplier: ${escapeHtml(suppliers.find(s => s.id === filterSupplierId)?.name || '')}</div>` : ''}
            ${filterCategoryIds.length > 0 ? `<div style="font-weight:600;">${escapeHtml(filterCategoryIds.map(id => categories.find(c => c.id === id)?.name || '').filter(Boolean).join(', '))}</div>` : ''}
            <div style="color:#777;">${escapeHtml(formatDate(getTodayDateString()))}</div>
          </div>
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead><tr style="background:#3448a5; color:white;">
            <th class="row-number">No.</th>
            <th style="text-align:left;">Product</th>
            <th style="text-align:left;">Category</th>
            <th style="text-align:left;">Barcode</th>
            <th style="text-align:left;">Supplier</th>
            <th style="text-align:right;">Buying Price</th>
            <th style="text-align:right;">Selling Price</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Cost (B×Q)</th>
            <th style="text-align:right;">Value (S×Q)</th>
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="10" style="text-align:center; padding:16px;">No products found</td></tr>'}</tbody>
          ${rows ? `<tfoot><tr style="background:#f0f0f0; font-weight:bold; border-top:2px solid #333;">
            <td colspan="8" style="padding:8px 6px; text-align:right;">Total:</td>
            <td class="number" style="padding:8px 6px; border-top:2px solid #333;">${formatCurrency(totalStockCost)}</td>
            <td class="number" style="padding:8px 6px; border-top:2px solid #333;">${formatCurrency(totalStockValue)}</td>
          </tr></tfoot>` : ''}
        </table>
        <p style="text-align:center; color:#888; font-size:11px; margin-top:18px;">${filteredItems.length} products</p>
        ${rows ? `<div style="margin-top:16px; padding:14px 16px; border-radius:8px; background:#f8f8f8; border:1px solid #ddd; font-size:13px; display:inline-block; float:right;">
          <div style="display:flex; justify-content:space-between; gap:40px; padding:4px 0;"><span>Total Cost (B×Q)</span><span>${formatCurrency(totalStockCost)}</span></div>
          <div style="display:flex; justify-content:space-between; gap:40px; padding:4px 0;"><span>Total Value (S×Q)</span><span>${formatCurrency(totalStockValue)}</span></div>
          <hr style="margin:6px 0; border:none; border-top:2px solid #333;"/>
          <div style="display:flex; justify-content:space-between; gap:40px; padding:4px 0; font-weight:bold; font-size:14px;"><span>Predicted Profit</span><span style="color:${totalStockValue - totalStockCost >= 0 ? '#22c55e' : '#ef4444'};">${formatCurrency(totalStockValue - totalStockCost)}</span></div>
        </div>` : ''}
      </body>
      <style>
        th,td { padding:8px 6px; border-bottom:1px solid #ddd; }
        .row-number { text-align:center; width:36px; }
        .number { text-align:right; white-space:nowrap; }
        .qty { text-align:center; }
      </style>
      </html>`;
  };

  const handlePrint = async () => {
    try {
      await RNPrint.print({ html: buildHtml() });
    } catch (error) {
      console.error('Failed to print stock details:', error);
    }
  };

  const handleShare = async () => {
    try {
      const path = `${RNFS.CachesDirectoryPath}/stock-details.html`;
      await RNFS.writeFile(path, buildHtml(), 'utf8');
      await Share.open({
        url: `file://${path}`,
        type: 'text/html',
        title: 'Stock Details',
      });
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        console.error('Failed to share stock details:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar
        title="Stock Details"
        rightActions={[
          {
            icon: (
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 14H8v-4h8v4zm2-4v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z"
                  fill="#FFFFFF"
                />
              </Svg>
            ),
            onPress: handlePrint,
          },
          {
            icon: (
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
                  fill="#FFFFFF"
                />
              </Svg>
            ),
            onPress: handleShare,
          },
        ]}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <Text style={styles.message}>Loading stock details...</Text>
        ) : (
          <>
            <View style={styles.filterRow}>
              <View style={styles.filterItem}>
                <SupplierFilterDropdown
                  suppliers={suppliers}
                  selectedId={filterSupplierId}
                  onSelect={setFilterSupplierId}
                />
              </View>
              <View style={styles.filterItem}>
                <CategoryMultiSelect
                  categories={categories}
                  selectedIds={filterCategoryIds}
                  onToggle={toggleCategory}
                  onClear={() => setFilterCategoryIds([])}
                  colors={colors}
                />
              </View>
            </View>
            {filteredItems.length === 0 ? (
              <Text style={styles.message}>No products found</Text>
            ) : (
              <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, styles.numberColumn]}>No.</Text>
                    <Text style={[styles.headerCell, styles.productColumn]}>Product</Text>
                    <Text style={[styles.headerCell, styles.categoryColumn]}>Category</Text>
                    <Text style={[styles.headerCell, styles.barcodeColumn]}>Barcode</Text>
                    <Text style={[styles.headerCell, styles.supplierColumn]}>Supplier</Text>
                    <Text style={[styles.headerCell, styles.priceColumn]}>Buying Price</Text>
                    <Text style={[styles.headerCell, styles.priceColumn]}>Selling Price</Text>
                    <Text style={[styles.headerCell, styles.qtyColumn]}>Qty</Text>
                    <Text style={[styles.headerCell, styles.costColumn]}>Cost (B×Q)</Text>
                    <Text style={[styles.headerCell, styles.costColumn]}>Value (S×Q)</Text>
                  </View>
                  {filteredItems.map((item, index) => (
                    <View key={item.id} style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}>
                      <Text style={[styles.cell, styles.numberColumn]}>{index + 1}</Text>
                      <Text style={[styles.cell, styles.productColumn]} numberOfLines={1}>{item.name}</Text>
                      <Text style={[styles.cell, styles.categoryColumn]} numberOfLines={1}>{item.category_name || '-'}</Text>
                      <Text style={[styles.cell, styles.barcodeColumn]} numberOfLines={1}>{item.barcode || '-'}</Text>
                      <Text style={[styles.cell, styles.supplierColumn]} numberOfLines={1}>{item.supplier_name || '-'}</Text>
                      <Text style={[styles.cell, styles.priceColumn]} numberOfLines={1}>{formatCurrency(item.buying_price)}</Text>
                      <Text style={[styles.cell, styles.priceColumn]} numberOfLines={1}>{formatCurrency(item.price)}</Text>
                      <Text style={[styles.cell, styles.qtyColumn]}>{item.stock}</Text>
                      <Text style={[styles.cell, styles.costColumn]} numberOfLines={1}>{formatCurrency(item.buying_price * item.stock)}</Text>
                      <Text style={[styles.cell, styles.costColumn]} numberOfLines={1}>{formatCurrency(item.price * item.stock)}</Text>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalCell, { flex: 1, textAlign: 'right', paddingRight: 10 }]}>Total:</Text>
                    <Text style={[styles.totalCell, styles.costColumn]}>{formatCurrency(filteredItems.reduce((sum, item) => sum + item.buying_price * item.stock, 0))}</Text>
                    <Text style={[styles.totalCell, styles.costColumn]}>{formatCurrency(filteredItems.reduce((sum, item) => sum + item.price * item.stock, 0))}</Text>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.profitSummary}>
                <View style={styles.profitRow}>
                  <Text style={styles.profitLabel}>Total Cost (B×Q)</Text>
                  <Text style={styles.profitValue}>{formatCurrency(filteredItems.reduce((sum, item) => sum + item.buying_price * item.stock, 0))}</Text>
                </View>
                <View style={styles.profitRow}>
                  <Text style={styles.profitLabel}>Total Value (S×Q)</Text>
                  <Text style={styles.profitValue}>{formatCurrency(filteredItems.reduce((sum, item) => sum + item.price * item.stock, 0))}</Text>
                </View>
                <View style={[styles.profitRow, styles.profitHighlight]}>
                  <Text style={styles.profitLabelBold}>Predicted Profit</Text>
                  <Text style={[styles.profitValueBold, { color: filteredItems.reduce((sum, item) => sum + (item.price - item.buying_price) * item.stock, 0) >= 0 ? colors.SUCCESS : colors.ERROR }]}>
                    {formatCurrency(filteredItems.reduce((sum, item) => sum + (item.price - item.buying_price) * item.stock, 0))}
                  </Text>
                </View>
              </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockDetailsScreen;

import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import RNPrint from 'react-native-print';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import AppBar from '../../../../shared/components/AppBar';
import SupplierFilterDropdown from '../../../../shared/components/SupplierFilterDropdown';
import CategoryFilterDropdown from '../../../../shared/components/CategoryFilterDropdown';
import useTheme from '../../../../shared/theme/useTheme';
import GetStockDetailsScreenStyles from './StockDetailsScreenStyles';
import { getDatabase } from '../../../../shared/db/database';
import { getAllProducts } from '../../../products/services/productService';
import { getAllProductCategories, ProductCategory } from '../../../products/services/categoryService';
import { getAllSuppliers } from '../../../suppliers/services/supplierService';
import { Product, Supplier } from '../../../../shared/types';
import { formatCurrency, formatDate, getTodayDateString } from '../../../../shared/utils/format';
import { STORE_NAME } from '../../../../configs/Constants';

type StockDetailsItem = Product & { supplier_name: string | null; category_name: string | null };

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const StockDetailsScreen = () => {
  const { colors } = useTheme();
  const styles = GetStockDetailsScreenStyles(colors);
  const [items, setItems] = useState<StockDetailsItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filterSupplierId, setFilterSupplierId] = useState<number | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      (filterSupplierId === null || item.supplier_id === filterSupplierId) &&
      (filterCategoryId === null || item.category_id === filterCategoryId),
    );
  }, [items, filterSupplierId, filterCategoryId]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setIsLoading(true);
        try {
          const db = await getDatabase();
          const [products, supplierData, categoryData] = await Promise.all([
            getAllProducts(db),
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
          setSuppliers(suppliers);
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
      </tr>`).join('');

    return `
      <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body style="font-family:sans-serif; padding:20px; color:#222;">
        <h2 style="text-align:center; margin:0;">${escapeHtml(STORE_NAME)}</h2>
        <h3 style="text-align:center; color:#555; margin:6px 0;">Stock Details</h3>
        <p style="text-align:center; color:#777; margin:0 0 18px;">${escapeHtml(formatDate(getTodayDateString()))}</p>
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
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="8" style="text-align:center; padding:16px;">No products found</td></tr>'}</tbody>
        </table>
        <p style="text-align:center; color:#888; font-size:11px; margin-top:18px;">${filteredItems.length} products</p>
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
                <CategoryFilterDropdown
                  categories={categories}
                  selectedId={filterCategoryId}
                  onSelect={setFilterCategoryId}
                />
              </View>
            </View>
            {filteredItems.length === 0 ? (
              <Text style={styles.message}>No products found</Text>
            ) : (
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
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockDetailsScreen;

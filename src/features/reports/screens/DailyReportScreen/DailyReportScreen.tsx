import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import RNPrint from 'react-native-print';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import AppBar from '../../../../shared/components/AppBar';
import SupplierFilterDropdown from '../../../../shared/components/SupplierFilterDropdown';
import useTheme from '../../../../shared/theme/useTheme';
import GetDailyReportScreenStyles from './DailyReportScreenStyles';
import useDailyReport from '../../hooks/useDailyReport';
import { Supplier } from '../../../../shared/types';
import { getDatabase } from '../../../../shared/db/database';
import { getAllSuppliers } from '../../../suppliers/services/supplierService';
import { formatCurrency, formatDate, formatDateTime, getTodayDateString } from '../../../../shared/utils/format';
import { STORE_NAME } from '../../../../configs/Constants';

const DailyReportScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetDailyReportScreenStyles(colors);
  const { date, summary, sales, isLoading, loadReport } = useDailyReport();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filterSupplierId, setFilterSupplierId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadReport(getTodayDateString());
      const loadSuppliers = async () => {
        try {
          const db = await getDatabase();
          const data = await getAllSuppliers(db);
          setSuppliers(data);
        } catch {}
      };
      loadSuppliers();
    }, []),
  );

  const filteredItems = useMemo(() => {
    if (filterSupplierId === null) return summary.items;
    return summary.items.filter(
      (item) => item.supplier_name === suppliers.find((s) => s.id === filterSupplierId)?.name,
    );
  }, [summary.items, filterSupplierId, suppliers]);

  const isToday = date === getTodayDateString();

  const buildReportHtml = () => {
    const rows = filteredItems
      .map(
        (item) => `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #eee;">${item.product_name}</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">${item.supplier_name || '-'}</td>
          <td style="padding:8px; text-align:center; border-bottom:1px solid #eee;">${item.total_quantity}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #eee;">${formatCurrency(item.total_cost)}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #eee;">${formatCurrency(item.total_revenue)}</td>
          <td style="padding:8px; text-align:right; border-bottom:1px solid #eee; color:${item.profit >= 0 ? '#22c55e' : '#ef4444'};">${formatCurrency(item.profit)}</td>
        </tr>`,
      )
      .join('');

    return `
      <html>
      <body style="font-family:sans-serif; max-width:700px; margin:0 auto; padding:20px;">
        <h2 style="text-align:center; margin-bottom:2px;">${STORE_NAME}</h2>
        <h3 style="text-align:center; color:#666; margin-top:4px;">Daily Sales Report</h3>
        <p style="text-align:center; color:#999;">${formatDate(date)}${isToday ? ' (Today)' : ''}</p>
        <hr/>
        <div style="display:flex; justify-content:space-around; margin:16px 0;">
          <div style="text-align:center;">
            <div style="font-size:24px; font-weight:bold;">${formatCurrency(summary.totalSales)}</div>
            <div style="color:#666; font-size:12px;">Total Revenue</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:24px; font-weight:bold;">${summary.totalTransactions}</div>
            <div style="color:#666; font-size:12px;">Transactions</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:24px; font-weight:bold; color:#22c55e;">${formatCurrency(summary.totalProfit)}</div>
            <div style="color:#666; font-size:12px;">Profit</div>
          </div>
        </div>
        <hr/>
        <h4>Item-wise Breakdown</h4>
        <table style="width:100%; border-collapse:collapse;">
          <tr style="background:#6C63FF; color:white;">
            <th style="padding:8px; text-align:left;">Product</th>
            <th style="padding:8px; text-align:left;">Supplier</th>
            <th style="padding:8px; text-align:center;">Qty</th>
            <th style="padding:8px; text-align:right;">Cost</th>
            <th style="padding:8px; text-align:right;">Revenue</th>
            <th style="padding:8px; text-align:right;">Profit</th>
          </tr>
          ${rows || '<tr><td colspan="6" style="padding:16px; text-align:center; color:#999;">No sales</td></tr>'}
        </table>
        <hr/>
        <p style="text-align:center; color:#999; font-size:12px; margin-top:16px;">Generated by ${STORE_NAME} POS</p>
      </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    await RNPrint.print({ html: buildReportHtml() });
  };

  const handleShare = async () => {
    try {
      const html = buildReportHtml();
      const path = `${RNFS.CachesDirectoryPath}/daily-report-${date}.html`;
      await RNFS.writeFile(path, html, 'utf8');
      await Share.open({
        url: `file://${path}`,
        type: 'text/html',
        title: `Daily Report - ${formatDate(date)}`,
      });
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        console.error('Share error:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar
        title="Daily Report"
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
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {formatDate(date)}
          </Text>
          {isToday && <Text style={styles.dateLabel}>Today</Text>}
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.totalSales)}
            </Text>
            <Text style={styles.summaryLabel}>Revenue</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {summary.totalTransactions}
            </Text>
            <Text style={styles.summaryLabel}>Sales</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.SUCCESS }]}>
              {formatCurrency(summary.totalProfit)}
            </Text>
            <Text style={styles.summaryLabel}>Profit</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Item-wise Breakdown</Text>

        <SupplierFilterDropdown
          suppliers={suppliers}
          selectedId={filterSupplierId}
          onSelect={setFilterSupplierId}
        />

        {filteredItems.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colProduct]}>
                  Product
                </Text>
                <Text style={[styles.tableHeaderText, styles.colSupplier]}>
                  Supplier
                </Text>
                <Text style={[styles.tableHeaderText, styles.colQty]}>
                  Qty
                </Text>
                <Text style={[styles.tableHeaderText, styles.colCost]}>
                  Cost
                </Text>
                <Text style={[styles.tableHeaderText, styles.colRevenue]}>
                  Revenue
                </Text>
                <Text style={[styles.tableHeaderText, styles.colProfit]}>
                  Profit
                </Text>
              </View>
              {filteredItems.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 && styles.tableRowAlt,
                  ]}>
                  <Text
                    style={[styles.tableCellBold, styles.colProduct]}
                    numberOfLines={1}>
                    {item.product_name}
                  </Text>
                  <Text
                    style={[styles.tableCell, styles.colSupplier]}
                    numberOfLines={1}>
                    {item.supplier_name || '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.colQty]}>
                    {item.total_quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.colCost]}>
                    {formatCurrency(item.total_cost)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colRevenue]}>
                    {formatCurrency(item.total_revenue)}
                  </Text>
                  <Text
                    style={[
                      styles.tableCellBold,
                      styles.colProfit,
                      { color: item.profit >= 0 ? colors.SUCCESS : colors.ERROR },
                    ]}>
                    {formatCurrency(item.profit)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.emptyReport}>
            {isLoading ? 'Loading...' : 'No sales recorded for this day'}
          </Text>
        )}

        {sales.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Transactions</Text>
            <View style={styles.transactionsContainer}>
              {sales.map((s, index) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.transactionRow,
                    index === sales.length - 1 && styles.transactionRowLast,
                  ]}
                  onPress={() => navigation.navigate('Receipt', { saleId: s.id })}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionId}>#{s.id}</Text>
                    <Text style={styles.transactionTime}>
                      {formatDateTime(s.created_at)}
                    </Text>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.transactionAmount}>
                      {formatCurrency(s.total)}
                    </Text>
                    <Text style={styles.transactionItems}>
                      {s.item_count} item{s.item_count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default DailyReportScreen;

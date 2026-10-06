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
import { formatCurrency, formatDate, getTodayDateString } from '../../../../shared/utils/format';
import { STORE_NAME } from '../../../../configs/Constants';

const DatePickerField = ({
  label,
  value,
  onChange,
  styles: s,
}: {
  label: string;
  value: string;
  onChange: (date: string) => void;
  styles: any;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const shiftDate = (days: number) => {
    const d = new Date(value + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const currentDate = new Date(value + 'T00:00:00');
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const shiftMonth = (offset: number) => {
    const d = new Date(currentYear, currentMonth + offset, 1);
    const maxDay = getDaysInMonth(d.getFullYear(), d.getMonth());
    const day = Math.min(currentDate.getDate(), maxDay);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    onChange(`${year}-${month}-${String(day).padStart(2, '0')}`);
  };

  const selectDay = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, '0');
    onChange(`${currentYear}-${month}-${String(day).padStart(2, '0')}`);
    setShowPicker(false);
  };

  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <View style={s.dateFieldContainer}>
      <Text style={s.dateFieldLabel}>{label}</Text>
      <View style={s.dateFieldRow}>
        <TouchableOpacity onPress={() => shiftDate(-1)} style={s.dateArrowBtn}>
          <Text style={s.dateArrowText}>{'‹'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={s.dateValueBtn}>
          <Text style={s.dateValueText}>{formatDate(value)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shiftDate(1)} style={s.dateArrowBtn}>
          <Text style={s.dateArrowText}>{'›'}</Text>
        </TouchableOpacity>
      </View>
      {showPicker && (
        <View style={s.calendarContainer}>
          <View style={s.calendarHeader}>
            <TouchableOpacity onPress={() => shiftMonth(-1)}>
              <Text style={s.calendarNavText}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={s.calendarMonthText}>{months[currentMonth]} {currentYear}</Text>
            <TouchableOpacity onPress={() => shiftMonth(1)}>
              <Text style={s.calendarNavText}>{'›'}</Text>
            </TouchableOpacity>
          </View>
          <View style={s.calendarWeekRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <Text key={d} style={s.calendarWeekDay}>{d}</Text>
            ))}
          </View>
          <View style={s.calendarGrid}>
            {calendarDays.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[s.calendarDayBtn, day === currentDate.getDate() && s.calendarDayActive]}
                onPress={() => day && selectDay(day)}
                disabled={!day}>
                <Text style={[s.calendarDayText, day === currentDate.getDate() && s.calendarDayActiveText]}>
                  {day || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const DailyReportScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetDailyReportScreenStyles(colors);
  const { fromDate, setFromDate, toDate, setToDate, summary, isLoading, loadReport } = useDailyReport();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filterSupplierId, setFilterSupplierId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadReport(getTodayDateString(), getTodayDateString());
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

  const handleFromDateChange = (date: string) => {
    setFromDate(date);
    if (date > toDate) setToDate(date);
    loadReport(date, date > toDate ? date : toDate);
  };

  const handleToDateChange = (date: string) => {
    setToDate(date);
    if (date < fromDate) setFromDate(date);
    loadReport(date < fromDate ? date : fromDate, date);
  };

  const filteredItems = useMemo(() => {
    if (filterSupplierId === null) return summary.items;
    return summary.items.filter(
      (item) => item.supplier_name === suppliers.find((s) => s.id === filterSupplierId)?.name,
    );
  }, [summary.items, filterSupplierId, suppliers]);

  const totalCost = filteredItems.reduce((sum, item) => sum + item.total_cost, 0);
  const totalRevenue = filteredItems.reduce((sum, item) => sum + item.total_revenue, 0);
  const totalProfit = filteredItems.reduce((sum, item) => sum + item.profit, 0);

  const isSingleDay = fromDate === toDate;
  const isToday = isSingleDay && fromDate === getTodayDateString();
  const dateLabel = isSingleDay ? formatDate(fromDate) : `${formatDate(fromDate)} - ${formatDate(toDate)}`;

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
        <h3 style="text-align:center; color:#666; margin-top:4px;">Sales Report</h3>
        <p style="text-align:center; color:#999;">${dateLabel}${isToday ? ' (Today)' : ''}</p>
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
          ${rows ? `<tr style="background:#f0f0f0; font-weight:bold;">
            <td style="padding:8px; border-top:2px solid #333;" colspan="3">Total</td>
            <td style="padding:8px; text-align:right; border-top:2px solid #333;">${formatCurrency(totalCost)}</td>
            <td style="padding:8px; text-align:right; border-top:2px solid #333;">${formatCurrency(totalRevenue)}</td>
            <td style="padding:8px; text-align:right; border-top:2px solid #333; color:${totalProfit >= 0 ? '#22c55e' : '#ef4444'};">${formatCurrency(totalProfit)}</td>
          </tr>` : ''}
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
      const path = `${RNFS.CachesDirectoryPath}/daily-report-${fromDate}-${toDate}.html`;
      await RNFS.writeFile(path, html, 'utf8');
      await Share.open({
        url: `file://${path}`,
        type: 'text/html',
        title: `Sales Report - ${dateLabel}`,
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
        title="Sales Report"
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
        <View style={styles.dateRangeRow}>
          <DatePickerField
            label="From"
            value={fromDate}
            onChange={handleFromDateChange}
            styles={styles}
          />
          <DatePickerField
            label="To"
            value={toDate}
            onChange={handleToDateChange}
            styles={styles}
          />
        </View>
        {isToday && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Today</Text>
          </View>
        )}

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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Item-wise Breakdown</Text>
          <TouchableOpacity
            style={styles.viewTransactionsBtn}
            onPress={() => navigation.navigate('SalesHistory')}>
            <Text style={styles.viewTransactionsBtnText}>Transactions</Text>
          </TouchableOpacity>
        </View>

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
              <View style={styles.tableTotalRow}>
                <Text style={[styles.tableTotalCell, styles.colProduct]} numberOfLines={1}>Total</Text>
                <Text style={[styles.tableTotalCell, styles.colSupplier]} />
                <Text style={[styles.tableTotalCell, styles.colQty]} />
                <Text style={[styles.tableTotalCell, styles.colCost]}>{formatCurrency(totalCost)}</Text>
                <Text style={[styles.tableTotalCell, styles.colRevenue]}>{formatCurrency(totalRevenue)}</Text>
                <Text style={[styles.tableTotalCell, styles.colProfit, { color: totalProfit >= 0 ? colors.SUCCESS : colors.ERROR }]}>
                  {formatCurrency(totalProfit)}
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.emptyReport}>
            {isLoading ? 'Loading...' : 'No sales recorded for this period'}
          </Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default DailyReportScreen;

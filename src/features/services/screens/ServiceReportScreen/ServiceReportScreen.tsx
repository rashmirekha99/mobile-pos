import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetServiceReportScreenStyles from './ServiceReportScreenStyles';
import { getDatabase } from '../../../../shared/db/database';
import { getServiceSalesRangeSummary } from '../../services/serviceService';
import { formatCurrency, formatDate, getTodayDateString } from '../../../../shared/utils/format';

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

const ServiceReportScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetServiceReportScreenStyles(colors);
  const [fromDate, setFromDate] = useState(getTodayDateString());
  const [toDate, setToDate] = useState(getTodayDateString());
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    items: [] as Array<{ service_name: string; total_count: number; total_revenue: number }>,
  });

  const loadReport = async (from: string, to: string) => {
    try {
      const db = await getDatabase();
      const summaryData = await getServiceSalesRangeSummary(db, from, to);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load service report:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReport(getTodayDateString(), getTodayDateString());
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Service Report" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateRangeRow}>
          <DatePickerField label="From" value={fromDate} onChange={handleFromDateChange} styles={styles} />
          <DatePickerField label="To" value={toDate} onChange={handleToDateChange} styles={styles} />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {formatCurrency(summary.totalRevenue)}
            </Text>
            <Text style={styles.summaryLabel}>Revenue</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {summary.totalTransactions}
            </Text>
            <Text style={styles.summaryLabel}>Transactions</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service Breakdown</Text>
          <TouchableOpacity
            style={styles.viewTransactionsBtn}
            onPress={() => navigation.navigate('ServiceSalesHistory')}>
            <Text style={styles.viewTransactionsBtnText}>Transactions</Text>
          </TouchableOpacity>
        </View>

        {summary.items.length > 0 && (
          <>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colService]}>Service</Text>
                <Text style={[styles.tableHeaderText, styles.colCount]}>Count</Text>
                <Text style={[styles.tableHeaderText, styles.colRevenue]}>Revenue</Text>
              </View>
              {summary.items.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 && styles.tableRowAlt,
                  ]}>
                  <Text style={[styles.tableCellBold, styles.colService]} numberOfLines={1}>
                    {item.service_name}
                  </Text>
                  <Text style={[styles.tableCell, styles.colCount]}>
                    {item.total_count}
                  </Text>
                  <Text style={[styles.tableCellBold, styles.colRevenue]}>
                    {formatCurrency(item.total_revenue)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {summary.items.length === 0 && (
          <Text style={styles.emptyText}>No service sales recorded for this period</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceReportScreen;

import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetServiceSalesHistoryScreenStyles from './ServiceSalesHistoryScreenStyles';
import { getDatabase } from '../../../../shared/db/database';
import { getServiceSalesByDateRange } from '../../services/serviceService';
import { formatCurrency, formatDate, formatDateTime, getTodayDateString } from '../../../../shared/utils/format';

type ServiceSaleEntry = {
  sale_id: number;
  service_name: string;
  quantity: number;
  subtotal: number;
  created_at: string;
};

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

const ServiceSalesHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetServiceSalesHistoryScreenStyles(colors);
  const [fromDate, setFromDate] = useState(getTodayDateString());
  const [toDate, setToDate] = useState(getTodayDateString());
  const [sales, setSales] = useState<ServiceSaleEntry[]>([]);

  const loadSales = async (from: string, to: string) => {
    try {
      const db = await getDatabase();
      const data = await getServiceSalesByDateRange(db, from, to);
      setSales(data);
    } catch (error) {
      console.error('Failed to load service sales history:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSales(getTodayDateString(), getTodayDateString());
    }, []),
  );

  const handleFromDateChange = (date: string) => {
    setFromDate(date);
    if (date > toDate) setToDate(date);
    loadSales(date, date > toDate ? date : toDate);
  };

  const handleToDateChange = (date: string) => {
    setToDate(date);
    if (date < fromDate) setFromDate(date);
    loadSales(date < fromDate ? date : fromDate, date);
  };

  const renderItem = ({ item, index }: { item: ServiceSaleEntry; index: number }) => (
    <TouchableOpacity
      style={[
        styles.transactionRow,
        index === sales.length - 1 && styles.transactionRowLast,
      ]}
      onPress={() => navigation.navigate('Receipt', { saleId: item.sale_id })}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionName}>
          {item.service_name} x{item.quantity}
        </Text>
        <Text style={styles.transactionTime}>
          Sale #{item.sale_id} · {formatDateTime(item.created_at)}
        </Text>
      </View>
      <Text style={styles.transactionAmount}>
        {formatCurrency(item.subtotal)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Service Transactions" />
      <FlatList
        data={sales}
        keyExtractor={(item, index) => `${item.sale_id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.dateRangeRow}>
            <DatePickerField label="From" value={fromDate} onChange={handleFromDateChange} styles={styles} />
            <DatePickerField label="To" value={toDate} onChange={handleToDateChange} styles={styles} />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No service transactions for this period</Text>
        }
      />
    </SafeAreaView>
  );
};

export default ServiceSalesHistoryScreen;

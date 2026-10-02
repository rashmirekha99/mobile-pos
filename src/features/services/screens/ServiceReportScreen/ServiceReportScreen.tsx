import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetServiceReportScreenStyles from './ServiceReportScreenStyles';
import { getDatabase } from '../../../../shared/db/database';
import { getServiceSalesSummary } from '../../services/serviceService';
import { formatCurrency, formatDate, getTodayDateString } from '../../../../shared/utils/format';

const ServiceReportScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetServiceReportScreenStyles(colors);
  const [date] = useState(getTodayDateString());
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    items: [] as Array<{ service_name: string; total_count: number; total_revenue: number }>,
  });
  const loadReport = useCallback(async () => {
    try {
      const db = await getDatabase();
      const summaryData = await getServiceSalesSummary(db, date);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load service report:', error);
    }
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      loadReport();
    }, [loadReport]),
  );

  const isToday = date === getTodayDateString();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Service Report" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          {isToday && <Text style={styles.dateLabel}>Today</Text>}
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
          <Text style={styles.emptyText}>No service sales recorded for today</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceReportScreen;

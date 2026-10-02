import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetServiceSalesHistoryScreenStyles from './ServiceSalesHistoryScreenStyles';
import { getDatabase } from '../../../../shared/db/database';
import { getServiceSalesByDate } from '../../services/serviceService';
import { formatCurrency, formatDate, formatDateTime, getTodayDateString } from '../../../../shared/utils/format';

type ServiceSaleEntry = {
  sale_id: number;
  service_name: string;
  quantity: number;
  subtotal: number;
  created_at: string;
};

const ServiceSalesHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetServiceSalesHistoryScreenStyles(colors);
  const [date] = useState(getTodayDateString());
  const [sales, setSales] = useState<ServiceSaleEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const db = await getDatabase();
          const data = await getServiceSalesByDate(db, date);
          setSales(data);
        } catch (error) {
          console.error('Failed to load service sales history:', error);
        }
      };
      load();
    }, [date]),
  );

  const isToday = date === getTodayDateString();

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
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            {isToday && <Text style={styles.dateLabel}>Today</Text>}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No service transactions for today</Text>
        }
      />
    </SafeAreaView>
  );
};

export default ServiceSalesHistoryScreen;

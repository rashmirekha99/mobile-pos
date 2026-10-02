import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetSalesHistoryScreenStyles from './SalesHistoryScreenStyles';
import { Sale } from '../../../../shared/types';
import { getDatabase } from '../../../../shared/db/database';
import { getSalesByDate } from '../../../sales/services/salesService';
import { formatCurrency, formatDate, formatDateTime, getTodayDateString } from '../../../../shared/utils/format';

const SalesHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetSalesHistoryScreenStyles(colors);
  const [date] = useState(getTodayDateString());
  const [sales, setSales] = useState<Array<Sale & { item_count: number }>>([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const db = await getDatabase();
          const data = await getSalesByDate(db, date);
          setSales(data);
        } catch (error) {
          console.error('Failed to load sales history:', error);
        }
      };
      load();
    }, [date]),
  );

  const isToday = date === getTodayDateString();

  const renderItem = ({ item, index }: { item: Sale & { item_count: number }; index: number }) => (
    <TouchableOpacity
      style={[
        styles.transactionRow,
        index === sales.length - 1 && styles.transactionRowLast,
      ]}
      onPress={() => navigation.navigate('Receipt', { saleId: item.id })}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionId}>#{item.id}</Text>
        <Text style={styles.transactionTime}>
          {formatDateTime(item.created_at)}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          {formatCurrency(item.total)}
        </Text>
        <Text style={styles.transactionItems}>
          {item.item_count} item{item.item_count !== 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Sales History" />
      <FlatList
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            {isToday && <Text style={styles.dateLabel}>Today</Text>}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions for today</Text>
        }
      />
    </SafeAreaView>
  );
};

export default SalesHistoryScreen;

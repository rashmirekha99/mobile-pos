import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useFocusEffect,
  NavigationProp,
} from '@react-navigation/native';
import { SvgProps } from 'react-native-svg';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetDashboardScreenStyles from './DashboardScreenStyles';
import useDashboard from '../../hooks/useDashboard';
import { formatCurrency } from '../../../../shared/utils/format';
import { APP_NAME } from '../../../../configs/Constants';
import NewSaleIcon from '../../../../assets/images/NewSale.svg';
import ProductsIcon from '../../../../assets/images/Products.svg';
import DailyReportIcon from '../../../../assets/images/DailyReport.svg';

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetDashboardScreenStyles(colors);
  const { todaySales, todayCount, lowStockItems, loadDashboard } = useDashboard();

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  const actionCards: Array<{
    title: string;
    Icon?: React.FC<SvgProps>;
    textIcon?: string;
    color: string;
    screen: keyof RootStackParamList;
  }> = [
    {
      title: 'New Sale',
      Icon: NewSaleIcon,
      color: colors.DASHBOARD_CARD_1,
      screen: 'POS',
    },
    {
      title: 'Products',
      Icon: ProductsIcon,
      color: colors.DASHBOARD_CARD_2,
      screen: 'ProductList',
    },
    {
      title: 'Daily Report',
      Icon: DailyReportIcon,
      color: colors.DASHBOARD_CARD_3,
      screen: 'DailyReport',
    },
    {
      title: 'Inventory',
      textIcon: '\u{1F4E6}',
      color: colors.ACCENT,
      screen: 'Inventory',
    },
  ];

  return (
    <SafeAreaView
      style={styles.container}
      edges={
        Platform.OS === 'ios'
          ? ['top', 'bottom', 'left', 'right']
          : ['bottom', 'left', 'right']
      }>
      <AppBar title={APP_NAME} showBackButton={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {formatCurrency(todaySales)}
              </Text>
              <Text style={styles.summaryLabel}>Revenue</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{todayCount}</Text>
              <Text style={styles.summaryLabel}>Sales</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.gridRow}>
          {actionCards.map((card) => (
            <TouchableOpacity
              key={card.screen}
              style={[styles.gridCard, { backgroundColor: card.color }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(card.screen)}>
              {card.Icon ? (
                <card.Icon width={48} height={48} />
              ) : (
                <Text style={styles.gridTextIcon}>{card.textIcon}</Text>
              )}
              <Text style={styles.gridTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {lowStockItems.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Low Stock Alerts
            </Text>
            <View style={styles.lowStockContainer}>
              {lowStockItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.lowStockRow}
                  onPress={() =>
                    navigation.navigate('ProductForm', { productId: item.id })
                  }>
                  <Text style={styles.lowStockName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.lowStockQty,
                      item.stock <= 0 && styles.lowStockOut,
                    ]}>
                    {item.stock <= 0 ? 'OUT' : item.stock}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

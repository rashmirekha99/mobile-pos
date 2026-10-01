import React, { useCallback, useMemo } from 'react';
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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

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

  const greeting = useMemo(() => getGreeting(), []);
  const dateStr = useMemo(() => getFormattedDate(), []);

  const actionCards: Array<{
    title: string;
    subtitle: string;
    Icon?: React.FC<SvgProps>;
    textIcon?: string;
    color: string;
    screen: keyof RootStackParamList;
  }> = [
    {
      title: 'New Sale',
      subtitle: 'Start selling',
      Icon: NewSaleIcon,
      color: colors.DASHBOARD_CARD_1,
      screen: 'POS',
    },
    {
      title: 'Products',
      subtitle: 'Manage items',
      Icon: ProductsIcon,
      color: colors.DASHBOARD_CARD_2,
      screen: 'ProductList',
    },
    {
      title: 'Daily Report',
      subtitle: 'View analytics',
      Icon: DailyReportIcon,
      color: colors.DASHBOARD_CARD_3,
      screen: 'DailyReport',
    },
    {
      title: 'Inventory',
      subtitle: 'Stock levels',
      textIcon: '\u{1F4E6}',
      color: colors.ACCENT,
      screen: 'Inventory',
    },
    {
      title: 'Suppliers',
      subtitle: 'Manage suppliers',
      textIcon: '\u{1F465}',
      color: colors.PRIMARY_DARK,
      screen: 'SupplierList',
    },
    {
      title: 'Printer',
      subtitle: 'Bluetooth setup',
      textIcon: '\u{1F5A8}',
      color: colors.SECONDARY,
      screen: 'PrinterSettings',
    },
    {
      title: 'Settings',
      subtitle: 'General config',
      textIcon: '\u{2699}',
      color: colors.TEXT_SECONDARY,
      screen: 'GeneralSettings',
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
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.summaryCardRevenue]}>
            <View style={[styles.summaryIconCircle, { backgroundColor: colors.PRIMARY + '20' }]}>
              <Text style={styles.summaryEmoji}>$</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.PRIMARY }]}>
              {formatCurrency(todaySales)}
            </Text>
            <Text style={styles.summaryLabel}>Revenue</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardSales]}>
            <View style={[styles.summaryIconCircle, { backgroundColor: colors.SECONDARY + '20' }]}>
              <Text style={styles.summaryEmoji}>#</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.SECONDARY }]}>
              {todayCount}
            </Text>
            <Text style={styles.summaryLabel}>Sales</Text>
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
              <View style={styles.gridCardOverlay} />
              <View style={styles.gridCardContent}>
                {card.Icon ? (
                  <card.Icon width={44} height={44} />
                ) : (
                  <Text style={styles.gridTextIcon}>{card.textIcon}</Text>
                )}
                <View style={styles.gridCardTextWrap}>
                  <Text style={styles.gridTitle}>{card.title}</Text>
                  <Text style={styles.gridSubtitle}>{card.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {lowStockItems.length > 0 && (
          <View style={styles.lowStockSection}>
            <View style={styles.lowStockHeader}>
              <Text style={styles.lowStockHeaderText}>Low Stock Alerts</Text>
              <View style={styles.lowStockBadge}>
                <Text style={styles.lowStockBadgeText}>{lowStockItems.length}</Text>
              </View>
            </View>
            <View style={styles.lowStockContainer}>
              {lowStockItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.lowStockRow,
                    index === lowStockItems.length - 1 && styles.lowStockRowLast,
                  ]}
                  onPress={() =>
                    navigation.navigate('ProductForm', { productId: item.id })
                  }>
                  <View style={styles.lowStockDot}>
                    <View
                      style={[
                        styles.lowStockDotInner,
                        { backgroundColor: item.stock <= 0 ? colors.ERROR : colors.WARNING },
                      ]}
                    />
                  </View>
                  <Text style={styles.lowStockName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View
                    style={[
                      styles.lowStockQtyBadge,
                      {
                        backgroundColor:
                          item.stock <= 0 ? colors.ERROR + '15' : colors.WARNING + '20',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.lowStockQty,
                        item.stock <= 0 && styles.lowStockOut,
                      ]}>
                      {item.stock <= 0 ? 'OUT' : item.stock}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

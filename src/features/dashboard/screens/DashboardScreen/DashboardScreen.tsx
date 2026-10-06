import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useFocusEffect,
  NavigationProp,
} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import useTheme from '../../../../shared/theme/useTheme';
import GetDashboardScreenStyles from './DashboardScreenStyles';
import useDashboard from '../../hooks/useDashboard';
import { formatCurrency } from '../../../../shared/utils/format';
import { APP_NAME } from '../../../../configs/Constants';

const GRADIENT_COLORS = ['#02078A', '#010450', '#01022E'];
const GRADIENT_LOCATIONS = [0, 0.55, 1];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Inline SVG icon components
const LogoIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DollarIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SalesIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ProductsIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChartIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InventoryIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7h18v13H3zM3 7l3-4h12l3 4M9 12h6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SupplierIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M1 6h13v10H1zM14 9h5l3 3v4h-8M6 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PrinterIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9V3h12v6M6 18H3v-7h18v7h-3M6 14h12v7H6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
    <Path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ServiceIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ServiceReportIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WarningIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3L2 21h20L12 3zM12 10v5M12 18h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type ActionItem = {
  title: string;
  subtitle: string;
  icon: (color: string) => React.ReactNode;
  screen: keyof RootStackParamList;
};

const ACTION_ITEMS: ActionItem[] = [
  { title: 'Products', subtitle: 'Manage items', icon: (c) => <ProductsIcon color={c} />, screen: 'ProductList' },
  { title: 'Sales Report', subtitle: 'View analytics', icon: (c) => <ChartIcon color={c} />, screen: 'DailyReport' },
  { title: 'Inventory', subtitle: 'Stock level', icon: (c) => <InventoryIcon color={c} />, screen: 'Inventory' },
  { title: 'Services', subtitle: 'Manage services', icon: (c) => <ServiceIcon color={c} />, screen: 'ServiceList' },
  { title: 'Service Report', subtitle: 'Service sales', icon: (c) => <ServiceReportIcon color={c} />, screen: 'ServiceReport' },
  { title: 'Suppliers', subtitle: 'Manage suppliers', icon: (c) => <SupplierIcon color={c} />, screen: 'SupplierList' },
  { title: 'Printer', subtitle: 'Bluetooth print', icon: (c) => <PrinterIcon color={c} />, screen: 'PrinterSettings' },
  { title: 'Settings', subtitle: 'General settings', icon: (c) => <SettingsIcon color={c} />, screen: 'GeneralSettings' },
];

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = GetDashboardScreenStyles(colors);
  const { todaySales, todayCount, outOfStockItems, loadDashboard } = useDashboard();

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  const greeting = useMemo(() => getGreeting(), []);
  const dateStr = useMemo(() => getFormattedDate(), []);

  const actionPairs = useMemo(() => {
    const pairs: ActionItem[][] = [];
    for (let i = 0; i < ACTION_ITEMS.length; i += 2) {
      pairs.push(ACTION_ITEMS.slice(i, i + 2));
    }
    return pairs;
  }, []);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#02078A" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Header */}
        <LinearGradient
          colors={GRADIENT_COLORS}
          locations={GRADIENT_LOCATIONS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 18 }]}>
          <View style={styles.heroCircleLarge} />
          <View style={styles.heroCircleSmall} />
          <View style={styles.heroTopRow}>
            <View style={styles.brand}>
              <View style={styles.logoBox}>
                <LogoIcon />
              </View>
              <Text style={styles.brandText}>{APP_NAME}</Text>
            </View>
            <Text style={styles.pill}>● Open</Text>
          </View>
          <View style={styles.heroGreeting}>
            <Text style={styles.heroDate}>{dateStr}</Text>
            <Text style={styles.heroTitle}>{greeting}</Text>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconBox}>
                <DollarIcon color={colors.PRIMARY} />
              </View>
              <Text style={styles.statLabel}>Revenue</Text>
              <Text style={styles.statValue}>{formatCurrency(todaySales)}</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconBox}>
                <SalesIcon color={colors.PRIMARY} />
              </View>
              <Text style={styles.statLabel}>Sales</Text>
              <Text style={styles.statValue}>{todayCount}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsGrid}>
          {/* Primary: New Sale */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('POS')}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              locations={GRADIENT_LOCATIONS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryAction}>
              <View style={styles.primaryCircle} />
              <View style={styles.primaryIconBox}>
                <PlusIcon color={colors.PRIMARY} />
              </View>
              <View>
                <Text style={styles.primaryTitle}>New Sale</Text>
                <Text style={styles.primarySubtitle}>Start selling</Text>
              </View>
              <View style={styles.primaryChevron}>
                <Text style={styles.chevronText}>›</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Action card pairs */}
          {actionPairs.map((pair, pairIndex) => (
            <View key={pairIndex} style={styles.actionsRow}>
              {pair.map((item) => (
                <TouchableOpacity
                  key={item.screen}
                  style={styles.actionCard}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate(item.screen)}>
                  <View style={styles.actionChevron}>
                    <Text style={styles.actionChevronText}>›</Text>
                  </View>
                  <View style={styles.actionIconBox}>
                    {item.icon(colors.PRIMARY)}
                  </View>
                  <Text style={styles.actionTitle}>{item.title}</Text>
                  <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Out of Stock Alert */}
        {outOfStockItems.length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <View style={styles.alertIconBox}>
                <WarningIcon color={colors.ERROR} />
              </View>
              <Text style={styles.alertTitle}>Out of stock</Text>
            </View>
            {outOfStockItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.alertItem,
                  index === 0 && styles.alertItemFirst,
                ]}
                onPress={() =>
                  navigation.navigate('ProductForm', { productId: item.id })
                }>
                <View style={styles.alertItemRow}>
                  <Text style={styles.alertItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.alertItemQty, { color: colors.ERROR }]}>
                    Out of stock
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

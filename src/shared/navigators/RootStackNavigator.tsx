import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamsList';
import DashboardScreen from '../../features/dashboard/screens/DashboardScreen/DashboardScreen';
import ProductListScreen from '../../features/products/screens/ProductListScreen/ProductListScreen';
import ProductFormScreen from '../../features/products/screens/ProductFormScreen/ProductFormScreen';
import POSScreen from '../../features/sales/screens/POSScreen/POSScreen';
import ReceiptScreen from '../../features/sales/screens/ReceiptScreen/ReceiptScreen';
import DailyReportScreen from '../../features/reports/screens/DailyReportScreen/DailyReportScreen';
import InventoryScreen from '../../features/dashboard/screens/InventoryScreen/InventoryScreen';
import StockDetailsScreen from '../../features/dashboard/screens/StockDetailsScreen/StockDetailsScreen';
import PrinterSettingsScreen from '../../features/settings/screens/PrinterSettingsScreen/PrinterSettingsScreen';
import SupplierListScreen from '../../features/suppliers/screens/SupplierListScreen/SupplierListScreen';
import SupplierFormScreen from '../../features/suppliers/screens/SupplierFormScreen/SupplierFormScreen';
import GeneralSettingsScreen from '../../features/settings/screens/GeneralSettingsScreen/GeneralSettingsScreen';
import ServiceListScreen from '../../features/services/screens/ServiceListScreen/ServiceListScreen';
import ServiceFormScreen from '../../features/services/screens/ServiceFormScreen/ServiceFormScreen';
import ServiceReportScreen from '../../features/services/screens/ServiceReportScreen/ServiceReportScreen';
import SalesHistoryScreen from '../../features/reports/screens/SalesHistoryScreen/SalesHistoryScreen';
import ServiceSalesHistoryScreen from '../../features/services/screens/ServiceSalesHistoryScreen/ServiceSalesHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="ProductForm" component={ProductFormScreen} />
        <Stack.Screen name="POS" component={POSScreen} />
        <Stack.Screen name="Receipt" component={ReceiptScreen} />
        <Stack.Screen name="DailyReport" component={DailyReportScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="StockDetails" component={StockDetailsScreen} />
        <Stack.Screen name="PrinterSettings" component={PrinterSettingsScreen} />
        <Stack.Screen name="SupplierList" component={SupplierListScreen} />
        <Stack.Screen name="SupplierForm" component={SupplierFormScreen} />
        <Stack.Screen name="GeneralSettings" component={GeneralSettingsScreen} />
        <Stack.Screen name="ServiceList" component={ServiceListScreen} />
        <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
        <Stack.Screen name="ServiceReport" component={ServiceReportScreen} />
        <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} />
        <Stack.Screen name="ServiceSalesHistory" component={ServiceSalesHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigator;

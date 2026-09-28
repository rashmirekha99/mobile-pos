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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigator;

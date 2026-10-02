import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';

const GRADIENT_COLORS = ['#02078A', '#010450', '#01022E'];
const GRADIENT_LOCATIONS = [0, 0.55, 1];
import AppBar from '../../../../shared/components/AppBar';
import MainButton from '../../../../shared/components/MainButton';
import useTheme from '../../../../shared/theme/useTheme';
import GetPOSScreenStyles from './POSScreenStyles';
import CartItemRow from '../../components/CartItemRow';
import ScannerModal from '../../components/ScannerModal';
import useCart from '../../hooks/useCart';
import { Product, Service, CartItem, ServiceCartItem } from '../../../../shared/types';
import { formatCurrency } from '../../../../shared/utils/format';
import { getDatabase } from '../../../../shared/db/database';
import { searchProducts } from '../../../products/services/productService';
import { getAllServices } from '../../../services/services/serviceService';

type UnifiedCartItem =
  | { type: 'product'; data: CartItem }
  | { type: 'service'; data: ServiceCartItem };

const POSScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetPOSScreenStyles(colors);

  const {
    items,
    serviceItems,
    addItem,
    removeItem,
    increment,
    decrement,
    addService,
    removeService,
    incrementService,
    decrementService,
    clear,
    total,
    totalItemCount,
    handleBarcodeScan,
    handleCheckout,
  } = useCart();

  const [scannerVisible, setScannerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [discountInput, setDiscountInput] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [servicePickerVisible, setServicePickerVisible] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const db = await getDatabase();
        const data = await getAllServices(db);
        setServices(data);
      } catch {}
    };
    loadServices();
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (query.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const db = await getDatabase();
        const results = await searchProducts(db, query.trim());
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      }
    },
    [],
  );

  const handleAddFromSearch = (product: Product) => {
    addItem(product);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleScanned = async (barcode: string) => {
    await handleBarcodeScan(barcode);
  };

  const handleServiceSelect = (service: Service) => {
    setServicePickerVisible(false);
    setServiceSearch('');
    addService(service);
  };

  const filteredServices = serviceSearch.trim().length > 0
    ? services.filter((s) =>
        s.name.toLowerCase().includes(serviceSearch.trim().toLowerCase()),
      )
    : services;

  const discount = parseFloat(discountInput) || 0;
  const finalTotal = Math.max(total - discount, 0);

  // Build unified list for FlatList
  const unifiedItems: UnifiedCartItem[] = [
    ...items.map((item): UnifiedCartItem => ({ type: 'product', data: item })),
    ...serviceItems.map((item): UnifiedCartItem => ({ type: 'service', data: item })),
  ];

  const onCheckout = () => {
    if (totalItemCount === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart first');
      return;
    }

    const msg = discount > 0
      ? `Subtotal: ${formatCurrency(total)}\nDiscount: -${formatCurrency(discount)}\nTotal: ${formatCurrency(finalTotal)}\n\nProceed with checkout?`
      : `Total: ${formatCurrency(total)}\n\nProceed with checkout?`;

    Alert.alert('Confirm Checkout', msg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          const saleId = await handleCheckout(discount);
          if (saleId) {
            setDiscountInput('');
            navigation.navigate('Receipt', { saleId });
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Point of Sale" />

      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScannerVisible(true)}>
          <LinearGradient
            colors={GRADIENT_COLORS}
            locations={GRADIENT_LOCATIONS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanButtonGradient}
          />
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
        {services.length > 0 && (
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: colors.ACCENT }]}
            onPress={() => setServicePickerVisible(true)}>
            <Text style={styles.scanButtonText}>Services</Text>
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.slice(0, 5).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.searchItem}
              onPress={() => handleAddFromSearch(product)}>
              <Text style={styles.searchItemName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.searchItemPrice}>
                {formatCurrency(product.price)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.cartHeader}>
        <View>
          <Text style={styles.cartTitle}>Cart</Text>
          <Text style={styles.cartCount}>
            {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
          </Text>
        </View>
        {totalItemCount > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() =>
              Alert.alert('Clear Cart', 'Remove all items?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clear },
              ])
            }>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        style={styles.cartList}
        data={unifiedItems}
        keyExtractor={(item) =>
          item.type === 'product'
            ? `p-${item.data.product.id}`
            : `s-${item.data.service.id}`
        }
        renderItem={({ item: unified }) => {
          if (unified.type === 'product') {
            const ci = unified.data;
            return (
              <CartItemRow
                name={ci.product.name}
                price={ci.product.price}
                quantity={ci.quantity}
                onIncrement={() => increment(ci.product.id)}
                onDecrement={() => decrement(ci.product.id)}
                onRemove={() => removeItem(ci.product.id)}
              />
            );
          } else {
            const si = unified.data;
            return (
              <CartItemRow
                name={si.service.name}
                price={si.service.price}
                quantity={si.quantity}
                isService
                onIncrement={() => incrementService(si.service.id)}
                onDecrement={() => decrementService(si.service.id)}
                onRemove={() => removeService(si.service.id)}
              />
            );
          }
        }}
        ListEmptyComponent={
          <Text style={styles.emptyCart}>
            Scan or search to add products
          </Text>
        }
      />

      <View style={styles.footer}>
        {discount > 0 && (
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalAmount}>{formatCurrency(total)}</Text>
          </View>
        )}
        <View style={styles.discountRow}>
          <Text style={styles.discountLabel}>Discount</Text>
          <TextInput
            style={styles.discountInput}
            placeholder="0.00"
            placeholderTextColor={colors.INPUT_PLACEHOLDER}
            value={discountInput}
            onChangeText={setDiscountInput}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(finalTotal)}</Text>
        </View>
        <MainButton
          title="Checkout"
          onPress={onCheckout}
          disabled={totalItemCount === 0}
        />
      </View>

      <ScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={handleScanned}
      />

      <Modal
        visible={servicePickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => { setServicePickerVisible(false); setServiceSearch(''); }}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => { setServicePickerVisible(false); setServiceSearch(''); }}>
          <View style={styles.servicePickerContainer}>
            <Text style={styles.servicePickerTitle}>Select Service</Text>
            <View style={styles.serviceSearchContainer}>
              <TextInput
                style={styles.serviceSearchInput}
                placeholder="Search services..."
                placeholderTextColor={colors.INPUT_PLACEHOLDER}
                value={serviceSearch}
                onChangeText={setServiceSearch}
                autoFocus
              />
            </View>
            <FlatList
              data={filteredServices}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.servicePickerItem}
                  onPress={() => handleServiceSelect(item)}>
                  <Text style={styles.servicePickerName}>{item.name}</Text>
                  <Text style={styles.servicePickerPrice}>
                    {formatCurrency(item.price)}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyCart}>No services available</Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default POSScreen;

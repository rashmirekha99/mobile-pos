import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
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
import { deleteSale, getSaleById, getSaleCartItems, getSaleCartServices, updateSaleContents } from '../../services/salesService';

type UnifiedCartItem =
  | { type: 'product'; data: CartItem }
  | { type: 'service'; data: ServiceCartItem };

const POSScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'POS'>>();
  const editSaleId = route.params?.editSaleId;
  const isEditingSale = typeof editSaleId === 'number';
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
    replaceCart,
    total,
    totalItemCount,
    handleBarcodeScan,
    handleCheckout,
  } = useCart();

  const [scannerVisible, setScannerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [discountInput, setDiscountInput] = useState('');
  const [receivedAmountInput, setReceivedAmountInput] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [servicePickerVisible, setServicePickerVisible] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [loadingSale, setLoadingSale] = useState(isEditingSale);

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

  useEffect(() => {
    if (typeof editSaleId !== 'number') return;
    let cancelled = false;
    const loadSaleForEditing = async () => {
      setLoadingSale(true);
      try {
        const db = await getDatabase();
        const [sale, existingItems, existingServices] = await Promise.all([
          getSaleById(db, editSaleId),
          getSaleCartItems(db, editSaleId),
          getSaleCartServices(db, editSaleId),
        ]);
        if (!sale) throw new Error('This sale could not be found');
        if (cancelled) return;
        replaceCart(existingItems, existingServices);
        setDiscountInput(String(sale.discount || 0));
        setReceivedAmountInput(String(sale.received_amount || 0));
      } catch (error: any) {
        if (!cancelled) {
          Alert.alert('Unable to Edit Sale', error?.message || 'Failed to load this sale');
          navigation.goBack();
        }
      } finally {
        if (!cancelled) setLoadingSale(false);
      }
    };
    loadSaleForEditing();
    return () => { cancelled = true; };
  }, [editSaleId, navigation, replaceCart]);

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
  const parsedReceivedAmount = Number.parseFloat(receivedAmountInput);
  const receivedAmount = Number.isFinite(parsedReceivedAmount)
    ? Math.round(parsedReceivedAmount * 100) / 100
    : 0;
  const roundedFinalTotal = Math.round(finalTotal * 100) / 100;
  const changeOrBalance = receivedAmount >= roundedFinalTotal
    ? receivedAmount - roundedFinalTotal
    : roundedFinalTotal - receivedAmount;
  const changeLabel = receivedAmount >= roundedFinalTotal ? 'Change Due' : 'Balance Due';

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

    if (receivedAmount < roundedFinalTotal) {
      Alert.alert(
        'Insufficient Payment',
        `Enter an amount received that is at least ${formatCurrency(roundedFinalTotal)}.`,
      );
      return;
    }

    const msg = `${discount > 0 ? `Subtotal: ${formatCurrency(total)}\nDiscount: -${formatCurrency(discount)}\n` : ''}Total: ${formatCurrency(roundedFinalTotal)}\nReceived: ${formatCurrency(receivedAmount)}\nChange: ${formatCurrency(receivedAmount - roundedFinalTotal)}\n\n${isEditingSale ? 'Save changes to this sale?' : 'Proceed with checkout?'}`;

    Alert.alert(isEditingSale ? 'Save Sale Changes' : 'Confirm Checkout', msg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          let saleId: number | null = null;
          if (isEditingSale && typeof editSaleId === 'number') {
            try {
              const db = await getDatabase();
              await updateSaleContents(db, editSaleId, items, serviceItems, discount, receivedAmount);
              saleId = editSaleId;
            } catch (error: any) {
              Alert.alert('Unable to Save Sale', error?.message || 'Failed to save changes');
              return;
            }
          } else {
            saleId = await handleCheckout(discount, receivedAmount);
          }
          if (saleId) {
            setDiscountInput('');
            setReceivedAmountInput('');
            if (isEditingSale) navigation.goBack();
            else navigation.navigate('Receipt', { saleId });
          }
        },
      },
    ]);
  };

  const onDeleteEditedSale = () => {
    if (typeof editSaleId !== 'number') return;
    Alert.alert(
      'Delete Sale',
      'Delete this entire sale and restore its product stock?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              await deleteSale(db, editSaleId);
              clear();
              navigation.navigate('Dashboard');
            } catch (error: any) {
              Alert.alert('Unable to Delete Sale', error?.message || 'Failed to delete this sale');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AppBar
        title={isEditingSale ? `Edit Sale #${editSaleId}` : 'Point of Sale'}
        rightActions={isEditingSale && !loadingSale ? [{
          label: 'Delete',
          destructive: true,
          onPress: onDeleteEditedSale,
        }] : undefined}
      />

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

      <ScrollView
        style={styles.footerScroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
      <View style={styles.footer}>
        {discount > 0 && (
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalAmount}>{formatCurrency(total)}</Text>
          </View>
        )}
        <View style={styles.discountRow}>
          <Text style={styles.discountLabel}>Discount (Rs.)</Text>
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
        <View style={styles.paymentSection}>
          <View style={styles.paymentInputRow}>
            <Text style={styles.paymentInputLabel}>Cash Received</Text>
            <TextInput
              style={styles.paymentInput}
              placeholder="Enter amount"
              placeholderTextColor={colors.INPUT_PLACEHOLDER}
              value={receivedAmountInput}
              onChangeText={(value) => setReceivedAmountInput(value.replace(/[^0-9.]/g, ''))}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.changeRow}>
            <Text style={styles.changeLabel}>{changeLabel}</Text>
            <Text style={styles.changeAmount}>{formatCurrency(changeOrBalance)}</Text>
          </View>
        </View>
      <MainButton
        title={isEditingSale ? 'Save Changes' : 'Checkout'}
        onPress={onCheckout}
        disabled={totalItemCount === 0 || loadingSale}
      />
      </View>
      </ScrollView>
      </KeyboardAvoidingView>

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

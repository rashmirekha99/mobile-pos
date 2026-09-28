import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import MainButton from '../../../../shared/components/MainButton';
import useTheme from '../../../../shared/theme/useTheme';
import GetPOSScreenStyles from './POSScreenStyles';
import CartItemRow from '../../components/CartItemRow';
import ScannerModal from '../../components/ScannerModal';
import useCart from '../../hooks/useCart';
import { Product } from '../../../../shared/types';
import { formatCurrency } from '../../../../shared/utils/format';
import { getDatabase } from '../../../../shared/db/database';
import { searchProducts } from '../../../products/services/productService';

const POSScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetPOSScreenStyles(colors);

  const {
    items,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
    total,
    handleBarcodeScan,
    handleCheckout,
  } = useCart();

  const [scannerVisible, setScannerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

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

  const onCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart first');
      return;
    }

    Alert.alert(
      'Confirm Checkout',
      `Total: ${formatCurrency(total)}\n\nProceed with checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const saleId = await handleCheckout();
            if (saleId) {
              navigation.navigate('Receipt', { saleId });
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Point of Sale" />

      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScannerVisible(true)}>
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
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
            {items.length} item{items.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {items.length > 0 && (
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
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrement={() => increment(item.product.id)}
            onDecrement={() => decrement(item.product.id)}
            onRemove={() => removeItem(item.product.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyCart}>
            Scan or search to add products
          </Text>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </View>
        <MainButton
          title="Checkout"
          onPress={onCheckout}
          disabled={items.length === 0}
        />
      </View>

      <ScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={handleScanned}
      />
    </SafeAreaView>
  );
};

export default POSScreen;

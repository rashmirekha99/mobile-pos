import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useCartStore } from '../../../shared/store/cartStore';
import { getDatabase } from '../../../shared/db/database';
import { getProductByBarcode } from '../../products/services/productService';
import { createSale } from '../services/salesService';

const useCart = () => {
  const { items, addItem, removeItem, increment, decrement, clear, getTotal } =
    useCartStore();

  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      try {
        const db = await getDatabase();
        const product = await getProductByBarcode(db, barcode);
        if (product) {
          addItem(product);
          return true;
        } else {
          Alert.alert('Not Found', `No product found for barcode: ${barcode}`);
          return false;
        }
      } catch (error) {
        console.error('Barcode scan error:', error);
        return false;
      }
    },
    [addItem],
  );

  const handleCheckout = useCallback(async (): Promise<number | null> => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to the cart first');
      return null;
    }

    try {
      const db = await getDatabase();
      const saleId = await createSale(db, items);
      clear();
      return saleId;
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Failed to complete checkout');
      return null;
    }
  }, [items, clear]);

  return {
    items,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
    total: getTotal(),
    handleBarcodeScan,
    handleCheckout,
  };
};

export default useCart;

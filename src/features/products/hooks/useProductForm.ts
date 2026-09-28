import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getDatabase } from '../../../shared/db/database';
import { Product } from '../../../shared/types';
import { BarcodeType } from '../types';
import {
  getProductById,
  insertProduct,
  updateProduct,
} from '../services/productService';
import { generateRandomBarcode } from '../../../shared/utils/barcode';

const useProductForm = (productId?: number) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('CODE128');
  const [stock, setStock] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    }
  }, [productId]);

  const loadProduct = async (id: number) => {
    try {
      const db = await getDatabase();
      const product = await getProductById(db, id);
      if (product) {
        setName(product.name);
        setPrice(product.price.toString());
        setSku(product.sku || '');
        setBarcode(product.barcode || '');
        setBarcodeType(product.barcode_type);
        setStock(product.stock.toString());
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    }
  };

  const handleAutoGenerate = () => {
    const generated = generateRandomBarcode(barcodeType);
    setBarcode(generated);
  };

  const validate = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Product name is required');
      return false;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Validation', 'Please enter a valid price');
      return false;
    }
    return true;
  };

  const handleSave = async (): Promise<boolean> => {
    if (!validate()) return false;

    setIsLoading(true);
    try {
      const db = await getDatabase();
      const productData: Omit<Product, 'id' | 'created_at'> = {
        name: name.trim(),
        price: parseFloat(price),
        sku: sku.trim() || null,
        barcode: barcode.trim() || null,
        barcode_type: barcodeType,
        stock: parseInt(stock, 10) || 0,
      };

      if (isEditing && productId) {
        await updateProduct(db, productId, productData);
      } else {
        await insertProduct(db, productData);
      }
      return true;
    } catch (error: any) {
      const msg = error?.message || 'Failed to save product';
      if (msg.includes('UNIQUE constraint failed: products.barcode')) {
        Alert.alert('Error', 'A product with this barcode already exists');
      } else if (msg.includes('UNIQUE constraint failed: products.sku')) {
        Alert.alert('Error', 'A product with this SKU already exists');
      } else {
        Alert.alert('Error', msg);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    price,
    setPrice,
    sku,
    setSku,
    barcode,
    setBarcode,
    barcodeType,
    setBarcodeType,
    stock,
    setStock,
    isLoading,
    isEditing,
    handleAutoGenerate,
    handleSave,
  };
};

export default useProductForm;

import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import RNPrint from 'react-native-print';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import MainButton from '../../../../shared/components/MainButton';
import useTheme from '../../../../shared/theme/useTheme';
import GetProductFormScreenStyles from './ProductFormScreenStyles';
import BarcodeDisplay from '../../components/BarcodeDisplay';
import useProductForm from '../../hooks/useProductForm';
import { BarcodeType } from '../../types';

const BARCODE_TYPES: BarcodeType[] = ['QR', 'EAN13', 'CODE128'];

const ProductFormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProductForm'>>();
  const productId = route.params?.productId;

  const { colors } = useTheme();
  const styles = GetProductFormScreenStyles(colors);
  const barcodeRef = useRef<ViewShot>(null);

  const {
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
  } = useProductForm(productId);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      navigation.goBack();
    }
  };

  const handlePrint = async () => {
    try {
      if (!barcodeRef.current?.capture) return;
      const uri = await barcodeRef.current.capture();
      const base64 = await RNFS.readFile(uri, 'base64');
      await RNPrint.print({
        html: `
          <html>
            <body style="text-align:center; padding:20px;">
              <h2 style="margin-bottom:4px;">${name || 'Product'}</h2>
              <p style="margin-top:0; color:#666;">${barcode}</p>
              <img src="data:image/png;base64,${base64}" style="max-width:300px;" />
            </body>
          </html>
        `,
      });
    } catch (error: any) {
      if (error?.message !== 'User cancelled') {
        Alert.alert('Print Error', 'Failed to print barcode');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title={isEditing ? 'Edit Product' : 'Add Product'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>SKU</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter SKU (optional)"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={sku}
          onChangeText={setSku}
        />

        <Text style={styles.label}>Stock Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={stock}
          onChangeText={setStock}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Barcode Type</Text>
        <View style={styles.pickerRow}>
          {BARCODE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.pickerOption,
                barcodeType === type && styles.pickerOptionActive,
              ]}
              onPress={() => setBarcodeType(type)}>
              <Text
                style={[
                  styles.pickerText,
                  barcodeType === type && styles.pickerTextActive,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Barcode Value</Text>
        <View style={styles.barcodeRow}>
          <TextInput
            style={styles.barcodeInput}
            placeholder="Enter or auto-generate"
            placeholderTextColor={colors.INPUT_PLACEHOLDER}
            value={barcode}
            onChangeText={setBarcode}
          />
          <TouchableOpacity
            style={styles.autoButton}
            onPress={handleAutoGenerate}>
            <Text style={styles.autoButtonText}>Auto</Text>
          </TouchableOpacity>
        </View>

        {barcode.trim().length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview</Text>
            <ViewShot
              ref={barcodeRef}
              options={{ format: 'png', quality: 1.0 }}>
              <BarcodeDisplay value={barcode} type={barcodeType} />
            </ViewShot>
            <TouchableOpacity
              style={styles.printButton}
              onPress={handlePrint}>
              <Text style={styles.printButtonText}>Print Barcode</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.saveButton}>
          <MainButton
            title={isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            onPress={onSave}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductFormScreen;

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
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
import { usePrinterStore } from '../../../../shared/store/printerStore';
import {
  printImageBase64,
  isConnected as isPrinterConnected,
} from '../../../../shared/services/bluetoothPrinterService';
import { Supplier } from '../../../../shared/types';
import { getDatabase } from '../../../../shared/db/database';
import { getAllSuppliers } from '../../../suppliers/services/supplierService';
import { useSettingsStore } from '../../../../shared/store/settingsStore';
import { getSetting } from '../../../../shared/services/settingsService';
import { STORE_NAME } from '../../../../configs/Constants';
import { formatCurrency } from '../../../../shared/utils/format';

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
    buyingPrice,
    setBuyingPrice,
    supplierId,
    setSupplierId,
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

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const { profitMargin, setProfitMargin } = useSettingsStore();

  const confirmGoBack = useCallback(() => {
    Alert.alert('Go Back', 'Are you sure you want to go back? Unsaved changes will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => navigation.goBack() },
    ]);
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        confirmGoBack();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [confirmGoBack]),
  );

  useFocusEffect(
    useCallback(() => {
      const loadSuppliers = async () => {
        try {
          const db = await getDatabase();
          const data = await getAllSuppliers(db);
          setSuppliers(data);
        } catch {}
      };
      const loadMargin = async () => {
        try {
          const db = await getDatabase();
          const saved = await getSetting(db, 'profit_margin');
          if (saved) {
            const val = parseFloat(saved);
            if (!isNaN(val) && val >= 0) {
              setProfitMargin(val);
            }
          }
        } catch {}
      };
      loadSuppliers();
      loadMargin();
    }, []),
  );

  const applyMargin = () => {
    const bp = parseFloat(buyingPrice);
    if (isNaN(bp) || bp <= 0) {
      Alert.alert('Margin', 'Please enter a valid buying price first');
      return;
    }
    const sellingPrice = bp * (1 + profitMargin / 100);
    setPrice(sellingPrice.toFixed(2));
  };

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      navigation.goBack();
    }
  };

  const thermalConnected = usePrinterStore((s) => s.isConnected);

  const captureBarcode = async (): Promise<string | null> => {
    try {
      if (!barcodeRef.current?.capture) return null;
      const uri = await barcodeRef.current.capture();
      return await RNFS.readFile(uri, 'base64');
    } catch {
      return null;
    }
  };

  const handleNormalPrint = async (base64: string) => {
    await RNPrint.print({
      html: `
        <html>
          <body style="text-align:center; padding:20px;">
            <img src="data:image/png;base64,${base64}" style="max-width:300px;" />
          </body>
        </html>
      `,
    });
  };

  const handleThermalPrint = async (base64: string) => {
    await printImageBase64(base64);
  };

  const handleSaveImage = async () => {
    try {
      if (!barcodeRef.current?.capture) return;
      const uri = await barcodeRef.current.capture();
      const timestamp = Date.now();
      const safeName = (name || 'product').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `barcode_${safeName}_${timestamp}.png`;
      const destDir =
        Platform.OS === 'android'
          ? RNFS.PicturesDirectoryPath
          : RNFS.DocumentDirectoryPath;
      const destPath = `${destDir}/${fileName}`;
      await RNFS.copyFile(uri, destPath);
      if (Platform.OS === 'android') {
        await RNFS.scanFile(destPath);
      }
      Alert.alert('Saved', `Barcode image saved to:\n${destPath}`);
    } catch {
      Alert.alert('Error', 'Failed to save barcode image');
    }
  };

  const handlePrint = async () => {
    const base64 = await captureBarcode();
    if (!base64) return;

    if (thermalConnected && isPrinterConnected()) {
      Alert.alert('Print Method', 'Choose how to print the barcode:', [
        {
          text: 'Thermal Printer',
          onPress: async () => {
            try {
              await handleThermalPrint(base64);
            } catch {
              Alert.alert('Print Error', 'Failed to print to thermal printer');
            }
          },
        },
        {
          text: 'Normal Print',
          onPress: async () => {
            try {
              await handleNormalPrint(base64);
            } catch (error: any) {
              if (error?.message !== 'User cancelled') {
                Alert.alert('Print Error', 'Failed to print barcode');
              }
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      try {
        await handleNormalPrint(base64);
      } catch (error: any) {
        if (error?.message !== 'User cancelled') {
          Alert.alert('Print Error', 'Failed to print barcode');
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title={isEditing ? 'Edit Product' : 'Add Product'} onBackPress={confirmGoBack} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Buying Price</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={buyingPrice}
          onChangeText={setBuyingPrice}
          keyboardType="decimal-pad"
        />

        <View style={styles.labelRow}>
          <Text style={[styles.label, {marginTop: 0, marginBottom: 0}]}>Selling Price *</Text>
          <TouchableOpacity style={styles.marginButton} onPress={applyMargin}>
            <Text style={styles.marginButtonText}>+{profitMargin}%</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Supplier</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowSupplierPicker(true)}>
          <Text
            style={[
              styles.dropdownButtonText,
              !selectedSupplier && styles.dropdownPlaceholder,
            ]}>
            {selectedSupplier ? selectedSupplier.name : 'Select supplier (optional)'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={showSupplierPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSupplierPicker(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSupplierPicker(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Supplier</Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setSupplierId(null);
                  setShowSupplierPicker(false);
                }}>
                <Text style={styles.modalOptionText}>None</Text>
              </TouchableOpacity>
              <FlatList
                data={suppliers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      supplierId === item.id && styles.modalOptionActive,
                    ]}
                    onPress={() => {
                      setSupplierId(item.id);
                      setShowSupplierPicker(false);
                    }}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        supplierId === item.id && styles.modalOptionTextActive,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

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
              options={{ format: 'png', quality: 1.0, result: 'tmpfile', pixelRatio: 4 }}>
              <BarcodeDisplay value={barcode} type={barcodeType} label={name || undefined} price={price} />
            </ViewShot>
            <View style={styles.barcodeActionsRow}>
              <TouchableOpacity
                style={styles.printButton}
                onPress={handlePrint}>
                <Text style={styles.printButtonText}>Print Barcode</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveImageButton}
                onPress={handleSaveImage}>
                <Text style={styles.saveImageButtonText}>Save Image</Text>
              </TouchableOpacity>
            </View>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProductFormScreen;

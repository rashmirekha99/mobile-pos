import React, { useRef, useState, useCallback, useEffect } from 'react';
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
  StatusBar,
} from 'react-native';
import RNFS from 'react-native-fs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import RNPrint from 'react-native-print';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import useTheme from '../../../../shared/theme/useTheme';
import GetProductFormScreenStyles from './ProductFormScreenStyles';
import BarcodeDisplay from '../../components/BarcodeDisplay';
import useProductForm from '../../hooks/useProductForm';
import { BarcodeType } from '../../types';
import { usePrinterStore } from '../../../../shared/store/printerStore';
import {
  printTSPLLabelImageBase64,
  isConnected as isPrinterConnected,
} from '../../../../shared/services/bluetoothPrinterService';
import { Supplier } from '../../../../shared/types';
import { getDatabase } from '../../../../shared/db/database';
import { getAllSuppliers } from '../../../suppliers/services/supplierService';
import { useSettingsStore } from '../../../../shared/store/settingsStore';
import { getSetting, setSetting } from '../../../../shared/services/settingsService';
import { formatCurrency } from '../../../../shared/utils/format';

const GRADIENT_COLORS = ['#02078A', '#010450', '#01022E'];
const GRADIENT_LOCATIONS = [0, 0.55, 1];
const BARCODE_TYPES: BarcodeType[] = ['QR', 'EAN13', 'CODE128'];

const ProductFormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ProductForm'>>();
  const productId = route.params?.productId;
  const insets = useSafeAreaInsets();

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
  const [labelWidthMm, setLabelWidthMm] = useState('30');
  const [labelHeightMm, setLabelHeightMm] = useState('20');
  const [labelGapMm, setLabelGapMm] = useState('2');
  const [printCount, setPrintCount] = useState('1');
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

  // Calculate margin percentage
  const bp = parseFloat(buyingPrice);
  const sp = parseFloat(price);
  let marginPercent: number | null = null;
  let marginNegative = false;
  if (bp > 0 && !isNaN(sp)) {
    marginPercent = Math.round(((sp - bp) / bp) * 100);
    marginNegative = marginPercent < 0;
  }

  const applyMargin = () => {
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

  useEffect(() => {
    const loadLabelSize = async () => {
      try {
        const db = await getDatabase();
        const [width, height, gap] = await Promise.all([
          getSetting(db, 'barcode_label_width_mm'),
          getSetting(db, 'barcode_label_height_mm'),
          getSetting(db, 'barcode_label_gap_mm'),
        ]);
        if (width && Number(width) >= 20 && Number(width) <= 76) setLabelWidthMm(width);
        if (height && Number(height) >= 10 && Number(height) <= 300) setLabelHeightMm(height);
        if (gap && Number(gap) >= 0 && Number(gap) <= 10) setLabelGapMm(gap);
      } catch {
        // Keep default 30 x 20 mm label size.
      }
    };
    void loadLabelSize();
  }, []);

  const saveLabelDimension = async (key: 'barcode_label_width_mm' | 'barcode_label_height_mm' | 'barcode_label_gap_mm', value: string) => {
    const dimension = Number(value);
    const valid = Number.isFinite(dimension) && (key === 'barcode_label_width_mm'
      ? dimension >= 20 && dimension <= 76
      : key === 'barcode_label_height_mm' ? dimension >= 10 && dimension <= 300 : dimension >= 0 && dimension <= 10);
    if (!valid) {
      Alert.alert('Invalid label size', key === 'barcode_label_width_mm'
        ? 'Label width must be between 20 and 76 mm.'
        : key === 'barcode_label_height_mm' ? 'Label height must be between 10 and 300 mm.' : 'Label gap must be between 0 and 10 mm.');
      return;
    }
    try {
      const db = await getDatabase();
      await setSetting(db, key, String(dimension));
    } catch {
      Alert.alert('Error', 'Could not save the label size.');
    }
  };



  const captureBarcode = async (): Promise<string | null> => {
    try {
      if (!barcodeRef.current?.capture) return null;
      const uri = await barcodeRef.current.capture();
      return await RNFS.readFile(uri, 'base64');
    } catch {
      return null;
    }
  };

  const handleNormalPrint = async (base64: string, copies: number) => {
    const labels = Array.from({ length: copies }, () =>
      '<div class="label"><img src="data:image/png;base64,' + base64 + '" /></div>',
    ).join('');
    await RNPrint.print({
      html: '<html><head><style>@page{size:' + labelWidthMm + 'mm ' + labelHeightMm + 'mm;margin:0}body{margin:0}.label{width:' + labelWidthMm + 'mm;height:' + labelHeightMm + 'mm;page-break-after:always;display:flex;align-items:center;justify-content:center}.label img{width:' + labelWidthMm + 'mm;height:' + labelHeightMm + 'mm}</style></head><body>' + labels + '</body></html>',
    });
  };

  const handleThermalPrint = async (base64: string, copies: number) => {
    await printTSPLLabelImageBase64(base64, Number(labelWidthMm), Number(labelHeightMm), Number(labelGapMm), copies);
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
    const copies = Number(printCount);
    if (!Number.isInteger(copies) || copies < 1 || copies > 500) {
      Alert.alert('Invalid print count', 'Enter a whole number from 1 to 500.');
      return;
    }
    const base64 = await captureBarcode();
    if (!base64) return;

    if (thermalConnected && isPrinterConnected()) {
      Alert.alert('Print Method', 'Choose how to print the barcode:', [
        {
          text: 'Thermal Printer',
          onPress: async () => {
            try {
              await handleThermalPrint(base64, copies);
            } catch {
              Alert.alert('Print Error', 'Failed to print to thermal printer');
            }
          },
        },
        {
          text: 'Normal Print',
          onPress: async () => {
            try {
              await handleNormalPrint(base64, copies);
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
        await handleNormalPrint(base64, copies);
      } catch (error: any) {
        if (error?.message !== 'User cancelled') {
          Alert.alert('Print Error', 'Failed to print barcode');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#02078A" />

      {/* Hero header */}
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroContainer, { paddingTop: insets.top }]}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <View style={styles.heroTop}>
          <TouchableOpacity style={styles.backButton} onPress={confirmGoBack}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#FFFFFF"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.heroTitle}>
            {isEditing ? 'Edit Product' : 'Add Product'}
          </Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled">

          {/* Basic Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic Info</Text>
            <View>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Product Name<Text style={styles.required}>*</Text>
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                placeholderTextColor="#a9acc9"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Pricing */}
          <View style={[styles.card, styles.cardSecondary]}>
            <Text style={styles.cardTitle}>Pricing</Text>
            <View style={styles.twoColumns}>
              <View style={styles.columnItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Buying Price</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#a9acc9"
                  value={buyingPrice}
                  onChangeText={setBuyingPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.columnItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    Selling Price<Text style={styles.required}>*</Text>
                  </Text>
                  {marginPercent !== null ? (
                    <TouchableOpacity onPress={applyMargin}>
                      <LinearGradient
                        colors={marginNegative ? ['#e5484d', '#e5484d'] : GRADIENT_COLORS}
                        locations={marginNegative ? [0, 1] : GRADIENT_LOCATIONS}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.marginBadge}>
                        <Text style={styles.marginBadgeText}>
                          {marginPercent >= 0 ? '+' : ''}{marginPercent}%
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={applyMargin}>
                      <LinearGradient
                        colors={GRADIENT_COLORS}
                        locations={GRADIENT_LOCATIONS}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.marginBadge}>
                        <Text style={styles.marginBadgeText}>+{profitMargin}%</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#a9acc9"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          {/* Details */}
          <View style={[styles.card, styles.cardSecondary]}>
            <Text style={styles.cardTitle}>Details</Text>
            <View>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Supplier</Text>
              </View>
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
                <View style={styles.dropdownArrow} />
              </TouchableOpacity>
            </View>
            <View style={styles.twoColumns}>
              <View style={styles.columnItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>SKU</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Optional"
                  placeholderTextColor="#a9acc9"
                  value={sku}
                  onChangeText={setSku}
                />
              </View>
              <View style={styles.columnItem}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Stock Quantity</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#a9acc9"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>

          {/* Barcode */}
          <View style={[styles.card, styles.cardSecondary]}>
            <Text style={styles.cardTitle}>Barcode</Text>
            <View>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Barcode Type</Text>
              </View>
              <View style={styles.barcodeTypeRow}>
                {BARCODE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.barcodeTypeOption,
                      barcodeType === type && styles.barcodeTypeOptionActive,
                    ]}
                    onPress={() => setBarcodeType(type)}>
                    <Text
                      style={[
                        styles.barcodeTypeText,
                        barcodeType === type && styles.barcodeTypeTextActive,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Barcode Value</Text>
              </View>
              <View style={styles.barcodeValueRow}>
                <TextInput
                  style={styles.barcodeInput}
                  placeholder="Enter or auto-generate"
                  placeholderTextColor="#a9acc9"
                  value={barcode}
                  onChangeText={setBarcode}
                />
                <TouchableOpacity
                  style={styles.autoButton}
                  onPress={handleAutoGenerate}
                  activeOpacity={0.85}>
                  <LinearGradient
                    colors={GRADIENT_COLORS}
                    locations={GRADIENT_LOCATIONS}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 14,
                    }}
                  />
                  <Text style={styles.autoButtonText}>Auto</Text>
                </TouchableOpacity>
              </View>
            </View>

            {barcode.trim().length > 0 && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Barcode sticker size</Text>
                <View style={styles.labelSizeRow}>
                  <View style={styles.labelSizeField}>
                    <Text style={styles.labelSizeCaption}>Width (mm)</Text>
                    <TextInput
                      style={styles.labelSizeInput}
                      value={labelWidthMm}
                      onChangeText={setLabelWidthMm}
                      onBlur={() => void saveLabelDimension('barcode_label_width_mm', labelWidthMm)}
                      keyboardType="decimal-pad"
                      selectTextOnFocus
                    />
                  </View>
                  <Text style={styles.labelSizeTimes}>x</Text>
                  <View style={styles.labelSizeField}>
                    <Text style={styles.labelSizeCaption}>Height (mm)</Text>
                    <TextInput
                      style={styles.labelSizeInput}
                      value={labelHeightMm}
                      onChangeText={setLabelHeightMm}
                      onBlur={() => void saveLabelDimension('barcode_label_height_mm', labelHeightMm)}
                      keyboardType="decimal-pad"
                      selectTextOnFocus
                    />
                  </View>
                  <View style={styles.labelSizeField}>
                    <Text style={styles.labelSizeCaption}>Gap (mm)</Text>
                    <TextInput
                      style={styles.labelSizeInput}
                      value={labelGapMm}
                      onChangeText={setLabelGapMm}
                      onBlur={() => void saveLabelDimension('barcode_label_gap_mm', labelGapMm)}
                      keyboardType="decimal-pad"
                      selectTextOnFocus
                    />
                  </View>
                </View>
                <View style={styles.copyCountRow}>
                  <View style={styles.labelSizeField}>
                    <Text style={styles.labelSizeCaption}>Print count</Text>
                    <TextInput
                      style={styles.labelSizeInput}
                      value={printCount}
                      onChangeText={setPrintCount}
                      keyboardType="number-pad"
                      maxLength={3}
                      selectTextOnFocus
                    />
                  </View>
                </View>
                <Text style={styles.labelSizeHint}>Sticker width: 20-76 mm; height: 10-300 mm; gap: 0-10 mm.</Text>
                <ViewShot
                  ref={barcodeRef}
                  options={{ format: 'png', quality: 1.0, result: 'tmpfile', pixelRatio: 8 }}>
                  <BarcodeDisplay value={barcode} type={barcodeType} label={name || undefined} price={price} labelSizeMm={{ width: Number(labelWidthMm) || 30, height: Number(labelHeightMm) || 20 }} />
                </ViewShot>
                <View style={styles.barcodeActionsRow}>
                  <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
                    <Text style={styles.printButtonText}>Print Barcode</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveImageButton} onPress={handleSaveImage} activeOpacity={0.85}>
                    <LinearGradient
                      colors={GRADIENT_COLORS}
                      locations={GRADIENT_LOCATIONS}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12 }}
                    />
                    <Text style={styles.saveImageButtonText}>Save Image</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onSave}
            disabled={isLoading}
            activeOpacity={0.85}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              locations={GRADIENT_LOCATIONS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 18,
              }}
            />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Supplier picker modal */}
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
    </View>
  );
};

export default ProductFormScreen;

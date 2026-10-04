import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Linking, Alert, NativeModules } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import useTheme from '../../../shared/theme/useTheme';
import GetScannerModalStyles from './ScannerModalStyles';
import MainButton from '../../../shared/components/MainButton';

interface ScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanned: (barcode: string) => void;
}

const ScannerModal = ({ visible, onClose, onScanned }: ScannerModalProps) => {
  const { colors } = useTheme();
  const styles = GetScannerModalStyles(colors);
  const [hasPermission, setHasPermission] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const isScanningRef = useRef(true);
  const device = useCameraDevice('back');

  useEffect(() => {
    if (visible) {
      checkPermission();
      isScanningRef.current = true;
    } else {
      setTorchOn(false);
      setManualEntry(false);
      setManualBarcode('');
    }
  }, [visible]);

  const showPermissionAlert = () => {
    Alert.alert(
      'Camera Permission Required',
      'Camera access is needed to scan barcodes. Please enable it in your app settings.',
      [
        { text: 'Cancel', style: 'cancel', onPress: onClose },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ],
    );
  };

  const checkPermission = async () => {
    const currentStatus = Camera.getCameraPermissionStatus();
    if (currentStatus === 'granted' || currentStatus === 'authorized') {
      setHasPermission(true);
      return;
    }
    if (currentStatus === 'denied') {
      showPermissionAlert();
      return;
    }
    const newStatus = await Camera.requestCameraPermission();
    if (newStatus === 'granted' || newStatus === 'authorized') {
      setHasPermission(true);
    } else {
      showPermissionAlert();
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: [
      'qr',
      'ean-13',
      'ean-8',
      'code-128',
      'code-39',
      'code-93',
      'upc-a',
      'upc-e',
    ],
    onCodeScanned: useCallback(
      (codes) => {
        if (codes.length > 0 && isScanningRef.current) {
          isScanningRef.current = false;
          const value = codes[0].value;
          if (value) {
            try {
              NativeModules.RNBLEPrinter?.playBarcodeBeep?.();
            } catch {
              // Keep barcode scanning working if the native beep is unavailable.
            }
            onScanned(value);
            onClose();
          }
        }
      },
      [onScanned, onClose],
    ),
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modal}>
        {manualEntry ? (
          <View style={styles.manualEntryContainer}>
            <Text style={styles.permissionText}>Enter barcode number</Text>
            <TextInput
              style={styles.manualInput}
              value={manualBarcode}
              onChangeText={setManualBarcode}
              placeholder="Barcode number"
              placeholderTextColor="#999"
              keyboardType="default"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => {
                if (manualBarcode.trim()) {
                  onScanned(manualBarcode.trim());
                  onClose();
                }
              }}
            />
            <MainButton
              title="Submit"
              onPress={() => {
                onScanned(manualBarcode.trim());
                onClose();
              }}
              disabled={!manualBarcode.trim()}
            />
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => setManualEntry(false)}>
              <Text style={styles.manualEntryButtonText}>Back to Scanner</Text>
            </TouchableOpacity>
          </View>
        ) : hasPermission && device ? (
          <>
            <Camera
              style={styles.camera}
              device={device}
              isActive={visible}
              codeScanner={codeScanner}
              torch={torchOn ? 'on' : 'off'}
              enableBufferCompression={true}
            />
            <View style={styles.overlay}>
              <View style={styles.scanArea} />
            </View>
            <Text style={styles.instruction}>
              Point camera at a barcode to scan
            </Text>
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => setManualEntry(true)}>
              <Text style={styles.manualEntryButtonText}>Enter Manually</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Camera permission is required to scan barcodes
            </Text>
            <MainButton title="Grant Permission" onPress={checkPermission} />
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => setManualEntry(true)}>
              <Text style={styles.manualEntryButtonText}>Enter Manually</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          {hasPermission && device?.hasTorch && (
            <TouchableOpacity
              style={styles.torchButton}
              onPress={() => setTorchOn((prev) => !prev)}>
              <Text style={styles.torchText}>{torchOn ? 'Flash OFF' : 'Flash ON'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ScannerModal;

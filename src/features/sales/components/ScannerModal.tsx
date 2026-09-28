import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, Linking } from 'react-native';
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
  const [isScanning, setIsScanning] = useState(true);
  const device = useCameraDevice('back');

  useEffect(() => {
    if (visible) {
      checkPermission();
      setIsScanning(true);
    }
  }, [visible]);

  const checkPermission = async () => {
    const currentStatus = Camera.getCameraPermissionStatus();
    if (currentStatus === 'granted' || currentStatus === 'authorized') {
      setHasPermission(true);
      return;
    }
    if (currentStatus === 'denied') {
      // Already denied permanently, open settings
      Linking.openSettings();
      return;
    }
    const newStatus = await Camera.requestCameraPermission();
    setHasPermission(
      newStatus === 'granted' || newStatus === 'authorized',
    );
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
        if (codes.length > 0 && isScanning) {
          setIsScanning(false);
          const value = codes[0].value;
          if (value) {
            onScanned(value);
            onClose();
          }
        }
      },
      [isScanning, onScanned, onClose],
    ),
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modal}>
        {hasPermission && device ? (
          <>
            <Camera
              style={styles.camera}
              device={device}
              isActive={visible}
              codeScanner={codeScanner}
            />
            <View style={styles.overlay}>
              <View style={styles.scanArea} />
            </View>
            <Text style={styles.instruction}>
              Point camera at a barcode to scan
            </Text>
          </>
        ) : (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Camera permission is required to scan barcodes
            </Text>
            <MainButton title="Grant Permission" onPress={checkPermission} />
          </View>
        )}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ScannerModal;

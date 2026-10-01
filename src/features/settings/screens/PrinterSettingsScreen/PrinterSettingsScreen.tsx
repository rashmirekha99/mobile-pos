import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetPrinterSettingsScreenStyles from './PrinterSettingsScreenStyles';
import { usePrinterStore } from '../../../../shared/store/printerStore';
import {
  BluetoothDevice,
  requestPermissions,
  scanDevices,
  connectPrinter,
  disconnectPrinter,
  printText,
} from '../../../../shared/services/bluetoothPrinterService';
import { getDatabase } from '../../../../shared/db/database';
import { getSetting, setSetting } from '../../../../shared/services/settingsService';

const PrinterSettingsScreen = () => {
  const { colors } = useTheme();
  const styles = GetPrinterSettingsScreenStyles(colors);

  const {
    connectedDevice,
    isConnecting,
    isConnected,
    paperWidth,
    setConnectedDevice,
    setSavedDeviceAddress,
    setIsConnecting,
    setIsConnected,
    setPaperWidth,
    disconnect,
  } = usePrinterStore();

  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const db = await getDatabase();
      const savedAddress = await getSetting(db, 'printer_address');
      const savedWidth = await getSetting(db, 'paper_width');
      if (savedAddress) {
        setSavedDeviceAddress(savedAddress);
      }
      if (savedWidth === '58' || savedWidth === '80') {
        setPaperWidth(Number(savedWidth) as 58 | 80);
      }
    } catch {
      // Ignore load errors
    }
  };

  const handleScan = async () => {
    setScanning(true);
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Bluetooth permissions are needed to scan for printers.',
      );
      setScanning(false);
      return;
    }

    const found = await scanDevices();
    setDevices(found);
    setScanning(false);

    if (found.length === 0) {
      Alert.alert(
        'No Devices Found',
        'Make sure your printer is turned on and paired via Bluetooth settings.',
      );
    }
  };

  const handleConnect = async (device: BluetoothDevice) => {
    setIsConnecting(true);
    const success = await connectPrinter(device.macAddress);
    if (success) {
      setConnectedDevice(device);
      setIsConnected(true);
      setSavedDeviceAddress(device.macAddress);

      try {
        const db = await getDatabase();
        await setSetting(db, 'printer_address', device.macAddress);
        await setSetting(db, 'printer_name', device.deviceName);
      } catch {
        // Ignore save errors
      }

      Alert.alert('Connected', `Connected to ${device.deviceName}`);
    } else {
      Alert.alert('Connection Failed', 'Could not connect to the printer.');
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async () => {
    await disconnectPrinter();
    disconnect();
  };

  const handlePaperWidth = async (width: 58 | 80) => {
    setPaperWidth(width);
    try {
      const db = await getDatabase();
      await setSetting(db, 'paper_width', String(width));
    } catch {
      // Ignore save errors
    }
  };

  const handleTestPrint = async () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect to a printer first.');
      return;
    }
    try {
      await printText('<CB>Test Print</CB>\n');
      await printText('Mobile POS\n');
      await printText('Printer is working!\n\n\n');
      Alert.alert('Success', 'Test print sent.');
    } catch (error: any) {
      Alert.alert('Print Error', error?.message || 'Failed to print.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Printer Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusValue}>
                {isConnecting
                  ? 'Connecting...'
                  : isConnected
                  ? connectedDevice?.deviceName || 'Connected'
                  : 'Not Connected'}
              </Text>
            </View>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isConnected
                    ? colors.SUCCESS
                    : colors.TEXT_TERTIARY,
                },
              ]}
            />
          </View>
        </View>

        {isConnected ? (
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnect}>
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScan}
            disabled={scanning || isConnecting}>
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning...' : 'Scan for Devices'}
            </Text>
          </TouchableOpacity>
        )}

        {devices.length > 0 && !isConnected && (
          <>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            <View style={styles.deviceList}>
              {devices.map((device, index) => (
                <TouchableOpacity
                  key={device.macAddress}
                  style={[
                    styles.deviceRow,
                    index === devices.length - 1 && styles.deviceRowLast,
                  ]}
                  onPress={() => handleConnect(device)}
                  disabled={isConnecting}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deviceName}>{device.deviceName}</Text>
                    <Text style={styles.deviceAddress}>
                      {device.macAddress}
                    </Text>
                  </View>
                  <Text style={styles.connectText}>
                    {isConnecting ? '...' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Paper Width</Text>
        <View style={styles.paperWidthRow}>
          {([58, 80] as const).map((width) => (
            <TouchableOpacity
              key={width}
              style={[
                styles.paperWidthOption,
                paperWidth === width && styles.paperWidthOptionActive,
              ]}
              onPress={() => handlePaperWidth(width)}>
              <Text
                style={[
                  styles.paperWidthText,
                  paperWidth === width && styles.paperWidthTextActive,
                ]}>
                {width}mm
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.testButton} onPress={handleTestPrint}>
          <Text style={styles.testButtonText}>Test Print</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrinterSettingsScreen;

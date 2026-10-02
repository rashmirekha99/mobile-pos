import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
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

const GRADIENT_COLORS = ['#02078A', '#010450', '#01022E'];
const GRADIENT_LOCATIONS = [0, 0.55, 1];
const TEST_GRADIENT = ['#00d4ae', '#00b894'];

const PrinterSettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Scan icon rotation
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinLoop = useRef<Animated.CompositeAnimation>();

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 2200);
  }, [toastOpacity]);

  useEffect(() => {
    loadSavedSettings();
  }, []);

  useEffect(() => {
    if (scanning) {
      spinAnim.setValue(0);
      spinLoop.current = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      spinLoop.current.start();
    } else {
      spinLoop.current?.stop();
      spinAnim.setValue(0);
    }
  }, [scanning, spinAnim]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
    if (scanning) return;
    setScanning(true);
    setDevices([]);
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
      showToast('No devices found');
    }
  };

  const handleConnect = async (device: BluetoothDevice) => {
    setIsConnecting(true);
    const success = await connectPrinter(device.macAddress);
    if (success) {
      setConnectedDevice(device);
      setIsConnected(true);
      setSavedDeviceAddress(device.macAddress);
      setDevices([]);

      try {
        const db = await getDatabase();
        await setSetting(db, 'printer_address', device.macAddress);
        await setSetting(db, 'printer_name', device.deviceName);
      } catch {
        // Ignore save errors
      }

      showToast(`Connected to ${device.deviceName}`);
    } else {
      showToast('Connection failed');
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async () => {
    const name = connectedDevice?.deviceName || 'printer';
    await disconnectPrinter();
    disconnect();
    showToast(`Disconnected from ${name}`);
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
      showToast('Connect a printer first');
      return;
    }
    try {
      await printText('<CB>Test Print</CB>\n');
      await printText('Mobile POS\n');
      await printText('Printer is working!\n\n\n');
      showToast('Test page sent to printer');
    } catch (error: any) {
      showToast(error?.message || 'Failed to print');
    }
  };

  const PrinterIcon = ({ size = 21, color = colors.PRIMARY }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9V3h12v6M6 18H3v-7h18v7h-3M6 14h12v7H6z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
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
          <Text style={styles.heroTitle}>Printer Settings</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.mainContent}>
        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusValue}>
                {isConnecting
                  ? 'Connecting...'
                  : isConnected
                  ? `Connected to ${connectedDevice?.deviceName || 'Printer'}`
                  : 'Not Connected'}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                isConnected && styles.badgeConnected,
              ]}>
              <View
                style={[
                  styles.badgeDot,
                  isConnected && styles.badgeDotConnected,
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  isConnected && styles.badgeTextConnected,
                ]}>
                {isConnected ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        {/* Scan / Disconnect button */}
        {isConnected ? (
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={handleDisconnect}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke="#FFFFFF"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScan}
            disabled={scanning || isConnecting}
            activeOpacity={0.85}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              locations={GRADIENT_LOCATIONS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 18,
                },
              ]}
            />
            <Animated.View style={{ transform: [{ rotate: scanning ? spinInterpolate : '0deg' }] }}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11"
                  stroke="#FFFFFF"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Animated.View>
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning...' : 'Scan for Devices'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Device list */}
        {devices.length > 0 && !isConnected && (
          <View style={styles.devicesContainer}>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.macAddress}
                style={styles.deviceCard}
                onPress={() => handleConnect(device)}
                disabled={isConnecting}
                activeOpacity={0.7}>
                <View style={styles.deviceIconBox}>
                  <PrinterIcon />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.deviceName}</Text>
                  <Text style={styles.deviceAddress}>{device.macAddress}</Text>
                </View>
                <Text style={styles.connectText}>
                  {isConnecting ? '...' : 'Connect'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Paper Width */}
        <Text style={styles.sectionTitle}>Paper Width</Text>
        <View style={styles.paperWidthRow}>
          {([58, 80] as const).map((width) => {
            const active = paperWidth === width;
            return (
              <TouchableOpacity
                key={width}
                style={[
                  styles.paperWidthOption,
                  active && styles.paperWidthOptionActive,
                ]}
                onPress={() => handlePaperWidth(width)}
                activeOpacity={0.7}>
                <View
                  style={[
                    styles.paperStrip,
                    {
                      width: width === 58 ? 30 : 44,
                      backgroundColor: active ? colors.PRIMARY : colors.TEXT_TERTIARY,
                      opacity: active ? 0.9 : 0.25,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.paperWidthText,
                    active && styles.paperWidthTextActive,
                  ]}>
                  {width}mm
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Test Print */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={handleTestPrint}
          activeOpacity={0.85}>
          <LinearGradient
            colors={TEST_GRADIENT}
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
          <PrinterIcon size={20} color="#FFFFFF" />
          <Text style={styles.testButtonText}>Test Print</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toastContainer,
          {
            opacity: toastOpacity,
            bottom: 24 + insets.bottom,
          },
        ]}
        pointerEvents="none">
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default PrinterSettingsScreen;

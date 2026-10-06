import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/shared/theme';
import RootStackNavigator from './src/shared/navigators/RootStackNavigator';
import { getDatabase } from './src/shared/db/database';
import { getSetting } from './src/shared/services/settingsService';
import { connectPrinter, disconnectPrinter, requestPermissions } from './src/shared/services/bluetoothPrinterService';
import { usePrinterStore } from './src/shared/store/printerStore';
import { autoBackupIfNeeded } from './src/shared/services/backupService';

const PrinterAutoReconnect = () => {
  const reconnecting = useRef(false);
  const lastState = useRef<AppStateStatus>(AppState.currentState);

  const reconnect = useCallback(async (force = false) => {
    if (reconnecting.current) return;
    const store = usePrinterStore.getState();
    if (store.isConnecting || (store.isConnected && !force)) return;
    reconnecting.current = true;
    store.setIsConnecting(true);
    try {
      const db = await getDatabase();
      const [address, autoConnect, savedName] = await Promise.all([
        getSetting(db, 'printer_address'),
        getSetting(db, 'printer_auto_connect'),
        getSetting(db, 'printer_name'),
      ]);
      if (!address || autoConnect === 'false' || AppState.currentState !== 'active') return;
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted || AppState.currentState !== 'active') return;
      store.setSavedDeviceAddress(address);
      await disconnectPrinter();
      const success = await connectPrinter(address);
      store.setConnectedDevice(success ? { macAddress: address, deviceName: savedName || 'Printer' } : null);
      store.setIsConnected(success);
    } catch (error) {
      console.warn('Printer auto-reconnect failed:', error);
      usePrinterStore.getState().setIsConnected(false);
    } finally {
      usePrinterStore.getState().setIsConnecting(false);
      reconnecting.current = false;
    }
  }, []);

  useEffect(() => {
    void reconnect();
    const interval = setInterval(() => {
      if (AppState.currentState === 'active' && !usePrinterStore.getState().isConnected) void reconnect();
    }, 12000);
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackgrounded = lastState.current.match(/inactive|background/);
      lastState.current = nextState;
      if (wasBackgrounded && nextState === 'active') void reconnect(true);
    });
    return () => { clearInterval(interval); subscription.remove(); };
  }, [reconnect]);
  return null;
};

const AutoBackup = () => {
  useEffect(() => {
    autoBackupIfNeeded();
  }, []);
  return null;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AutoBackup />
        <PrinterAutoReconnect />
        <RootStackNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

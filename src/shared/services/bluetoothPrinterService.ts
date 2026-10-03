import { NativeModules, Platform, PermissionsAndroid } from 'react-native';
import {
  BLEPrinter,
  IBLEPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';

export interface BluetoothDevice {
  deviceName: string;
  macAddress: string;
}

let connected = false;

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    return Object.values(granted).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED,
    );
  } catch {
    return false;
  }
};

export const scanDevices = async (): Promise<BluetoothDevice[]> => {
  try {
    await BLEPrinter.init();
    const devices: IBLEPrinter[] = await BLEPrinter.getDeviceList();
    return devices.map((d) => ({
      deviceName: d.device_name || 'Unknown Device',
      macAddress: d.inner_mac_address,
    }));
  } catch (error) {
    console.error('Scan devices error:', error);
    return [];
  }
};

export const connectPrinter = async (macAddress: string): Promise<boolean> => {
  try {
    await BLEPrinter.connectPrinter(macAddress);
    connected = true;
    return true;
  } catch (error) {
    console.error('Connect printer error:', error);
    connected = false;
    return false;
  }
};

export const disconnectPrinter = async (): Promise<void> => {
  try {
    await BLEPrinter.closeConn();
  } catch {
    // Ignore disconnect errors
  }
  connected = false;
};

export const printImageBase64 = async (base64: string, paperWidth: 58 | 80 = 58): Promise<void> => {
  await BLEPrinter.printImageBase64(base64, {
    imageWidth: paperWidth === 80 ? 560 : 380,
  });
};

export const printTSPLLabelImageBase64 = async (base64: string, labelWidthMm: number, labelHeightMm: number, gapMm: number, copies: number): Promise<void> => {
  const imageWidth = Math.round((labelWidthMm / 25.4) * 203);
  const imageHeight = Math.round((labelHeightMm / 25.4) * 203);
  if (Platform.OS !== 'android' || typeof NativeModules.RNBLEPrinter?.printTSPLLabelImageBase64 !== 'function') {
    throw new Error('TSPL label printing requires a rebuilt Android app.');
  }
  await new Promise<void>((resolve, reject) => {
    NativeModules.RNBLEPrinter.printTSPLLabelImageBase64(base64, imageWidth, imageHeight, labelWidthMm, labelHeightMm, gapMm, copies, resolve, (error: string) => reject(new Error(error)));
  });
};

export const printText = async (text: string): Promise<void> => {
  await BLEPrinter.printText(text);
};

export const isConnected = (): boolean => {
  return connected;
};

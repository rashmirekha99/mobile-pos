import { create } from 'zustand';

export interface PrinterDevice {
  deviceName: string;
  macAddress: string;
}

interface PrinterState {
  connectedDevice: PrinterDevice | null;
  savedDeviceAddress: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  paperWidth: 58 | 80;
  setConnectedDevice: (device: PrinterDevice | null) => void;
  setSavedDeviceAddress: (address: string | null) => void;
  setIsConnecting: (connecting: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  setPaperWidth: (width: 58 | 80) => void;
  disconnect: () => void;
}

export const usePrinterStore = create<PrinterState>((set) => ({
  connectedDevice: null,
  savedDeviceAddress: null,
  isConnecting: false,
  isConnected: false,
  paperWidth: 58,

  setConnectedDevice: (device) => set({ connectedDevice: device }),
  setSavedDeviceAddress: (address) => set({ savedDeviceAddress: address }),
  setIsConnecting: (connecting) => set({ isConnecting: connecting }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setPaperWidth: (width) => set({ paperWidth: width }),
  disconnect: () =>
    set({
      connectedDevice: null,
      isConnected: false,
      isConnecting: false,
    }),
}));

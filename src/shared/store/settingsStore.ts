import { create } from 'zustand';

interface SettingsState {
  profitMargin: number;
  setProfitMargin: (margin: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  profitMargin: 30,
  setProfitMargin: (margin) => set({ profitMargin: margin }),
}));

import { create } from 'zustand';
import { CartItem, Product, Service, ServiceCartItem } from '../types';

interface CartState {
  items: CartItem[];
  serviceItems: ServiceCartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: number) => void;
  incrementService: (serviceId: number) => void;
  decrementService: (serviceId: number) => void;
  clear: () => void;
  getTotal: () => number;
  getTotalItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  serviceItems: [],

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  increment: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    })),

  decrement: (productId) =>
    set((state) => {
      const item = state.items.find((i) => i.product.id === productId);
      if (item && item.quantity <= 1) {
        return { items: state.items.filter((i) => i.product.id !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        ),
      };
    }),

  addService: (service) =>
    set((state) => {
      const existing = state.serviceItems.find((i) => i.service.id === service.id);
      if (existing) {
        return {
          serviceItems: state.serviceItems.map((i) =>
            i.service.id === service.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return { serviceItems: [...state.serviceItems, { service, quantity: 1 }] };
    }),

  removeService: (serviceId) =>
    set((state) => ({
      serviceItems: state.serviceItems.filter((i) => i.service.id !== serviceId),
    })),

  incrementService: (serviceId) =>
    set((state) => ({
      serviceItems: state.serviceItems.map((i) =>
        i.service.id === serviceId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    })),

  decrementService: (serviceId) =>
    set((state) => {
      const item = state.serviceItems.find((i) => i.service.id === serviceId);
      if (item && item.quantity <= 1) {
        return { serviceItems: state.serviceItems.filter((i) => i.service.id !== serviceId) };
      }
      return {
        serviceItems: state.serviceItems.map((i) =>
          i.service.id === serviceId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        ),
      };
    }),

  clear: () => set({ items: [], serviceItems: [] }),

  getTotal: () => {
    const productTotal = get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const serviceTotal = get().serviceItems.reduce(
      (sum, item) => sum + item.service.price * item.quantity,
      0,
    );
    return productTotal + serviceTotal;
  },

  getTotalItemCount: () => {
    return get().items.length + get().serviceItems.length;
  },
}));

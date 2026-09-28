export interface Product {
  id: number;
  name: string;
  price: number;
  sku: string | null;
  barcode: string | null;
  barcode_type: 'QR' | 'EAN13' | 'CODE128';
  stock: number;
  created_at: string;
}

export interface Sale {
  id: number;
  total: number;
  created_at: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  items: Array<{
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
}

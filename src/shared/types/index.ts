export interface Product {
  id: number;
  name: string;
  price: number;
  buying_price: number;
  supplier_id: number | null;
  sku: string | null;
  barcode: string | null;
  barcode_type: 'QR' | 'EAN13' | 'CODE128';
  stock: number;
  created_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}

export interface Sale {
  id: number;
  total: number;
  discount: number;
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
  totalProfit: number;
  items: Array<{
    product_name: string;
    supplier_name: string | null;
    total_quantity: number;
    total_revenue: number;
    total_cost: number;
    profit: number;
  }>;
}

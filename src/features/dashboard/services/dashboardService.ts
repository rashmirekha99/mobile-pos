import { SQLiteDatabase } from 'react-native-sqlite-storage';

export interface DashboardData {
  todaySales: number;
  todayCount: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  total_sold: number;
  supplier_id: number | null;
}

export interface InventorySummary {
  totalProducts: number;
  totalStockQty: number;
  totalSoldQty: number;
  items: InventoryItem[];
}

export const getDashboardData = async (
  db: SQLiteDatabase,
): Promise<DashboardData> => {
  const [results] = await db.executeSql(
    "SELECT COALESCE(SUM(total), 0) as todaySales, COUNT(*) as todayCount FROM sales WHERE date(created_at) = date('now','localtime')",
  );
  const row = results.rows.item(0);
  return {
    todaySales: row.todaySales,
    todayCount: row.todayCount,
  };
};

export const getInventorySummary = async (
  db: SQLiteDatabase,
): Promise<InventorySummary> => {
  const [results] = await db.executeSql(
    `SELECT p.id, p.name, p.stock, p.supplier_id,
            COALESCE(SUM(si.quantity), 0) as total_sold
     FROM products p
     LEFT JOIN sale_items si ON p.id = si.product_id
     GROUP BY p.id, p.name, p.stock, p.supplier_id
     ORDER BY p.name ASC`,
  );

  const items: InventoryItem[] = [];
  let totalStockQty = 0;
  let totalSoldQty = 0;

  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    items.push(row);
    totalStockQty += row.stock;
    totalSoldQty += row.total_sold;
  }

  return {
    totalProducts: items.length,
    totalStockQty,
    totalSoldQty,
    items,
  };
};

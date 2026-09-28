import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { CartItem, Sale, SaleItem } from '../../../shared/types';

export const createSale = async (
  db: SQLiteDatabase,
  items: CartItem[],
): Promise<number> => {
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const [saleResult] = await db.executeSql(
    'INSERT INTO sales (total) VALUES (?)',
    [total],
  );

  const saleId = saleResult.insertId;

  for (const item of items) {
    const subtotal = item.product.price * item.quantity;
    await db.executeSql(
      'INSERT INTO sale_items (sale_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [saleId, item.product.id, item.quantity, item.product.price, subtotal],
    );
    // Deduct stock
    await db.executeSql(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [item.quantity, item.product.id],
    );
  }

  return saleId;
};

export const getSaleById = async (
  db: SQLiteDatabase,
  saleId: number,
): Promise<Sale | null> => {
  const [results] = await db.executeSql(
    'SELECT * FROM sales WHERE id = ?',
    [saleId],
  );
  if (results.rows.length > 0) {
    return results.rows.item(0);
  }
  return null;
};

export const getSaleItems = async (
  db: SQLiteDatabase,
  saleId: number,
): Promise<Array<SaleItem & { product_name: string }>> => {
  const [results] = await db.executeSql(
    `SELECT si.*, p.name as product_name
     FROM sale_items si
     JOIN products p ON si.product_id = p.id
     WHERE si.sale_id = ?`,
    [saleId],
  );
  const items: Array<SaleItem & { product_name: string }> = [];
  for (let i = 0; i < results.rows.length; i++) {
    items.push(results.rows.item(i));
  }
  return items;
};

export const getTodaySalesCount = async (
  db: SQLiteDatabase,
): Promise<number> => {
  const [results] = await db.executeSql(
    "SELECT COUNT(*) as count FROM sales WHERE date(created_at) = date('now','localtime')",
  );
  return results.rows.item(0).count;
};

export const getTodaySalesTotal = async (
  db: SQLiteDatabase,
): Promise<number> => {
  const [results] = await db.executeSql(
    "SELECT COALESCE(SUM(total), 0) as total FROM sales WHERE date(created_at) = date('now','localtime')",
  );
  return results.rows.item(0).total;
};

import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { CartItem, Sale, SaleItem } from '../../../shared/types';

export const createSale = async (
  db: SQLiteDatabase,
  items: CartItem[],
  discount: number = 0,
): Promise<number> => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const total = Math.max(subtotal - discount, 0);

  const [saleResult] = await db.executeSql(
    'INSERT INTO sales (total, discount) VALUES (?, ?)',
    [total, discount],
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

export const removeSaleItem = async (
  db: SQLiteDatabase,
  saleId: number,
  saleItemId: number,
): Promise<boolean> => {
  // Get the item details before removing
  const [itemResult] = await db.executeSql(
    'SELECT * FROM sale_items WHERE id = ? AND sale_id = ?',
    [saleItemId, saleId],
  );
  if (itemResult.rows.length === 0) return false;

  const item = itemResult.rows.item(0);

  // Restore stock
  await db.executeSql(
    'UPDATE products SET stock = stock + ? WHERE id = ?',
    [item.quantity, item.product_id],
  );

  // Remove the item
  await db.executeSql('DELETE FROM sale_items WHERE id = ?', [saleItemId]);

  // Update sale total
  const [totalResult] = await db.executeSql(
    'SELECT COALESCE(SUM(subtotal), 0) as new_total FROM sale_items WHERE sale_id = ?',
    [saleId],
  );
  const newTotal = totalResult.rows.item(0).new_total;

  if (newTotal === 0) {
    // No items left, delete the sale
    await db.executeSql('DELETE FROM sales WHERE id = ?', [saleId]);
    return false; // indicates sale was deleted
  }

  await db.executeSql('UPDATE sales SET total = ? WHERE id = ?', [newTotal, saleId]);
  return true; // sale still exists
};

export const deleteSale = async (
  db: SQLiteDatabase,
  saleId: number,
): Promise<void> => {
  // Restore stock for all items
  const [itemsResult] = await db.executeSql(
    'SELECT product_id, quantity FROM sale_items WHERE sale_id = ?',
    [saleId],
  );
  for (let i = 0; i < itemsResult.rows.length; i++) {
    const item = itemsResult.rows.item(i);
    await db.executeSql(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [item.quantity, item.product_id],
    );
  }

  // Delete items then sale
  await db.executeSql('DELETE FROM sale_items WHERE sale_id = ?', [saleId]);
  await db.executeSql('DELETE FROM sales WHERE id = ?', [saleId]);
};

export const getSalesByDate = async (
  db: SQLiteDatabase,
  date: string,
): Promise<Array<Sale & { item_count: number }>> => {
  const [results] = await db.executeSql(
    `SELECT s.*, COUNT(si.id) as item_count
     FROM sales s
     LEFT JOIN sale_items si ON si.sale_id = s.id
     WHERE date(s.created_at) = ?
     GROUP BY s.id
     ORDER BY s.created_at DESC`,
    [date],
  );
  const sales: Array<Sale & { item_count: number }> = [];
  for (let i = 0; i < results.rows.length; i++) {
    sales.push(results.rows.item(i));
  }
  return sales;
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

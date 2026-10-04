import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { CartItem, Sale, SaleItem, ServiceCartItem } from '../../../shared/types';

export interface SaleServiceItem {
  id: number;
  sale_id: number;
  service_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export const createSale = async (
  db: SQLiteDatabase,
  items: CartItem[],
  serviceItems: ServiceCartItem[] = [],
  discount: number = 0,
  receivedAmount: number = 0,
): Promise<number> => {
  const productSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const serviceSubtotal = serviceItems.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0,
  );
  const total = Math.round(Math.max(productSubtotal + serviceSubtotal - discount, 0) * 100) / 100;
  const roundedReceivedAmount = Math.round(receivedAmount * 100) / 100;
  if (!Number.isFinite(roundedReceivedAmount) || roundedReceivedAmount < total) {
    throw new Error('Received amount must cover the sale total');
  }
  const changeDue = Math.round((roundedReceivedAmount - total) * 100) / 100;

  const [saleResult] = await db.executeSql(
    'INSERT INTO sales (total, discount, received_amount, change_due) VALUES (?, ?, ?, ?)',
    [total, discount, roundedReceivedAmount, changeDue],
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

  for (const item of serviceItems) {
    const subtotal = item.service.price * item.quantity;
    await db.executeSql(
      'INSERT INTO sale_service_items (sale_id, service_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [saleId, item.service.id, item.quantity, item.service.price, subtotal],
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

export const getSaleServiceItems = async (
  db: SQLiteDatabase,
  saleId: number,
): Promise<Array<SaleServiceItem & { service_name: string }>> => {
  const [results] = await db.executeSql(
    `SELECT ssi.*, s.name as service_name
     FROM sale_service_items ssi
     JOIN services s ON ssi.service_id = s.id
     WHERE ssi.sale_id = ?`,
    [saleId],
  );
  const items: Array<SaleServiceItem & { service_name: string }> = [];
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

  return await recalcSaleTotal(db, saleId);
};

export const removeSaleServiceItem = async (
  db: SQLiteDatabase,
  saleId: number,
  saleServiceItemId: number,
): Promise<boolean> => {
  await db.executeSql('DELETE FROM sale_service_items WHERE id = ? AND sale_id = ?', [saleServiceItemId, saleId]);
  return await recalcSaleTotal(db, saleId);
};

const recalcSaleTotal = async (
  db: SQLiteDatabase,
  saleId: number,
): Promise<boolean> => {
  const [productTotal] = await db.executeSql(
    'SELECT COALESCE(SUM(subtotal), 0) as total FROM sale_items WHERE sale_id = ?',
    [saleId],
  );
  const [serviceTotal] = await db.executeSql(
    'SELECT COALESCE(SUM(subtotal), 0) as total FROM sale_service_items WHERE sale_id = ?',
    [saleId],
  );
  const newTotal = productTotal.rows.item(0).total + serviceTotal.rows.item(0).total;

  if (newTotal === 0) {
    await db.executeSql('DELETE FROM sales WHERE id = ?', [saleId]);
    return false; // sale deleted
  }

  await db.executeSql(
    'UPDATE sales SET total = ?, change_due = MAX(received_amount - ?, 0) WHERE id = ?',
    [newTotal, newTotal, saleId],
  );
  return true; // sale still exists
};

export const deleteSale = async (
  db: SQLiteDatabase,
  saleId: number,
): Promise<void> => {
  // Restore stock for product items
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

  // Delete all items then sale
  await db.executeSql('DELETE FROM sale_items WHERE sale_id = ?', [saleId]);
  await db.executeSql('DELETE FROM sale_service_items WHERE sale_id = ?', [saleId]);
  await db.executeSql('DELETE FROM sales WHERE id = ?', [saleId]);
};

export const getSalesByDate = async (
  db: SQLiteDatabase,
  date: string,
): Promise<Array<Sale & { item_count: number }>> => {
  const [results] = await db.executeSql(
    `SELECT s.*,
       (SELECT COUNT(*) FROM sale_items WHERE sale_id = s.id) +
       (SELECT COUNT(*) FROM sale_service_items WHERE sale_id = s.id) as item_count
     FROM sales s
     WHERE date(s.created_at) = ?
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

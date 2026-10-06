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

export const getSaleCartItems = async (db: SQLiteDatabase, saleId: number): Promise<CartItem[]> => {
  const [results] = await db.executeSql(
    `SELECT p.*, si.quantity, si.price AS sale_price FROM sale_items si
     JOIN products p ON p.id = si.product_id WHERE si.sale_id = ?`,
    [saleId],
  );
  const items: CartItem[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    items.push({ product: { ...row, price: Number(row.sale_price) }, quantity: Number(row.quantity) });
  }
  return items;
};

export const getSaleCartServices = async (db: SQLiteDatabase, saleId: number): Promise<ServiceCartItem[]> => {
  const [results] = await db.executeSql(
    `SELECT s.*, ssi.quantity, ssi.price AS sale_price FROM sale_service_items ssi
     JOIN services s ON s.id = ssi.service_id WHERE ssi.sale_id = ?`,
    [saleId],
  );
  const items: ServiceCartItem[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    items.push({ service: { ...row, price: Number(row.sale_price) }, quantity: Number(row.quantity) });
  }
  return items;
};

export const updateSaleContents = async (
  db: SQLiteDatabase,
  saleId: number,
  items: CartItem[],
  serviceItems: ServiceCartItem[],
  discount: number,
  receivedAmount: number,
): Promise<void> => {
  if (!Number.isFinite(discount) || discount < 0 || !Number.isFinite(receivedAmount) || receivedAmount < 0) {
    throw new Error('Enter valid discount and amount received values');
  }

  const [oldItemsResult] = await db.executeSql(
    'SELECT product_id, quantity FROM sale_items WHERE sale_id = ?', [saleId],
  );
  const oldQuantities = new Map<number, number>();
  for (let i = 0; i < oldItemsResult.rows.length; i++) {
    const row = oldItemsResult.rows.item(i);
    oldQuantities.set(Number(row.product_id), Number(row.quantity));
  }
  const newQuantities = new Map<number, number>();
  items.forEach(item => newQuantities.set(item.product.id, item.quantity));

  const [saleResult] = await db.executeSql('SELECT id FROM sales WHERE id = ?', [saleId]);
  if (!saleResult.rows.length) throw new Error('This sale no longer exists');

  // Check all added stock before changing any records.
  for (const item of items) {
    const added = item.quantity - (oldQuantities.get(item.product.id) || 0);
    if (added > 0) {
      const [stockResult] = await db.executeSql('SELECT stock FROM products WHERE id = ?', [item.product.id]);
      const available = stockResult.rows.length ? Number(stockResult.rows.item(0).stock) : 0;
      if (available < added) {
        throw new Error(`Not enough stock for ${item.product.name}. Available: ${available}`);
      }
    }
  }

  for (const [productId, oldQuantity] of oldQuantities) {
    const delta = (newQuantities.get(productId) || 0) - oldQuantity;
    if (delta !== 0) {
      await db.executeSql('UPDATE products SET stock = stock - ? WHERE id = ?', [delta, productId]);
    }
  }
  for (const item of items) {
    if (!oldQuantities.has(item.product.id)) {
      await db.executeSql('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product.id]);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) +
    serviceItems.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  const roundedDiscount = Math.round(discount * 100) / 100;
  const total = Math.round(Math.max(subtotal - roundedDiscount, 0) * 100) / 100;
  const received = Math.round(receivedAmount * 100) / 100;

  await db.executeSql('DELETE FROM sale_items WHERE sale_id = ?', [saleId]);
  await db.executeSql('DELETE FROM sale_service_items WHERE sale_id = ?', [saleId]);
  for (const item of items) {
    const itemSubtotal = item.product.price * item.quantity;
    await db.executeSql(
      'INSERT INTO sale_items (sale_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [saleId, item.product.id, item.quantity, item.product.price, itemSubtotal],
    );
  }
  for (const item of serviceItems) {
    const itemSubtotal = item.service.price * item.quantity;
    await db.executeSql(
      'INSERT INTO sale_service_items (sale_id, service_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [saleId, item.service.id, item.quantity, item.service.price, itemSubtotal],
    );
  }
  await db.executeSql(
    'UPDATE sales SET total = ?, discount = ?, received_amount = ?, change_due = MAX(? - ?, 0) WHERE id = ?',
    [total, roundedDiscount, received, received, total, saleId],
  );
};

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

export const getSalesByDateRange = async (
  db: SQLiteDatabase,
  fromDate: string,
  toDate: string,
): Promise<Array<Sale & { item_count: number }>> => {
  const [results] = await db.executeSql(
    `SELECT s.*,
       (SELECT COUNT(*) FROM sale_items WHERE sale_id = s.id) +
       (SELECT COUNT(*) FROM sale_service_items WHERE sale_id = s.id) as item_count
     FROM sales s
     WHERE date(s.created_at) >= ? AND date(s.created_at) <= ?
     ORDER BY s.created_at DESC`,
    [fromDate, toDate],
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

import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Product } from '../../../shared/types';

export const getAllProducts = async (db: SQLiteDatabase): Promise<Product[]> => {
  const [results] = await db.executeSql(
    'SELECT * FROM products ORDER BY created_at DESC',
  );
  const products: Product[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    products.push(results.rows.item(i));
  }
  return products;
};

export const getProductById = async (
  db: SQLiteDatabase,
  id: number,
): Promise<Product | null> => {
  const [results] = await db.executeSql(
    'SELECT * FROM products WHERE id = ?',
    [id],
  );
  if (results.rows.length > 0) {
    return results.rows.item(0);
  }
  return null;
};

export const getProductByBarcode = async (
  db: SQLiteDatabase,
  barcode: string,
): Promise<Product | null> => {
  const [results] = await db.executeSql(
    'SELECT * FROM products WHERE barcode = ?',
    [barcode],
  );
  if (results.rows.length > 0) {
    return results.rows.item(0);
  }
  return null;
};

export const searchProducts = async (
  db: SQLiteDatabase,
  query: string,
): Promise<Product[]> => {
  const [results] = await db.executeSql(
    "SELECT * FROM products WHERE name LIKE ? OR sku LIKE ? ORDER BY name ASC",
    [`%${query}%`, `%${query}%`],
  );
  const products: Product[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    products.push(results.rows.item(i));
  }
  return products;
};

export const insertProduct = async (
  db: SQLiteDatabase,
  product: Omit<Product, 'id' | 'created_at'>,
): Promise<number> => {
  const [result] = await db.executeSql(
    'INSERT INTO products (name, price, buying_price, supplier_id, category_id, sku, barcode, barcode_type, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [product.name, product.price, product.buying_price, product.supplier_id, product.category_id ?? null, product.sku, product.barcode, product.barcode_type, product.stock],
  );
  return result.insertId;
};

export const updateProduct = async (
  db: SQLiteDatabase,
  id: number,
  product: Omit<Product, 'id' | 'created_at'>,
): Promise<void> => {
  await db.executeSql(
    'UPDATE products SET name = ?, price = ?, buying_price = ?, supplier_id = ?, category_id = ?, sku = ?, barcode = ?, barcode_type = ?, stock = ? WHERE id = ?',
    [product.name, product.price, product.buying_price, product.supplier_id, product.category_id ?? null, product.sku, product.barcode, product.barcode_type, product.stock, id],
  );
};

export const deleteProduct = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  await db.executeSql('DELETE FROM products WHERE id = ?', [id]);
};

export const deductStock = async (
  db: SQLiteDatabase,
  productId: number,
  quantity: number,
): Promise<void> => {
  await db.executeSql(
    'UPDATE products SET stock = stock - ? WHERE id = ?',
    [quantity, productId],
  );
};

export const getLowStockProducts = async (
  db: SQLiteDatabase,
  threshold: number = 5,
): Promise<Product[]> => {
  const [results] = await db.executeSql(
    'SELECT * FROM products WHERE stock <= ? AND stock >= 0 ORDER BY stock ASC',
    [threshold],
  );
  const products: Product[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    products.push(results.rows.item(i));
  }
  return products;
};

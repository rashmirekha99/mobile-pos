import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Supplier } from '../../../shared/types';

export const getAllSuppliers = async (db: SQLiteDatabase): Promise<Supplier[]> => {
  const [results] = await db.executeSql(
    'SELECT * FROM suppliers ORDER BY name ASC',
  );
  const suppliers: Supplier[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    suppliers.push(results.rows.item(i));
  }
  return suppliers;
};

export const getSupplierById = async (
  db: SQLiteDatabase,
  id: number,
): Promise<Supplier | null> => {
  const [results] = await db.executeSql(
    'SELECT * FROM suppliers WHERE id = ?',
    [id],
  );
  if (results.rows.length > 0) {
    return results.rows.item(0);
  }
  return null;
};

export const insertSupplier = async (
  db: SQLiteDatabase,
  supplier: Omit<Supplier, 'id' | 'created_at'>,
): Promise<number> => {
  const [result] = await db.executeSql(
    'INSERT INTO suppliers (name, phone, email, address) VALUES (?, ?, ?, ?)',
    [supplier.name, supplier.phone, supplier.email, supplier.address],
  );
  return result.insertId;
};

export const updateSupplier = async (
  db: SQLiteDatabase,
  id: number,
  supplier: Omit<Supplier, 'id' | 'created_at'>,
): Promise<void> => {
  await db.executeSql(
    'UPDATE suppliers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
    [supplier.name, supplier.phone, supplier.email, supplier.address, id],
  );
};

export const deleteSupplier = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  await db.executeSql(
    'UPDATE products SET supplier_id = NULL WHERE supplier_id = ?',
    [id],
  );
  await db.executeSql('DELETE FROM suppliers WHERE id = ?', [id]);
};

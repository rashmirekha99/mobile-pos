import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Service } from '../../../shared/types';

export const getAllServices = async (db: SQLiteDatabase): Promise<Service[]> => {
  const [results] = await db.executeSql('SELECT * FROM services ORDER BY name ASC');
  const services: Service[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    services.push(results.rows.item(i));
  }
  return services;
};

export const getServiceById = async (
  db: SQLiteDatabase,
  id: number,
): Promise<Service | null> => {
  const [results] = await db.executeSql('SELECT * FROM services WHERE id = ?', [id]);
  if (results.rows.length > 0) {
    return results.rows.item(0);
  }
  return null;
};

export const insertService = async (
  db: SQLiteDatabase,
  service: { name: string; price: number },
): Promise<number> => {
  const [result] = await db.executeSql(
    'INSERT INTO services (name, price) VALUES (?, ?)',
    [service.name, service.price],
  );
  return result.insertId;
};

export const updateService = async (
  db: SQLiteDatabase,
  id: number,
  service: { name: string; price: number },
): Promise<void> => {
  await db.executeSql(
    'UPDATE services SET name = ?, price = ? WHERE id = ?',
    [service.name, service.price, id],
  );
};

export const deleteService = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  await db.executeSql('DELETE FROM service_sales WHERE service_id = ?', [id]);
  await db.executeSql('DELETE FROM sale_service_items WHERE service_id = ?', [id]);
  await db.executeSql('DELETE FROM services WHERE id = ?', [id]);
};

export const getServiceSalesByDate = async (
  db: SQLiteDatabase,
  date: string,
): Promise<Array<{ sale_id: number; service_name: string; quantity: number; subtotal: number; created_at: string }>> => {
  const [results] = await db.executeSql(
    `SELECT ssi.sale_id, s.name as service_name, ssi.quantity, ssi.subtotal, sa.created_at
     FROM sale_service_items ssi
     JOIN services s ON ssi.service_id = s.id
     JOIN sales sa ON ssi.sale_id = sa.id
     WHERE date(sa.created_at) = ?
     ORDER BY sa.created_at DESC`,
    [date],
  );
  const sales: Array<{ sale_id: number; service_name: string; quantity: number; subtotal: number; created_at: string }> = [];
  for (let i = 0; i < results.rows.length; i++) {
    sales.push(results.rows.item(i));
  }
  return sales;
};

export const getServiceSalesByDateRange = async (
  db: SQLiteDatabase,
  fromDate: string,
  toDate: string,
): Promise<Array<{ sale_id: number; service_name: string; quantity: number; subtotal: number; created_at: string }>> => {
  const [results] = await db.executeSql(
    `SELECT ssi.sale_id, s.name as service_name, ssi.quantity, ssi.subtotal, sa.created_at
     FROM sale_service_items ssi
     JOIN services s ON ssi.service_id = s.id
     JOIN sales sa ON ssi.sale_id = sa.id
     WHERE date(sa.created_at) >= ? AND date(sa.created_at) <= ?
     ORDER BY sa.created_at DESC`,
    [fromDate, toDate],
  );
  const sales: Array<{ sale_id: number; service_name: string; quantity: number; subtotal: number; created_at: string }> = [];
  for (let i = 0; i < results.rows.length; i++) {
    sales.push(results.rows.item(i));
  }
  return sales;
};

export const getServiceSalesSummary = async (
  db: SQLiteDatabase,
  date: string,
): Promise<{
  totalRevenue: number;
  totalTransactions: number;
  items: Array<{ service_name: string; total_count: number; total_revenue: number }>;
}> => {
  const [totalResult] = await db.executeSql(
    `SELECT COALESCE(SUM(ssi.subtotal), 0) as totalRevenue,
            COUNT(DISTINCT ssi.sale_id) as totalTransactions
     FROM sale_service_items ssi
     JOIN sales sa ON ssi.sale_id = sa.id
     WHERE date(sa.created_at) = ?`,
    [date],
  );
  const row = totalResult.rows.item(0);

  const [itemsResult] = await db.executeSql(
    `SELECT s.name as service_name,
            SUM(ssi.quantity) as total_count,
            SUM(ssi.subtotal) as total_revenue
     FROM sale_service_items ssi
     JOIN services s ON ssi.service_id = s.id
     JOIN sales sa ON ssi.sale_id = sa.id
     WHERE date(sa.created_at) = ?
     GROUP BY ssi.service_id, s.name
     ORDER BY total_revenue DESC`,
    [date],
  );

  const items: Array<{ service_name: string; total_count: number; total_revenue: number }> = [];
  for (let i = 0; i < itemsResult.rows.length; i++) {
    items.push(itemsResult.rows.item(i));
  }

  return {
    totalRevenue: row.totalRevenue,
    totalTransactions: row.totalTransactions,
    items,
  };
};

export const getServiceSalesRangeSummary = async (
  db: SQLiteDatabase,
  fromDate: string,
  toDate: string,
): Promise<{
  totalRevenue: number;
  totalTransactions: number;
  items: Array<{ service_name: string; total_count: number; total_revenue: number }>;
}> => {
  const [totalResult] = await db.executeSql(
    `SELECT COALESCE(SUM(ssi.subtotal), 0) as totalRevenue,
            COUNT(DISTINCT ssi.sale_id) as totalTransactions
     FROM sale_service_items ssi
     JOIN sales sa ON ssi.sale_id = sa.id
     WHERE date(sa.created_at) >= ? AND date(sa.created_at) <= ?`,
    [fromDate, toDate],
  );
  const row = totalResult.rows.item(0);

  const [itemsResult] = await db.executeSql(
    `SELECT s.name as service_name,
            SUM(ssi.quantity) as total_count,
            SUM(ssi.subtotal) as total_revenue
     FROM sale_service_items ssi
     JOIN services s ON ssi.service_id = s.id
     JOIN sales sa ON ssi.sale_id = sa.id
     WHERE date(sa.created_at) >= ? AND date(sa.created_at) <= ?
     GROUP BY ssi.service_id, s.name
     ORDER BY total_revenue DESC`,
    [fromDate, toDate],
  );

  const items: Array<{ service_name: string; total_count: number; total_revenue: number }> = [];
  for (let i = 0; i < itemsResult.rows.length; i++) {
    items.push(itemsResult.rows.item(i));
  }

  return {
    totalRevenue: row.totalRevenue,
    totalTransactions: row.totalTransactions,
    items,
  };
};

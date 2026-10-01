import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { SalesSummary } from '../../../shared/types';

export const getDailySummary = async (
  db: SQLiteDatabase,
  date: string,
): Promise<SalesSummary> => {
  const [totalResult] = await db.executeSql(
    "SELECT COALESCE(SUM(total), 0) as totalSales, COUNT(*) as totalTransactions FROM sales WHERE date(created_at) = ?",
    [date],
  );

  const row = totalResult.rows.item(0);

  const [itemsResult] = await db.executeSql(
    `SELECT p.name as product_name,
            sup.name as supplier_name,
            SUM(si.quantity) as total_quantity,
            SUM(si.subtotal) as total_revenue,
            SUM(si.quantity * COALESCE(p.buying_price, 0)) as total_cost,
            SUM(si.subtotal) - SUM(si.quantity * COALESCE(p.buying_price, 0)) as profit
     FROM sale_items si
     JOIN sales s ON si.sale_id = s.id
     JOIN products p ON si.product_id = p.id
     LEFT JOIN suppliers sup ON p.supplier_id = sup.id
     WHERE date(s.created_at) = ?
     GROUP BY si.product_id, p.name
     ORDER BY total_revenue DESC`,
    [date],
  );

  const items: SalesSummary['items'] = [];
  let totalProfit = 0;
  for (let i = 0; i < itemsResult.rows.length; i++) {
    const item = itemsResult.rows.item(i);
    items.push(item);
    totalProfit += item.profit || 0;
  }

  return {
    totalSales: row.totalSales,
    totalTransactions: row.totalTransactions,
    totalProfit,
    items,
  };
};

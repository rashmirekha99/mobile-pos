import { useState, useCallback } from 'react';
import { getDatabase } from '../../../shared/db/database';
import { getDashboardData } from '../services/dashboardService';
import { getOutOfStockProducts } from '../../products/services/productService';
import { Product } from '../../../shared/types';

const useDashboard = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const db = await getDatabase();
      const data = await getDashboardData(db);
      setTodaySales(data.todaySales);
      setTodayCount(data.todayCount);
      const outOfStock = await getOutOfStockProducts(db);
      setOutOfStockItems(outOfStock);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    todaySales,
    todayCount,
    outOfStockItems,
    isLoading,
    loadDashboard,
  };
};

export default useDashboard;

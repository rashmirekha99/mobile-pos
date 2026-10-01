import { useState, useCallback } from 'react';
import { Sale, SalesSummary } from '../../../shared/types';
import { getDatabase } from '../../../shared/db/database';
import { getDailySummary } from '../services/reportService';
import { getSalesByDate } from '../../sales/services/salesService';
import { getTodayDateString } from '../../../shared/utils/format';

const useDailyReport = () => {
  const [date, setDate] = useState(getTodayDateString());
  const [summary, setSummary] = useState<SalesSummary>({
    totalSales: 0,
    totalTransactions: 0,
    totalProfit: 0,
    items: [],
  });
  const [sales, setSales] = useState<Array<Sale & { item_count: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReport = useCallback(async (reportDate?: string) => {
    const targetDate = reportDate || date;
    setIsLoading(true);
    try {
      const db = await getDatabase();
      const [data, salesData] = await Promise.all([
        getDailySummary(db, targetDate),
        getSalesByDate(db, targetDate),
      ]);
      setSummary(data);
      setSales(salesData);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  return {
    date,
    setDate,
    summary,
    sales,
    isLoading,
    loadReport,
  };
};

export default useDailyReport;

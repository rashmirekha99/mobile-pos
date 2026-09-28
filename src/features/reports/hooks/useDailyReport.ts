import { useState, useCallback } from 'react';
import { SalesSummary } from '../../../shared/types';
import { getDatabase } from '../../../shared/db/database';
import { getDailySummary } from '../services/reportService';
import { getTodayDateString } from '../../../shared/utils/format';

const useDailyReport = () => {
  const [date, setDate] = useState(getTodayDateString());
  const [summary, setSummary] = useState<SalesSummary>({
    totalSales: 0,
    totalTransactions: 0,
    items: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadReport = useCallback(async (reportDate?: string) => {
    const targetDate = reportDate || date;
    setIsLoading(true);
    try {
      const db = await getDatabase();
      const data = await getDailySummary(db, targetDate);
      setSummary(data);
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
    isLoading,
    loadReport,
  };
};

export default useDailyReport;

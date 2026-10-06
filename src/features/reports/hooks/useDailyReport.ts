import { useState, useCallback } from 'react';
import { SalesSummary } from '../../../shared/types';
import { getDatabase } from '../../../shared/db/database';
import { getDateRangeSummary } from '../services/reportService';
import { getTodayDateString } from '../../../shared/utils/format';

const useDailyReport = () => {
  const [fromDate, setFromDate] = useState(getTodayDateString());
  const [toDate, setToDate] = useState(getTodayDateString());
  const [summary, setSummary] = useState<SalesSummary>({
    totalSales: 0,
    totalTransactions: 0,
    totalProfit: 0,
    items: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadReport = useCallback(async (from?: string, to?: string) => {
    const targetFrom = from || fromDate;
    const targetTo = to || toDate;
    setIsLoading(true);
    try {
      const db = await getDatabase();
      const data = await getDateRangeSummary(db, targetFrom, targetTo);
      setSummary(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate]);

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    summary,
    isLoading,
    loadReport,
  };
};

export default useDailyReport;

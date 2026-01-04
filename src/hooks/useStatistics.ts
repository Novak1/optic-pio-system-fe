import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { MonthlyStatistic } from '../types/api';

// Get monthly statistics
export function useMonthlyStatistics() {
  return useQuery({
    queryKey: ['statistics', 'monthly'],
    queryFn: () => apiClient.get<MonthlyStatistic[]>('/statistics/monthly'),
  });
}

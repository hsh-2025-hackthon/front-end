import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  analyticsDataAtom, 
  analyticsLoadingAtom, 
  analyticsErrorAtom,
  selectedDateRangeAtom,
  realTimeStatsAtom,
  TripAnalytics 
} from '../state';
import { analyticsApi } from '../../../lib/apiClient';
import toast from 'react-hot-toast';

export function useAnalytics(tripId?: string) {
  const [analyticsData, setAnalyticsData] = useAtom(analyticsDataAtom);
  const [loading, setLoading] = useAtom(analyticsLoadingAtom);
  const [error, setError] = useAtom(analyticsErrorAtom);
  const [dateRange] = useAtom(selectedDateRangeAtom);
  const [realTimeStats, setRealTimeStats] = useAtom(realTimeStatsAtom);

  // 載入分析數據
  const loadAnalytics = async (forceRefresh = false) => {
    if (loading && !forceRefresh) return;
    
    (setLoading as any)(true);
    (setError as any)(null);

    try {
      let data: TripAnalytics;
      
      if (tripId) {
        // 單一旅行的分析數據
        data = await analyticsApi.getTripAnalytics(tripId, {
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString()
        });
      } else {
        // 用戶的整體分析數據
        data = await analyticsApi.getUserAnalytics({
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString()
        });
      }

      (setAnalyticsData as any)(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入分析資料失敗';
      (setError as any)(errorMessage);
      toast.error(errorMessage);
      
      // 設置模擬數據作為後備
      (setAnalyticsData as any)(getMockAnalyticsData());
    } finally {
      (setLoading as any)(false);
    }
  };

  // 載入即時統計
  const loadRealTimeStats = async () => {
    try {
      if (tripId) {
        const stats = await analyticsApi.getTripRealTimeStats(tripId);
        (setRealTimeStats as any)(stats);
      } else {
        const stats = await analyticsApi.getUserRealTimeStats();
        (setRealTimeStats as any)(stats);
      }
    } catch (err) {
      console.error('Failed to load real-time stats:', err);
      // 使用模擬數據
      (setRealTimeStats as any)({
        activeUsers: Math.floor(Math.random() * 10) + 1,
        messagesCount: Math.floor(Math.random() * 100) + 20,
        lastActivity: new Date(Date.now() - Math.random() * 60000).toISOString(),
        onlineCollaborators: ['user1', 'user2', 'user3']
      });
    }
  };

  // 導出數據
  const exportAnalytics = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      (setLoading as any)(true);
      const blob = await analyticsApi.exportAnalytics(tripId, format, {
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString()
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_${tripId || 'user'}_${format}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('分析報表導出成功');
    } catch (err) {
      toast.error('導出分析報表失敗');
    } finally {
      (setLoading as any)(false);
    }
  };

  // 組件載入時自動載入數據
  useEffect(() => {
    loadAnalytics();
    loadRealTimeStats();

    // 設置定期更新即時統計
    const interval = setInterval(loadRealTimeStats, 30000); // 每30秒更新

    return () => clearInterval(interval);
  }, [tripId, dateRange]);

  return {
    analyticsData,
    loading,
    error,
    realTimeStats,
    loadAnalytics,
    loadRealTimeStats,
    exportAnalytics,
    refresh: () => loadAnalytics(true)
  };
}

// 模擬分析數據（作為後備）
function getMockAnalyticsData(): TripAnalytics {
  return {
    totalTrips: 12,
    completedTrips: 8,
    totalExpenses: 25600,
    averageTripDuration: 7.5,
    topDestinations: [
      { name: '東京', count: 5 },
      { name: '首爾', count: 4 },
      { name: '台北', count: 3 },
      { name: '香港', count: 2 },
      { name: '新加坡', count: 1 }
    ],
    monthlyExpenses: [
      { month: '1月', amount: 3200 },
      { month: '2月', amount: 4100 },
      { month: '3月', amount: 2800 },
      { month: '4月', amount: 5200 },
      { month: '5月', amount: 3600 },
      { month: '6月', amount: 6700 }
    ],
    expenseCategories: [
      { category: '住宿', amount: 12800, percentage: 50 },
      { category: '交通', amount: 6400, percentage: 25 },
      { category: '餐飲', amount: 3840, percentage: 15 },
      { category: '娛樂', amount: 1920, percentage: 7.5 },
      { category: '其他', amount: 640, percentage: 2.5 }
    ],
    budgetComparison: [
      { planned: 5000, actual: 4800 },
      { planned: 8000, actual: 8500 },
      { planned: 3000, actual: 2900 },
      { planned: 6000, actual: 5700 },
      { planned: 4000, actual: 4200 }
    ],
    collaboratorActivity: [
      { userId: '1', name: '小明', actions: 45 },
      { userId: '2', name: '小華', actions: 38 },
      { userId: '3', name: '小李', actions: 29 },
      { userId: '4', name: '小王', actions: 15 }
    ],
    travelTrends: [
      { date: '2024-01', trips: 2 },
      { date: '2024-02', trips: 3 },
      { date: '2024-03', trips: 1 },
      { date: '2024-04', trips: 4 },
      { date: '2024-05', trips: 2 },
      { date: '2024-06', trips: 3 }
    ]
  };
} 
import { atom } from 'jotai';

// 分析數據類型
export interface TripAnalytics {
  totalTrips: number;
  completedTrips: number;
  totalExpenses: number;
  averageTripDuration: number;
  topDestinations: { name: string; count: number }[];
  monthlyExpenses: { month: string; amount: number }[];
  expenseCategories: { category: string; amount: number; percentage: number }[];
  budgetComparison: { planned: number; actual: number }[];
  collaboratorActivity: { userId: string; name: string; actions: number }[];
  travelTrends: { date: string; trips: number }[];
}

export interface RealTimeStats {
  activeUsers: number;
  messagesCount: number;
  lastActivity: string;
  onlineCollaborators: string[];
}

// 分析數據狀態
export const analyticsDataAtom = atom<TripAnalytics | null>(null);
export const analyticsLoadingAtom = atom<boolean>(false);
export const analyticsErrorAtom = atom<string | null>(null);
export const selectedDateRangeAtom = atom<{ start: Date; end: Date }>({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
  end: new Date()
});

// 即時統計狀態
export const realTimeStatsAtom = atom<RealTimeStats>({
  activeUsers: 0,
  messagesCount: 0,
  lastActivity: '',
  onlineCollaborators: []
});

// 圖表設定狀態
export const chartConfigAtom = atom({
  theme: 'light' as 'light' | 'dark',
  showAnimations: true,
  refreshInterval: 30000 // 30秒
});

// 衍生狀態 - 總預算效率
export const budgetEfficiencyAtom = atom(
  (get) => {
    const data = get(analyticsDataAtom);
    if (!data || data.budgetComparison.length === 0) return 0;
    
    const totalPlanned = data.budgetComparison.reduce((sum, item) => sum + item.planned, 0);
    const totalActual = data.budgetComparison.reduce((sum, item) => sum + item.actual, 0);
    
    if (totalPlanned === 0) return 0;
    return ((totalPlanned - totalActual) / totalPlanned) * 100;
  }
);

// 衍生狀態 - 旅行完成率
export const tripCompletionRateAtom = atom(
  (get) => {
    const data = get(analyticsDataAtom);
    if (!data || data.totalTrips === 0) return 0;
    return (data.completedTrips / data.totalTrips) * 100;
  }
); 
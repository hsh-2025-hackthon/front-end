import { atom } from 'jotai';
import { AccountInfo } from '@azure/msal-browser';

// 認證相關狀態
export const userAtom = atom<AccountInfo | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const authTokenAtom = atom<string | null>(null);

// 當前選中的旅行
export const currentTripAtom = atom<any | null>(null);
export const currentTripIdAtom = atom<string | null>(null);

// 旅行列表
export const tripsAtom = atom<any[]>([]);
export const tripsLoadingAtom = atom<boolean>(false);
export const tripsErrorAtom = atom<string | null>(null);

// 行程資料
export const itineraryAtom = atom<any | null>(null);
export const smartCardsAtom = atom<any[]>([]);
export const smartCardsLoadingAtom = atom<boolean>(false);

// 聊天相關狀態
export const chatRoomsAtom = atom<any[]>([]);
export const currentChatRoomAtom = atom<any | null>(null);
export const chatMessagesAtom = atom<any[]>([]);
export const chatLoadingAtom = atom<boolean>(false);

// 投票相關狀態
export const votesAtom = atom<any[]>([]);
export const activeVoteAtom = atom<any | null>(null);

// 費用管理狀態
export const expensesAtom = atom<any[]>([]);
export const budgetAtom = atom<any | null>(null);
export const balancesAtom = atom<any>({});
export const budgetAlertsAtom = atom<any[]>([]);

// AI 智慧分析狀態
export const aiSessionsAtom = atom<any[]>([]);
export const activeSessionAtom = atom<any | null>(null);
export const aiRecommendationsAtom = atom<any[]>([]);

// 協作狀態
export const collaboratorsAtom = atom<any[]>([]);
export const permissionsAtom = atom<any>({});
export const conflictsAtom = atom<any[]>([]);
export const versionsAtom = atom<any[]>([]);

// 外部資料狀態
export const weatherDataAtom = atom<any | null>(null);
export const exchangeRatesAtom = atom<any>({});
export const placesDataAtom = atom<any[]>([]);

// 預訂相關狀態
export const flightSearchResultsAtom = atom<any[]>([]);
export const hotelSearchResultsAtom = atom<any[]>([]);
export const bookingStatusAtom = atom<any>({});

// 通知狀態
export const notificationsAtom = atom<any[]>([]);
export const unreadCountAtom = atom<number>(0);
export const notificationSettingsAtom = atom<any>({});

// UI 狀態
export const sidebarOpenAtom = atom<boolean>(true);
export const currentPageAtom = atom<string>('trips');
export const modalOpenAtom = atom<string | null>(null);
export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// 快捷操作狀態
export const quickActionsOpenAtom = atom<boolean>(false);
export const selectedDestinationAtom = atom<any | null>(null);

// 地圖和視覺化狀態
export const mapDataAtom = atom<any | null>(null);
export const timelineDataAtom = atom<any | null>(null);
export const visualizationModeAtom = atom<'map' | 'timeline' | 'cards'>('cards');

// WebSocket 連線狀態
export const websocketConnectedAtom = atom<boolean>(false);
export const realtimeUpdatesAtom = atom<any[]>([]);

// 搜尋和篩選狀態
export const searchQueryAtom = atom<string>('');
export const filtersAtom = atom<any>({});
export const sortingAtom = atom<{ field: string; direction: 'asc' | 'desc' }>({
  field: 'createdAt',
  direction: 'desc'
});

// 效能和快取狀態
export const cacheAtom = atom<Record<string, any>>({});
export const lastUpdatedAtom = atom<Record<string, number>>({});

// 衍生狀態（計算屬性）
export const hasUnreadNotificationsAtom = atom(
  (get) => get(unreadCountAtom) > 0
);

export const currentTripMembersAtom = atom(
  (get) => {
    const trip = get(currentTripAtom);
    const collaborators = get(collaboratorsAtom);
    return trip ? [...collaborators, { userId: trip.createdBy, role: 'owner' }] : [];
  }
);

export const totalExpensesAtom = atom(
  (get) => {
    const expenses = get(expensesAtom);
    return expenses.reduce((total, expense) => total + expense.amountBaseCurrency, 0);
  }
);

export const canEditCurrentTripAtom = atom(
  (get) => {
    const user = get(userAtom);
    const trip = get(currentTripAtom);
    const permissions = get(permissionsAtom);
    
    if (!user || !trip) return false;
    if (trip.createdBy === user.localAccountId) return true;
    
    const userPermissions = permissions[user.localAccountId];
    return userPermissions?.canEditTrip || false;
  }
);

// 載入狀態組合
export const isLoadingAtom = atom(
  (get) => get(loadingAtom) || get(tripsLoadingAtom) || get(smartCardsLoadingAtom) || get(chatLoadingAtom)
);

// 錯誤狀態組合
export const hasErrorAtom = atom(
  (get) => !!get(errorAtom) || !!get(tripsErrorAtom)
);

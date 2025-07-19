"use client";

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  ChatBubbleLeftRightIcon,
  MapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  PlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  currentTripAtom,
  currentTripIdAtom,
  smartCardsAtom,
  expensesAtom,
  notificationsAtom,
  currentPageAtom,
  sidebarOpenAtom
} from '../../store/atoms';
import ChatInterface from '../../features/chat/components/ChatInterface';
import SmartCard from '../../features/itinerary/components/SmartCard';
import ExpenseManager from '../../features/budget/components/ExpenseManager';
import AnalyticsDashboard from '../../features/analytics/components/AnalyticsDashboard';
import { tripApi, chatApi, expenseApi } from '../../lib/apiClient';
import toast, { Toaster } from 'react-hot-toast';

export default function TravelPlannerApp() {
  const [currentTrip, setCurrentTrip] = useAtom(currentTripAtom);
  const [currentTripId, setCurrentTripId] = useAtom(currentTripIdAtom);
  const [smartCards, setSmartCards] = useAtom(smartCardsAtom);
  const [expenses, setExpenses] = useAtom(expensesAtom);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<string>('');

  // 載入用戶旅行列表
  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);
        const tripsData = await tripApi.getAll();
        setTrips(tripsData);
        
        // 如果有旅行，預設選擇第一個
        if (tripsData.length > 0 && !currentTripId) {
          (setCurrentTripId as any)(tripsData[0].id);
          (setCurrentTrip as any)(tripsData[0]);
        }
      } catch (error) {
        console.error('Failed to load trips:', error);
        toast.error('載入旅行列表失敗');
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  // 載入當前旅行的詳細資料
  useEffect(() => {
    if (!currentTripId) return;

    const loadTripData = async () => {
      try {
        // 並行載入資料
        const [smartCardsData, expensesData, chatRoomsData] = await Promise.all([
          tripApi.getSmartCards(currentTripId),
          expenseApi.getTripExpenses(currentTripId),
          chatApi.getRooms(currentTripId)
        ]);

        setSmartCards(smartCardsData.cards || []);
        setExpenses(expensesData);
        
        // 設置預設聊天室
        if (chatRoomsData.length > 0) {
          setChatRoomId(chatRoomsData[0].id);
        }
      } catch (error) {
        console.error('Failed to load trip data:', error);
        toast.error('載入旅行資料失敗');
      }
    };

    loadTripData();
  }, [currentTripId, setSmartCards, setExpenses]);

  // 創建新旅行
  const handleCreateTrip = async () => {
    const tripName = prompt('請輸入旅行名稱：');
    if (!tripName) return;

    try {
      const newTrip = await tripApi.create({
        title: tripName,
        description: '新的旅行計劃',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      setTrips(prev => [newTrip, ...prev]);
      (setCurrentTripId as any)(newTrip.id);
      (setCurrentTrip as any)(newTrip);
      toast.success('旅行建立成功！');
    } catch (error) {
      console.error('Failed to create trip:', error);
      toast.error('建立旅行失敗');
    }
  };

  // 重新整理智慧卡片
  const handleRefreshCard = async (cardId: string) => {
    try {
      await tripApi.refreshSmartCard(currentTripId!, cardId);
      const updatedCards = await tripApi.getSmartCards(currentTripId!);
      setSmartCards(updatedCards.cards || []);
      toast.success('卡片資料已更新');
    } catch (error) {
      console.error('Failed to refresh card:', error);
      toast.error('重新整理失敗');
    }
  };

  // 處理卡片操作
  const handleCardAction = async (cardId: string, actionId: string) => {
    console.log(`Card action: ${cardId} - ${actionId}`);
    toast('功能開發中...');
  };

  // 新增費用
  const handleAddExpense = async (expense: any) => {
    try {
      const newExpense = await expenseApi.createExpense(currentTripId!, expense);
      setExpenses(prev => [newExpense, ...prev]);
      toast.success('費用新增成功');
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error('新增費用失敗');
    }
  };

  // 處理分帳
  const handleExpenseSplit = async (expenseId: string, splitData: any) => {
    try {
      await expenseApi.createSplit(expenseId, splitData);
      toast.success('分帳設定成功');
    } catch (error) {
      console.error('Failed to split expense:', error);
      toast.error('分帳設定失敗');
    }
  };

  const sidebarItems = [
    { id: 'cards', name: '智慧卡片', icon: MapIcon },
    { id: 'chat', name: '群組聊天', icon: ChatBubbleLeftRightIcon },
    { id: 'budget', name: '預算管理', icon: CurrencyDollarIcon },
    { id: 'analytics', name: '數據分析', icon: ChartBarIcon }
  ];

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      {/* 主导航栏 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                <div className="h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                <div className="h-0.5 bg-gray-600 dark:bg-gray-300"></div>
              </div>
            </button>

            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              OurGo - 協同旅行規劃
            </h1>

            {/* 旅行選擇器 */}
            <select
              value={currentTripId || ''}
              onChange={(e) => {
                const tripId = e.target.value;
                const trip = trips.find(t => t.id === tripId);
                if (trip) {
                  (setCurrentTripId as any)(tripId);
                  (setCurrentTrip as any)(trip);
                }
              }}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
            >
              <option value="">選擇旅行</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateTrip}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              新建
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* 通知按鈕 */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Cog6ToothIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* 侧边栏 */}
        {sidebarOpen && (
          <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                功能模块
              </h2>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>

              {/* 當前旅行資訊 */}
              {currentTrip && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                    當前旅行
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="font-medium">{currentTrip.title}</p>
                    <p>{currentTrip.description}</p>
                    <p>
                      {new Date(currentTrip.startDate).toLocaleDateString()} - 
                      {new Date(currentTrip.endDate).toLocaleDateString()}
                    </p>
            </div>
          </div>
              )}
            </div>
          </aside>
        )}

        {/* 主內容區域 */}
        <main className="flex-1 p-6">
          {!currentTripId ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  開始您的旅行規劃
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  建立新旅行或選擇現有旅行開始協同規劃
            </p>
                <button
                  onClick={handleCreateTrip}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  建立新旅行
                </button>
          </div>
            </div>
          ) : (
            <>
              {/* 智慧卡片視圖 */}
              {currentPage === 'cards' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      智慧行程卡片
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{smartCards.length} 個卡片</span>
          </div>
        </div>

                  {smartCards.length === 0 ? (
                    <div className="text-center py-16">
                      <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        還沒有行程卡片，開始新增景點吧
                      </p>
            </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {smartCards.map((card) => (
                        <SmartCard
                          key={card.id}
                          card={card}
                          onRefresh={handleRefreshCard}
                          onActionClick={handleCardAction}
                        />
                      ))}
            </div>
                  )}
            </div>
              )}

              {/* 聊天介面 */}
              {currentPage === 'chat' && chatRoomId && (
                <div className="h-[calc(100vh-8rem)]">
                  <ChatInterface tripId={currentTripId} roomId={chatRoomId} />
          </div>
              )}

              {/* 預算管理 */}
              {currentPage === 'budget' && (
                <ExpenseManager
                  tripId={currentTripId}
                  expenses={expenses}
                  budget={null} // TODO: 載入預算資料
                  onExpenseAdd={handleAddExpense}
                  onExpenseSplit={handleExpenseSplit}
                />
              )}

              {/* 數據分析 */}
              {currentPage === 'analytics' && (
                <AnalyticsDashboard tripId={currentTripId} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

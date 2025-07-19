"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import {
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '../hooks/useAnalytics';
import { budgetEfficiencyAtom, tripCompletionRateAtom } from '../state';
import StatsCard from './StatsCard';
import ExpenseChart, { chartColors } from './Charts/ExpenseChart';
import toast from 'react-hot-toast';

interface AnalyticsDashboardProps {
  tripId?: string;
}

export default function AnalyticsDashboard({ tripId }: AnalyticsDashboardProps) {
  const { analyticsData, realTimeStats, loading, error, refresh, exportAnalytics } = useAnalytics(tripId);
  const [budgetEfficiency] = useAtom(budgetEfficiencyAtom);
  const [tripCompletionRate] = useAtom(tripCompletionRateAtom);

  // 處理導出
  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      await exportAnalytics(format);
    } catch (err) {
      toast.error('導出失敗，請稍後再試');
    }
  };

  // 準備圖表數據
  const chartData = useMemo(() => {
    if (!analyticsData) return {};

    return {
      monthlyExpenses: {
        labels: analyticsData.monthlyExpenses.map(item => item.month),
        datasets: [
          {
            label: '月度支出',
            data: analyticsData.monthlyExpenses.map(item => item.amount),
            borderColor: chartColors.primary[0],
            backgroundColor: chartColors.gradient[0],
            tension: 0.4,
            fill: true
          }
        ]
      },
      expenseCategories: {
        labels: analyticsData.expenseCategories.map(item => item.category),
        datasets: [
          {
            data: analyticsData.expenseCategories.map(item => item.amount),
            backgroundColor: chartColors.primary,
            borderWidth: 0
          }
        ]
      },
      budgetComparison: {
        labels: ['旅行1', '旅行2', '旅行3', '旅行4', '旅行5'],
        datasets: [
          {
            label: '預算',
            data: analyticsData.budgetComparison.map(item => item.planned),
            backgroundColor: chartColors.gradient[1],
            borderColor: chartColors.primary[1],
            borderWidth: 2
          },
          {
            label: '實際',
            data: analyticsData.budgetComparison.map(item => item.actual),
            backgroundColor: chartColors.gradient[2],
            borderColor: chartColors.primary[2],
            borderWidth: 2
          }
        ]
      },
      travelTrends: {
        labels: analyticsData.travelTrends.map(item => item.date),
        datasets: [
          {
            label: '旅行次數',
            data: analyticsData.travelTrends.map(item => item.trips),
            borderColor: chartColors.primary[4],
            backgroundColor: chartColors.gradient[4],
            tension: 0.4
          }
        ]
      }
    };
  }, [analyticsData]);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">載入分析資料時發生錯誤</p>
        <button
          onClick={refresh}
          className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和控制項 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {tripId ? '旅行分析' : '總體分析'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {tripId ? '單一旅行的詳細分析數據' : '您所有旅行的統計概覽'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            重新整理
          </button>
          
          <div className="relative group">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              導出
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={() => handleExport('csv')}
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 即時統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="總支出"
          value={`$${analyticsData?.totalExpenses.toLocaleString() || 0}`}
          icon={CurrencyDollarIcon}
          color="green"
          change={{
            value: 12.5,
            type: 'increase',
            label: '較上月'
          }}
          loading={loading}
        />
        
        <StatsCard
          title={tripId ? "行程天數" : "總旅行數"}
          value={tripId ? `${analyticsData?.averageTripDuration || 0} 天` : analyticsData?.totalTrips || 0}
          icon={tripId ? CalendarIcon : MapPinIcon}
          color="blue"
          change={{
            value: 8.2,
            type: 'increase',
            label: '較上月'
          }}
          loading={loading}
        />
        
        <StatsCard
          title="完成率"
          value={`${tripCompletionRate.toFixed(1)}%`}
          icon={ChartBarIcon}
          color="purple"
          change={{
            value: 5.1,
            type: 'increase',
            label: '較上月'
          }}
          loading={loading}
        />
        
        <StatsCard
          title="預算效率"
          value={`${budgetEfficiency.toFixed(1)}%`}
          icon={CurrencyDollarIcon}
          color={budgetEfficiency >= 0 ? 'green' : 'red'}
          change={{
            value: Math.abs(budgetEfficiency),
            type: budgetEfficiency >= 0 ? 'increase' : 'decrease',
            label: budgetEfficiency >= 0 ? '節省' : '超支'
          }}
          loading={loading}
        />
      </div>

      {/* 即時活動統計 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ClockIcon className="w-5 h-5 mr-2" />
          即時活動
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{realTimeStats.activeUsers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">線上用戶</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{realTimeStats.messagesCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">今日消息</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{realTimeStats.onlineCollaborators.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">活躍協作者</p>
          </div>
        </div>
      </motion.div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月度支出趨勢 */}
        <ExpenseChart
          type="line"
          data={chartData.monthlyExpenses}
          title="月度支出趨勢"
          height={350}
        />
        
        {/* 支出分類 */}
        <ExpenseChart
          type="doughnut"
          data={chartData.expenseCategories}
          title="支出分類統計"
          height={350}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 預算對比 */}
        <ExpenseChart
          type="bar"
          data={chartData.budgetComparison}
          title="預算 vs 實際支出"
          height={350}
        />
        
        {/* 旅行趨勢 */}
        <ExpenseChart
          type="line"
          data={chartData.travelTrends}
          title="旅行頻率趨勢"
          height={350}
        />
      </div>

      {/* 熱門目的地和協作者活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 熱門目的地 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            熱門目的地
          </h3>
          <div className="space-y-4">
            {analyticsData?.topDestinations.map((destination, index) => (
              <div key={destination.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {destination.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {destination.count} 次
                </span>
              </div>
            )) || []}
          </div>
        </motion.div>

        {/* 協作者活動 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            協作者活動
          </h3>
          <div className="space-y-4">
            {analyticsData?.collaboratorActivity.map((collaborator) => (
              <div key={collaborator.userId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {collaborator.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {collaborator.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {collaborator.actions} 操作
                </span>
              </div>
            )) || []}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
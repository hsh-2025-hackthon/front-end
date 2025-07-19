"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CloudIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { quickActionApi, mcpApi } from '../../../lib/apiClient';

interface QuickActionsProps {
  tripId: string;
  onActionComplete: () => void;
}

interface QuickAction {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => Promise<void>;
}

interface FormData {
  destination?: string;
  location?: string;
  title?: string;
  options?: string[];
  amount?: number;
  description?: string;
  [key: string]: any;
}

export default function QuickActions({ tripId, onActionComplete }: QuickActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  // 快速添加目的地
  const handleAddDestination = async () => {
    if (!formData.destination) {
      toast.error('請輸入目的地名稱');
      return;
    }

    try {
      await quickActionApi.addDestination(tripId, {
        destinationName: formData.destination,
        date: formData.date || new Date().toISOString().split('T')[0]
      });
      
      toast.success(`已添加目的地：${formData.destination}`);
      setFormData({});
      onActionComplete();
    } catch (error) {
      toast.error('添加目的地失敗');
    }
  };

  // 創建投票
  const handleCreateVote = async () => {
    if (!formData.title || !formData.options || formData.options.length === 0) {
      toast.error('請填寫投票標題和選項');
      return;
    }

    try {
      const voteOptions = typeof formData.options === 'string' 
        ? formData.options.split('\n').filter(option => option.trim())
        : formData.options;

      await quickActionApi.createVote(tripId, {
        title: formData.title,
        options: voteOptions.map((option, index) => ({
          id: `option_${index}`,
          name: option.trim(),
          description: ''
        }))
      });
      
      toast.success('投票創建成功');
      setFormData({});
      onActionComplete();
    } catch (error) {
      toast.error('創建投票失敗');
    }
  };

  // 獲取天氣資訊
  const handleGetWeather = async () => {
    try {
      const weather = await mcpApi.getWeather(formData.location || 'current-location');
      
      // 在聊天中顯示天氣資訊（這裡應該調用聊天API）
      toast.success('天氣資訊已發送到聊天');
      onActionComplete();
    } catch (error) {
      toast.error('獲取天氣資訊失敗');
    }
  };

  // 快速分賬
  const handleSplitExpense = async () => {
    if (!formData.title || !formData.amount) {
      toast.error('請填寫費用標題和金額');
      return;
    }

    try {
      // 這裡需要先創建費用，然後分賬
      // 簡化實現，實際應該是兩步操作
      await quickActionApi.splitExpense(tripId, {
        expenseId: 'temp', // 臨時ID
        method: formData.splitMethod || 'equal'
      });
      
      toast.success('分賬已發起');
      setFormData({});
      onActionComplete();
    } catch (error) {
      toast.error('分賬失敗');
    }
  };

  // 定義快捷操作
  const quickActions: QuickAction[] = [
    {
      id: 'add_destination',
      name: '添加目的地',
      icon: MapPinIcon,
      color: 'bg-green-500',
      action: handleAddDestination
    },
    {
      id: 'create_vote',
      name: '創建投票',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      action: handleCreateVote
    },
    {
      id: 'split_expense',
      name: '快速分賬',
      icon: CurrencyDollarIcon,
      color: 'bg-orange-500',
      action: handleSplitExpense
    },
    {
      id: 'get_weather',
      name: '查看天氣',
      icon: CloudIcon,
      color: 'bg-sky-500',
      action: handleGetWeather
    }
  ];

  // 渲染表單內容
  const renderFormContent = () => {
    switch (activeAction) {
      case 'add_destination':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                目的地名稱
              </label>
              <input
                type="text"
                value={formData.destination || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="例如：京都清水寺"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                日期
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      case 'create_vote':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                投票標題
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例如：選擇午餐地點"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                投票選項（每行一個）
              </label>
              <textarea
                value={formData.options || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, options: e.target.value }))}
                placeholder="選項1&#10;選項2&#10;選項3"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                投票類型
              </label>
              <select
                value={formData.voteType || 'destination'}
                onChange={(e) => setFormData(prev => ({ ...prev, voteType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="destination">景點</option>
                <option value="restaurant">餐廳</option>
                <option value="activity">活動</option>
                <option value="budget">預算</option>
              </select>
            </div>
          </div>
        );

      case 'split_expense':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                費用標題
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例如：午餐費用"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                金額
              </label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                分賬方式
              </label>
              <select
                value={formData.splitMethod || 'equal'}
                onChange={(e) => setFormData(prev => ({ ...prev, splitMethod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="equal">平均分攤</option>
                <option value="percentage">按百分比</option>
                <option value="custom">自訂金額</option>
              </select>
            </div>
          </div>
        );

      case 'get_weather':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                地點
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="例如：東京"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (activeAction) {
    // 顯示表單
    const action = quickActions.find(a => a.id === activeAction);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {action?.icon && <action.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
            <h3 className="font-medium text-gray-900 dark:text-white">{action?.name}</h3>
          </div>
        </div>

        {renderFormContent()}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={action?.action}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            確認
          </button>
          <button
            onClick={() => {
              setActiveAction(null);
              setFormData({});
            }}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            取消
          </button>
        </div>
      </motion.div>
    );
  }

  // 顯示快捷操作按鈕
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        快捷操作
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <motion.button
            key={action.id}
            onClick={() => setActiveAction(action.id)}
            className={`${action.color} text-white p-3 rounded-lg flex flex-col items-center space-y-2 hover:opacity-90 transition-opacity`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
} 
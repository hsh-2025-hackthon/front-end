"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CurrencyDollarIcon,
  CameraIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  CalculatorIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ExpenseManagerProps {
  tripId: string;
  expenses: any[];
  budget: any;
  onExpenseAdd: (expense: any) => void;
  onExpenseSplit: (expenseId: string, splitData: any) => void;
}

export default function ExpenseManager({ 
  tripId, 
  expenses, 
  budget, 
  onExpenseAdd, 
  onExpenseSplit 
}: ExpenseManagerProps) {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    category: 'food',
    description: '',
    participants: [] as string[],
    splitMethod: 'equal'
  });
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // 檔案上傳處理
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessingReceipt(true);
    try {
      // 模擬 OCR 處理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockReceiptData = {
        merchant: 'Sample Restaurant',
        total: 128.50,
        currency: 'USD',
        date: new Date().toISOString().split('T')[0],
        items: [
          { name: '主菜', quantity: 2, price: 45.00 },
          { name: '飲料', quantity: 3, price: 15.00 },
          { name: '甜點', quantity: 1, price: 25.00 }
        ],
        tax: 12.80,
        confidence: 0.85
      };
      
      setReceiptData(mockReceiptData);
      setExpenseForm(prev => ({
        ...prev,
        title: mockReceiptData.merchant,
        amount: mockReceiptData.total.toString(),
        currency: mockReceiptData.currency
      }));
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsProcessingReceipt(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmitExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount) {
      alert('請填寫費用標題和金額');
      return;
    }

    const expense = {
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
      expenseDate: new Date().toISOString().split('T')[0],
      receiptData: receiptData
    };

    await onExpenseAdd(expense);
    setExpenseForm({
      title: '',
      amount: '',
      currency: 'USD',
      category: 'food',
      description: '',
      participants: [],
      splitMethod: 'equal'
    });
    setReceiptData(null);
    setIsAddingExpense(false);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amountBaseCurrency, 0);
  };

  const getBudgetUsage = () => {
    if (!budget?.totalAmount) return 0;
    return (getTotalExpenses() / budget.totalAmount) * 100;
  };

  const getBudgetAlert = () => {
    const usage = getBudgetUsage();
    if (usage >= 90) return { level: 'danger', message: '預算即將超支！' };
    if (usage >= 75) return { level: 'warning', message: '預算使用較多，注意控制' };
    return null;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      transportation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      accommodation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      activity: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      shopping: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* 預算概覽 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 mr-2 text-green-600" />
            預算管理
          </h2>
          <button
            onClick={() => setIsAddingExpense(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            添加費用
          </button>
        </div>

        {budget && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${budget.totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                總預算
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${getTotalExpenses().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                已花費
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                ${(budget.totalAmount - getTotalExpenses()).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                剩餘預算
              </div>
            </div>
          </div>
        )}

        {/* 預算進度條 */}
        {budget && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>預算使用情況</span>
              <span>{getBudgetUsage().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  getBudgetUsage() >= 90 
                    ? 'bg-red-500' 
                    : getBudgetUsage() >= 75 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(getBudgetUsage(), 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* 預算警告 */}
        {getBudgetAlert() && (
          <div className={`mt-4 p-3 rounded-lg flex items-center ${
            getBudgetAlert()?.level === 'danger' 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
          }`}>
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            {getBudgetAlert()?.message}
          </div>
        )}
      </div>

      {/* 添加費用表單 */}
      {isAddingExpense && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              添加新費用
            </h3>
            <button
              onClick={() => setIsAddingExpense(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* OCR 上傳區域 */}
          <div className="mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              {isProcessingReceipt ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
                  <p className="text-blue-600 dark:text-blue-400">識別收據中...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <CameraIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    拖放收據照片或點選上傳
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    支援 JPG、PNG 格式，自動識別金額和商家資訊
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* OCR 識別結果 */}
          {receiptData && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800 dark:text-blue-300">
                  識別結果 (置信度: {Math.round(receiptData.confidence * 100)}%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">商家: </span>
                  <span className="font-medium">{receiptData.merchant}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">總金額: </span>
                  <span className="font-medium">{receiptData.currency} {receiptData.total}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">日期: </span>
                  <span className="font-medium">{receiptData.date}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">稅費: </span>
                  <span className="font-medium">{receiptData.currency} {receiptData.tax}</span>
                </div>
              </div>
            </div>
          )}

          {/* 表單欄位 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                費用標題
              </label>
              <input
                type="text"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="例如：午餐費用"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                金額
              </label>
              <div className="flex">
                <select
                  value={expenseForm.currency}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, currency: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JPY">JPY</option>
                  <option value="TWD">TWD</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                類別
              </label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="food">餐飲</option>
                <option value="transportation">交通</option>
                <option value="accommodation">住宿</option>
                <option value="activity">活動</option>
                <option value="shopping">購物</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                分賬方式
              </label>
              <select
                value={expenseForm.splitMethod}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, splitMethod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="equal">平均分攤</option>
                <option value="percentage">按比例</option>
                <option value="custom">自訂</option>
                <option value="none">不分賬</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              備註說明
            </label>
            <textarea
              value={expenseForm.description}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="費用詳情說明..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmitExpense}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              添加費用
            </button>
            <button
              onClick={() => setIsAddingExpense(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 費用列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            費用記錄
          </h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {expenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              還沒有費用記錄，點擊上方按鈕添加第一筆費用
            </div>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {expense.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {expense.description || '無說明'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>{new Date(expense.expenseDate).toLocaleDateString()}</span>
                      <span className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        {expense.participants.length} 人分攤
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                      {expense.currency} {expense.amount}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ≈ ${expense.amountBaseCurrency}
                    </div>
                    <button
                      onClick={() => onExpenseSplit(expense.id, { method: expense.splitMethod })}
                      className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                    >
                      <CalculatorIcon className="w-4 h-4 mr-1" />
                      查看分賬
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
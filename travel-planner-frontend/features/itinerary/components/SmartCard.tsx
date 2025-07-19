"use client";

import React, { useState } from 'react';
import { 
  MapPinIcon, 
  ClockIcon, 
  CloudIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CalendarIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SmartCardProps {
  card: {
    id: string;
    tripId: string;
    type: 'destination' | 'activity' | 'transport' | 'accommodation' | 'meal';
    title: string;
    description: string;
    basicInfo: {
      date: string;
      startTime?: string;
      endTime?: string;
      duration?: string;
      location?: {
        name: string;
        address: string;
        coordinates: { lat: number; lng: number };
      };
      status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
    };
    enrichedData?: {
      weather?: {
        current: {
          temperature: number;
          condition: string;
          icon: string;
          humidity: number;
          windSpeed: number;
        };
        recommendation: string;
      };
      pricing?: {
        exchangeRate: {
          localCurrency: string;
          rate: number;
          convertedPrice: number;
          baseCurrency: string;
        };
      };
      transport?: {
        toLocation: {
          method: string;
          duration: string;
          distance: string;
        };
      };
      operatingHours?: {
        today: {
          open: string;
          close: string;
          isOpen: boolean;
        };
      };
      lastUpdated?: string;
    };
    actions: Array<{
      id: string;
      type: 'navigation' | 'booking' | 'sharing' | 'modification' | 'information';
      label: string;
      action: string;
      enabled: boolean;
    }>;
    metadata: {
      priority: 'low' | 'medium' | 'high';
      tags: string[];
      createdBy: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  onRefresh: (cardId: string) => void;
  onActionClick: (cardId: string, actionId: string) => void;
}

export default function SmartCard({ card, onRefresh, onActionClick }: SmartCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh(card.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCardIcon = () => {
    switch (card.type) {
      case 'destination':
        return <MapPinIcon className="w-6 h-6" />;
      case 'activity':
        return <CalendarIcon className="w-6 h-6" />;
      case 'transport':
        return <TruckIcon className="w-6 h-6" />;
      case 'accommodation':
        return <MapPinIcon className="w-6 h-6" />;
      case 'meal':
        return <ClockIcon className="w-6 h-6" />;
      default:
        return <InformationCircleIcon className="w-6 h-6" />;
    }
  };

  const getCardColor = () => {
    switch (card.type) {
      case 'destination':
        return 'from-blue-500 to-cyan-600';
      case 'activity':
        return 'from-green-500 to-emerald-600';
      case 'transport':
        return 'from-orange-500 to-amber-600';
      case 'accommodation':
        return 'from-purple-500 to-violet-600';
      case 'meal':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getStatusColor = () => {
    switch (card.basicInfo.status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* 卡片头部 */}
      <div className={`bg-gradient-to-r ${getCardColor()} p-4 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              {getCardIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">
                {card.title}
              </h3>
              <p className="text-sm opacity-90 mt-1">
                {card.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDate(card.basicInfo.date)}
                </span>
                {card.basicInfo.startTime && (
                  <span className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {formatTime(card.basicInfo.startTime)}
                    {card.basicInfo.endTime && (
                      <>
                        <ArrowRightIcon className="w-3 h-3 mx-1" />
                        {formatTime(card.basicInfo.endTime)}
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {card.basicInfo.status}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 基础信息 */}
      <div className="p-4">
        {card.basicInfo.location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">
              {card.basicInfo.location.name}
              {card.basicInfo.location.address && (
                <span className="text-gray-400 ml-2">
                  • {card.basicInfo.location.address}
                </span>
              )}
            </span>
          </div>
        )}

        {/* 即時資料資訊 */}
        {card.enrichedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* 天气信息 */}
            {card.enrichedData.weather && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <CloudIcon className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    天气
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between mb-1">
                    <span>{card.enrichedData.weather.current.condition}</span>
                    <span className="font-semibold">
                      {card.enrichedData.weather.current.temperature}°C
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    湿度 {card.enrichedData.weather.current.humidity}% • 
                    风速 {card.enrichedData.weather.current.windSpeed}km/h
                  </div>
                  {card.enrichedData.weather.recommendation && (
                    <div className="mt-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/30 p-2 rounded">
                      💡 {card.enrichedData.weather.recommendation}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 价格信息 */}
            {card.enrichedData.pricing && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    价格
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>
                      {card.enrichedData.pricing.exchangeRate.localCurrency} 
                      {card.enrichedData.pricing.exchangeRate.convertedPrice}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      匯率: {card.enrichedData.pricing.exchangeRate.rate}
                    </span>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    ≈ {card.enrichedData.pricing.exchangeRate.baseCurrency} 
                    {(card.enrichedData.pricing.exchangeRate.convertedPrice * card.enrichedData.pricing.exchangeRate.rate).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* 交通信息 */}
            {card.enrichedData.transport && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <TruckIcon className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    交通
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between mb-1">
                    <span>{card.enrichedData.transport.toLocation.method}</span>
                    <span className="font-semibold">
                      {card.enrichedData.transport.toLocation.duration}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    距离: {card.enrichedData.transport.toLocation.distance}
                  </div>
                </div>
              </div>
            )}

                                {/* 營業時間 */}
            {card.enrichedData.operatingHours && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <ClockIcon className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    营业时间
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>
                      {card.enrichedData.operatingHours.today.open} - 
                      {card.enrichedData.operatingHours.today.close}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      card.enrichedData.operatingHours.today.isOpen
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {card.enrichedData.operatingHours.today.isOpen ? '营业中' : '已闭店'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        {card.actions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {card.actions.filter(action => action.enabled).map((action) => (
                <button
                  key={action.id}
                  onClick={() => onActionClick(card.id, action.id)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 数据更新时间 */}
        {card.enrichedData?.lastUpdated && (
          <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
            数据更新: {new Date(card.enrichedData.lastUpdated).toLocaleString('zh-TW')}
          </div>
        )}
      </div>
    </div>
  );
} 
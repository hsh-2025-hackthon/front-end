"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    label: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    icon: 'bg-blue-500 text-white',
    change: {
      increase: 'text-blue-600 bg-blue-50',
      decrease: 'text-blue-600 bg-blue-50'
    }
  },
  green: {
    icon: 'bg-emerald-500 text-white',
    change: {
      increase: 'text-emerald-600 bg-emerald-50',
      decrease: 'text-emerald-600 bg-emerald-50'
    }
  },
  yellow: {
    icon: 'bg-yellow-500 text-white',
    change: {
      increase: 'text-yellow-600 bg-yellow-50',
      decrease: 'text-yellow-600 bg-yellow-50'
    }
  },
  red: {
    icon: 'bg-red-500 text-white',
    change: {
      increase: 'text-red-600 bg-red-50',
      decrease: 'text-red-600 bg-red-50'
    }
  },
  purple: {
    icon: 'bg-purple-500 text-white',
    change: {
      increase: 'text-purple-600 bg-purple-50',
      decrease: 'text-purple-600 bg-purple-50'
    }
  },
  gray: {
    icon: 'bg-gray-500 text-white',
    change: {
      increase: 'text-gray-600 bg-gray-50',
      decrease: 'text-gray-600 bg-gray-50'
    }
  }
};

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = 'blue',
  loading = false 
}: StatsCardProps) {
  const colorClass = colorClasses[color];

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString();
    }
    return val;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(value)}
          </p>
          
          {change && (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${colorClass.change[change.type]}`}>
              {change.type === 'increase' ? (
                <ArrowUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change.value)}% {change.label}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClass.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

// 趋势指标组件
export function TrendIndicator({ 
  value, 
  type, 
  label 
}: { 
  value: number; 
  type: 'increase' | 'decrease'; 
  label: string;
}) {
  return (
    <div className="flex items-center space-x-1">
      {type === 'increase' ? (
        <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
      ) : (
        <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm font-medium ${
        type === 'increase' ? 'text-emerald-600' : 'text-red-600'
      }`}>
        {Math.abs(value)}%
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
} 
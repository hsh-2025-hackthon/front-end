"use client";

import React from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { motion } from 'framer-motion';

// 註冊Chart.js組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface ExpenseChartProps {
  type: 'line' | 'doughnut' | 'bar';
  data: any;
  title: string;
  height?: number;
}

export default function ExpenseChart({ type, data, title, height = 300 }: ExpenseChartProps) {
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, sans-serif'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold' as const
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y !== null ? context.parsed.y : context.parsed;
            
            if (type === 'doughnut') {
              const percentage = ((value / data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
              return `${label}: $${value.toLocaleString()} (${percentage}%)`;
            }
            
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif'
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    } : undefined,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      default:
        return <Line data={data} options={chartOptions} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </motion.div>
  );
}

// 預設的圖表顏色方案
export const chartColors = {
  primary: [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#F97316', // orange-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#EC4899', // pink-500
    '#6B7280'  // gray-500
  ],
  gradient: [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(132, 204, 22, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(107, 114, 128, 0.8)'
  ]
}; 
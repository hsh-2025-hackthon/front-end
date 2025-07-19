"use client";

import React, { useState } from 'react';
import { ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface VoteCardProps {
  message: {
    id: string;
    userId: string;
    content: string;
    messageType: 'vote';
    metadata?: {
      voteId: string;
      title: string;
      options: Array<{
        id: string;
        name: string;
        votes: number;
      }>;
      totalVotes: number;
      deadline?: string;
      hasVoted: boolean;
      userVote?: string[];
    };
    createdAt: string;
  };
}

export default function VoteCard({ message }: VoteCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { metadata } = message;
  if (!metadata) return null;

  const { title, options, totalVotes, hasVoted, userVote } = metadata;

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // 這裡調用投票API
      // await voteApi.submitVoteResponse(metadata.voteId, { selectedOptions });
      console.log('Submitting vote:', selectedOptions);
              // 臨時延時模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-200 dark:border-gray-600 shadow-sm">
      {/* 投票头部 */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <ChartBarIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalVotes} 票 • {hasVoted ? '已投票' : '等待投票'}
          </p>
        </div>
      </div>

      {/* 投票选项 */}
      <div className="space-y-3 mb-4">
        {options.map((option) => {
          const percentage = getOptionPercentage(option.votes);
          const isSelected = selectedOptions.includes(option.id);
          const isUserVote = userVote?.includes(option.id);

          return (
            <div
              key={option.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                hasVoted
                  ? 'border-gray-200 dark:border-gray-600 cursor-default'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
              onClick={() => !hasVoted && handleOptionToggle(option.id)}
            >
              {/* 进度条背景 */}
              {hasVoted && (
                <div
                  className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  {!hasVoted && (
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                  )}
                  
                  {hasVoted && isUserVote && (
                    <CheckCircleIcon className="w-5 h-5 text-blue-500 mr-3" />
                  )}
                  
                  <span className="font-medium text-gray-800 dark:text-white">
                    {option.name}
                  </span>
                </div>

                {hasVoted && (
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {option.votes} ({percentage}%)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 投票按钮 */}
      {!hasVoted && (
        <button
          onClick={handleSubmitVote}
          disabled={selectedOptions.length === 0 || isSubmitting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              提交中...
            </div>
          ) : (
            `投票 (${selectedOptions.length} 選項)`
          )}
        </button>
      )}

      {/* 投票状态信息 */}
      {hasVoted && (
        <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium">
          ✅ 您已投票完成
        </div>
      )}
    </div>
  );
} 
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  InformationCircleIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface MessageBubbleProps {
  message: {
    id: string;
    userId: string;
    content: string;
    messageType: 'text' | 'system' | 'ai_suggestion' | 'vote';
    metadata?: any;
    createdAt: string;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isCurrentUser = message.userId === 'current-user'; // TODO: 从用户状态获取
  const isAI = message.userId === 'ai-assistant';
  const isSystem = message.messageType === 'system';

  // 格式化时间
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: zhCN });
  };

  // 根据消息类型返回样式
  const getMessageStyles = () => {
    if (isSystem) {
      return {
        container: 'mx-auto max-w-md',
        bubble: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-center py-2 px-4 rounded-full text-sm',
        showAvatar: false,
        showTime: false
      };
    }
    
    if (isAI) {
      return {
        container: 'mr-auto max-w-3xl',
        bubble: 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg',
        showAvatar: true,
        showTime: true,
        avatar: <SparklesIcon className="w-6 h-6 text-purple-600" />
      };
    }
    
    if (isCurrentUser) {
      return {
        container: 'ml-auto max-w-xl',
        bubble: 'bg-blue-600 text-white shadow-md',
        showAvatar: false,
        showTime: true
      };
    }
    
    return {
      container: 'mr-auto max-w-xl',
      bubble: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md border border-gray-200 dark:border-gray-700',
      showAvatar: true,
      showTime: true,
      avatar: <UserIcon className="w-6 h-6 text-gray-500" />
    };
  };

  const styles = getMessageStyles();

  // 处理 AI 建议的特殊显示
  const renderAIContent = () => {
    if (!isAI) return message.content;
    
    const confidence = message.metadata?.confidence;
    const sessionId = message.metadata?.sessionId;
    
    return (
      <div>
        <div className="mb-2">
          {message.content}
        </div>
        
        {confidence && (
          <div className="text-xs opacity-75 border-t border-white/20 pt-2 mt-2">
            置信度: {Math.round(confidence * 100)}%
            {sessionId && (
              <span className="ml-2">会话: {sessionId.slice(0, 8)}...</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`flex items-end space-x-3 ${styles.container}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* 用户头像 */}
      {styles.showAvatar && !isCurrentUser && (
        <motion.div
          className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          {styles.avatar || <UserIcon className="w-6 h-6 text-gray-500" />}
        </motion.div>
      )}

      <div className="flex-1">
        {/* 消息内容 */}
        <motion.div
          className={`px-4 py-3 rounded-2xl ${styles.bubble} ${
            isCurrentUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* 特殊消息类型处理 */}
          {message.messageType === 'ai_suggestion' ? (
            <div>
              <div className="flex items-center mb-2">
                <SparklesIcon className="w-4 h-4 mr-2" />
                <span className="text-xs font-semibold opacity-90">AI 智能建议</span>
              </div>
              {renderAIContent()}
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
          
          {/* 时间戳 */}
          {styles.showTime && (
            <div className={`text-xs mt-1 ${
              isCurrentUser || isAI 
                ? 'text-white/70' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formatTime(message.createdAt)}
            </div>
          )}
        </motion.div>

        {/* AI 消息的交互按钮 */}
        {isAI && (
          <motion.div
            className="flex items-center space-x-2 mt-2 ml-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
              👍 有用
            </button>
            <button className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
              👎 无用
            </button>
            <button className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
              🔄 重新生成
            </button>
          </motion.div>
        )}
      </div>

      {/* 当前用户的头像 */}
      {styles.showAvatar && isCurrentUser && (
        <motion.div
          className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <UserIcon className="w-6 h-6 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
} 
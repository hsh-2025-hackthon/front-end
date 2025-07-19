"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  CommandLineIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { 
  chatMessagesAtom, 
  currentChatRoomAtom, 
  quickActionsOpenAtom, 
  chatLoadingAtom,
  aiSessionsAtom 
} from '../../../store/atoms';
import { chatApi, quickActionApi, mcpApi, aiAgentApi } from '../../../lib/apiClient';
import MessageBubble from './MessageBubble';
import VoteCard from './VoteCard';
import QuickActions from './QuickActions';

interface ChatInterfaceProps {
  tripId: string;
  roomId: string;
}

export default function ChatInterface({ tripId, roomId }: ChatInterfaceProps) {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [currentRoom, setCurrentRoom] = useAtom(currentChatRoomAtom);
  const [quickActionsOpen, setQuickActionsOpen] = useAtom(quickActionsOpenAtom);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 滾動到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 載入消息
  const loadMessages = useCallback(async () => {
    if (!roomId) return;
    
    try {
      setIsLoading(true);
      const messagesData = await chatApi.getMessages(roomId);
      setMessages(messagesData);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('載入消息失敗');
    } finally {
      setIsLoading(false);
    }
  }, [roomId, setMessages, scrollToBottom]);

  // 發送消息
  const sendMessage = useCallback(async (content: string, messageType = 'text', metadata?: any) => {
    if (!roomId || !content.trim()) return;

    const tempMessage = {
      id: Date.now().toString(),
      roomId,
      userId: 'current-user', // TODO: 從用戶狀態獲取
      content: content.trim(),
      messageType,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // 添加到本地狀態
      setMessages(prev => [...prev, tempMessage]);
      scrollToBottom();
      
      // 檢查是否需要 AI 分析
      if (shouldAnalyzeMessage(content)) {
        await handleAIAnalysis(content);
      }

      await chatApi.sendMessage(roomId, { content, message_type: messageType, metadata });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('發送消息失敗');
    }
  }, [roomId, setMessages, scrollToBottom]);

  // 檢查是否需要 AI 分析
  const shouldAnalyzeMessage = (content: string): boolean => {
    const keywords = [
      '建議', '推薦', '行程', '景點', '餐廳', '住宿', '預算', '天氣',
      '計劃', '安排', '路線', '交通', '活動'
    ];
    return keywords.some(keyword => content.includes(keyword));
  };

  // AI 分析處理
  const handleAIAnalysis = useCallback(async (content: string) => {
    try {
      setAiProcessing(true);
      
      // 分析用戶需求
      const analysisResult = await aiAgentApi.analyzeRequirements(tripId, {
        messages: [{ content, userId: 'current-user', timestamp: new Date().toISOString() }]
      });

      if (analysisResult.recommendations?.length > 0) {
        // 發送 AI 建議消息
        const aiMessage = {
          content: `🤖 AI 建議：\n${analysisResult.recommendations.join('\n')}`,
          messageType: 'ai_suggestion',
          metadata: { confidence: analysisResult.confidence, sessionId: analysisResult.sessionId }
        };
        
        await sendMessage(aiMessage.content, aiMessage.messageType, aiMessage.metadata);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      // 不顯示錯誤，AI 分析失敗不應該影響正常聊天
    } finally {
      setAiProcessing(false);
    }
  }, [tripId, sendMessage]);

  // 處理輸入提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isLoading) return;
    
    const content = messageInput.trim();
    setMessageInput('');
    
    // 檢查是否是指令
    if (content.startsWith('/')) {
      handleQuickCommand(content);
    } else {
      sendMessage(content);
    }
  };

  // 處理快捷指令
  const handleQuickCommand = useCallback(async (command: string) => {
    const [cmd, ...args] = command.slice(1).split(' ');
    
    try {
      switch (cmd) {
        case 'weather':
          const weather = await mcpApi.getWeather('current-location');
          await sendMessage(`☀️ 天氣資訊：${JSON.stringify(weather)}`, 'system');
          break;
        case 'budget':
          toast.error('獲取天氣資訊失敗');
          break;
        case 'budget':
          await sendMessage('💰 預算管理功能已開啟，請使用右側面板管理預算', 'system');
          // 觸發預算面板開啟邏輯
          break;
        case 'vote':
          setQuickActionsOpen(true);
          break;
        case 'help':
          const helpMessage = `🛠️ 快捷指令幫助：

📋 可用指令：
/weather - 獲取天氣資訊
/budget - 開啟預算管理
/vote - 建立投票
/add [地點] - 快速添加景點
/help - 顯示幫助`;
          await sendMessage(helpMessage, 'system');
          break;
        case 'add':
          if (args.length > 0) {
            const destination = args.join(' ');
            try {
              await quickActionApi.addDestination(tripId, {
                destinationName: destination,
                date: new Date().toISOString().split('T')[0]
              });
              await sendMessage(`✅ 已添加目的地：${destination}`, 'system');
            } catch (error) {
              toast.error('添加目的地失敗');
            }
          } else {
            await sendMessage('❌ 請指定要添加的地點，例如：/add 東京塔', 'system');
          }
          break;
        default:
          await sendMessage('❌ 未知指令，輸入 /help 查看可用指令', 'system');
      }
    } catch (error) {
      console.error('Quick command failed:', error);
    }
  }, [tripId, sendMessage, setQuickActionsOpen]);

  // 鍵盤事件處理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      // 檢查是否是指令
      if (messageInput.startsWith('/')) {
        setMessageInput('');
      }
    }
  };

  // 組件掛載時載入消息
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // 監聽新消息（WebSocket 連接可以在這裡處理）
  useEffect(() => {
    // WebSocket 消息監聽邏輯
    // TODO: 實現 WebPubSub 連接
  }, [roomId]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* 聊天頭部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-sky-500" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentRoom?.name || '聊天室'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentRoom?.description || '與團隊成員討論旅行計劃'}
            </p>
          </div>
        </div>
        
        {aiProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-sky-500"
          >
            <SparklesIcon className="h-4 w-4 animate-spin" />
            <span className="text-sm">AI 分析中...</span>
          </motion.div>
        )}

        <button
          onClick={() => setQuickActionsOpen(!quickActionsOpen)}
          className="p-2 text-gray-500 hover:text-sky-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="快捷操作"
        >
          <CommandLineIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {message.messageType === 'vote' ? (
                    <VoteCard message={message} />
                  ) : (
                    <MessageBubble message={message} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-500 border-t-transparent"></div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷操作面板 */}
          <AnimatePresence>
            {quickActionsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <QuickActions 
                  tripId={tripId} 
                  onActionComplete={() => setQuickActionsOpen(false)} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 輸入區域 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex space-x-3">
                <textarea
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="輸入消息... (/ 開頭輸入指令)"
                  className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={1}
                />
                
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isLoading}
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {/* 指令提示 */}
                  {messageInput.startsWith('/') && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg"
                    >
                      💡 可用指令：/weather, /budget, /vote, /add [地點], /help
                    </motion.div>
                  )}
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
              
              {messageInput.startsWith('/') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  按 Enter 發送，Shift+Enter 換行，/ 開頭輸入指令
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
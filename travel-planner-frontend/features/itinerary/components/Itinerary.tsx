"use client";

import { useSharedItinerary } from "../hooks/useSharedItinerary";
import { useState } from "react";

export function Itinerary({ tripId }: { tripId: string }) {
  const { itinerary, addDestination } = useSharedItinerary(tripId);
  const [newDestination, setNewDestination] = useState("");

  const handleAddDestination = () => {
    if (newDestination.trim() !== "") {
      addDestination({ name: newDestination });
      setNewDestination("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddDestination();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-orange-50 travel-pattern">
      <div className="max-w-4xl mx-auto p-6">
        {/* 標題區域 */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-orange-400 rounded-full mb-6 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 hand-drawn-line">
            OurGo 旅行規劃
          </h1>
          <p className="text-gray-600 text-lg">
            行程 ID: <span className="font-mono text-sky-600 bg-white px-2 py-1 rounded-md shadow-sm">{tripId}</span>
          </p>
        </div>

        {/* 新增目的地表單 */}
        <div className="card p-8 mb-8 bg-gradient-to-br from-white to-sky-50 border-2 border-sky-200 animate-fadeInUp animate-delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">新增目的地</h2>
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="請輸入目的地名稱..."
              className="flex-1 px-6 py-4 border-2 border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-400 text-lg transition-all duration-200 shadow-sm"
            />
            <button 
              onClick={handleAddDestination}
              disabled={!newDestination.trim()}
              className="btn-coral px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>新增</span>
              </div>
            </button>
          </div>
        </div>

        {/* 目的地列表 */}
        <div className="card border-2 border-sky-200 overflow-hidden animate-fadeInUp animate-delay-400">
          {/* 列表標題 */}
          <div className="bg-gradient-to-r from-sky-400 to-orange-400 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-2xl font-bold">您的目的地</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                  {itinerary.length} 個地點
                </span>
              </div>
            </div>
          </div>

          {/* 目的地內容 */}
          <div className="bg-white">
            {itinerary.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-600 mb-3">
                  還沒有目的地
                </h3>
                <p className="text-gray-500 text-lg">
                  開始新增您的第一個目的地，讓 OurGo 旅行規劃更精彩！
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {itinerary.map((dest, index) => (
                  <div key={index} className="p-6 hover:bg-gradient-to-r hover:from-sky-50 hover:to-orange-50 transition-all duration-300 group">
                    <div className="flex items-center gap-6">
                      {/* 序號 */}
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        {index < itinerary.length - 1 && (
                          <div className="absolute top-14 left-7 w-0.5 h-8 bg-gradient-to-b from-sky-400 to-orange-400 opacity-30"></div>
                        )}
                      </div>
                      
                      {/* 目的地資訊 */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-sky-600 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-gray-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          第 {index + 1} 站
                        </p>
                      </div>
                      
                      {/* 狀態指示器 */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-500">已規劃</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部操作區 */}
        {itinerary.length > 0 && (
          <div className="mt-8 text-center animate-fadeInUp animate-delay-600">
            <button className="btn-primary px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>分享行程</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-sky-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeInUp">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          旅程規劃
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          與朋友一起規劃完美旅程
        </p>
        <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            行程 ID: <span className="font-mono text-sky-600 dark:text-sky-400">{tripId}</span>
          </span>
        </div>
      </div>

      {/* Add Destination Form */}
      <div className="card-ourgo mb-8 animate-slideInLeft">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">新增目的地</h3>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入目的地名稱..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
          />
          <button 
            onClick={handleAddDestination}
            disabled={!newDestination.trim()}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Destinations List */}
      <div className="card-ourgo animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">旅程目的地</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 text-sm rounded-full font-medium">
              {itinerary.length} 個目的地
            </span>
          </div>
        </div>
        
        {itinerary.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
              還沒有目的地
            </h4>
            <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
              開始新增你的第一個目的地吧！與朋友一起規劃，創造美好的旅行回憶。
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {itinerary.map((dest, index) => (
              <div key={index} className="bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-sky-200 dark:border-sky-800 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                      {dest.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      目的地 {index + 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">已新增</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

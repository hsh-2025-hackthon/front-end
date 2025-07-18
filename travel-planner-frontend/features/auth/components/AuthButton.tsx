"use client";

import { useAuth } from "../hooks/useAuth";

export function AuthButton() {
  const { isAuthenticated, user, login, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto">
        {/* 用戶歡迎卡片 */}
        <div className="card p-6 mb-6 bg-gradient-to-br from-sky-50 to-emerald-50 border border-sky-200">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                歡迎回到 OurGo！
              </h3>
              <p className="text-gray-600">
                {user?.name || 'Travel Explorer'}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mb-1"></div>
              <span className="text-xs text-gray-500">已連線</span>
            </div>
          </div>
        </div>

        {/* 登出按鈕 */}
        <button 
          onClick={logout}
          className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>登出</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 登入卡片 */}
      <div className="card p-8 bg-gradient-to-br from-sky-50 to-orange-50 border border-sky-200">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">開始您的 OurGo 旅程</h3>
          <p className="text-gray-600">登入後即可開始規劃您的完美旅行</p>
        </div>
        
        <button 
          onClick={login}
          className="btn-coral w-full text-lg py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-200 group"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>立即登入</span>
          </div>
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            支援 Microsoft 帳戶登入
          </p>
        </div>
      </div>
    </div>
  );
}

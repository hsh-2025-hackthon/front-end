export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-orange-400 relative overflow-hidden travel-pattern">
      {/* Floating Travel Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full animate-float">
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-orange-300/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}>
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-300/15 rounded-full animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-1/3 right-20 w-18 h-18 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="mb-8">
            <h1 className="hero-title">
              OurGo
            </h1>
            <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full mb-6"></div>
          </div>
          <p className="hero-subtitle">
            與朋友家人一起規劃完美旅程
          </p>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            協作創建、分享和管理您的旅行行程。即時同步，輕鬆分帳，讓每一次旅行都成為美好回憶。
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/80 mb-8">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">即時協作</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">智能分帳</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">行程共享</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="btn-coral text-lg px-8 py-4 mb-4">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>開始規劃旅程</span>
            </div>
          </button>
          <p className="text-sm text-white/70">免費使用，無需信用卡</p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          {/* Smart Itinerary Card */}
          <div className="card-ourgo text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">智能行程規劃</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              AI 助手幫您規劃最佳路線，景點推薦，時間安排一次搞定。支持拖拉重排，即時更新。
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-1 bg-sky-400 rounded-full"></div>
            </div>
          </div>

          {/* Collaboration Card */}
          <div className="card-ourgo text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">多人協作</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              邀請朋友家人一起參與規劃，即時聊天討論，投票決定行程。每個人都能貢獻想法。
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-1 bg-orange-400 rounded-full"></div>
            </div>
          </div>

          {/* Smart Expense Card */}
          <div className="card-ourgo text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">智能分帳</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              自動記錄花費，智能分配費用，支持多種分帳方式。旅行結束後一鍵結算，省去麻煩。
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-1 bg-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-center gap-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm">活躍用戶</div>
            </div>
            <div className="w-1 h-8 bg-white/30 rounded-full"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-sm">成功行程</div>
            </div>
            <div className="w-1 h-8 bg-white/30 rounded-full"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm">滿意度</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

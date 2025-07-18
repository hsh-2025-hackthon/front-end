export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-orange-50 travel-pattern">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        {/* 裝飾性背景元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-float animate-delay-400"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-emerald-200 rounded-full opacity-25 animate-bounce animate-delay-600"></div>
          
          {/* 旅行圖示裝飾 */}
          <div className="absolute top-32 right-1/4 opacity-10">
            <svg className="w-16 h-16 text-sky-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div className="absolute bottom-32 right-10 opacity-10">
            <svg className="w-12 h-12 text-orange-400 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* 主標題 */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 animate-fadeInUp">
              <span className="text-sky-500">Our</span>
              <span className="text-orange-500 hand-drawn-line">Go</span>
            </h1>
            
            {/* 副標題 */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fadeInUp animate-delay-200">
              與親友一起規劃完美旅程<br/>
              協作式旅行規劃，讓每個人都能參與，讓旅行更有意義
            </p>

            {/* 特色標籤 */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeInUp animate-delay-400">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">即時協作</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">安全分享</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">智能規劃</span>
              </div>
            </div>

            {/* CTA 按鈕 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animate-delay-600">
              <button className="btn-coral text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  開始規劃旅程
                </div>
              </button>
              <button className="btn-primary text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  查看範例
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 功能展示區 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-fadeInUp">
              為什麼選擇 OurGo？
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animate-delay-200">
              讓旅行規劃變得更簡單、更有趣、更有效率
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* 功能卡片 1 */}
            <div className="card p-8 text-center animate-fadeInUp animate-delay-400 h-full flex flex-col">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">智能行程規劃</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                AI 驅動的行程建議，根據您的喜好和預算，自動生成最佳旅行路線和景點推薦。
              </p>
            </div>

            {/* 功能卡片 2 */}
            <div className="card p-8 text-center animate-fadeInUp animate-delay-600 h-full flex flex-col">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">即時協作</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                邀請朋友家人一起規劃，即時同步更新，投票決定行程，讓每個人都能參與旅行計劃。
              </p>
            </div>

            {/* 功能卡片 3 */}
            <div className="card p-8 text-center animate-fadeInUp animate-delay-800 h-full flex flex-col">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">預算管理</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                自動計算旅行費用，分帳功能讓團體旅行更輕鬆，即時追蹤預算使用情況。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-fadeInUp">
              簡單三步驟，開始您的 OurGo 旅程
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* 步驟 1 */}
            <div className="text-center animate-fadeInLeft animate-delay-400">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full animate-bounce"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">建立行程</h3>
              <p className="text-gray-600 leading-relaxed">
                選擇目的地和旅行日期，我們會為您建立專屬的行程規劃空間。
              </p>
            </div>

            {/* 步驟 2 */}
            <div className="text-center animate-fadeInUp animate-delay-600">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full animate-bounce animate-delay-200"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">邀請夥伴</h3>
              <p className="text-gray-600 leading-relaxed">
                分享行程連結給朋友家人，一起討論和規劃完美的旅行體驗。
              </p>
            </div>

            {/* 步驟 3 */}
            <div className="text-center animate-fadeInRight animate-delay-800">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-sky-400 rounded-full animate-bounce animate-delay-400"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">出發旅行</h3>
              <p className="text-gray-600 leading-relaxed">
                帶著完整的行程計劃，享受無憂無慮的完美旅行時光。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 區域 */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-fadeInUp">
            準備好開始您的 OurGo 旅程了嗎？
          </h2>
          <p className="text-xl text-gray-600 mb-8 animate-fadeInUp animate-delay-200">
            加入數千位旅行者的行列，讓 OurGo 幫您實現旅行夢想！
          </p>
          <button className="btn-coral text-xl px-12 py-5 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fadeInUp animate-delay-400">
            <div className="flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              立即開始規劃
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}

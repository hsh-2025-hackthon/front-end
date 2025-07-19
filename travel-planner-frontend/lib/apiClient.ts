import { msalInstance } from "../services/msal";
import { SilentRequest } from "@azure/msal-browser";
import { config, API_ENDPOINTS } from "./config";

// 後端 API 基礎 URL
const API_BASE_URL = config.api.baseUrl;

// 取得存取權杖
const getAccessToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const request: SilentRequest = {
      scopes: [config.auth.apiScope],
      account: accounts[0],
    };
    try {
      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      return msalInstance.acquireTokenPopup(request).then(res => res.accessToken);
    }
  }
  return null;
};

// 通用 API 用戶端
const apiClient = async (url: string, method: string, body?: any, options?: RequestInit) => {
  const token = await getAccessToken();
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  
  if (body && !(body instanceof FormData)) {
    headers.append("Content-Type", "application/json");
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    ...options,
  };

  if (body) {
    requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}/api${url}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || errorData.message || response.statusText);
  }

  // 處理空回應
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return response.text();
};

// 旅行相關 API
export const tripApi = {
  // 取得所有旅行
  getAll: () => apiClient("/trips", "GET"),
  
  // 建立新旅行
  create: (tripData: any) => apiClient("/trips", "POST", tripData),
  
  // 取得特定旅行
  getById: (tripId: string) => apiClient(`/trips/${tripId}`, "GET"),
  
  // 更新旅行
  update: (tripId: string, tripData: any) => apiClient(`/trips/${tripId}`, "PUT", tripData),
  
  // 刪除旅行
  delete: (tripId: string) => apiClient(`/trips/${tripId}`, "DELETE"),
  
  // 新增目的地
  addDestination: (tripId: string, destination: any) => 
    apiClient(`/trips/${tripId}/destinations`, "POST", destination),
  
  // 更新目的地
  updateDestination: (tripId: string, destinationId: string, destination: any) =>
    apiClient(`/trips/${tripId}/destinations/${destinationId}`, "PUT", destination),
  
  // 刪除目的地
  deleteDestination: (tripId: string, destinationId: string) =>
    apiClient(`/trips/${tripId}/destinations/${destinationId}`, "DELETE"),
  
  // 取得行程
  getItinerary: (tripId: string) => apiClient(`/trips/${tripId}/itinerary`, "GET"),
  
  // 取得智慧卡片
  getSmartCards: (tripId: string) => apiClient(`/trips/${tripId}/smart-cards`, "GET"),
  
  // 重新整理智慧卡片
  refreshSmartCard: (tripId: string, cardId: string) =>
    apiClient(`/trips/${tripId}/smart-cards/${cardId}/refresh`, "POST"),
  
  // 取得智慧卡片摘要
  getSmartCardsSummary: (tripId: string) => 
    apiClient(`/trips/${tripId}/smart-cards/summary`, "GET"),
  
  // 取得時間軸資料
  getTimeline: (tripId: string, granularity: string = "day") =>
    apiClient(`/trips/${tripId}/timeline?granularity=${granularity}`, "GET"),
  
  // 取得地圖資料
  getMapData: (tripId: string, includeRoutes: boolean = true) =>
    apiClient(`/trips/${tripId}/map-data?includeRoutes=${includeRoutes}`, "GET"),
  
  // 路线规划
  planRoute: (tripId: string, routeData: any) =>
    apiClient(`/trips/${tripId}/route-plan`, "POST", routeData),
};

// 協作相關 API
export const collaborationApi = {
  // 取得 WebPubSub 權杖
  getToken: (tripId: string) => apiClient(`/collaboration/token/${tripId}`, "GET"),
  
  // 成員管理
  addMember: (tripId: string, memberData: any) =>
    apiClient(`/trips/${tripId}/members`, "POST", memberData),
  
  removeMember: (tripId: string, userId: string) =>
    apiClient(`/trips/${tripId}/members/${userId}`, "DELETE"),
  
  // 權限管理
  getPermissions: (tripId: string) => apiClient(`/trips/${tripId}/permissions`, "GET"),
  
  updateMemberPermissions: (tripId: string, userId: string, permissions: any) =>
    apiClient(`/trips/${tripId}/members/${userId}/permissions`, "PUT", permissions),
  
  // 版本控制
  getVersions: (tripId: string, limit: number = 50, offset: number = 0) =>
    apiClient(`/trips/${tripId}/versions?limit=${limit}&offset=${offset}`, "GET"),
  
  restoreVersion: (tripId: string, versionId: string) =>
    apiClient(`/trips/${tripId}/versions/${versionId}/restore`, "POST"),
  
  getChanges: (tripId: string, since?: string, limit: number = 20) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (since) params.append("since", since);
    return apiClient(`/trips/${tripId}/changes?${params}`, "GET");
  },
  
  // 冲突处理
  getConflicts: (tripId: string) => apiClient(`/trips/${tripId}/conflicts`, "GET"),
  
  resolveConflict: (tripId: string, conflictId: string, resolution: any) =>
    apiClient(`/trips/${tripId}/conflicts/${conflictId}/resolve`, "POST", resolution),
};

// 聊天相关 API
export const chatApi = {
  // 聊天室管理
  getRooms: (tripId: string) => apiClient(`/trips/${tripId}/chat/rooms`, "GET"),
  
  createRoom: (tripId: string, roomData: any) =>
    apiClient(`/trips/${tripId}/chat/rooms`, "POST", roomData),
  
  updateRoom: (roomId: string, roomData: any) =>
    apiClient(`/chat/rooms/${roomId}`, "PUT", roomData),
  
  deleteRoom: (roomId: string) => apiClient(`/chat/rooms/${roomId}`, "DELETE"),
  
  // 消息管理
  getMessages: (roomId: string, limit: number = 50, offset: number = 0) =>
    apiClient(`/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`, "GET"),
  
  sendMessage: (roomId: string, messageData: any) =>
    apiClient(`/chat/rooms/${roomId}/messages`, "POST", messageData),
  
  editMessage: (messageId: string, content: string) =>
    apiClient(`/chat/messages/${messageId}`, "PUT", { content }),
  
  deleteMessage: (messageId: string) => apiClient(`/chat/messages/${messageId}`, "DELETE"),
  
  // 聊天室成員管理
  getRoomMembers: (roomId: string) => apiClient(`/chat/rooms/${roomId}/members`, "GET"),
  
  addRoomMember: (roomId: string, memberData: any) =>
    apiClient(`/chat/rooms/${roomId}/members`, "POST", memberData),
  
  removeRoomMember: (roomId: string, userId: string) =>
    apiClient(`/chat/rooms/${roomId}/members/${userId}`, "DELETE"),
};

// 投票相关 API
export const voteApi = {
  // 取得旅行的所有投票
  getTripVotes: (tripId: string) => apiClient(`/trips/${tripId}/votes`, "GET"),
  
  // 建立投票
  createVote: (tripId: string, voteData: any) => 
    apiClient(`/trips/${tripId}/votes`, "POST", voteData),
  
  // 取得特定投票
  getVote: (voteId: string) => apiClient(`/votes/${voteId}`, "GET"),
  
  // 提交投票回覆
  submitVoteResponse: (voteId: string, responseData: any) =>
    apiClient(`/votes/${voteId}/responses`, "POST", responseData),
  
  // 获取投票结果
  getVoteResults: (voteId: string) => apiClient(`/votes/${voteId}/results`, "GET"),
};

// 费用管理 API
export const expenseApi = {
  // 获取旅行费用
  getTripExpenses: (tripId: string) => apiClient(`/trips/${tripId}/expenses`, "GET"),
  
  // 创建费用
  createExpense: (tripId: string, expenseData: any) =>
    apiClient(`/trips/${tripId}/expenses`, "POST", expenseData),
  
  // 更新费用
  updateExpense: (expenseId: string, expenseData: any) =>
    apiClient(`/expenses/${expenseId}`, "PUT", expenseData),
  
  // 删除费用
  deleteExpense: (expenseId: string) => apiClient(`/expenses/${expenseId}`, "DELETE"),
  
  // 上传收据
  uploadReceipt: (expenseId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient(`/expenses/${expenseId}/receipt`, "POST", formData);
  },
  
  // 分账管理
  getTripSplits: (tripId: string) => apiClient(`/trips/${tripId}/splits`, "GET"),
  
  createSplit: (expenseId: string, splitData: any) =>
    apiClient(`/expenses/${expenseId}/split`, "POST", splitData),
  
  updateSplitStatus: (splitId: string, status: string) =>
    apiClient(`/splits/${splitId}/status`, "PUT", { status }),
  
  // 余额管理
  getTripBalances: (tripId: string) => apiClient(`/trips/${tripId}/balances`, "GET"),
  
  // 预算管理
  getBudget: (tripId: string) => apiClient(`/trips/${tripId}/budget`, "GET"),
  
  updateBudget: (tripId: string, budgetData: any) =>
    apiClient(`/trips/${tripId}/budget`, "PUT", budgetData),
  
  getBudgetAlerts: (tripId: string) => apiClient(`/trips/${tripId}/budget/alerts`, "GET"),
  
  // 导出费用报表
  exportCSV: (tripId: string) => {
    return fetch(`${API_BASE_URL}/api/trips/${tripId}/expenses/export/csv`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` }
    }).then(response => response.blob());
  },
};

// AI 智能分析 API
export const aiAgentApi = {
  // 优化行程
  optimizeItinerary: (tripId: string, optimizationData: any) =>
    apiClient(`/trips/${tripId}/agents/optimize-itinerary`, "POST", optimizationData),
  
  // 获取推荐
  getRecommendations: (tripId: string, recommendationData: any) =>
    apiClient(`/trips/${tripId}/agents/recommendations`, "POST", recommendationData),
  
  // 分析需求
  analyzeRequirements: (tripId: string, messagesData: any) =>
    apiClient(`/trips/${tripId}/agents/analyze-requirements`, "POST", messagesData),
  
  // 调整计划
  adjustPlan: (tripId: string, adjustmentData: any) =>
    apiClient(`/trips/${tripId}/agents/adjust-plan`, "POST", adjustmentData),
  
  // 获取 Agent 会话状态
  getSessionStatus: (tripId: string, sessionId: string) =>
    apiClient(`/trips/${tripId}/agents/status/${sessionId}`, "GET"),
  
  // 取消 Agent 会话
  cancelSession: (tripId: string, sessionId: string) =>
    apiClient(`/trips/${tripId}/agents/sessions/${sessionId}`, "DELETE"),
  
  // 获取可用 Agents
  getAvailableAgents: () => apiClient("/agents/available", "GET"),
  
  // 获取所有活跃会话
  getActiveSessions: () => apiClient("/agents/sessions", "GET"),
  
  // 获取会话详情
  getSessionDetails: (sessionId: string) => apiClient(`/agents/sessions/${sessionId}`, "GET"),
  
  // 获取会话结果
  getSessionResults: (sessionId: string) => apiClient(`/agents/sessions/${sessionId}/results`, "GET"),
  
  // 获取会话日志
  getSessionLogs: (sessionId: string, level?: string, limit: number = 100, offset: number = 0) => {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
    if (level) params.append("level", level);
    return apiClient(`/agents/sessions/${sessionId}/logs?${params}`, "GET");
  },
};

// 外部数据集成 API
export const mcpApi = {
  // 天气数据
  getWeather: (location: string) => apiClient(`/mcp/weather?location=${encodeURIComponent(location)}`, "GET"),
  
  // 汇率数据
  getExchangeRate: (from: string, to: string) =>
    apiClient(`/mcp/exchange-rates?from=${from}&to=${to}`, "GET"),
  
  // 地点搜索
  searchPlaces: (query: string, location?: string) => {
    const params = new URLSearchParams({ query });
    if (location) params.append("location", location);
    return apiClient(`/mcp/places/search?${params}`, "GET");
  },
  
  // 地点详情
  getPlaceDetails: (placeId: string) => apiClient(`/mcp/places/${placeId}/details`, "GET"),
  
  // 路线规划
  planRoute: (routeData: any) => apiClient("/mcp/routes/plan", "POST", routeData),
  
  // 旅行推荐
  getTravelRecommendations: (query: string, type?: string) => {
    const params = new URLSearchParams({ query });
    if (type) params.append("type", type);
    return apiClient(`/mcp/travel/recommendations?${params}`, "GET");
  },
  
  // 餐厅推荐
  getRestaurantRecommendations: (location: string, cuisine?: string) => {
    const params = new URLSearchParams({ location });
    if (cuisine) params.append("cuisine", cuisine);
    return apiClient(`/mcp/travel/restaurants?${params}`, "GET");
  },
  
  // 活动推荐
  getActivityRecommendations: (location: string, date?: string) => {
    const params = new URLSearchParams({ location });
    if (date) params.append("date", date);
    return apiClient(`/mcp/travel/activities?${params}`, "GET");
  },
};

// 预订服务 API
export const bookingApi = {
  // 航班搜索
  searchFlights: (searchData: any) => apiClient("/booking/flights/search", "POST", searchData),
  
  // 酒店搜索
  searchHotels: (searchData: any) => apiClient("/booking/hotels/search", "POST", searchData),
  
  // 获取预订详情
  getBookingDetails: (bookingId: string) => apiClient(`/booking/${bookingId}/details`, "GET"),
  
  // 确认预订
  confirmBooking: (bookingId: string) => apiClient(`/booking/${bookingId}/confirm`, "POST"),
  
  // 获取供应商状态
  getProvidersStatus: () => apiClient("/booking/providers/status", "GET"),
  
  // 触发健康检查
  triggerHealthCheck: () => apiClient("/booking/providers/health-check", "POST"),
  
  // 重置熔断器
  resetCircuitBreakers: () => apiClient("/booking/circuit-breakers/reset", "POST"),
  
  // 更新配置
  updateConfig: (configData: any) => apiClient("/booking/config", "PUT", configData),
};

// 通知相关 API
export const notificationApi = {
  // 获取用户通知
  getUserNotifications: () => apiClient("/users/me/notifications", "GET"),
  
  // 标记通知为已读
  markAsRead: (notificationId: string) =>
    apiClient(`/notifications/${notificationId}/read`, "PUT"),
  
  // 更新通知设置
  updateSettings: (settings: any) =>
    apiClient("/users/me/notification-settings", "PUT", settings),
};

// 快捷操作 API
export const quickActionApi = {
  // 快速添加目的地
  addDestination: (tripId: string, destinationData: any) =>
    apiClient(`/trips/${tripId}/quick-actions/add-destination`, "POST", destinationData),
  
  // 快速分账
  splitExpense: (tripId: string, splitData: any) =>
    apiClient(`/trips/${tripId}/quick-actions/split-expense`, "POST", splitData),
  
  // 获取天气
  getWeather: (tripId: string) => apiClient(`/trips/${tripId}/quick-actions/get-weather`, "POST"),
  
  // 创建投票
  createVote: (tripId: string, voteData: any) =>
    apiClient(`/trips/${tripId}/quick-actions/create-vote`, "POST", voteData),
};

// 用户相关 API
export const userApi = {
  // 获取当前用户
  getCurrentUser: () => apiClient("/users/me", "GET"),
  
  // 更新用户资料
  updateProfile: (userData: any) => apiClient("/users/me", "PUT", userData),
  
  // 搜索用户
  searchUsers: (query: string, limit: number = 20, offset: number = 0) =>
    apiClient(`/users?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`, "GET"),
  
  // 获取用户详情
  getUserById: (userId: string) => apiClient(`/users/${userId}`, "GET"),
};

// 健康监控 API
export const healthApi = {
  // 获取系统健康状态
  getSystemHealth: () => apiClient("/health", "GET"),
  
  // 获取服务健康详情
  getServicesHealth: () => apiClient("/health/services", "GET"),
  
  // 获取特定服务健康
  getServiceHealth: (serviceName: string) =>
    apiClient(`/health/services/${encodeURIComponent(serviceName)}`, "GET"),
  
  // 获取 Azure 服务健康
  getAzureHealth: () => apiClient("/health/azure", "GET"),
  
  // 获取 MCP 服务健康
  getMcpHealth: () => apiClient("/health/mcp", "GET"),
  
  // 刷新健康检查
  refreshHealthChecks: () => apiClient("/health/refresh", "POST"),
};

// 數據分析 API
export const analyticsApi = {
  // 取得用戶分析數據
  getUserAnalytics: (params?: { startDate: string; endDate: string }) =>
    apiClient(`/analytics/user?${new URLSearchParams(params || {}).toString()}`, "GET"),
  
  // 取得特定旅行分析數據
  getTripAnalytics: (tripId: string, params?: { startDate: string; endDate: string }) =>
    apiClient(`/analytics/trips/${tripId}?${new URLSearchParams(params || {}).toString()}`, "GET"),
  
  // 取得用戶即時統計
  getUserRealTimeStats: () => apiClient("/analytics/realtime/user", "GET"),
  
  // 取得旅行即時統計
  getTripRealTimeStats: (tripId: string) => 
    apiClient(`/analytics/realtime/trips/${tripId}`, "GET"),
  
  // 取得費用趨勢
  getExpenseTrends: (tripId?: string, period: 'week' | 'month' | 'year' = 'month') =>
    tripId 
      ? apiClient(`/analytics/expenses/trends/${tripId}?period=${period}`, "GET")
      : apiClient(`/analytics/expenses/trends?period=${period}`, "GET"),
  
  // 取得目的地熱度
  getDestinationHeatmap: () => apiClient("/analytics/destinations/heatmap", "GET"),
  
  // 取得協作者活動統計
  getCollaboratorActivity: (tripId: string) =>
    apiClient(`/analytics/collaboration/${tripId}`, "GET"),
  
  // 取得預算對比分析
  getBudgetComparison: (tripId?: string) =>
    tripId 
      ? apiClient(`/analytics/budget/comparison/${tripId}`, "GET")
      : apiClient("/analytics/budget/comparison", "GET"),
  
  // 導出分析報表
  exportAnalytics: async (tripId: string | undefined, format: 'csv' | 'pdf' | 'excel', params: { startDate: string; endDate: string }) => {
    const token = await getAccessToken();
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = tripId 
      ? `/analytics/export/${tripId}/${format}?${queryParams}`
      : `/analytics/export/${format}?${queryParams}`;
    
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export analytics');
    }
    
    return response.blob();
  }
};

export default apiClient;

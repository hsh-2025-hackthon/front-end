// 應用配置文件
export const config = {
  // 後端API配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://172.200.210.243",
    timeout: 30000, // 30秒
  },

  // WebPubSub配置
  webPubSub: {
    endpoint: process.env.NEXT_PUBLIC_WEBPUBSUB_ENDPOINT || "wss://172.200.210.243/ws",
    hub: "travelPlanner",
  },

  // Azure MSAL配置
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'YOUR_CLIENT_ID',
    tenantName: process.env.NEXT_PUBLIC_B2C_TENANT_NAME || 'YOUR_TENANT_NAME',
    policy: process.env.NEXT_PUBLIC_B2C_POLICY || 'YOUR_POLICY',
    apiScope: process.env.NEXT_PUBLIC_API_SCOPE || "api://YOUR_API/access_as_user",
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  },

  // 應用設置
  app: {
    name: '智慧旅行規劃助手',
    version: '1.0.0',
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },
} as const;

// 後端API端點
export const API_ENDPOINTS = {
  // 旅行管理
  trips: '/trips',
  trip: (id: string) => `/trips/${id}`,
  
  // 行程管理
  smartCards: (tripId: string) => `/trips/${tripId}/smartcards`,
  itinerary: (tripId: string) => `/trips/${tripId}/itinerary`,
  
  // 聊天功能
  chatRooms: (tripId: string) => `/trips/${tripId}/chatrooms`,
  chatMessages: (roomId: string) => `/chatrooms/${roomId}/messages`,
  
  // 費用管理
  expenses: (tripId: string) => `/trips/${tripId}/expenses`,
  budgets: (tripId: string) => `/trips/${tripId}/budgets`,
  splits: (tripId: string) => `/trips/${tripId}/splits`,
  
  // 投票功能
  votes: (tripId: string) => `/trips/${tripId}/votes`,
  
  // AI功能
  aiSessions: (tripId: string) => `/trips/${tripId}/ai-sessions`,
  aiAnalyze: (tripId: string) => `/trips/${tripId}/ai/analyze`,
  
  // MCP服務
  mcpWeather: '/mcp/weather',
  mcpPlaces: '/mcp/places',
  
  // 協作功能
  collaborators: (tripId: string) => `/trips/${tripId}/collaborators`,
  permissions: (tripId: string) => `/trips/${tripId}/permissions`,
} as const;

// WebSocket事件類型
export const WS_EVENTS = {
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  TRIP_UPDATED: 'trip_updated',
  VOTE_CREATED: 'vote_created',
  EXPENSE_ADDED: 'expense_added',
} as const; 
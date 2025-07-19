// 基礎類型定義
export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
}

// 旅行相關類型
export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: string;
  createdBy: string;
  status: 'planning' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface NewTrip {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Destination {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface NewDestination {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

// 行程相關類型
export interface Itinerary {
  id: string;
  tripId: string;
  days: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  cost?: number;
  currency?: string;
}

// 智慧卡片相關類型
export interface ItineraryCard {
  id: string;
  tripId: string;
  type: 'destination' | 'activity' | 'transport' | 'accommodation' | 'meal';
  title: string;
  description: string;
  basicInfo: {
    date: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    location?: {
      name: string;
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  };
  enrichedData?: {
    weather?: {
      current: {
        temperature: number;
        condition: string;
        icon: string;
        humidity: number;
        windSpeed: number;
      };
      recommendation: string;
    };
    pricing?: {
      exchangeRate: {
        localCurrency: string;
        rate: number;
        convertedPrice: number;
        baseCurrency: string;
      };
    };
    transport?: {
      toLocation: {
        method: string;
        duration: string;
        distance: string;
      };
    };
    operatingHours?: {
      today: {
        open: string;
        close: string;
        isOpen: boolean;
      };
    };
    lastUpdated?: string;
  };
  actions: CardAction[];
  metadata: {
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CardAction {
  id: string;
  type: 'navigation' | 'booking' | 'sharing' | 'modification' | 'information';
  label: string;
  action: string;
  enabled: boolean;
}

export interface SmartCardsSummary {
  totalCards: number;
  cardsByType: Record<string, number>;
  cardsByStatus: Record<string, number>;
  upcomingCards: Array<{
    id: string;
    title: string;
    date: string;
    startTime: string;
    type: string;
  }>;
  alertsCount: number;
  dataFreshness: {
    oldest: number;
    newest: number;
    averageAge: number;
  };
}

// 聊天相關類型
export interface ChatRoom {
  id: string;
  tripId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  messageType: 'text' | 'system' | 'ai_suggestion' | 'vote';
  metadata?: any;
  repliedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoomMember {
  roomId: string;
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
  lastReadAt?: string;
}

// 投票相關類型
export interface Vote {
  id: string;
  tripId: string;
  chatMessageId?: string;
  title: string;
  description: string;
  voteType: 'destination' | 'restaurant' | 'activity' | 'budget';
  options: VoteOption[];
  creatorId: string;
  deadline?: string;
  status: 'active' | 'closed' | 'cancelled';
  createdAt: string;
}

export interface VoteOption {
  id: string;
  name: string;
  description: string;
}

export interface VoteResponse {
  id: string;
  voteId: string;
  userId: string;
  selectedOptions: string[];
  comment?: string;
  createdAt: string;
}

export interface VoteResults {
  voteId: string;
  results: Record<string, number>;
}

// 費用管理相關類型
export interface Expense {
  id: string;
  tripId: string;
  userId: string;
  title: string;
  amount: number;
  currency: string;
  amountBaseCurrency: number;
  category: 'transportation' | 'food' | 'accommodation' | 'activity' | 'shopping' | 'other';
  subcategory?: string;
  description?: string;
  receiptImageUrl?: string;
  receiptData?: any;
  location?: any;
  expenseDate: string;
  participants: string[];
  splitMethod: 'equal' | 'percentage' | 'custom' | 'none';
  splitData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NewExpense {
  title: string;
  amount: number;
  currency: string;
  category: string;
  expenseDate: string;
  participants: string[];
  splitMethod: string;
  splitData?: any;
}

export interface ExpenseSplit {
  id: string;
  expenseId: string;
  userId: string;
  amount: number;
  currency: string;
  amountBaseCurrency: number;
  paidByUserId: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  tripId: string;
  category: string;
  totalAmount: number;
  currency: string;
  spentAmount: number;
  alertThreshold: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  type: string;
  message: string;
  currentAmount: number;
  budgetLimit: number;
}

export interface Balances {
  [userId: string]: {
    owes: string;
    amount: number;
  };
}

// 外部数据相关类型
export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    description: string;
  }>;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
}

export interface PlaceData {
  placeId: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating?: number;
  reviews?: number;
  photos?: string[];
  openingHours?: any[];
  priceLevel?: number;
  types?: string[];
}

// 预订相关类型
export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  budget?: number;
}

export interface FlightSearchResult {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  bookingUrl: string;
}

export interface HotelSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  budget?: number;
  amenities?: string[];
}

export interface HotelSearchResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  price: number;
  currency: string;
  bookingUrl: string;
}

export interface BookingDetails {
  bookingId: string;
  type: 'flight' | 'hotel';
  status: string;
  details: any;
}

// AI 智慧分析相關類型
export interface TravelRequirements {
  destinations: string[];
  budget: {
    total: number;
    currency: string;
    categories: any;
  };
  dates: {
    startDate: string;
    endDate: string;
    duration: number;
    flexibility: 'rigid' | 'flexible' | 'very_flexible';
  };
  preferences: any;
  groupDynamics: {
    size: number;
    interests: string[];
  };
  priorities: {
    primary: string[];
    secondary: string[];
  };
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    excitement: number;
    consensus: number;
  };
  confidence: number;
}

export interface OptimizedItinerary {
  id: string;
  name: string;
  totalCost: number;
  currency: string;
  duration: number;
  destinations: any[];
  dailyPlans: any[];
  transportation: any[];
  budgetBreakdown: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
    miscellaneous: number;
  };
  optimizationScore: number;
}

export interface DisruptionEvent {
  type: 'weather' | 'transportation' | 'accommodation' | 'activity_closure' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedDestination: string;
  affectedDate: string;
  description: string;
  suggestedActions: string[];
}

export interface AgentOptimizationResponse {
  success: boolean;
  sessionId: string;
  requirements: TravelRequirements;
  itinerary: OptimizedItinerary;
  alternatives: OptimizedItinerary[];
  confidence: number;
  processingTime: number;
  recommendations: string[];
  warnings: string[];
  generatedAt: string;
}

export interface AgentRequirementResponse {
  success: boolean;
  sessionId: string;
  requirements: TravelRequirements;
  confidence: number;
  processingTime: number;
  recommendations: string[];
  warnings: string[];
  generatedAt: string;
}

export interface AgentAdjustmentResponse {
  success: boolean;
  sessionId: string;
  disruption: DisruptionEvent;
  originalItinerary: OptimizedItinerary;
  adjustedItinerary: OptimizedItinerary;
  impactAnalysis: {
    affectedDays: number;
    costImpact: number;
    experienceImpact: number;
  };
  alternatives: OptimizedItinerary[];
  recommendations: string[];
  generatedAt: string;
}

export interface AgentSessionStatus {
  sessionId: string;
  tripId: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  currentStep: string;
  progress: number;
  startTime: string;
  endTime?: string;
  errors: string[];
  hasResults: boolean;
}

export interface AgentInfo {
  name: string;
  metadata: {
    name: string;
    version: string;
    capabilities: Array<{
      name: string;
      description: string;
      inputSchema: any;
      outputSchema: any;
    }>;
  };
}

// 通知相關類型
export interface Notification {
  id: string;
  userId: string;
  tripId?: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  channels: string[];
  status: 'pending' | 'sent' | 'failed' | 'read';
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface UserNotificationSettings {
  userId: string;
  notificationType: string;
  enabled: boolean;
  channels: string[];
  advanceMinutes?: number;
}

// 协作和版本控制相关类型
export interface TripVersion {
  id: string;
  tripId: string;
  versionNumber: number;
  createdBy: string;
  createdAt: string;
  changes: TripChange[];
  summary: string;
  tags: string[];
  dataSnapshot: any;
}

export interface TripChange {
  id: string;
  userId: string;
  userName: string;
  changeType: 'create' | 'update' | 'delete' | 'restore';
  entityType: 'trip' | 'destination' | 'itinerary' | 'expense' | 'vote' | 'chat_message' | 'member';
  entityId: string;
  fieldName?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface UserPermissions {
  userId: string;
  userName: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: PermissionSet;
  grantedBy: string;
  grantedAt: string;
  lastActive: string;
}

export interface PermissionSet {
  canEditTrip: boolean;
  canEditItinerary: boolean;
  canManageExpenses: boolean;
  canCreateVotes: boolean;
  canManageMembers: boolean;
  canDeleteContent: boolean;
  canExportData: boolean;
  canManageBookings: boolean;
  canAccessAnalytics: boolean;
  canModeratChat: boolean;
  granularPermissions: {
    destinations: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    activities: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    expenses: {
      viewAll: boolean;
      editOwn: boolean;
      editAll: boolean;
      approveSettlements: boolean;
    };
  };
}

export interface DataConflict {
  id: string;
  entityType: 'trip' | 'destination' | 'itinerary' | 'expense' | 'vote';
  entityId: string;
  fieldName: string;
  conflictType: 'concurrent_edit' | 'delete_conflict' | 'dependency_conflict';
  localValue: any;
  remoteValue: any;
  lastModifiedBy: Array<{
    userId: string;
    timestamp: string;
  }>;
  suggestedResolution: 'accept_local' | 'accept_remote' | 'merge_custom';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

// 可视化相关类型
export interface TimelineData {
  tripId: string;
  timeframe: {
    start: string;
    end: string;
    duration: number;
  };
  tasks: TimelineTask[];
  milestones: TimelineMilestone[];
  criticalPath: string[];
  generatedAt: string;
}

export interface TimelineTask {
  id: string;
  name: string;
  type: 'travel' | 'accommodation' | 'activity' | 'meal' | 'free_time';
  start: string;
  end: string;
  duration: number;
  dependencies: string[];
  status: 'planned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  location?: {
    name: string;
    coordinates: [number, number];
  };
  cost?: number;
  currency?: string;
  assignedTo: string[];
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface TimelineMilestone {
  id: string;
  name: string;
  date: string;
  type: 'departure' | 'arrival' | 'checkpoint' | 'deadline';
  status: 'upcoming' | 'reached' | 'missed';
}

export interface MapVisualizationData {
  tripId: string;
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  markers: MapMarker[];
  routes: MapRoute[];
  heatmapData: Array<{
    lat: number;
    lng: number;
    weight: number;
  }>;
}

export interface MapMarker {
  id: string;
  type: 'destination' | 'accommodation' | 'activity' | 'restaurant' | 'transport_hub' | 'custom';
  coordinates: { lat: number; lng: number };
  title: string;
  description: string;
  date: string;
  status: 'planned' | 'confirmed' | 'visited' | 'cancelled';
  metadata: {
    address: string;
    rating?: number;
    priceLevel?: number;
    category: string;
    photos: string[];
  };
  clustering?: {
    groupId: string;
    groupName: string;
  };
}

export interface MapRoute {
  id: string;
  name: string;
  waypoints: Array<{
    lat: number;
    lng: number;
    name: string;
    order: number;
  }>;
  travelMode: 'driving' | 'walking' | 'transit' | 'cycling';
  distance: number;
  duration: number;
  polyline: string;
  date: string;
  status: 'planned' | 'active' | 'completed';
}

// 健康监控相关类型
export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  message: string;
  responseTime: number;
  timestamp: string;
}

export interface HealthSummary {
  total: number;
  healthy: number;
  unhealthy: number;
  unknown: number;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unknown' | 'error';
  timestamp: string;
  version: string;
  summary: HealthSummary;
  services: ServiceHealth[];
}

// 推荐相关类型
export interface TravelRecommendation {
  id: string;
  name: string;
  description: string;
  type: 'attraction' | 'restaurant' | 'activity';
  location: string;
  rating: number;
  imageUrl: string;
}

export interface RestaurantRecommendation {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  rating: number;
  priceRange: string;
  imageUrl: string;
}

export interface ActivityRecommendation {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  price: number;
  imageUrl: string;
}

// 供应商状态
export interface ProviderStatus {
  name: string;
  type: 'flight' | 'hotel' | 'activity';
  available: boolean;
  lastChecked: string;
}

// 错误响应类型
export interface ErrorResponse {
  error: string;
  message?: string;
}

// WebPubSub 令牌
export interface WebPubSubToken {
  token: string;
  url: string;
  expiresOn: string;
}

// 路线规划相关类型
export interface RoutePlanRequest {
  coordinates: [number, number][];
  travelMode?: 'car' | 'truck' | 'taxi' | 'bus' | 'van' | 'motorcycle' | 'bicycle' | 'pedestrian';
}

export interface RoutePlanResponse {
  routes: Array<{
    summary: {
      lengthInMeters: number;
      travelTimeInSeconds: number;
      trafficDelayInSeconds: number;
    };
    legs: Array<{
      summary: {
        lengthInMeters: number;
        travelTimeInSeconds: number;
      };
      points: Array<{
        latitude: number;
        longitude: number;
      }>;
    }>;
  }>;
}

// 收据识别相关类型
export interface ReceiptData {
  merchant: string;
  total: number;
  currency: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  tax: number;
  confidence: number;
}

// 协作者相关类型
export interface Collaborator {
  userId: string;
  role: 'editor' | 'viewer';
}

export interface NewCollaborator {
  email: string;
  role: 'editor' | 'viewer';
}

export interface ExtractedInfo {
  destinations: string[];
  dates: string[];
  budget: number;
  interests: string[];
  preferences: any;
  mentions: any;
} 
# 環境設置指南

## 後端服務器配置

前端已配置連接到後端服務器：`http://172.200.210.243`

## 環境變數設置（可選）

雖然已在代碼中設置了默認值，但您可以通過創建 `.env.local` 文件來覆蓋這些配置：

```bash
# .env.local 文件內容

# 後端API服務器地址
NEXT_PUBLIC_API_BASE_URL=http://172.200.210.243

# WebPubSub WebSocket端點
NEXT_PUBLIC_WEBPUBSUB_ENDPOINT=wss://172.200.210.243/ws

# Azure B2C 認證配置
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_B2C_TENANT_NAME=your-tenant-name
NEXT_PUBLIC_B2C_POLICY=your-policy-name
NEXT_PUBLIC_API_SCOPE=api://your-api/access_as_user

# 重定向URI（通常為前端地址）
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000

# 應用環境
NEXT_PUBLIC_APP_ENV=development
```

## API 端點

前端已配置以下API端點：

### 旅行管理
- `GET /api/trips` - 獲取所有旅行
- `POST /api/trips` - 創建新旅行
- `GET /api/trips/{id}` - 獲取特定旅行

### 聊天功能
- `GET /api/trips/{tripId}/chatrooms` - 獲取聊天室列表
- `GET /api/chatrooms/{roomId}/messages` - 獲取聊天消息
- `POST /api/chatrooms/{roomId}/messages` - 發送消息

### 費用管理
- `GET /api/trips/{tripId}/expenses` - 獲取費用列表
- `POST /api/trips/{tripId}/expenses` - 添加新費用
- `POST /api/trips/{tripId}/splits` - 設置分賬

### 智慧卡片
- `GET /api/trips/{tripId}/smartcards` - 獲取智慧卡片
- `POST /api/trips/{tripId}/smartcards/refresh` - 刷新卡片

### AI 功能
- `POST /api/trips/{tripId}/ai/analyze` - AI 分析需求
- `GET /api/trips/{tripId}/ai-sessions` - 獲取AI會話

### MCP 服務
- `GET /api/mcp/weather` - 獲取天氣信息
- `GET /api/mcp/places` - 獲取地點信息

## WebSocket 連接

WebSocket 連接配置：
- 端點：`wss://172.200.210.243/ws`
- Hub：`travelPlanner`

支持的事件：
- `message_sent` - 消息發送
- `message_received` - 消息接收
- `trip_updated` - 旅行更新
- `vote_created` - 投票創建
- `expense_added` - 費用添加

## 開發服務器

啟動開發服務器：

```bash
npm run dev
```

前端將運行在 `http://localhost:3000` 並連接到後端 `http://172.200.210.243`

## 生產構建

```bash
npm run build
npm start
```

## 故障排除

### 連接問題
1. 確認後端服務器 `172.200.210.243` 可訪問
2. 檢查防火牆設置
3. 確認後端服務正在運行

### 認證問題
1. 確認 Azure B2C 配置正確
2. 檢查客戶端ID和租戶設置
3. 確認API範圍配置

### API 錯誤
1. 檢查瀏覽器開發者工具的網絡標籤
2. 確認API端點格式正確
3. 檢查認證令牌是否有效 
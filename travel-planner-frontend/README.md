# OurGo - 协同旅行规划 AI 系统

一个功能完整的多用户协同旅行规划系统，集成了智能 AI 分析、实时聊天协作、预算管理、外部数据整合等强大功能。

## 🌟 核心功能

### 1. 群组协作模块
- **实时聊天系统** - 支持多人实时讨论旅行计划
- **投票决策机制** - 群组成员可对景点、餐厅等进行投票
- **版本控制** - 记录每次编辑历史，支持回滚到先前版本
- **权限管理** - 支持管理者、编辑者、观看者等不同权限角色

### 2. 智能分析引擎
- **AI 需求分析** - 自动分析群组对话，提取旅行偏好和需求
- **行程智能优化** - 基于约束条件生成最佳化路线
- **智能推荐** - 个性化推荐景点、餐厅、活动
- **应变调整** - 支持行程被打乱时的快速重新规划

### 3. 智能预算管理系统
- **OCR 收据识别** - 拍照识别收据，自动解析金额和商家信息
- **智能分账** - 支持平均分、按比例、自定义等多种分账方式
- **预算控制** - 实时显示预算使用情况，超支警示
- **多币种支持** - 自动汇率转换与统一货币分账

### 4. 通知提醒系统
- **行前提醒** - 交通出发、文件检查、天气预报提醒
- **即时异常提示** - 航班延误、天气变化、预订异常通知
- **日程快照** - 每日行程总览和进度追踪

### 5. 外部数据整合 (MCP)
- **天气预报** - OpenWeatherMap 整合，5-7 天详细天气预报
- **汇率查询** - ExchangeRate-API 整合，实时汇率查询
- **地图路线** - Google Maps API 集成，最佳路线规划
- **旅游信息** - TripAdvisor/Yelp 评价整合

### 6. 航班酒店预订整合
- **一页式搜索** - 同时搜索航班与酒店，提供套装和分别预订选项
- **多平台比价** - 整合 Booking.com、Expedia、Skyscanner 等平台
- **智能标签** - 自动标注"最省"、"推荐"、"最快"选项

### 7. 智能行程卡片系统
- **天气整合** - 每日行程显示当地天气预报与穿搭建议
- **汇率显示** - 景点门票、餐厅价格同时显示当地货币与换算价格
- **交通信息** - 显示前往下个景点的交通方式与预估时间
- **动态更新** - 根据实时数据自动更新卡片信息

### 8. 快捷操作界面
- **快速指令** - 支持 `/weather`, `/budget`, `/add [景点]` 等指令
- **一键操作** - 常用功能如平均分账、匯出行程单击完成
- **快捷按钮** - 输入框旁放置常用功能快捷标签

## 🛠 技术架构

### 前端技术栈
- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 原子化 CSS 框架
- **Jotai** - 轻量级状态管理
- **Framer Motion** - 动画效果库
- **React Query** - 数据获取和缓存

### UI 组件库
- **Headless UI** - 无样式组件库
- **Heroicons** - 图标库
- **Material-UI Charts** - 图表组件
- **React Leaflet** - 地图组件
- **React Hook Form** - 表单处理

### 功能库
- **React Dropzone** - 文件上传
- **Socket.io Client** - 实时通信
- **date-fns** - 日期处理
- **Chart.js** - 数据可视化

### 认证与实时通信
- **Azure MSAL** - Microsoft 身份验证
- **Azure Web PubSub** - 实时消息推送
- **Y.js** - 协同编辑 CRDT

## 📁 项目结构

```
travel-planner-frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # 主应用页面
│   │   ├── layout.tsx      # 根布局
│   │   └── providers.tsx   # 全局提供者
│   └── components/         # 通用组件
├── features/               # 功能模块
│   ├── auth/              # 认证功能
│   ├── chat/              # 聊天协作
│   ├── itinerary/         # 行程管理
│   └── budget/            # 预算管理
├── lib/                   # 工具库
│   ├── apiClient.ts      # API 客户端
│   └── types.ts          # TypeScript 类型定义
├── store/                 # 状态管理
│   └── atoms.ts          # Jotai 原子状态
├── services/              # 服务层
│   ├── msal.ts           # MSAL 配置
│   ├── tripService.ts    # 旅行服务
│   └── WebPubSubProvider.ts # 实时通信
└── styles/                # 样式文件
```

## 🚀 快速开始

### 1. 环境准备
```bash
# 确保 Node.js 版本 >= 18
node --version

# 克隆项目
git clone <repository-url>
cd travel-planner-frontend

# 安装依赖
npm install --legacy-peer-deps
```

### 2. 环境配置
复制 `.env.local` 文件并配置相应的环境变量：

```bash
# API 配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # 后端 API 地址
NEXT_PUBLIC_API_SCOPE=api://travel-planner/access_as_user

# Azure MSAL 配置
NEXT_PUBLIC_MSAL_CLIENT_ID=your-client-id
NEXT_PUBLIC_MSAL_AUTHORITY=https://login.microsoftonline.com/common
NEXT_PUBLIC_MSAL_REDIRECT_URI=http://localhost:3000
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 4. 构建和部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🎯 主要功能使用说明

### 创建和管理旅行
1. 点击"新建"按钮创建旅行
2. 输入旅行名称和基本信息
3. 邀请朋友加入协作

### 群组协作聊天
1. 选择"群组聊天"模块
2. 使用快捷指令：`/weather`, `/budget`, `/add [景点]`
3. AI 会自动分析对话并提供建议
4. 使用快捷操作面板快速添加内容

### 智能行程卡片
1. 查看"智能卡片"模块
2. 每张卡片显示实时天气、价格、交通信息
3. 点击刷新按钮获取最新数据
4. 使用操作按钮进行导航、预订等

### 预算管理
1. 进入"预算管理"模块
2. 拍照上传收据，系统自动识别金额
3. 选择分账方式和参与人员
4. 查看预算使用情况和余额

## 🔧 开发指南

### 添加新功能模块
1. 在 `features/` 下创建新模块文件夹
2. 创建组件、hooks、状态管理文件
3. 在主应用中注册新模块

### API 客户端使用
```typescript
import { tripApi, chatApi, expenseApi } from '@/lib/apiClient';

// 获取旅行列表
const trips = await tripApi.getAll();

// 发送聊天消息
await chatApi.sendMessage(roomId, messageData);

// 创建费用记录
await expenseApi.createExpense(tripId, expenseData);
```

### 状态管理
```typescript
import { useAtom } from 'jotai';
import { currentTripAtom, expensesAtom } from '@/store/atoms';

const [currentTrip, setCurrentTrip] = useAtom(currentTripAtom);
const [expenses, setExpenses] = useAtom(expensesAtom);
```

## 🧪 测试

```bash
# 运行测试
npm test

# 运行 lint 检查
npm run lint

# 类型检查
npm run type-check
```

## 📱 PWA 支持

本应用支持 Progressive Web App 功能：
- 离线访问重要信息
- 推送通知提醒
- 手机添加到主屏幕
- Widget 支持显示关键信息

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/new-feature`)
3. 提交变更 (`git commit -am 'Add new feature'`)
4. 推送分支 (`git push origin feature/new-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

如有问题或建议，请：
1. 查看 [FAQ](docs/FAQ.md)
2. 提交 [Issue](issues)
3. 参考 [API 文档](docs/API.md)

---

**OurGo** - 让每一次旅行都成为美好回憶 ✈️🌟

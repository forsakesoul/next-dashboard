# 项目上下文摘要（证券交易每日复盘）
生成时间：2025-11-20

## 1. 相似实现分析

### 实现1: app/food-wheel/page.tsx
- **模式**: 客户端组件 + 动态导入 + 自定义Hooks
- **可复用**:
  - 动态导入模式（减少初始加载）
  - 自定义Hooks模式（逻辑复用）
  - 响应式布局设计
- **需注意**:
  - 使用 `'use client'` 标记客户端组件
  - 动态导入时提供loading状态
  - 处理CSS动画和视觉效果

### 实现2: app/beauti/page.tsx
- **模式**: 复杂客户端交互 + 外部API调用 + useEffect管理
- **可复用**:
  - 外部API轮询机制
  - 重试策略（最多5次）
  - 移动端触摸手势支持
  - 内联样式（style jsx global）
- **需注意**:
  - 资源清理（useEffect返回清理函数）
  - 事件监听器管理
  - 错误处理和降级方案

### 实现3: app/ui/dashboard/revenue-chart.tsx + cards.tsx
- **模式**: 服务端组件 + 数据可视化 + HeroIcons
- **可复用**:
  - Lusitana字体使用（`@/app/ui/fonts`）
  - HeroIcons图标库
  - 数据可视化结构
  - 卡片式布局
- **需注意**:
  - 异步组件（async function）
  - 数据格式化工具（formatCurrency）
  - 条件渲染（无数据时）

## 2. 项目约定

### 命名约定
- **组件文件**: PascalCase（如 `RevenueChart.tsx`）
- **页面文件**: 小写kebab-case目录 + `page.tsx`（如 `app/stock-review/page.tsx`）
- **工具函数**: camelCase（如 `fetchStockData`）
- **类型定义**: PascalCase（如 `StockData`）

### 文件组织
- **页面**: `app/[route-name]/page.tsx`
- **组件**: `app/ui/[module]/[component].tsx`
- **数据层**: `app/lib/data.ts`（数据库查询函数）
- **类型定义**: `app/lib/definitions.ts`
- **工具函数**: `app/lib/utils.ts`

### 导入顺序
1. React/Next.js核心库
2. 第三方库
3. 项目内部模块（使用 `@/` 别名）
4. 类型定义
5. 样式/字体

### 代码风格
- **缩进**: 2空格
- **引号**: 单引号
- **分号**: 不使用
- **组件导出**: 优先使用 `export default`
- **TypeScript**: 严格模式，明确类型注解

## 3. 可复用组件清单

### UI组件
- `app/ui/fonts.ts`: Lusitana字体配置
- `app/ui/dashboard/cards.tsx`: Card组件（卡片布局）
- `app/ui/dashboard/revenue-chart.tsx`: 图表组件模板
- `app/ui/skeletons.tsx`: 加载骨架屏

### 数据层工具
- `app/lib/data.ts`: 数据库查询函数模板
- `app/lib/utils.ts`: formatCurrency等格式化工具
- `app/lib/definitions.ts`: TypeScript类型定义

### 动画/交互
- `food-wheel/hooks/`: 自定义Hooks（useWheelAnimation, useWeightedSpin）
- `food-wheel/components/`: Canvas组件、粒子效果

## 4. 测试策略

### 测试框架
- **未在代码中看到测试框架配置**，需要确认项目是否有测试需求

### 测试模式
- **客户端组件**: 测试用户交互、状态变化
- **服务端组件**: 测试数据获取、渲染逻辑
- **数据查询**: 测试SQL查询正确性、错误处理

### 覆盖要求
- 正常流程：API调用成功、数据展示
- 边界条件：无数据、数据为空、极端值
- 错误处理：API失败、网络错误、数据库错误

## 5. 依赖和集成点

### 外部依赖
- **@heroicons/react**: 图标库
- **postgres**: 数据库连接（需要 `POSTGRES_URL` 环境变量）
- **next/font/google**: 字体优化
- **tailwindcss**: 样式框架

### 内部依赖
- **字体系统**: `app/ui/fonts.ts`（被7个组件依赖）
- **工具函数**: `app/lib/utils.ts`（格式化、验证）
- **类型系统**: `app/lib/definitions.ts`（全局类型）

### 集成方式
- **数据层**: 直接调用 `app/lib/data.ts` 中的查询函数
- **类型系统**: 导入 `app/lib/definitions.ts` 中的类型
- **样式**: Tailwind CSS类名 + 部分内联样式

### 配置来源
- **环境变量**: `.env` 文件（POSTGRES_URL）
- **Tailwind配置**: `tailwind.config.ts`（自定义主题）
- **TypeScript配置**: `tsconfig.json`（路径别名 `@/*`）

## 6. 技术选型理由

### 为什么用这个方案
- **Next.js App Router**: 服务端渲染 + 客户端交互混合，优化SEO和性能
- **PostgreSQL**: 结构化数据存储，支持复杂查询
- **Tailwind CSS**: 快速开发，一致性样式系统
- **TypeScript**: 类型安全，减少运行时错误

### 优势
- **性能**: Turbopack加速开发，字体自动优化
- **开发体验**: 路径别名、热重载、类型提示
- **可维护性**: 模块化架构、统一错误处理

### 劣势和风险
- **数据库依赖**: 需要配置PostgreSQL（可能增加部署复杂度）
- **客户端状态**: 未使用状态管理库（复杂场景可能需要Redux/Zustand）
- **测试覆盖**: 未见测试代码（需要补充）

## 7. 关键风险点

### 证券数据API
- **选择风险**: 需要找到免费/可靠的证券数据API（如Tushare、新浪财经）
- **频率限制**: 免费API可能有调用频率限制
- **数据延迟**: 免费数据可能不是实时的（延迟15分钟）

### 并发问题
- **数据库连接**: 需要考虑连接池（postgres包已启用SSL）
- **API调用**: 避免过度调用导致限流

### 边界条件
- **节假日**: 证券市场休市时无数据
- **数据缺失**: API返回空数据或错误
- **时区问题**: 确保时间显示一致性

### 性能瓶颈
- **大数据量**: 历史数据可能很大，需要分页或限制查询范围
- **图表渲染**: 复杂图表可能影响性能，考虑使用专业库（Recharts/Chart.js）

### 安全考虑
- **API密钥**: 如果使用付费API，需要安全存储密钥
- **SQL注入**: 已使用参数化查询（postgres包），风险较低
- **数据验证**: 需要验证外部API返回的数据格式

## 8. 证券复盘功能规划

### 核心数据维度
1. **上证指数**: 开盘价、收盘价、最高价、最低价、涨跌幅
2. **成交量**: 当日总成交量、成交额
3. **市场情绪**: 涨跌家数、涨停跌停数量
4. **板块行情**: 热门板块涨跌幅
5. **个股榜单**: 涨幅榜、跌幅榜、成交额榜
6. **资金流向**: 北向资金、南向资金
7. **技术指标**: MACD、KDJ、RSI等

### 丰富交互功能
1. **日期选择器**: 查看历史某一天的复盘数据
2. **数据对比**: 与前一日/前一周对比
3. **图表可视化**: K线图、成交量柱状图、技术指标曲线
4. **实时刷新**: WebSocket或轮询更新数据（交易时段）
5. **自定义看板**: 用户可选择展示哪些指标
6. **导出功能**: 导出PDF/Excel复盘报告
7. **AI分析**: 使用GPT生成市场总结和建议

### 数据来源推荐
- **免费API**:
  - 新浪财经API（无需注册）
  - 网易财经API
  - 东方财富网API
- **付费API**:
  - Tushare Pro（高质量数据）
  - 聚宽JQData
- **爬虫方案**:
  - 自建爬虫（需要遵守robots.txt）

### 数据库设计
```sql
-- 日线数据表
CREATE TABLE daily_market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  index_code VARCHAR(20) NOT NULL, -- sh000001（上证指数）
  open_price DECIMAL(10, 2),
  close_price DECIMAL(10, 2),
  high_price DECIMAL(10, 2),
  low_price DECIMAL(10, 2),
  volume BIGINT,
  turnover DECIMAL(20, 2),
  change_percent DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, index_code)
);

-- 市场情绪表
CREATE TABLE market_sentiment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  up_count INT,
  down_count INT,
  limit_up_count INT,
  limit_down_count INT,
  total_turnover DECIMAL(20, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 板块行情表
CREATE TABLE sector_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  sector_name VARCHAR(50) NOT NULL,
  change_percent DECIMAL(5, 2),
  lead_stock VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, sector_name)
);
```

### 技术架构建议
- **页面路由**: `app/stock-review/page.tsx`
- **数据API**: `app/api/stock/route.ts`（Next.js API Route）
- **数据获取**: `app/lib/stock-data.ts`（封装API调用）
- **类型定义**: `app/lib/definitions.ts`（新增Stock相关类型）
- **UI组件**:
  - `app/ui/stock/index-card.tsx`（指数卡片）
  - `app/ui/stock/k-line-chart.tsx`（K线图）
  - `app/ui/stock/stock-list.tsx`（个股列表）
  - `app/ui/stock/sector-heatmap.tsx`（板块热力图）

## 9. 实施优先级

### P0（核心功能，必须实现）
1. 上证指数基础数据展示
2. 成交量展示
3. 日期选择器
4. 基础卡片布局

### P1（重要功能，增强体验）
1. K线图可视化
2. 涨跌榜单
3. 板块行情
4. 数据对比功能

### P2（进阶功能，锦上添花）
1. 技术指标
2. 资金流向
3. AI分析总结
4. 导出报告

### P3（未来扩展）
1. 实时数据推送
2. 个人自选股
3. 预警提醒
4. 社区讨论

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js App Router 的 Dashboard 应用，包含发票管理、客户管理等功能，同时包含两个独立的娱乐页面（美食转盘和随机视频）。项目使用 TypeScript、Tailwind CSS 和 PostgreSQL 数据库。

**技术栈:**
- Next.js (latest, App Router)
- React (latest)
- TypeScript 5.7.3
- Tailwind CSS 3.4.17
- PostgreSQL (通过 `postgres` 包)
- Next-Auth 5.0.0-beta.25 (身份验证)
- Bcrypt (密码加密)

## 常用开发命令

### 开发和构建
```bash
# 启动开发服务器 (使用 Turbopack)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 数据库操作
```bash
# 初始化数据库并填充示例数据
# 访问 http://localhost:3000/seed
# 这会创建并填充 users, customers, invoices, revenue 表
```

**注意:** 项目需要配置 `POSTGRES_URL` 环境变量才能连接数据库。

## 项目架构

### 目录结构
```
app/
├── lib/                    # 共享工具和数据层
│   ├── data.ts            # 数据库查询函数
│   ├── definitions.ts     # TypeScript 类型定义
│   ├── placeholder-data.ts # 示例数据
│   └── utils.ts           # 工具函数
├── ui/                     # UI 组件库
│   ├── dashboard/         # Dashboard 专用组件
│   ├── invoices/          # 发票相关组件
│   ├── customers/         # 客户相关组件
│   ├── fonts.ts           # 字体配置 (Lusitana)
│   └── [其他组件]
├── seed/route.ts          # 数据库初始化端点
├── query/route.ts         # 查询端点
├── beauti/page.tsx        # 随机视频播放器页面
├── food-wheel/page.tsx    # 美食转盘页面
├── shop/[...slug]/page.tsx # 商店动态路由
└── [其他页面]
```

### 核心架构模式

**数据层 (app/lib/data.ts):**
- 使用 `postgres` 包进行数据库连接（启用 SSL）
- 所有数据库查询封装为独立的异步函数
- 统一错误处理模式：捕获错误并抛出描述性消息
- 分页支持：ITEMS_PER_PAGE = 6

**类型系统 (app/lib/definitions.ts):**
- 手动定义 TypeScript 类型（未使用 ORM）
- 核心类型：User, Customer, Invoice, Revenue
- 区分原始数据类型和格式化后的类型（如 LatestInvoice vs LatestInvoiceRaw）

**字体优化 (app/ui/fonts.ts):**
- 使用 `next/font/google` 加载 Lusitana 字体
- 权重：400, 700
- 子集：latin
- 显示策略：swap（优化性能）
- 7个组件依赖此字体：acme-logo, login-form, revenue-chart, cards, breadcrumbs, latest-invoices, customers/table

**样式系统:**
- Tailwind CSS 作为主要样式解决方案
- 自定义 Tailwind 配置：
  - 扩展 gridTemplateColumns（13列网格）
  - 自定义蓝色调色板
  - shimmer 关键帧动画
- 使用 `@tailwindcss/forms` 插件
- 部分组件使用 JSX 内联样式（如 beauti/page.tsx）

### 路径别名配置
- `@/*` 映射到项目根目录
- 示例：`@/app/ui/fonts`, `@/app/lib/data`

## 数据库架构

### 表结构
```sql
-- users: 用户账户（含加密密码）
-- customers: 客户信息
-- invoices: 发票记录（关联 customer_id）
-- revenue: 月度收入统计
```

**关键字段:**
- 所有表使用 UUID 作为主键（uuid-ossp 扩展）
- invoices.status: 'pending' | 'paid'
- invoices.amount: 整数（分为单位，需要格式化为美元）
- 所有 ID 使用 UUID v4

### 查询优化模式
- 使用 `Promise.all` 并行执行独立查询（见 fetchCardData）
- ILIKE 用于不区分大小写的搜索
- JOIN 优化：显式 JOIN 而非子查询
- 分页：LIMIT + OFFSET 模式

## 特殊功能页面

### 美食转盘 (/food-wheel)
- 客户端组件，使用 React Hooks
- 9个预定义美食选项，每个有独特颜色
- 使用 CSS conic-gradient 实现转盘视觉效果
- 动画：cubic-bezier(0.22, 0.61, 0.36, 1) 缓动函数
- 随机旋转 6-8 圈后停止

### 随机视频播放器 (/beauti)
- 客户端组件，复杂的视频预加载逻辑
- 13个外部 API 端点轮询
- 功能：自动连播、预加载下一个视频、静音控制
- 移动端优化：触摸手势支持（上滑切换）
- 重试机制：最多5次重试
- 内联样式（<style jsx global>）

## 开发注意事项

### 类型安全
- 严格模式启用（tsconfig.json strict: true）
- 所有数据库查询使用泛型类型注解
- 避免使用 `any`，优先使用明确的类型定义

### 性能优化
- 使用 Turbopack 加速开发构建
- 字体自动优化（next/font）
- 数据获取：并行查询 + 适当的错误边界
- 图片：使用 Next.js Image 组件（如果添加图片）

### 身份验证
- Next-Auth 配置（版本 5.0.0-beta.25）
- Bcrypt 用于密码加密（加密轮数：10）
- 注意：当前代码库中未看到完整的 auth 配置文件

### 环境变量
- `POSTGRES_URL`: PostgreSQL 连接字符串（必需，需启用 SSL）
- 环境变量文件应在 .gitignore 中

### 代码风格
- 函数组件优先使用 `export default`
- 客户端组件需显式标记 `'use client'`
- 异步函数使用 try-catch 统一错误处理
- 格式化工具函数集中在 `app/lib/utils.ts`

## 常见任务

### 添加新数据库查询
1. 在 `app/lib/definitions.ts` 中定义类型
2. 在 `app/lib/data.ts` 中创建查询函数
3. 使用统一的错误处理模式：
```typescript
export async function fetchNewData() {
  try {
    const data = await sql<Type[]>`SELECT ...`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ...');
  }
}
```

### 添加新 UI 组件
1. 在 `app/ui/` 或相应子目录创建组件
2. 如需客户端交互，添加 `'use client'` 指令
3. 导入字体：`import { lusitana } from '@/app/ui/fonts'`
4. 使用 Tailwind CSS 类进行样式设置

### 修改字体
如果需要更改或添加字体：
1. 修改 `app/ui/fonts.ts`
2. 从 `next/font/google` 或 `next/font/local` 导入
3. 更新所有依赖组件的导入语句

### 数据库迁移
当前没有迁移工具。数据库架构通过 `/seed` 端点的 CREATE TABLE 语句定义。如需修改架构：
1. 更新 `app/seed/route.ts` 中的 CREATE TABLE 语句
2. 更新 `app/lib/definitions.ts` 中的类型
3. 更新相关查询函数

## 项目文档

项目包含详细的任务文档在 `project_document/` 目录：
- 使用 RIPER-5 + 多维度思维协议
- 包含团队协作模拟和决策记录
- 详细的实施计划和验收标准
- 参考这些文档了解项目决策背景

## 故障排除

### TypeScript 编译错误
- 确保所有导入路径使用 `@/` 别名
- 检查 `app/ui/fonts.ts` 是否存在（常见问题）
- 运行 `npm run build` 查看完整错误信息

### 数据库连接失败
- 验证 `POSTGRES_URL` 环境变量
- 确保 SSL 启用（`{ ssl: 'require' }`）
- 检查数据库是否已初始化（访问 /seed）

### 开发服务器启动失败
- 清除 `.next` 目录：`rm -rf .next`
- 重新安装依赖：`npm install`
- 检查端口 3000 是否被占用

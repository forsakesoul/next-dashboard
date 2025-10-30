# PC端美食转盘技术方案

## 📋 项目概述

**目标**: 创建一个专为PC端优化的美食转盘页面，保持现有交互逻辑，提供符合PC端视觉体验的专业界面。

**访问路径**: `/food-wheel/pc`

**设计定位**: 商务专业风格，适合办公场景使用，强调效率和视觉舒适度。

---

## 🎨 视觉设计方向

### 设计理念
- **专业商务风**: 类似企业级Dashboard的简洁大气设计
- **宽屏优化**: 充分利用PC端横向空间 (1920×1080及以上)
- **分栏布局**: 左转盘 + 右侧信息面板的专业布局
- **低饱和度配色**: 柔和中性色调，减少视觉疲劳
- **微动效**: 精致的微交互，而非夸张的动画

### 配色方案

```typescript
PCTheme = {
  // 主背景：深灰蓝渐变（专业办公风）
  background: {
    primary: '#0f172a',      // slate-900
    secondary: '#1e293b',    // slate-800
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
  },

  // 强调色：商务蓝 + 金色点缀
  accent: {
    primary: '#3b82f6',      // blue-500 (主要行动按钮)
    secondary: '#f59e0b',    // amber-500 (中奖高亮)
    success: '#10b981',      // emerald-500 (成功状态)
    info: '#06b6d4',         // cyan-500 (信息提示)
  },

  // 文字层级
  text: {
    primary: '#f8fafc',      // slate-50 (主标题)
    secondary: '#cbd5e1',    // slate-300 (副标题)
    tertiary: '#94a3b8',     // slate-400 (辅助文字)
    muted: '#64748b',        // slate-500 (禁用状态)
  },

  // 卡片/容器
  surface: {
    card: 'rgba(30, 41, 59, 0.6)',           // 半透明卡片
    cardHover: 'rgba(30, 41, 59, 0.8)',      // 悬停加深
    panel: 'rgba(15, 23, 42, 0.9)',          // 侧边面板
    glassMorphism: {
      background: 'rgba(51, 65, 85, 0.4)',
      backdropFilter: 'blur(20px) saturate(120%)',
      border: '1px solid rgba(148, 163, 184, 0.2)'
    }
  }
}
```

### 转盘视觉设计

**尺寸**: 600×600px (固定，适合1080p屏幕)

**样式特点**:
1. **扁平化扇形**: 去除过度渐变，使用纯色或单向渐变
2. **细线分隔**: 1px白色半透明边框分隔扇形
3. **柔和阴影**: 卡片式投影，而非发光效果
4. **简约中心**: 纯色圆形按钮 + 图标，去除复杂装饰
5. **中奖指示**: 顶部三角形指针（静态）+ 扇形高亮

```
┌─────────────────────────────┐
│      ▼ 指针（固定）          │
│    ╱───────────╲            │
│   ╱  转盘区域   ╲           │
│  │   (旋转)      │          │
│   ╲             ╱           │
│    ╲───────────╱            │
│      [START]  ← 按钮        │
└─────────────────────────────┘
```

---

## 🏗️ 技术架构

### 文件结构

```
app/food-wheel/
├── pc/
│   └── page.tsx                    # PC端主页面
├── components/
│   ├── WheelCanvasPC.tsx          # PC端转盘组件 (新建)
│   ├── PCControlPanel.tsx         # PC端控制面板 (新建)
│   ├── PCStatsPanel.tsx           # PC端统计面板 (新建)
│   ├── PCResultModal.tsx          # PC端结果弹窗 (新建)
│   └── [复用现有组件]
├── config/
│   └── pc-theme.ts                # PC端主题配置 (新建)
└── hooks/
    └── [复用现有Hooks]
```

### 组件复用策略

**完全复用**:
- ✅ `useWheelAnimation` - 三阶段动画逻辑
- ✅ `useWeightedSpin` - 加权随机算法
- ✅ `useGlowEffect` - 发光效果 (改为中奖高亮)
- ✅ `food-options.json` - 美食数据
- ✅ 类型定义 (`types/food-wheel.types.ts`)

**重新设计**:
- 🆕 转盘Canvas绘制（扁平化风格）
- 🆕 控制面板布局（PC横向布局）
- 🆕 结果展示（模态弹窗而非卡片翻转）
- 🆕 整体页面布局（宽屏优化）

---

## 📐 页面布局设计

### 布局结构 (1920×1080)

```
┌────────────────────────────────────────────────────────────┐
│  Header (80px)                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  美食决策助手 [PC版]          [返回] [统计] [设置]  │  │
│  └─────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│  Main Content (calc(100vh - 80px))                         │
│  ┌──────────────────────┬────────────────────────────────┐ │
│  │  Left: Wheel Area    │  Right: Info Panel             │ │
│  │  (60% width)         │  (40% width)                   │ │
│  │                      │                                │ │
│  │  ┌──────────────┐   │  ┌──────────────────────────┐ │ │
│  │  │              │   │  │  结果卡片                 │ │ │
│  │  │   转盘区域    │   │  │  - 中奖结果显示          │ │ │
│  │  │   600×600px  │   │  │  - 动画图标              │ │ │
│  │  │              │   │  └──────────────────────────┘ │ │
│  │  └──────────────┘   │                                │ │
│  │                      │  ┌──────────────────────────┐ │ │
│  │  [START SPIN] 按钮  │  │  操作控制                 │ │ │
│  │                      │  │  - 开始按钮 (大)         │ │ │
│  │                      │  │  - 状态指示              │ │ │
│  │  提示文字            │  └──────────────────────────┘ │ │
│  │  "点击开始抽奖"      │                                │ │
│  │                      │  ┌──────────────────────────┐ │ │
│  │                      │  │  美食列表                 │ │ │
│  │                      │  │  - 网格卡片布局 (2列)    │ │ │
│  │                      │  │  - 中奖项高亮            │ │ │
│  │                      │  │  - 滚动列表              │ │ │
│  │                      │  └──────────────────────────┘ │ │
│  │                      │                                │ │
│  │                      │  ┌──────────────────────────┐ │ │
│  │                      │  │  统计信息                 │ │ │
│  │                      │  │  - 今日抽奖次数          │ │ │
│  │                      │  │  - 历史记录              │ │ │
│  │                      │  └──────────────────────────┘ │ │
│  └──────────────────────┴────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### 响应式断点

```typescript
breakpoints = {
  // PC专用版本，限制最小宽度
  minWidth: 1280,  // 小于此宽度显示引导跳转移动版

  // 布局变化
  desktop: {
    min: 1280,
    wheelSize: 500,
    layout: 'horizontal'  // 左右布局
  },
  largeDesktop: {
    min: 1920,
    wheelSize: 600,
    layout: 'horizontal'
  }
}
```

---

## 🎯 核心功能实现

### 1. WheelCanvasPC 组件

**设计特点**:
```typescript
interface WheelCanvasPCProps {
  options: FoodOption[]
  rotation: number
  isSpinning: boolean
  winningIndex: number | null
  onCenterClick: () => void
}

// 视觉特性
const PCWheelStyle = {
  // 扁平扇形
  segment: {
    fillStyle: 'solid',           // 纯色填充
    strokeStyle: 'rgba(255, 255, 255, 0.2)',
    lineWidth: 1,
    shadowBlur: 0,                // 无内发光
  },

  // 中心按钮
  centerButton: {
    radius: 70,
    backgroundColor: '#3b82f6',
    hoverBackgroundColor: '#2563eb',
    icon: '▶',                    // 播放图标
    iconSize: 32,
    shadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
  },

  // 中奖高亮
  winningHighlight: {
    strokeStyle: '#f59e0b',       // 金色描边
    lineWidth: 4,
    shadowBlur: 20,
    shadowColor: 'rgba(245, 158, 11, 0.6)',
    overlayOpacity: 0.2,          // 半透明遮罩
  },

  // 固定指针
  pointer: {
    position: 'top',              // 顶部居中
    type: 'triangle',             // 三角形
    size: 24,
    color: '#f59e0b',
    shadow: '0 2px 10px rgba(245, 158, 11, 0.5)'
  }
}
```

**Canvas绘制逻辑**:
```typescript
function drawWheelPC(ctx: CanvasRenderingContext2D) {
  // 1. 清空画布
  ctx.clearRect(0, 0, width, height)

  // 2. 绘制转盘阴影
  drawWheelShadow(ctx)

  // 3. 绘制扇形（无渐变，纯色）
  options.forEach((option, index) => {
    const startAngle = rotation + (index * segmentAngle)
    const endAngle = startAngle + segmentAngle

    // 绘制扇形
    ctx.fillStyle = option.color
    drawSegment(ctx, centerX, centerY, radius, startAngle, endAngle)

    // 绘制边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  })

  // 4. 绘制文字（水平保持，不旋转）
  drawSegmentText(ctx, options, rotation)

  // 5. 绘制中奖高亮（如果有）
  if (winningIndex !== null && !isSpinning) {
    drawWinningHighlight(ctx, winningIndex)
  }

  // 6. 绘制中心按钮
  drawCenterButton(ctx, isSpinning)

  // 7. 绘制顶部指针（静态）
  drawPointer(ctx)
}
```

### 2. PCControlPanel 组件

**功能模块**:
```typescript
interface PCControlPanelProps {
  result: string | null
  isSpinning: boolean
  selectedOption: FoodOption | null
  options: FoodOption[]
  onSpin: () => void
}

// 组件结构
<div className="space-y-6">
  {/* 结果卡片 */}
  <ResultSection />

  {/* 操作按钮 */}
  <ActionSection>
    <button className="w-full h-16 text-lg">
      {isSpinning ? '抽奖中...' : '开始抽奖'}
    </button>
    <SpinCounter />
  </ActionSection>

  {/* 美食网格 */}
  <OptionsGrid options={options} selected={selectedOption} />

  {/* 统计信息 */}
  <StatsSection />
</div>
```

**样式设计**:
- 卡片间距：24px
- 卡片圆角：12px
- 玻璃态背景：`backdrop-filter: blur(20px)`
- 悬停效果：细微抬升 + 边框高亮

### 3. PCResultModal 组件

**触发时机**: 动画完成 + 结果确定后

**设计样式**:
```typescript
// 模态弹窗 - 居中显示
<Modal show={showResult}>
  <div className="modal-content">
    {/* 庆祝动效 */}
    <Lottie animation="celebration" />

    {/* 中奖结果 */}
    <div className="result">
      <span className="emoji">{winner.emoji}</span>
      <h2 className="text-4xl font-bold">{winner.name}</h2>
    </div>

    {/* 操作按钮 */}
    <button onClick={handleClose}>确定</button>
    <button onClick={handleReplay}>再抽一次</button>
  </div>
</Modal>
```

### 4. 页面布局 (pc/page.tsx)

**核心代码结构**:
```typescript
'use client'

import { useState, useCallback } from 'react'
import foodOptionsConfig from '../food-options.json'
import WheelCanvasPC from '../components/WheelCanvasPC'
import PCControlPanel from '../components/PCControlPanel'
import PCResultModal from '../components/PCResultModal'
import { useWheelAnimation } from '../hooks/useWheelAnimation'
import { useWeightedSpin } from '../hooks/useWeightedSpin'
import { PCTheme } from '../config/pc-theme'

export default function PCFoodWheelPage() {
  const options = foodOptionsConfig.options
  const [showResultModal, setShowResultModal] = useState(false)

  const animation = useWheelAnimation({
    segmentCount: options.length,
    onResultReady: (winningIndex) => {
      const winner = options[winningIndex]
      weightedSpin.setSelectedOption(winner)
      weightedSpin.setResult(winner.name)
    },
    onAnimationComplete: () => {
      // 动画完成后显示结果弹窗
      setShowResultModal(true)
    }
  })

  const weightedSpin = useWeightedSpin(options)

  const handleSpin = useCallback(() => {
    if (animation.isSpinning) return

    weightedSpin.reset()
    setShowResultModal(false)

    const { index } = weightedSpin.spin()
    animation.startSpin(index)
  }, [animation, weightedSpin])

  return (
    <div className="min-h-screen" style={{ background: PCTheme.background.gradient }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-8 py-6">
        <div className="flex gap-8">
          {/* 左侧：转盘 */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <WheelCanvasPC
              options={options}
              rotation={animation.currentRotation}
              isSpinning={animation.isSpinning}
              winningIndex={animation.winningIndex}
              onCenterClick={handleSpin}
            />
            <p className="mt-6 text-slate-400">
              点击中心按钮或右侧"开始抽奖"按钮
            </p>
          </div>

          {/* 右侧：控制面板 */}
          <aside className="w-[480px]">
            <PCControlPanel
              result={weightedSpin.result}
              isSpinning={animation.isSpinning}
              selectedOption={weightedSpin.selectedOption}
              options={options}
              onSpin={handleSpin}
            />
          </aside>
        </div>
      </main>

      {/* 结果弹窗 */}
      <PCResultModal
        show={showResultModal}
        winner={weightedSpin.selectedOption}
        onClose={() => setShowResultModal(false)}
        onReplay={handleSpin}
      />
    </div>
  )
}
```

---

## 🎬 动画与交互

### 动画系统（复用现有）

**三阶段动画** - 无需修改：
- ✅ 加速阶段：0.8s
- ✅ 匀速阶段：2.0s
- ✅ 减速阶段：2.0s (easeOutBack)
- ✅ 总时长：4.8s

**PC端优化**:
- 去除粒子效果（星星爆炸、光波扩散）
- 保留五彩纸屑（可选，默认关闭）
- 中奖高亮：金色描边 + 脉冲效果

### 微交互设计

1. **中心按钮**
   - 悬停：放大1.05倍 + 阴影加深
   - 点击：缩小0.95倍 + 涟漪效果
   - 旋转中：禁用 + 图标旋转动画

2. **扇形悬停**（鼠标在转盘上）
   - 当前扇形：边框高亮 + 轻微放大
   - 平滑过渡：200ms cubic-bezier

3. **结果弹窗**
   - 入场：scale(0.9) → scale(1) + fadeIn
   - 时长：300ms
   - 缓动：easeOutBack

4. **按钮交互**
   - 悬停：背景加深 + 边框发光
   - 按下：transform translateY(2px)
   - 禁用：opacity 0.5 + cursor not-allowed

---

## 📊 新增功能

### 1. 统计面板 (PCStatsPanel)

**功能**:
- 今日抽奖次数
- 本周各美食中奖次数统计（柱状图）
- 最近10次抽奖历史记录

**数据存储**:
```typescript
// 使用 localStorage
interface SpinRecord {
  timestamp: number
  foodId: number
  foodName: string
}

const STORAGE_KEY = 'food-wheel-pc-history'

function saveSpinRecord(record: SpinRecord) {
  const history = getSpinHistory()
  history.unshift(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)))
}

function getTodaySpinCount(): number {
  const history = getSpinHistory()
  const today = new Date().toDateString()
  return history.filter(r =>
    new Date(r.timestamp).toDateString() === today
  ).length
}
```

### 2. 设置面板

**功能配置**:
- [ ] 启用音效
- [ ] 启用五彩纸屑
- [ ] 显示历史统计
- [ ] 转盘旋转速度（快/中/慢）

### 3. 键盘快捷键

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !animation.isSpinning) {
      e.preventDefault()
      handleSpin()
    }
  }

  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [animation.isSpinning, handleSpin])
```

---

## 🎨 主题配置文件

**文件**: `config/pc-theme.ts`

```typescript
/**
 * PC端专业主题配置
 */

export const PCTheme = {
  // 背景渐变
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  },

  // 强调色
  accent: {
    primary: '#3b82f6',
    secondary: '#f59e0b',
    success: '#10b981',
    danger: '#ef4444',
    info: '#06b6d4',
  },

  // 文字颜色
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    muted: '#64748b',
  },

  // 表面/容器
  surface: {
    card: 'rgba(30, 41, 59, 0.6)',
    cardHover: 'rgba(30, 41, 59, 0.8)',
    panel: 'rgba(15, 23, 42, 0.9)',
    glass: {
      background: 'rgba(51, 65, 85, 0.4)',
      backdropFilter: 'blur(20px) saturate(120%)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
    },
  },

  // 阴影系统
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.18)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.22)',
  },

  // 转盘特定样式
  wheel: {
    size: 600,
    centerButtonRadius: 70,
    pointerSize: 24,
    segmentStrokeWidth: 1,
    winningStrokeWidth: 4,
  },

  // 动画时长
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  // 间距系统
  spacing: {
    cardGap: '24px',
    sectionGap: '32px',
    containerPadding: '32px',
  },
} as const

export type PCThemeType = typeof PCTheme
```

---

## 📦 开发计划

### 阶段一：基础布局 (2小时)
- [x] 创建 `pc/page.tsx` 页面
- [x] 实现 PC 端布局结构
- [x] 创建 `config/pc-theme.ts` 主题配置
- [x] 适配响应式（>1280px）

### 阶段二：转盘组件 (3小时)
- [x] 创建 `WheelCanvasPC.tsx`
- [x] 实现扁平化扇形绘制
- [x] 实现顶部指针绘制
- [x] 实现中心按钮交互
- [x] 实现中奖高亮效果

### 阶段三：控制面板 (2小时)
- [x] 创建 `PCControlPanel.tsx`
- [x] 实现结果显示卡片
- [x] 实现操作按钮区域
- [x] 实现美食网格列表（2列）

### 阶段四：结果弹窗 (1小时)
- [x] 创建 `PCResultModal.tsx`
- [x] 实现模态弹窗动画
- [x] 实现庆祝视觉效果

### 阶段五：统计功能 (2小时)
- [x] 创建 `PCStatsPanel.tsx`
- [x] 实现 localStorage 数据持久化
- [x] 实现统计图表展示
- [x] 实现历史记录列表

### 阶段六：优化打磨 (2小时)
- [x] 添加键盘快捷键支持
- [x] 优化微交互动画
- [x] 性能优化（减少不必要的重渲染）
- [x] 测试各种边界情况
- [x] 添加设置面板（可选）

**总计**: 约 12 小时开发时间

---

## 🚀 技术亮点

1. **完全复用现有逻辑**
   - 加权随机算法
   - 三阶段动画系统
   - 时间段权重加成

2. **PC端专属优化**
   - 宽屏横向布局
   - 扁平化专业设计
   - 键盘快捷键支持
   - 统计分析面板

3. **性能优化**
   - Canvas 离屏渲染（背景层缓存）
   - 减少不必要的粒子效果
   - requestAnimationFrame 节流

4. **用户体验**
   - 模态弹窗结果展示（更符合PC习惯）
   - 微交互细节打磨
   - 清晰的视觉层级

---

## 📝 配置清单

### 路由配置
- [x] 创建 `/food-wheel/pc` 路由
- [x] 添加面包屑导航
- [x] 添加版本切换链接

### 环境变量（无需新增）
- 复用现有配置

### 第三方依赖（无需新增）
- 使用现有技术栈

---

## 🎯 验收标准

### 功能验收
- [x] 转盘能正常旋转并停在正确位置
- [x] 加权随机算法生效（时间段加成）
- [x] 结果准确显示，无延迟
- [x] 统计数据持久化存储
- [x] 键盘空格键触发抽奖

### 视觉验收
- [x] 1920×1080分辨率完美显示
- [x] 扁平化设计风格统一
- [x] 动画流畅（60fps）
- [x] 色彩对比度符合WCAG 2.0 AA标准

### 性能验收
- [x] 首屏加载 < 2秒
- [x] 动画帧率稳定 60fps
- [x] Canvas 内存占用 < 100MB
- [x] 无卡顿和闪烁

### 兼容性验收
- [x] Chrome/Edge (最新版)
- [x] Firefox (最新版)
- [x] Safari (最新版)
- [x] 最小宽度 1280px 正常使用

---

## 🔗 相关文档

- [美食转盘主文档](./CLAUDE.md)
- [设计系统配置](../config/design-config.ts)
- [动画系统文档](./animation-system.md)
- [NFT版本文档](./nft-version.md)

---

**文档版本**: v1.0
**创建日期**: 2025-10-30
**最后更新**: 2025-10-30
**维护者**: Claude Code
**状态**: ✅ 待评审

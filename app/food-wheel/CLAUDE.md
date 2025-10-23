# Food Wheel 美食抽奖转盘

## 项目概述

美食抽奖转盘是一个基于 Canvas 的交互式抽奖应用，帮助用户随机选择今天吃什么。采用赛博朋克科技风格设计，具有炫酷的视觉效果和流畅的动画。

**路由**: `/food-wheel`

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **UI**: Tailwind CSS
- **动画**: Canvas API + requestAnimationFrame
- **状态管理**: React Hooks (useState, useRef, useEffect)

## 文件结构

```
app/food-wheel/
├── page.tsx              # 主页面组件
├── food-options.json     # 美食选项配置文件
└── CLAUDE.md            # 本文档
```

## 核心功能

### 1. 转盘抽奖系统

#### 配置文件 (food-options.json)
```json
[
  { "id": 1, "name": "西部马华", "color": "#FF6B6B", "emoji": "🍜" },
  { "id": 2, "name": "地下美食", "color": "#4ECDC4", "emoji": "🍱" },
  ...
]
```

**字段说明**:
- `id`: 唯一标识符
- `name`: 美食名称
- `color`: 扇形背景色(HEX格式)
- `emoji`: 美食图标

#### 转盘绘制 (drawWheel)

**Canvas 尺寸**: 500×500px (实际显示350×350px)

**关键坐标**:
```typescript
centerX = canvas.width / 2   // 250
centerY = canvas.height / 2  // 250
radius = Math.min(centerX, centerY) - 20  // 230
```

**扇形计算**:
```typescript
const SEGMENT_ANGLE = (2 * Math.PI) / FOOD_OPTIONS.length
const startAngle = index * SEGMENT_ANGLE - Math.PI / 2
const endAngle = (index + 1) * SEGMENT_ANGLE - Math.PI / 2
```

**文字绘制特性**:
- 文字始终保持水平，不随转盘旋转
- 通过 `Math.cos(midAngle + angle)` 和 `Math.sin(midAngle + angle)` 计算位置
- Emoji: 32px, 文字: 14px

#### 中奖高亮效果 (page.tsx:78-151)

**5层高亮效果**:
1. 三色发光边框 (红→黄→白)
2. 白色脉冲覆盖层
3. 8条内部放射发光线
4. 12px超粗白色边框
5. "中奖!"文字标记

**脉冲动画**:
```typescript
// 300ms周期，0.6-1.0强度范围
const intensity = 0.6 + 0.4 * Math.sin((elapsed / 300) * Math.PI)
```

### 2. 旋转动画

#### 动画参数
```typescript
const randomIndex = Math.floor(Math.random() * FOOD_OPTIONS.length)
const targetAngle = randomIndex * SEGMENT_ANGLE
const extraSpins = (Math.floor(Math.random() * 3) + 8) * Math.PI * 2  // 8-10圈
const duration = 4000 + Math.floor(Math.random() * 1000)  // 4-5秒
```

#### 缓动函数 (Ease-Out Cubic)
```typescript
const easeOut = 1 - Math.pow(1 - progress, 3)
const currentAngle = currentRotation + (targetRotation - currentRotation) * easeOut
```

#### 中奖计算 (page.tsx:338-348)
```typescript
// 12点钟方向对应的扇形
const normalizedRotation = targetRotation % (Math.PI * 2)
const pointerAngle = -Math.PI / 2
const relativeAngle = (pointerAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2)
let calculatedIndex = Math.floor(relativeAngle / SEGMENT_ANGLE)
calculatedIndex = ((calculatedIndex % FOOD_OPTIONS.length) + FOOD_OPTIONS.length) % FOOD_OPTIONS.length
```

### 3. 控制面板 (科技风格)

#### 三大模块

**结果显示卡片** (page.tsx:519-589):
- 赛博朋克背景网格
- 青色霓虹边框
- 渐变文字效果
- 动态加载动画

**抽奖按钮** (page.tsx:591-619):
- 三色渐变边框 (cyan → purple → pink)
- 悬停发光效果
- 禁用状态处理
- 按下缩放反馈

**美食列表** (page.tsx:621-677):
- 2列网格布局
- 中奖项黄色高亮 + 绿色勾选
- 悬停放大效果
- 发光边框

## 状态管理

### 核心状态

```typescript
const [isSpinning, setIsSpinning] = useState(false)         // 是否正在旋转
const [currentRotation, setCurrentRotation] = useState(0)   // 当前旋转角度
const [targetRotation, setTargetRotation] = useState(0)     // 目标旋转角度
const [result, setResult] = useState<string | null>(null)   // 中奖结果名称
const [showConfetti, setShowConfetti] = useState(false)     // 是否显示中奖状态
const [selectedOption, setSelectedOption] = useState<FoodOption | null>(null)  // 中奖选项
const [winningIndex, setWinningIndex] = useState<number>(-1)  // 中奖索引
const [glowIntensity, setGlowIntensity] = useState(1)       // 发光强度
```

### 引用 (Refs)

```typescript
const canvasRef = useRef<HTMLCanvasElement>(null)        // 转盘Canvas引用
const animationFrameRef = useRef<number>()               // 旋转动画ID
const glowAnimationRef = useRef<number>()                // 发光动画ID
const startTimeRef = useRef<number>(0)                   // 动画开始时间
const durationRef = useRef<number>(0)                    // 动画持续时间
```

## 关键算法

### 1. 角度归一化
```typescript
const normalizedRotation = targetRotation % (Math.PI * 2)
```

### 2. 文字位置计算（保持水平）
```typescript
// 计算实际角度（包含转盘旋转）
const midAngle = startAngle + SEGMENT_ANGLE / 2 + angle

// 计算文字位置
const textRadius = radius * 0.65
const textX = textRadius * Math.cos(midAngle)
const textY = textRadius * Math.sin(midAngle)

// 直接绘制（不旋转Canvas）
ctx.fillText(option.emoji, textX, textY)
```

### 3. 中心按钮点击检测
```typescript
const rect = canvas.getBoundingClientRect()
const scaleX = canvas.width / rect.width
const scaleY = canvas.height / rect.height
const x = (e.clientX - rect.left) * scaleX
const y = (e.clientY - rect.top) * scaleY

const centerX = canvas.width / 2
const centerY = canvas.height / 2
const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))

if (distance <= 50) {
  handleSpin()
}
```

## 样式设计

### 色彩方案 (科技风)

**主色调**:
- Cyan (青色): `#06B6D4`, `#0EA5E9`
- Purple (紫色): `#8B5CF6`, `#A855F7`
- Pink (粉色): `#EC4899`, `#F472B6`
- Indigo (靛蓝): `#6366F1`, `#818CF8`

**背景**:
- 深色渐变: `from-slate-900 via-purple-900 to-slate-900`
- 背景网格: `linear-gradient(cyan 1px, transparent 1px)`

**发光效果**:
- 文字: `drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]`
- 边框: `shadow-lg shadow-cyan-500/50`
- 按钮: `shadow-2xl shadow-purple-500/70`

### 响应式设计

**断点**:
- 小屏 (`< lg`): 垂直布局，转盘在上，控制面板在下
- 大屏 (`>= lg`): 水平布局，转盘左，控制面板右

**尺寸**:
- 转盘: `350px × 350px` (大屏), `max-w-[80vw]` (小屏)
- 控制面板: `380px` 宽 (大屏), `100%` (小屏)

## 性能优化

### 1. requestAnimationFrame
```typescript
// 旋转动画
animationFrameRef.current = requestAnimationFrame(animate)

// 发光脉冲
glowAnimationRef.current = requestAnimationFrame(animateGlow)
```

### 2. 清理机制
```typescript
useEffect(() => {
  // 动画逻辑...

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }
}, [dependencies])
```

### 3. Canvas优化
- 使用 `ctx.save()` 和 `ctx.restore()` 管理状态
- 每帧完整清空画布: `ctx.clearRect(0, 0, width, height)`
- 分离旋转层和静态层绘制

## 常见问题

### Q1: 如何添加新的美食选项？
编辑 `food-options.json`:
```json
{ "id": 9, "name": "新美食", "color": "#颜色", "emoji": "📍" }
```

### Q2: 如何调整转盘大小？
修改 `page.tsx:500` 的容器尺寸:
```typescript
<div className="relative w-[350px] h-[350px] max-w-[80vw] max-h-[80vw]">
```

### Q3: 如何修改旋转圈数？
修改 `handleSpin` 函数中的 `extraSpins`:
```typescript
const extraSpins = (Math.floor(Math.random() * 3) + 8) * Math.PI * 2
// 改为: (Math.floor(Math.random() * 5) + 5) * Math.PI * 2  // 5-9圈
```

### Q4: 为什么文字不旋转？
特殊设计：通过计算位置而不是旋转Canvas实现水平文字显示，提升可读性。

### Q5: 如何禁用脉冲效果？
注释掉 `page.tsx:390-411` 的发光动画 useEffect。

## 开发指南

### 修改美食列表
1. 编辑 `food-options.json`
2. 刷新页面即可看到变化
3. 注意：至少需要2个选项

### 自定义颜色主题
修改控制面板样式类:
```typescript
// 从科技风改为温暖风
className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
// 改为
className="bg-gradient-to-br from-orange-900 via-red-900 to-pink-900"
```

### 调试技巧
```typescript
// 在中奖计算后添加
console.log('Winner index:', calculatedIndex, 'Option:', winner)

// 在动画循环中添加
console.log('Current angle:', currentAngle, 'Progress:', progress)
```

## 待优化项

- [ ] 添加声音效果
- [ ] 支持自定义转盘背景图
- [ ] 添加历史记录功能
- [ ] 支持导出/导入配置
- [ ] 添加权重系统（不同选项中奖概率）
- [ ] 支持移动端触摸手势

## 技术要点总结

1. **Canvas 动画**: 使用 requestAnimationFrame 实现流畅60fps动画
2. **数学计算**: 三角函数用于圆形布局和位置计算
3. **状态同步**: React状态与Canvas渲染的协调
4. **事件处理**: Canvas点击事件的坐标转换
5. **样式设计**: 科技感霓虹效果和发光动画
6. **性能优化**: 动画清理和资源管理

## 参考资料

- [Canvas API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [requestAnimationFrame 指南](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [缓动函数可视化](https://easings.net/)

---

**最后更新**: 2025-01-23
**维护者**: Claude Code

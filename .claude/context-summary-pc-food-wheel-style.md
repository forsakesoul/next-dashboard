# PC美食转盘样式对比分析

**生成时间**: 2025-11-10
**分析对象**: `app/food-wheel/` vs `app/pc-food-wheel/`

---

## 一、架构差异总览

### 1.1 文件组织对比

| 功能模块 | food-wheel (移动版) | pc-food-wheel (PC版) | 差异说明 |
|---------|-------------------|---------------------|---------|
| **Canvas组件** | WheelCanvas.tsx (经典) + WheelCanvasNFT.tsx (豪华) | WheelCanvasPC.tsx | PC版仅1个组件，样式简化 |
| **绘制工具** | canvas-helpers.ts (复杂渐变/发光/边框) | 内联在组件中 | PC版缺失独立工具函数 |
| **特效系统** | nft-effects.ts (粒子/金属边框/宝石) | ❌ 无 | PC版无高级特效 |
| **设计配置** | design-config.ts + nft-theme.ts | pc-theme.ts | PC版配置更简洁 |
| **动画缓动** | animation-easing.ts (8种缓动) | ❌ 无 | PC版无专业动画系统 |

### 1.2 视觉风格定位

| 版本 | 设计风格 | 核心特点 | 适用场景 |
|-----|---------|---------|---------|
| **food-wheel 经典版** | Dribbble炫彩风 | 彩虹渐变、3D透视、粒子爆炸 | 休闲娱乐、日常美食选择 |
| **food-wheel NFT版** | 加密货币奢华风 | 金属边框、粒子轨道、六边形网格 | 高端抽奖、Web3活动 |
| **pc-food-wheel** | 扁平化商务风 | 简洁渐变、最小化装饰 | 办公环境、专业场景 |

---

## 二、关键样式差异对比表

### 2.1 扇形绘制

| 样式要素 | food-wheel 经典版 | food-wheel NFT版 | pc-food-wheel | 建议应用 |
|---------|-----------------|----------------|---------------|---------|
| **径向渐变** | ✅ 3层渐变 (0→0.7→1) + 透明度变化 | ✅ 同经典版 | ⚠️ 简单渐变 (0→0.6→1) | ✅ 应用经典版3层渐变 |
| **边框样式** | ✅ 白色半透明 + 发光 (shadowBlur: 5) | ✅ 同经典版 | ⚠️ 简单白色边框 (无发光) | ✅ 应用发光边框 |
| **内发光线** | ✅ 8条径向线 (WheelSegmentEnhancement) | ✅ 同经典版 | ❌ 无 | ✅ 添加内发光线装饰 |
| **颜色处理** | ✅ hexToRgba() 精确透明度控制 | ✅ 同经典版 | ⚠️ adjustColorBrightness() 简单变暗 | ✅ 应用hexToRgba系统 |

**代码片段 (经典版 canvas-helpers.ts:19-76)**:
```typescript
// 关键：3层径向渐变 + 透明度控制
const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
gradient.addColorStop(0, hexToRgba(baseColor, 0.8))  // 中心80%透明度
gradient.addColorStop(0.7, hexToRgba(baseColor, 1))  // 中段100%
gradient.addColorStop(1, hexToRgba(baseColor, 0.9))  // 边缘90%

// 关键：发光边框
ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
ctx.lineWidth = 2
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
ctx.shadowBlur = 5

// 关键：8条内发光线
for (let i = 0; i < 8; i++) {
  const lineAngle = startAngle + ((endAngle - startAngle) * (i + 0.5)) / 8
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
  ctx.shadowBlur = 10
}
```

### 2.2 中奖高亮效果

| 样式要素 | food-wheel 经典版 | pc-food-wheel | 差异关键 |
|---------|-----------------|---------------|---------|
| **外发光边框** | ✅ 3层彩色边框 (红/黄/白) + shadowBlur: 40 | ⚠️ 1层金色边框 + shadowBlur: 20 | **应用3层彩色边框** |
| **白色覆盖层** | ✅ rgba(255,255,255,0.4~0.7) 脉冲 | ⚠️ rgba(255,255,255,0.15) 固定 | **增强覆盖层透明度** |
| **发光线** | ✅ 8条白色径向线 + 黄色发光 | ❌ 无 | **添加发光线** |
| **粗边框** | ✅ 12px白色 + shadowBlur: 20 | ⚠️ 3px金色 + shadowBlur: 20 | **增加边框宽度** |

**代码片段 (经典版 canvas-helpers.ts:92-154)**:
```typescript
// 关键：3层彩色发光边框
for (let i = 3; i >= 1; i--) {
  ctx.strokeStyle = i === 3 ? '#FF0000' : i === 2 ? '#FFFF00' : '#FFFFFF'
  ctx.lineWidth = 10
  ctx.shadowColor = ctx.strokeStyle
  ctx.shadowBlur = 40 * glowIntensity
  ctx.globalAlpha = 0.8 * glowIntensity
}

// 关键：脉冲白色覆盖层
ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.3 * glowIntensity})`

// 关键：8条发光线
for (let i = 0; i < 8; i++) {
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * glowIntensity})`
  ctx.lineWidth = 4
  ctx.shadowColor = '#FFFF00'
  ctx.shadowBlur = 15 * glowIntensity
}

// 关键：超粗白色边框
ctx.strokeStyle = '#FFFFFF'
ctx.lineWidth = 12
ctx.shadowBlur = 20
```

### 2.3 转盘外圈装饰

| 样式要素 | food-wheel 经典版 | pc-food-wheel | 差异关键 |
|---------|-----------------|---------------|---------|
| **三层脉冲光晕** | ✅ Pink/Purple/Cyan 径向渐变 + 描边 | ⚠️ 单层蓝色径向渐变 (仅CSS) | **应用三层光晕系统** |
| **玻璃态边框** | ✅ 16px白色半透明主边框 | ❌ 无 | **添加主边框** |
| **渐变金边** | ✅ 6px金色线性渐变 + shadowBlur: 20 | ❌ 无 | **添加金边装饰** |

**代码片段 (经典版 canvas-helpers.ts:214-268)**:
```typescript
// 关键：3层脉冲光晕（Canvas绘制）
const glowRings = [
  { radius: radius + 25, color: 'rgba(236, 72, 153, 0.4)', blur: 40, width: 3 },
  { radius: radius + 18, color: 'rgba(168, 85, 247, 0.5)', blur: 30, width: 3 },
  { radius: radius + 12, color: 'rgba(6, 182, 212, 0.6)', blur: 20, width: 3 },
]

// 关键：玻璃态主边框
ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
ctx.lineWidth = 16

// 关键：渐变金边
const gradient = ctx.createLinearGradient(...)
gradient.addColorStop(0, '#FFD700')
gradient.addColorStop(0.5, '#FFA500')
gradient.addColorStop(1, '#FFD700')
ctx.lineWidth = 6
ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
ctx.shadowBlur = 20
```

### 2.4 中心按钮

| 样式要素 | food-wheel 经典版 | pc-food-wheel | 差异关键 |
|---------|-----------------|---------------|---------|
| **外层光晕** | ✅ 3层彩色光环 (Pink/Purple/Cyan) | ⚠️ 单色发光 (蓝/灰) | **应用3层光环** |
| **按钮渐变** | ✅ 3色径向渐变 (#FF6B6B → #4ECDC4 → #95E1D3) | ⚠️ 2色线性渐变 (#667eea → #764ba2) | **升级为3色径向渐变** |
| **内发光环** | ✅ 内圈白色半透明环 (radius - 5) | ❌ 无 | **添加内发光环** |
| **图标大小** | ✅ Emoji 28px + 文字 14px | ⚠️ 播放按钮 40px | **调整图标大小** |

**代码片段 (经典版 canvas-helpers.ts:274-351)**:
```typescript
// 关键：3层彩色光环
const outerGlows = [
  { radius: centerRadius + 15, color: 'rgba(236, 72, 153, 0.6)', blur: 30 },
  { radius: centerRadius + 10, color: 'rgba(168, 85, 247, 0.7)', blur: 20 },
  { radius: centerRadius + 5, color: 'rgba(6, 182, 212, 0.8)', blur: 15 },
]

// 关键：3色径向渐变
const gradient = ctx.createRadialGradient(
  centerX - 15, centerY - 15, 0,
  centerX, centerY, centerRadius
)
gradient.addColorStop(0, '#FF6B6B')
gradient.addColorStop(0.5, '#4ECDC4')
gradient.addColorStop(1, '#95E1D3')

// 关键：内发光环
ctx.arc(centerX, centerY, centerRadius - 5, 0, Math.PI * 2)
ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
ctx.lineWidth = 2
```

### 2.5 顶部指针/标记

| 样式要素 | food-wheel 经典版 | pc-food-wheel | 差异关键 |
|---------|-----------------|---------------|---------|
| **形状** | 水平线 + 中心红点 | 三角形向下 | **保持三角形** |
| **发光效果** | ✅ 金色shadowBlur: 20 + 红点shadowBlur: 15 | ⚠️ 粉色shadowBlur: 30 | **调整为金/红配色** |
| **尺寸** | 线条 60px宽 + 8px线宽 | 三角形 14px大小 | **适中尺寸** |

**代码片段 (经典版 canvas-helpers.ts:357-400)**:
```typescript
// 关键：发光标记线
ctx.strokeStyle = '#FFD700'
ctx.lineWidth = 8
ctx.shadowColor = '#FFD700'
ctx.shadowBlur = 20

// 关键：白色内线
ctx.strokeStyle = '#FFFFFF'
ctx.lineWidth = 4

// 关键：红色圆点
ctx.shadowColor = '#FF0000'
ctx.shadowBlur = 15
ctx.fillStyle = '#FF0000'
ctx.arc(centerX, markerY, 6, 0, Math.PI * 2)
```

### 2.6 文字渲染

| 样式要素 | food-wheel 经典版 | pc-food-wheel | 差异对比 |
|---------|-----------------|---------------|---------|
| **Emoji大小** | 32px | 32px | ✅ 相同 |
| **文字大小** | 14px | 14px | ✅ 相同 |
| **文字阴影** | shadowColor: rgba(0,0,0,0.8) + blur: 4 | shadowColor: rgba(0,0,0,0.5) + blur: 6 | **统一阴影强度** |
| **中奖标记** | ✅ "中奖!" 白字红边 28px + shadowBlur: 8 | ❌ 无 | **添加中奖标记** |

---

## 三、NFT版独特特效 (可选应用)

### 3.1 高级装饰系统

| 特效 | 实现位置 | 效果描述 | 应用建议 |
|-----|---------|---------|---------|
| **粒子轨道** | nft-effects.ts:29-77 | 24个发光粒子环绕转盘旋转 | 可选：增强科技感 |
| **金属边框** | nft-effects.ts:82-116 | 5层金色渐变 (深→标→亮→标→深) | 可选：替换简单边框 |
| **中心宝石** | nft-effects.ts:121-149 | 3层彩色发光 (金/紫/蓝) + 脉冲 | 可选：替换简单中心按钮 |
| **六边形网格** | nft-effects.ts:154-201 | 背景网格动画 | 可选：增强背景层次 |
| **扫描线** | nft-effects.ts:206-222 | 全息投影效果 | 可选：科幻风格 |

**决策建议**:
- **基础升级**: 应用经典版所有样式 (三层光晕、发光边框、中奖高亮)
- **进阶装饰**: 可选应用金属边框、中心宝石 (如需奢华感)
- **特效系统**: 粒子轨道/六边形网格适合Web3主题，商务风可跳过

---

## 四、容器与3D效果

### 4.1 3D透视系统

| 效果 | food-wheel 经典版 | pc-food-wheel | 应用建议 |
|-----|-----------------|---------------|---------|
| **perspective** | 1200px | ❌ 无 | ✅ 添加透视 |
| **空闲倾斜** | rotateX(15deg) | ❌ 无 | ✅ 添加倾斜 |
| **悬停效果** | rotateX(20deg) rotateY(5deg) scale(1.05) | scale(1.05) | ✅ 增强悬停 |
| **旋转时** | rotateX(0deg) + brightness(1.2) saturate(1.3) | brightness(1.15) saturate(1.2) | ✅ 增强滤镜 |

**代码片段 (经典版 WheelCanvas.tsx:199-224)**:
```typescript
// 关键：3D透视容器
<div style={{ perspective: '1200px' }}>
  <div style={{
    transform: isSpinning
      ? 'rotateX(0deg) scale(1)'
      : 'rotateX(15deg) scale(1)',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'rotateX(20deg) rotateY(5deg) scale(1.05)'
  }}>
```

### 4.2 玻璃态质感

| 层级 | food-wheel 经典版 | pc-food-wheel | 应用建议 |
|-----|-----------------|---------------|---------|
| **转盘容器** | rgba(255,255,255,0.05) + blur(10px) | ❌ 仅光环 | ✅ 添加玻璃态容器 |
| **边框** | 1px solid rgba(255,255,255,0.2) | ❌ 无 | ✅ 添加边框 |
| **阴影** | 0 8px 32px rgba(31,38,135,0.37) | 0 10px 40px rgba(0,0,0,0.3) | ✅ 升级阴影 |

### 4.3 背景光晕

| 层级 | food-wheel 经典版 | pc-food-wheel | 应用建议 |
|-----|-----------------|---------------|---------|
| **三层脉冲** | 85vmin Pink + 80vmin Purple + 75vmin Cyan | 单层蓝色 | ✅ 应用三层系统 |
| **动画延迟** | 0s / 0.5s / 1s 交错脉冲 | 无延迟 | ✅ 添加交错动画 |

---

## 五、可复用样式函数清单

### 5.1 必须迁移的核心函数

| 函数名 | 文件位置 | 功能 | 优先级 |
|-------|---------|------|-------|
| `drawSegment()` | canvas-helpers.ts:20-77 | 绘制扇形 (3层渐变+内发光线) | ⭐⭐⭐⭐⭐ |
| `drawWinningHighlight()` | canvas-helpers.ts:92-154 | 中奖高亮 (3层彩色边框+发光线) | ⭐⭐⭐⭐⭐ |
| `drawWheelBorder()` | canvas-helpers.ts:214-268 | 转盘边框 (三层光晕+金边) | ⭐⭐⭐⭐⭐ |
| `drawCenterButton()` | canvas-helpers.ts:274-351 | 中心按钮 (3层光环+3色渐变) | ⭐⭐⭐⭐⭐ |
| `drawMarker()` | canvas-helpers.ts:357-400 | 顶部标记 (发光线+红点) | ⭐⭐⭐⭐ |
| `drawOptionText()` | canvas-helpers.ts:160-208 | 文字渲染 (中奖标记) | ⭐⭐⭐⭐ |
| `hexToRgba()` | canvas-helpers.ts:82-87 | 颜色转换 | ⭐⭐⭐⭐⭐ |
| `getScale()` | canvas-helpers.ts:11-14 | 缩放比例计算 | ⭐⭐⭐⭐⭐ |

### 5.2 可选迁移的增强函数 (NFT版)

| 函数名 | 文件位置 | 功能 | 应用场景 |
|-------|---------|------|---------|
| `drawMetallicRim()` | nft-effects.ts:82-116 | 金属边框 | 奢华主题 |
| `drawCenterGem()` | nft-effects.ts:121-149 | 宝石效果 | 高端抽奖 |
| `ParticleOrbit` | nft-effects.ts:29-77 | 粒子轨道 | 科技风格 |
| `drawHexGrid()` | nft-effects.ts:154-201 | 六边形网格 | 背景装饰 |
| `drawScanlines()` | nft-effects.ts:206-222 | 扫描线 | 全息效果 |

---

## 六、具体迁移方案

### 6.1 阶段一：基础样式升级 (必须)

**目标**: 将PC版扇形/中奖/边框/按钮升级到经典版水平

**步骤**:
1. **创建独立工具文件**
   - 新建 `app/pc-food-wheel/utils/canvas-helpers.ts`
   - 迁移8个核心函数 (drawSegment, drawWinningHighlight等)

2. **修改 WheelCanvasPC.tsx**
   - 导入canvas-helpers函数
   - 删除内联的简化版绘制代码
   - 调整函数调用参数

3. **配置文件更新**
   - 在 `pc-theme.ts` 中添加 `WheelSegmentEnhancement` 配置
   - 参考 `design-config.ts` 的结构

**预计效果**:
- 扇形：简单渐变 → 3层渐变 + 8条内发光线
- 中奖：1层金边 → 3层彩色边框 + 8条发光线 + 脉冲覆盖层
- 边框：无装饰 → 三层光晕 + 玻璃态边框 + 渐变金边
- 按钮：2色渐变 → 3层光环 + 3色径向渐变 + 内发光环

### 6.2 阶段二：3D容器增强 (推荐)

**目标**: 添加透视倾斜和玻璃态容器

**步骤**:
1. **修改容器结构**
   ```tsx
   <div style={{ perspective: '1200px' }}>
     <div className="玻璃态容器" style={{
       transform: isSpinning ? 'rotateX(0deg)' : 'rotateX(15deg)',
       transformStyle: 'preserve-3d',
       background: 'rgba(255,255,255,0.05)',
       backdropFilter: 'blur(10px)',
     }}>
       <canvas />
     </div>
   </div>
   ```

2. **添加悬停交互**
   - onMouseEnter: rotateX(20deg) rotateY(5deg) scale(1.05)
   - onMouseLeave: 恢复初始倾斜

3. **增强背景光晕**
   - 替换单层光晕为三层脉冲系统 (Pink/Purple/Cyan)
   - 添加交错动画 (0s / 0.5s / 1s)

**预计效果**:
- 转盘具有立体悬浮感
- 悬停时产生动态倾斜
- 背景光晕更丰富多彩

### 6.3 阶段三：NFT特效集成 (可选)

**适用场景**: 如需打造Web3/奢华主题

**步骤**:
1. **创建特效文件**
   - 新建 `app/pc-food-wheel/utils/nft-effects.ts`
   - 迁移 ParticleOrbit、drawMetallicRim等类/函数

2. **选择性集成**
   - 金属边框: 替换 drawWheelBorder
   - 中心宝石: 替换 drawCenterButton
   - 粒子轨道: 添加到动画循环
   - 六边形网格: 添加背景Canvas

3. **主题配置切换**
   - 在 `pc-theme.ts` 中添加NFT配色选项
   - 支持经典/NFT主题动态切换

---

## 七、关键代码片段索引

### 7.1 扇形渐变核心代码

**位置**: `app/food-wheel/utils/canvas-helpers.ts:29-54`

```typescript
// 关键：3层径向渐变
const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
gradient.addColorStop(0, hexToRgba(baseColor, config.gradient.colorStops[0].opacity)) // 0.8
gradient.addColorStop(0.7, hexToRgba(baseColor, config.gradient.colorStops[1].opacity)) // 1
gradient.addColorStop(1, hexToRgba(baseColor, config.gradient.colorStops[2].opacity)) // 0.9

ctx.fillStyle = gradient
ctx.fill()

// 关键：发光边框
ctx.save()
ctx.strokeStyle = config.border.color // 'rgba(255, 255, 255, 0.3)'
ctx.lineWidth = config.border.width // 2
ctx.shadowColor = config.border.shadowColor // 'rgba(0, 0, 0, 0.5)'
ctx.shadowBlur = config.border.shadowBlur // 5
ctx.stroke()
ctx.restore()

// 关键：8条内发光线
for (let i = 0; i < config.innerGlow.lineCount; i++) {
  const lineAngle = startAngle + ((endAngle - startAngle) * (i + 0.5)) / config.innerGlow.lineCount
  ctx.strokeStyle = config.innerGlow.color // 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = config.innerGlow.lineWidth // 2
  ctx.shadowColor = config.innerGlow.color
  ctx.shadowBlur = config.innerGlow.blur // 10
  ctx.stroke()
}
```

### 7.2 中奖高亮核心代码

**位置**: `app/food-wheel/utils/canvas-helpers.ts:104-152`

```typescript
// 关键：3层彩色边框
for (let i = 3; i >= 1; i--) {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius + i * 4, startAngle, endAngle)
  ctx.closePath()
  ctx.strokeStyle = i === 3 ? '#FF0000' : i === 2 ? '#FFFF00' : '#FFFFFF'
  ctx.lineWidth = 10
  ctx.shadowColor = ctx.strokeStyle
  ctx.shadowBlur = 40 * glow
  ctx.globalAlpha = 0.8 * glow
  ctx.stroke()
}

// 关键：脉冲白色覆盖层
ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.3 * glow})`
ctx.fill()

// 关键：8条发光线
for (let i = 0; i < 8; i++) {
  const lineAngle = startAngle + (segmentAngle * (i + 0.5)) / 8
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * glow})`
  ctx.lineWidth = 4
  ctx.shadowColor = '#FFFF00'
  ctx.shadowBlur = 15 * glow
  ctx.stroke()
}

// 关键：超粗白色边框
ctx.strokeStyle = '#FFFFFF'
ctx.lineWidth = 12
ctx.shadowBlur = 20
ctx.stroke()
```

### 7.3 三层光晕边框核心代码

**位置**: `app/food-wheel/utils/canvas-helpers.ts:224-266`

```typescript
// 关键：3层脉冲光晕
const glowRings = [
  { radius: radius + 25 * scale, color: 'rgba(236, 72, 153, 0.4)', blur: 40 * scale, width: 3 * scale },
  { radius: radius + 18 * scale, color: 'rgba(168, 85, 247, 0.5)', blur: 30 * scale, width: 3 * scale },
  { radius: radius + 12 * scale, color: 'rgba(6, 182, 212, 0.6)', blur: 20 * scale, width: 3 * scale },
]

glowRings.forEach((ring) => {
  ctx.beginPath()
  ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2)
  ctx.strokeStyle = ring.color
  ctx.lineWidth = ring.width
  ctx.shadowColor = ring.color
  ctx.shadowBlur = ring.blur
  ctx.stroke()
})

// 关键：玻璃态主边框
ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
ctx.lineWidth = 16 * scale
ctx.stroke()

// 关键：渐变金边
const gradient = ctx.createLinearGradient(...)
gradient.addColorStop(0, '#FFD700')
gradient.addColorStop(0.5, '#FFA500')
gradient.addColorStop(1, '#FFD700')
ctx.strokeStyle = gradient
ctx.lineWidth = 6 * scale
ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
ctx.shadowBlur = 20 * scale
ctx.stroke()
```

### 7.4 中心按钮核心代码

**位置**: `app/food-wheel/utils/canvas-helpers.ts:288-336`

```typescript
// 关键：3层彩色光环
const outerGlows = [
  { radius: centerRadius + 15 * scale, color: 'rgba(236, 72, 153, 0.6)', blur: 30 * scale },
  { radius: centerRadius + 10 * scale, color: 'rgba(168, 85, 247, 0.7)', blur: 20 * scale },
  { radius: centerRadius + 5 * scale, color: 'rgba(6, 182, 212, 0.8)', blur: 15 * scale },
]

outerGlows.forEach((glow) => {
  ctx.beginPath()
  ctx.arc(centerX, centerY, glow.radius, 0, Math.PI * 2)
  ctx.strokeStyle = glow.color
  ctx.lineWidth = 2 * scale
  ctx.shadowColor = glow.color
  ctx.shadowBlur = glow.blur
  ctx.stroke()
})

// 关键：3色径向渐变
const gradient = ctx.createRadialGradient(
  centerX - 15 * scale, centerY - 15 * scale, 0,
  centerX, centerY, centerRadius
)
gradient.addColorStop(0, '#FF6B6B')
gradient.addColorStop(0.5, '#4ECDC4')
gradient.addColorStop(1, '#95E1D3')
ctx.fillStyle = gradient
ctx.fill()

// 关键：内发光环
ctx.arc(centerX, centerY, centerRadius - 5 * scale, 0, Math.PI * 2)
ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
ctx.lineWidth = 2 * scale
ctx.stroke()
```

---

## 八、配置对比与迁移

### 8.1 设计配置结构对比

| 配置项 | food-wheel (design-config.ts) | pc-food-wheel (pc-theme.ts) |
|-------|------------------------------|---------------------------|
| **渐变系统** | ✅ 6种主题渐变 (pastel/vibrant/neon等) | ⚠️ 单一渐变字符串 |
| **发光系统** | ✅ 6种发光色 (cyan/pink/yellow等) | ⚠️ 仅3种glow配置 |
| **阴影系统** | ✅ 5种阴影 + 霓虹发光 | ⚠️ 基础阴影 |
| **3D配置** | ✅ Wheel3DConfig (idle/hover/spinning) | ❌ 无 |
| **玻璃态** | ✅ GlassMaterial (wheel/panel/card) | ⚠️ 简化glass配置 |
| **光晕系统** | ✅ GlowRingSystem (3层嵌套+旋转光环) | ❌ 无 |
| **扇形增强** | ✅ WheelSegmentEnhancement (渐变/边框/内发光) | ❌ 无 |

**建议**: 在 `pc-theme.ts` 中补充缺失的配置对象

### 8.2 需要添加的配置项

```typescript
// 建议添加到 pc-theme.ts

export const PCTheme = {
  // ... 现有配置 ...

  // 新增：Dribbble风格渐变
  gradients: {
    classic: {
      from: '#667eea',
      via: '#764ba2',
      to: '#f093fb',
    },
    // 可选：更多渐变主题
  },

  // 新增：三层光晕系统
  glowRings: {
    outer: { radius: 1.1, color: 'rgba(236, 72, 153, 0.4)', blur: 40 },
    middle: { radius: 1.05, color: 'rgba(168, 85, 247, 0.5)', blur: 30 },
    inner: { radius: 1.02, color: 'rgba(6, 182, 212, 0.6)', blur: 20 },
  },

  // 新增：扇形增强配置
  segmentEnhancement: {
    gradient: {
      colorStops: [
        { offset: 0, opacity: 0.8 },
        { offset: 0.7, opacity: 1 },
        { offset: 1, opacity: 0.9 },
      ],
    },
    border: {
      width: 2,
      color: 'rgba(255, 255, 255, 0.3)',
      shadowBlur: 5,
    },
    innerGlow: {
      enabled: true,
      lineCount: 8,
      lineWidth: 2,
      length: 40,
      color: 'rgba(255, 255, 255, 0.5)',
      blur: 10,
    },
  },

  // 新增：3D透视配置
  transform3D: {
    idle: { rotateX: '15deg' },
    hover: { rotateX: '20deg', rotateY: '5deg', scale: '1.05' },
    spinning: { rotateX: '0deg' },
  },
}
```

---

## 九、实施检查清单

### 9.1 阶段一检查项

- [ ] 创建 `app/pc-food-wheel/utils/canvas-helpers.ts`
- [ ] 迁移 `getScale()` 函数
- [ ] 迁移 `hexToRgba()` 函数
- [ ] 迁移 `drawSegment()` 函数 (包含3层渐变+内发光线)
- [ ] 迁移 `drawWinningHighlight()` 函数 (包含3层彩色边框+发光线)
- [ ] 迁移 `drawWheelBorder()` 函数 (包含三层光晕+金边)
- [ ] 迁移 `drawCenterButton()` 函数 (包含3层光环+3色渐变)
- [ ] 迁移 `drawMarker()` 函数 (保持三角形，调整为金/红配色)
- [ ] 迁移 `drawOptionText()` 函数 (添加中奖标记)
- [ ] 在 `pc-theme.ts` 中添加 `segmentEnhancement` 配置
- [ ] 修改 `WheelCanvasPC.tsx` 导入并使用新函数
- [ ] 删除旧的内联绘制代码
- [ ] 测试扇形渐变效果
- [ ] 测试中奖高亮效果
- [ ] 测试边框光晕效果
- [ ] 测试中心按钮效果

### 9.2 阶段二检查项

- [ ] 修改转盘容器结构 (添加perspective父容器)
- [ ] 添加玻璃态容器 (background + backdropFilter)
- [ ] 实现3D倾斜 (rotateX: 15deg)
- [ ] 实现悬停交互 (rotateX: 20deg + rotateY: 5deg + scale: 1.05)
- [ ] 替换单层光晕为三层脉冲系统
- [ ] 添加交错动画延迟 (0s / 0.5s / 1s)
- [ ] 在 `pc-theme.ts` 中添加 `transform3D` 配置
- [ ] 在 `pc-theme.ts` 中添加 `glowRings` 配置
- [ ] 测试3D透视效果
- [ ] 测试悬停倾斜效果
- [ ] 测试背景光晕效果

### 9.3 阶段三检查项 (可选)

- [ ] 创建 `app/pc-food-wheel/utils/nft-effects.ts`
- [ ] 迁移 `ParticleOrbit` 类
- [ ] 迁移 `drawMetallicRim()` 函数
- [ ] 迁移 `drawCenterGem()` 函数
- [ ] 迁移 `drawHexGrid()` 函数
- [ ] 迁移 `drawScanlines()` 函数
- [ ] 在 `pc-theme.ts` 中添加NFT配色选项
- [ ] 实现主题切换逻辑
- [ ] 测试粒子轨道效果
- [ ] 测试金属边框效果
- [ ] 测试中心宝石效果
- [ ] 测试背景网格效果

---

## 十、预期效果对比

### 10.1 升级前 (当前PC版)

```
扇形：
  - 简单径向渐变 (0→0.6→1)
  - 无内发光线
  - 简单白色边框

中奖高亮：
  - 1层金色边框
  - 弱白色覆盖层 (0.15透明度)
  - 无发光线

边框：
  - 单层蓝色CSS光晕
  - 无Canvas边框装饰

中心按钮：
  - 2色线性渐变
  - 单色发光
  - 无光环/内发光环

容器：
  - 无3D透视
  - 简单缩放悬停
  - 单层背景光晕
```

### 10.2 升级后 (经典版水平)

```
扇形：
  - 3层径向渐变 (0.8→1→0.9透明度)
  - 8条内发光线
  - 发光边框 (shadowBlur: 5)

中奖高亮：
  - 3层彩色边框 (红/黄/白)
  - 强脉冲覆盖层 (0.4~0.7)
  - 8条黄色发光线
  - 12px超粗白色边框

边框：
  - 三层Canvas光晕 (Pink/Purple/Cyan)
  - 16px玻璃态主边框
  - 6px渐变金边 + shadowBlur: 20

中心按钮：
  - 3层彩色光环 (Pink/Purple/Cyan)
  - 3色径向渐变 (#FF6B6B→#4ECDC4→#95E1D3)
  - 内发光环

容器：
  - 1200px透视距离
  - rotateX(15deg) 倾斜
  - rotateX(20deg) + rotateY(5deg) + scale(1.05) 悬停
  - 三层脉冲背景光晕 (交错动画)
```

### 10.3 视觉提升量化对比

| 指标 | 升级前 | 升级后 | 提升幅度 |
|-----|-------|-------|---------|
| **扇形装饰层数** | 1层 | 4层 (渐变+边框+发光线+阴影) | +300% |
| **中奖视觉强度** | 2层 | 6层 (3色边框+覆盖层+发光线+粗边框) | +200% |
| **边框装饰元素** | 1个 | 5个 (3层光晕+主边框+金边) | +400% |
| **中心按钮复杂度** | 2层 | 5层 (3层光环+渐变+内环) | +150% |
| **3D效果** | 无 | 透视+倾斜+悬停交互 | 从无到有 |
| **背景层次** | 1层 | 3层交错脉冲 | +200% |

---

## 十一、注意事项与风险提示

### 11.1 性能考量

| 风险点 | 影响 | 缓解措施 |
|-------|-----|---------|
| **Canvas重绘频率** | 高 | 使用 requestAnimationFrame 而非 setInterval |
| **阴影叠加** | 中 | 合理使用 ctx.save/restore，避免阴影累积 |
| **粒子系统** | 中 | 仅NFT版启用，PC版可禁用 |
| **背景模糊** | 低 | backdrop-filter 硬件加速 |

### 11.2 兼容性问题

| 功能 | 浏览器支持 | 降级方案 |
|-----|-----------|---------|
| **backdrop-filter** | Chrome 76+, Safari 9+ | 使用半透明背景色 |
| **3D transform** | 全部现代浏览器 | 无需降级 |
| **Canvas shadowBlur** | 全部浏览器 | 无需降级 |
| **conic-gradient** | Chrome 69+, Safari 12.1+ | 使用径向渐变替代 |

### 11.3 代码维护

**优势**:
- ✅ 独立工具函数易于测试
- ✅ 配置化设计易于调整
- ✅ 复用经典版成熟代码

**注意**:
- ⚠️ 需保持canvas-helpers与配置文件同步
- ⚠️ 缩放比例计算需基于新的canvas尺寸
- ⚠️ 颜色主题切换需更新配置引用

---

## 十二、总结

### 12.1 核心差异

1. **food-wheel 经典版**: 完整的Dribbble风格系统 (3层渐变/发光/装饰)
2. **food-wheel NFT版**: 奢华高端风格 (金属边框/粒子/宝石)
3. **pc-food-wheel**: 简化扁平风格 (基础渐变/最小装饰)

### 12.2 推荐迁移路径

**必须做** (基础升级):
- ✅ 迁移8个核心绘制函数
- ✅ 应用3层渐变扇形
- ✅ 应用3层彩色中奖边框
- ✅ 应用三层光晕边框
- ✅ 应用3层光环中心按钮

**推荐做** (体验增强):
- ✅ 添加3D透视倾斜
- ✅ 添加玻璃态容器
- ✅ 增强背景光晕

**可选做** (主题扩展):
- 💡 集成NFT特效 (金属边框/粒子轨道)
- 💡 实现主题切换系统

### 12.3 预期收益

- **视觉冲击力**: 提升 200-400%
- **专业度**: 从基础扁平 → Dribbble精致风格
- **用户体验**: 3D交互 + 丰富动画反馈
- **代码质量**: 模块化 + 可维护性提升

---

**文档版本**: v1.0
**分析人**: Claude Code
**适用版本**: food-wheel v2.0.0 + pc-food-wheel v1.0.0

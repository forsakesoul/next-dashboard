/**
 * 光波扩散粒子效果
 */

export interface ShockwaveRing {
  x: number
  y: number
  radius: number
  maxRadius: number
  life: number
  maxLife: number
  delay: number
}

export const ShockwaveConfig = {
  // 波纹配置
  rings: 3,
  spacing: 150, // 环之间的间隔（ms）

  // 每个波纹属性
  wave: {
    maxRadius: 400,
    lineWidth: {
      start: 8,
      end: 2,
    },
    duration: 1200,
  },

  // 颜色渐变
  colors: [
    { stop: 0, color: 'rgba(236, 72, 153, 0.8)' },
    { stop: 0.5, color: 'rgba(168, 85, 247, 0.6)' },
    { stop: 1, color: 'rgba(6, 182, 212, 0.2)' },
  ],
} as const

/**
 * 创建光波扩散粒子
 */
export function createShockwave(x: number, y: number): ShockwaveRing[] {
  const rings: ShockwaveRing[] = []
  const config = ShockwaveConfig

  for (let i = 0; i < config.rings; i++) {
    rings.push({
      x,
      y,
      radius: 0,
      maxRadius: config.wave.maxRadius,
      life: config.wave.duration,
      maxLife: config.wave.duration,
      delay: i * config.spacing,
    })
  }

  return rings
}

/**
 * 更新光波粒子
 */
export function updateShockwaveRing(ring: ShockwaveRing, deltaTime: number = 16): boolean {
  // 处理延迟
  if (ring.delay > 0) {
    ring.delay -= deltaTime
    return true
  }

  // 更新生命值
  ring.life -= deltaTime

  // 计算进度
  const progress = 1 - ring.life / ring.maxLife

  // 使用缓动函数扩散
  const easeOut = 1 - Math.pow(1 - progress, 2)
  ring.radius = ring.maxRadius * easeOut

  // 返回是否存活
  return ring.life > 0
}

/**
 * 渲染光波粒子
 */
export function renderShockwaveRing(
  ctx: CanvasRenderingContext2D,
  ring: ShockwaveRing
): void {
  // 如果还在延迟中，不渲染
  if (ring.delay > 0) return

  const config = ShockwaveConfig
  const progress = 1 - ring.life / ring.maxLife

  // 计算线宽（逐渐变细）
  const lineWidth =
    config.wave.lineWidth.start -
    (config.wave.lineWidth.start - config.wave.lineWidth.end) * progress

  // 计算透明度（逐渐消失）
  const alpha = 1 - progress

  // 创建渐变 (确保内半径不小于 0)
  const innerRadius = Math.max(0, ring.radius - 20)
  const outerRadius = ring.radius + 20
  const gradient = ctx.createRadialGradient(ring.x, ring.y, innerRadius, ring.x, ring.y, outerRadius)

  config.colors.forEach(({ stop, color }) => {
    const colorWithAlpha = color.replace(/[\d.]+\)$/, `${alpha})`)
    gradient.addColorStop(stop, colorWithAlpha)
  })

  // 绘制波纹
  ctx.save()
  ctx.strokeStyle = gradient
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

/**
 * Canvas 绘制辅助函数 - Dribbble 风格增强版
 */

import { FoodOption } from '../types/food-wheel.types'
import { WheelSegmentEnhancement } from '../config/design-config'

/**
 * 绘制单个扇形 - 增强版（渐变 + 发光边框）
 */
export function drawSegment(
  ctx: CanvasRenderingContext2D,
  option: FoodOption,
  startAngle: number,
  endAngle: number,
  radius: number
) {
  const config = WheelSegmentEnhancement.segment
  const midAngle = (startAngle + endAngle) / 2

  // 创建径向渐变（从中心到边缘）
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)

  // 解析颜色并应用透明度
  const baseColor = option.color
  gradient.addColorStop(0, hexToRgba(baseColor, config.gradient.colorStops[0].opacity))
  gradient.addColorStop(0.7, hexToRgba(baseColor, config.gradient.colorStops[1].opacity))
  gradient.addColorStop(1, hexToRgba(baseColor, config.gradient.colorStops[2].opacity))

  // 绘制扇形主体
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius, startAngle, endAngle)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()

  // 绘制发光边框
  ctx.save()
  ctx.strokeStyle = config.border.color
  ctx.lineWidth = config.border.width
  ctx.shadowColor = config.border.shadowColor
  ctx.shadowBlur = config.border.shadowBlur
  ctx.stroke()
  ctx.restore()

  // 绘制内部发光线（可选装饰）
  if (config.innerGlow.enabled) {
    ctx.save()
    const glowLines = config.innerGlow.lineCount
    const lineLength = config.innerGlow.length

    for (let i = 0; i < glowLines; i++) {
      const lineAngle = startAngle + ((endAngle - startAngle) * (i + 0.5)) / glowLines
      const startR = radius - lineLength

      ctx.beginPath()
      ctx.moveTo(startR * Math.cos(lineAngle), startR * Math.sin(lineAngle))
      ctx.lineTo(radius * Math.cos(lineAngle), radius * Math.sin(lineAngle))
      ctx.strokeStyle = config.innerGlow.color
      ctx.lineWidth = config.innerGlow.lineWidth
      ctx.shadowColor = config.innerGlow.color
      ctx.shadowBlur = config.innerGlow.blur
      ctx.stroke()
    }
    ctx.restore()
  }
}

/**
 * 辅助函数: 十六进制颜色转 RGBA
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 绘制中奖扇形的高亮效果
 */
export function drawWinningHighlight(
  ctx: CanvasRenderingContext2D,
  startAngle: number,
  endAngle: number,
  segmentAngle: number,
  radius: number,
  glowIntensity: number
) {
  ctx.save()

  const glow = glowIntensity

  // 1. 绘制外层超级发光边框（多层，带脉冲效果）
  for (let i = 3; i >= 1; i--) {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, radius + i * 4, startAngle, endAngle)
    ctx.closePath()
    ctx.strokeStyle = i === 3 ? '#FF0000' : i === 2 ? '#FFFF00' : '#FFFFFF'
    ctx.lineWidth = 10
    ctx.shadowColor = i === 3 ? '#FF0000' : i === 2 ? '#FFFF00' : '#FFFFFF'
    ctx.shadowBlur = 40 * glow
    ctx.globalAlpha = 0.8 * glow
    ctx.stroke()
  }

  ctx.globalAlpha = 1

  // 2. 超亮白色覆盖层（带脉冲）
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius, startAngle, endAngle)
  ctx.closePath()
  ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.3 * glow})`
  ctx.fill()

  // 3. 内部发光线条（从中心放射）
  for (let i = 0; i < 8; i++) {
    const lineAngle = startAngle + (segmentAngle * (i + 0.5)) / 8
    ctx.beginPath()
    ctx.moveTo(radius * 0.2 * Math.cos(lineAngle), radius * 0.2 * Math.sin(lineAngle))
    ctx.lineTo(Math.cos(lineAngle) * radius, Math.sin(lineAngle) * radius)
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * glow})`
    ctx.lineWidth = 4
    ctx.shadowColor = '#FFFF00'
    ctx.shadowBlur = 15 * glow
    ctx.stroke()
  }

  // 4. 超粗白色边框
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius, startAngle, endAngle)
  ctx.closePath()
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 12
  ctx.shadowColor = '#FFFFFF'
  ctx.shadowBlur = 20
  ctx.stroke()

  ctx.restore()
}

/**
 * 绘制选项文字和Emoji（保持水平）
 */
export function drawOptionText(
  ctx: CanvasRenderingContext2D,
  option: FoodOption,
  midAngle: number,
  radius: number,
  isWinner: boolean
) {
  const textRadius = radius * 0.65
  const textX = textRadius * Math.cos(midAngle)
  const textY = textRadius * Math.sin(midAngle)

  // 绘制 emoji - 保持水平
  ctx.font = 'bold 32px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0, 0, 0, 0)'
  ctx.shadowBlur = 0
  ctx.fillStyle = '#000000'
  ctx.fillText(option.emoji, textX, textY)

  // 绘制文字 - 保持水平
  ctx.font = 'bold 14px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 2
  ctx.fillText(option.name, textX, textY + 30)

  // 如果是中奖项，绘制"中奖!"标记（水平）
  if (isWinner) {
    const markerRadius = radius * 0.4
    const markerX = markerRadius * Math.cos(midAngle)
    const markerY = markerRadius * Math.sin(midAngle)

    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#FF0000'
    ctx.lineWidth = 3
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#000000'
    ctx.shadowBlur = 8
    ctx.strokeText('中奖!', markerX, markerY)
    ctx.fillText('中奖!', markerX, markerY)
  }

  ctx.shadowBlur = 0
}

/**
 * 绘制转盘外圈装饰 - 三层光晕效果
 */
export function drawWheelBorder(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  ctx.save()

  // 绘制三层脉冲光晕（从外到内）
  const glowRings = [
    { radius: radius + 25, color: 'rgba(236, 72, 153, 0.4)', blur: 40, width: 3 },
    { radius: radius + 18, color: 'rgba(168, 85, 247, 0.5)', blur: 30, width: 3 },
    { radius: radius + 12, color: 'rgba(6, 182, 212, 0.6)', blur: 20, width: 3 },
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

  ctx.shadowBlur = 0

  // 绘制主边框（玻璃态质感）
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 16
  ctx.stroke()

  // 绘制内圈渐变金边
  const gradient = ctx.createLinearGradient(
    centerX - radius,
    centerY - radius,
    centerX + radius,
    centerY + radius
  )
  gradient.addColorStop(0, '#FFD700')
  gradient.addColorStop(0.5, '#FFA500')
  gradient.addColorStop(1, '#FFD700')

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.strokeStyle = gradient
  ctx.lineWidth = 6
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
  ctx.shadowBlur = 20
  ctx.stroke()

  ctx.restore()
}

/**
 * 绘制中心按钮 - 多层嵌套 3D 效果
 */
export function drawCenterButton(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  isSpinning: boolean
) {
  const centerRadius = 50

  ctx.save()

  // 外层多色光晕（三层）
  if (!isSpinning) {
    const outerGlows = [
      { radius: centerRadius + 15, color: 'rgba(236, 72, 153, 0.6)', blur: 30 },
      { radius: centerRadius + 10, color: 'rgba(168, 85, 247, 0.7)', blur: 20 },
      { radius: centerRadius + 5, color: 'rgba(6, 182, 212, 0.8)', blur: 15 },
    ]

    outerGlows.forEach((glow) => {
      ctx.beginPath()
      ctx.arc(centerX, centerY, glow.radius, 0, Math.PI * 2)
      ctx.strokeStyle = glow.color
      ctx.lineWidth = 2
      ctx.shadowColor = glow.color
      ctx.shadowBlur = glow.blur
      ctx.stroke()
    })
  }

  ctx.shadowBlur = 0

  // 主按钮渐变（霓虹风格）
  const gradient = ctx.createRadialGradient(
    centerX - 15,
    centerY - 15,
    0,
    centerX,
    centerY,
    centerRadius
  )
  gradient.addColorStop(0, '#FF6B6B')
  gradient.addColorStop(0.5, '#4ECDC4')
  gradient.addColorStop(1, '#95E1D3')

  ctx.beginPath()
  ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // 玻璃态边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 3
  ctx.stroke()

  // 内发光效果
  ctx.beginPath()
  ctx.arc(centerX, centerY, centerRadius - 5, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 绘制中心图标和文字
  ctx.font = 'bold 28px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
  ctx.shadowBlur = 6
  ctx.fillText('🎲', centerX, centerY - 8)

  ctx.font = 'bold 14px Arial'
  ctx.shadowBlur = 4
  ctx.fillText(isSpinning ? '旋转中' : '开始', centerX, centerY + 18)

  ctx.restore()
}

/**
 * 绘制12点钟位置标记
 */
export function drawMarker(ctx: CanvasRenderingContext2D, centerX: number, radius: number) {
  ctx.save()

  // 在转盘顶部画一个标记线
  const markerY = centerX - radius - 5

  // 绘制发光的标记线
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.shadowColor = '#FFD700'
  ctx.shadowBlur = 20

  ctx.beginPath()
  ctx.moveTo(centerX - 30, markerY)
  ctx.lineTo(centerX + 30, markerY)
  ctx.stroke()

  // 绘制白色内线
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(centerX - 30, markerY)
  ctx.lineTo(centerX + 30, markerY)
  ctx.stroke()

  // 绘制中心圆点
  ctx.shadowColor = '#FF0000'
  ctx.shadowBlur = 15
  ctx.fillStyle = '#FF0000'
  ctx.beginPath()
  ctx.arc(centerX, markerY, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, markerY, 6, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}

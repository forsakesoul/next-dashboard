/**
 * Canvas 绘制辅助函数
 */

import { FoodOption } from '../types/food-wheel.types'

/**
 * 绘制单个扇形
 */
export function drawSegment(
  ctx: CanvasRenderingContext2D,
  option: FoodOption,
  startAngle: number,
  endAngle: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, radius, startAngle, endAngle)
  ctx.closePath()
  ctx.fillStyle = option.color
  ctx.fill()

  // 绘制边框线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 2
  ctx.stroke()
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
 * 绘制转盘外圈装饰
 */
export function drawWheelBorder(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  // 绘制外圈金属边框
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2)
  ctx.strokeStyle = '#4a4a4a'
  ctx.lineWidth = 20
  ctx.stroke()

  // 绘制内圈金边
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 6
  ctx.shadowColor = 'rgba(255, 215, 0, 0.6)'
  ctx.shadowBlur = 15
  ctx.stroke()
  ctx.shadowBlur = 0
}

/**
 * 绘制中心按钮
 */
export function drawCenterButton(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  isSpinning: boolean
) {
  const centerRadius = 50

  // 外层发光圈（仅在非旋转时显示）
  if (!isSpinning) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, centerRadius + 5, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)'
    ctx.lineWidth = 3
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
    ctx.shadowBlur = 20
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // 渐变背景
  const gradient = ctx.createRadialGradient(
    centerX - 15,
    centerY - 15,
    0,
    centerX,
    centerY,
    centerRadius
  )
  gradient.addColorStop(0, '#FFD700')
  gradient.addColorStop(0.6, '#FFA500')
  gradient.addColorStop(1, '#FF8C00')

  ctx.beginPath()
  ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // 立体边框
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 4
  ctx.stroke()

  // 内阴影效果
  ctx.beginPath()
  ctx.arc(centerX, centerY, centerRadius - 3, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.lineWidth = 2
  ctx.stroke()

  // 绘制中心文字
  ctx.font = 'bold 18px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
  ctx.shadowBlur = 4
  ctx.fillText('START', centerX, centerY - 5)

  ctx.font = 'bold 12px Arial'
  ctx.fillText('点击开始', centerX, centerY + 12)
  ctx.shadowBlur = 0
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

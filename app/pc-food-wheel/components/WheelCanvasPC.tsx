/**
 * PC端转盘Canvas组件
 * 扁平化专业设计风格
 */

'use client'

import { useRef, useEffect, useCallback } from 'react'
import { FoodOption } from '../../food-wheel/types/food-wheel.types'
import { PCTheme } from '../../food-wheel/config/pc-theme'

interface WheelCanvasPCProps {
  options: FoodOption[]
  rotation: number
  isSpinning: boolean
  winningIndex: number | null
  glowIntensity: number
  onCenterClick: () => void
}

export default function WheelCanvasPC({
  options,
  rotation,
  isSpinning,
  winningIndex,
  glowIntensity,
  onCenterClick,
}: WheelCanvasPCProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>(0)

  // 画布尺寸
  const SIZE = PCTheme.wheel.size.largeDesktop
  const CANVAS_SIZE = SIZE * 2 // 2x for retina
  const CENTER_X = CANVAS_SIZE / 2
  const CENTER_Y = CANVAS_SIZE / 2
  const RADIUS = (CANVAS_SIZE / 2) * 0.85
  const CENTER_BUTTON_RADIUS = PCTheme.wheel.centerButtonRadius * 2

  const SEGMENT_ANGLE = (2 * Math.PI) / options.length

  /**
   * 调整颜色亮度
   */
  const adjustColorBrightness = (hex: string, amount: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount))
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount))
    const b = Math.max(0, Math.min(255, (num & 0xff) + amount))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  /**
   * 绘制转盘
   */
  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // 清空画布
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      // 绘制转盘阴影
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 40
      ctx.shadowOffsetY = 10
      ctx.beginPath()
      ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fill()
      ctx.restore()

      // 绘制扇形
      options.forEach((option, index) => {
        const startAngle = rotation + index * SEGMENT_ANGLE
        const endAngle = startAngle + SEGMENT_ANGLE
        const middleAngle = startAngle + SEGMENT_ANGLE / 2

        // 绘制扇形填充
        ctx.beginPath()
        ctx.moveTo(CENTER_X, CENTER_Y)
        ctx.arc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle)
        ctx.closePath()

        // 径向渐变填充
        const gradient = ctx.createRadialGradient(
          CENTER_X,
          CENTER_Y,
          0,
          CENTER_X,
          CENTER_Y,
          RADIUS
        )
        gradient.addColorStop(0, option.color)
        gradient.addColorStop(0.6, option.color)
        gradient.addColorStop(1, adjustColorBrightness(option.color, -30))

        ctx.fillStyle = gradient
        ctx.fill()

        // 绘制发光边框
        ctx.save()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 2
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.restore()

        // 绘制文字和Emoji（保持水平）
        drawSegmentText(ctx, option, index, startAngle)
      })

      // 绘制中奖高亮
      if (winningIndex !== null && !isSpinning) {
        drawWinningHighlight(ctx, winningIndex)
      }

      // 绘制中心按钮
      drawCenterButton(ctx, isSpinning)

      // 绘制顶部指针
      drawPointer(ctx)
    },
    [options, rotation, winningIndex, isSpinning, glowIntensity]
  )

  /**
   * 绘制扇形文字
   */
  const drawSegmentText = (
    ctx: CanvasRenderingContext2D,
    option: FoodOption,
    index: number,
    startAngle: number
  ) => {
    const middleAngle = startAngle + SEGMENT_ANGLE / 2
    const textRadius = RADIUS * 0.7

    // 计算文字位置（保持水平）
    const x = CENTER_X + Math.cos(middleAngle) * textRadius
    const y = CENTER_Y + Math.sin(middleAngle) * textRadius

    ctx.save()
    ctx.translate(x, y)

    // 绘制Emoji
    ctx.font = `${60 * 2}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(option.emoji, 0, -30)

    // 绘制文字
    ctx.font = `bold ${24 * 2}px sans-serif`
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 8
    ctx.fillText(option.name, 0, 30)

    ctx.restore()
  }

  /**
   * 绘制中奖高亮
   */
  const drawWinningHighlight = (
    ctx: CanvasRenderingContext2D,
    index: number
  ) => {
    const startAngle = rotation + index * SEGMENT_ANGLE
    const endAngle = startAngle + SEGMENT_ANGLE

    ctx.save()

    // 绘制高亮扇形
    ctx.beginPath()
    ctx.moveTo(CENTER_X, CENTER_Y)
    ctx.arc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle)
    ctx.closePath()

    // 半透明白色遮罩
    ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * glowIntensity})`
    ctx.fill()

    // 金色发光边框
    ctx.strokeStyle = PCTheme.wheel.winningStrokeColor
    ctx.lineWidth = PCTheme.wheel.winningStrokeWidth * 2
    ctx.shadowColor = PCTheme.wheel.winningStrokeColor
    ctx.shadowBlur = 20
    ctx.stroke()

    ctx.restore()
  }

  /**
   * 绘制中心按钮
   */
  const drawCenterButton = (ctx: CanvasRenderingContext2D, spinning: boolean) => {
    ctx.save()

    // 外圈发光阴影
    ctx.shadowColor = spinning
      ? 'rgba(100, 100, 100, 0.3)'
      : 'rgba(102, 126, 234, 0.8)'
    ctx.shadowBlur = spinning ? 20 : 60
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // 绘制按钮背景（渐变）
    ctx.beginPath()
    ctx.arc(CENTER_X, CENTER_Y, CENTER_BUTTON_RADIUS, 0, 2 * Math.PI)

    if (!spinning) {
      const buttonGradient = ctx.createLinearGradient(
        CENTER_X - CENTER_BUTTON_RADIUS,
        CENTER_Y - CENTER_BUTTON_RADIUS,
        CENTER_X + CENTER_BUTTON_RADIUS,
        CENTER_Y + CENTER_BUTTON_RADIUS
      )
      buttonGradient.addColorStop(0, '#667eea')
      buttonGradient.addColorStop(1, '#764ba2')
      ctx.fillStyle = buttonGradient
    } else {
      ctx.fillStyle = '#64748b'
    }

    ctx.fill()

    // 发光边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 6
    ctx.stroke()

    // 绘制图标
    if (spinning) {
      // 旋转动画图标
      ctx.save()
      ctx.translate(CENTER_X, CENTER_Y)
      ctx.rotate((Date.now() / 200) % (2 * Math.PI))
      ctx.font = `bold ${70 * 2}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 10
      ctx.fillText('⟳', 0, 0)
      ctx.restore()
    } else {
      // 播放图标
      ctx.font = `bold ${70 * 2}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 10
      ctx.fillText('▶', CENTER_X + 15, CENTER_Y)
    }

    ctx.restore()
  }

  /**
   * 绘制顶部指针
   */
  const drawPointer = (ctx: CanvasRenderingContext2D) => {
    const pointerSize = PCTheme.wheel.pointerSize * 2

    ctx.save()

    // 指针位置（顶部中央）
    const x = CENTER_X
    const y = CENTER_Y - RADIUS - 30

    // 绘制三角形指针
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x - pointerSize, y - pointerSize * 1.5)
    ctx.lineTo(x + pointerSize, y - pointerSize * 1.5)
    ctx.closePath()

    // 渐变填充
    const gradient = ctx.createLinearGradient(x, y - pointerSize * 1.5, x, y)
    gradient.addColorStop(0, '#f093fb')
    gradient.addColorStop(1, '#f093fb')

    ctx.fillStyle = gradient
    ctx.shadowColor = 'rgba(240, 147, 251, 0.9)'
    ctx.shadowBlur = 30
    ctx.fill()

    // 发光边框
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 6
    ctx.shadowBlur = 15
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    ctx.stroke()

    ctx.restore()
  }

  /**
   * 处理点击事件
   */
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // 检测是否点击中心按钮
    const dx = x - CENTER_X
    const dy = y - CENTER_Y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= CENTER_BUTTON_RADIUS) {
      onCenterClick()
    }
  }

  /**
   * 动画循环
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      drawWheel(ctx)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [drawWheel])

  return (
    <div ref={containerRef} className="relative">
      {/* 转盘光环效果 */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animationDuration: '3s',
        }}
      />

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onClick={handleCanvasClick}
        className="cursor-pointer transition-all duration-500 hover:scale-105 hover:drop-shadow-2xl relative z-10"
        style={{
          width: SIZE,
          height: SIZE,
          filter: isSpinning ? 'brightness(1.15) saturate(1.2)' : 'drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4))',
        }}
      />
    </div>
  )
}

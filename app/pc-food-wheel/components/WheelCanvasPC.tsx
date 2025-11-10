/**
 * PC端转盘Canvas组件
 * Dribbble 风格增强版 - 三层渐变 + 多层光晕
 */

'use client'

import { useRef, useEffect, useCallback } from 'react'
import { FoodOption } from '../../food-wheel/types/food-wheel.types'
import { PCTheme } from '../../food-wheel/config/pc-theme'
import {
  drawSegment,
  drawWinningHighlight,
  drawOptionText,
  drawWheelBorder,
  drawCenterButton,
  drawMarker,
} from '../utils/canvas-helpers'

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
  const lastRotationRef = useRef(rotation)
  const lastGlowRef = useRef(glowIntensity)

  // 画布尺寸
  const SIZE = PCTheme.wheel.size.largeDesktop
  const CANVAS_SIZE = SIZE * 2 // 2x for retina
  const CENTER_X = CANVAS_SIZE / 2
  const CENTER_Y = CANVAS_SIZE / 2
  const RADIUS = (CANVAS_SIZE / 2) * 0.85
  const CENTER_BUTTON_RADIUS = PCTheme.wheel.centerButtonRadius * 2

  const SEGMENT_ANGLE = (2 * Math.PI) / options.length

  /**
   * 绘制转盘 - 使用增强版样式
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

      // 绘制扇形（使用增强版函数）
      options.forEach((option, index) => {
        const startAngle = rotation + index * SEGMENT_ANGLE
        const endAngle = startAngle + SEGMENT_ANGLE

        // 使用增强版扇形绘制（三层渐变 + 发光边框 + 内发光线）
        drawSegment(ctx, option, startAngle, endAngle, RADIUS, CENTER_X, CENTER_Y)
      })

      // 绘制三层彩色光晕边框
      drawWheelBorder(ctx, CENTER_X, CENTER_Y, RADIUS)

      // 绘制中奖高亮（四层叠加效果）
      if (winningIndex !== null && !isSpinning) {
        const startAngle = rotation + winningIndex * SEGMENT_ANGLE
        const endAngle = startAngle + SEGMENT_ANGLE
        drawWinningHighlight(
          ctx,
          startAngle,
          endAngle,
          SEGMENT_ANGLE,
          RADIUS,
          CENTER_X,
          CENTER_Y,
          glowIntensity
        )
      }

      // 绘制文字和Emoji
      options.forEach((option, index) => {
        const startAngle = rotation + index * SEGMENT_ANGLE
        const midAngle = startAngle + SEGMENT_ANGLE / 2
        const isWinner = winningIndex === index && !isSpinning
        drawOptionText(ctx, option, midAngle, RADIUS, CENTER_X, CENTER_Y, isWinner)
      })

      // 绘制多层霓虹中心按钮
      drawCenterButton(ctx, CENTER_X, CENTER_Y, RADIUS, isSpinning)

      // 绘制发光顶部标记
      drawMarker(ctx, CENTER_X, CENTER_Y, RADIUS)
    },
    [options, rotation, winningIndex, isSpinning, glowIntensity]
  )


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
   * 动画循环 - 优化版：仅在必要时渲染
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 检查是否需要渲染
    const needsRender = () => {
      // 1. 正在旋转时必须渲染
      if (isSpinning) return true

      // 2. rotation或glowIntensity变化时需要渲染
      if (rotation !== lastRotationRef.current) return true
      if (glowIntensity !== lastGlowRef.current) return true

      // 3. 静止状态不需要渲染
      return false
    }

    const animate = () => {
      if (needsRender()) {
        drawWheel(ctx)
        lastRotationRef.current = rotation
        lastGlowRef.current = glowIntensity
      }

      // 仅在旋转时持续请求动画帧
      if (isSpinning) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    // 立即绘制一次
    drawWheel(ctx)
    lastRotationRef.current = rotation
    lastGlowRef.current = glowIntensity

    // 如果正在旋转，启动动画循环
    if (isSpinning) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [drawWheel, rotation, isSpinning, glowIntensity])

  return (
    <div ref={containerRef} className="relative">
      {/* 转盘光环效果 - 按比例缩小 */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.25) 0%, transparent 70%)',
          filter: 'blur(30px)',
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
          filter: isSpinning ? 'brightness(1.15) saturate(1.2)' : 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.3))',
        }}
      />
    </div>
  )
}

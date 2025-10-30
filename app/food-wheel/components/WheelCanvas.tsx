/**
 * 转盘 Canvas 组件
 */

'use client'

import { useEffect, useRef, memo, useState, useCallback } from 'react'
import { FoodOption } from '../types/food-wheel.types'
import {
  drawSegment,
  drawWinningHighlight,
  drawOptionText,
  drawWheelBorder,
  drawCenterButton,
  drawMarker,
} from '../utils/canvas-helpers'
import { useDeviceInfo, useResponsiveSizes, triggerHapticFeedback } from '../hooks/useResponsive'

interface WheelCanvasProps {
  /** 美食选项列表 */
  options: FoodOption[]
  /** 当前旋转角度 */
  rotation: number
  /** 是否正在旋转 */
  isSpinning: boolean
  /** 中奖扇形索引 */
  winningIndex: number
  /** 发光强度 */
  glowIntensity: number
  /** 中心按钮点击回调 */
  onCenterClick: () => void
}

/**
 * 转盘 Canvas 组件
 * 负责绘制转盘、动画渲染和交互
 */
function WheelCanvas({
  options,
  rotation,
  isSpinning,
  winningIndex,
  glowIntensity,
  onCenterClick,
}: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 响应式设备检测
  const deviceInfo = useDeviceInfo()
  const responsiveSizes = useResponsiveSizes(deviceInfo)

  // 触摸手势状态
  const touchTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastTapRef = useRef<number>(0)
  const [isPressing, setIsPressing] = useState(false)

  // 计算每个扇形的角度
  const SEGMENT_ANGLE = (2 * Math.PI) / options.length

  /**
   * 绘制完整转盘
   */
  const drawWheel = (
    ctx: CanvasRenderingContext2D,
    angle: number,
    spinning: boolean = false
  ) => {
    const canvas = ctx.canvas
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ===== 绘制扇形区域（旋转的部分） =====
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle)

    options.forEach((option, index) => {
      const startAngle = index * SEGMENT_ANGLE - Math.PI / 2
      const endAngle = (index + 1) * SEGMENT_ANGLE - Math.PI / 2
      const isWinner = !spinning && winningIndex === index

      // 绘制基础扇形
      drawSegment(ctx, option, startAngle, endAngle, radius)

      // 如果是中奖扇形，添加高亮效果
      if (isWinner) {
        drawWinningHighlight(ctx, startAngle, endAngle, SEGMENT_ANGLE, radius, glowIntensity)
      }
    })

    ctx.restore()

    // ===== 绘制文字和 emoji（不旋转，始终保持水平） =====
    ctx.save()
    ctx.translate(centerX, centerY)

    options.forEach((option, index) => {
      const startAngle = index * SEGMENT_ANGLE - Math.PI / 2
      const isWinner = !spinning && winningIndex === index

      // 计算实际角度（包含转盘旋转）
      const midAngle = startAngle + SEGMENT_ANGLE / 2 + angle

      drawOptionText(ctx, option, midAngle, radius, isWinner)
    })

    ctx.restore()

    // ===== 绘制转盘边框和装饰 =====
    drawWheelBorder(ctx, centerX, centerY, radius)

    // ===== 绘制中心按钮 =====
    drawCenterButton(ctx, centerX, centerY, spinning)

    // ===== 绘制12点钟位置标记 =====
    drawMarker(ctx, centerX, radius)
  }

  /**
   * 渲染 Effect
   * 监听状态变化，更新Canvas
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Failed to get canvas context')
      return
    }

    // 绘制转盘
    drawWheel(ctx, rotation, isSpinning)
  }, [rotation, isSpinning, winningIndex, glowIntensity, options, SEGMENT_ANGLE])

  /**
   * 检测是否点击中心按钮
   */
  const isClickInCenter = useCallback(
    (clientX: number, clientY: number): boolean => {
      const canvas = canvasRef.current
      if (!canvas) return false

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (clientX - rect.left) * scaleX
      const y = (clientY - rect.top) * scaleY

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))

      return distance <= 50
    },
    []
  )

  /**
   * 处理 Canvas 点击事件
   */
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isSpinning) return

      if (isClickInCenter(e.clientX, e.clientY)) {
        triggerHapticFeedback('medium')
        onCenterClick()
      }
    },
    [isSpinning, isClickInCenter, onCenterClick]
  )

  /**
   * 处理触摸开始 (长按支持)
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (isSpinning) return

      const touch = e.touches[0]
      if (!touch) return

      setIsPressing(true)

      // 检测双击
      const now = Date.now()
      const timeSinceLastTap = now - lastTapRef.current
      lastTapRef.current = now

      if (timeSinceLastTap < 300 && isClickInCenter(touch.clientX, touch.clientY)) {
        // 双击快速开始
        triggerHapticFeedback('heavy')
        onCenterClick()
        return
      }

      // 长按开始 (500ms)
      if (isClickInCenter(touch.clientX, touch.clientY)) {
        touchTimerRef.current = setTimeout(() => {
          if (!isSpinning) {
            triggerHapticFeedback('medium')
            onCenterClick()
          }
        }, 500)
      }
    },
    [isSpinning, isClickInCenter, onCenterClick]
  )

  /**
   * 处理触摸结束
   */
  const handleTouchEnd = useCallback(() => {
    setIsPressing(false)
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current)
    }
  }, [])

  /**
   * 清理定时器
   */
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      <div
        className="relative transition-all duration-300"
        style={{
          width: `${responsiveSizes.wheelSize}px`,
          height: `${responsiveSizes.wheelSize}px`,
        }}
      >
        <canvas
          ref={canvasRef}
          width={responsiveSizes.canvasSize}
          height={responsiveSizes.canvasSize}
          className={`relative z-10 drop-shadow-2xl cursor-pointer touch-none transition-transform ${
            isPressing ? 'scale-95' : 'scale-100'
          }`}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        />
      </div>
    </div>
  )
}

// 使用 memo 优化性能，避免不必要的重渲染
export default memo(WheelCanvas)

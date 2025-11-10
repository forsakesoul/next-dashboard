/**
 * 转盘 Canvas 组件
 */

'use client'

import { useEffect, useRef, memo } from 'react'
import { FoodOption } from '../types/food-wheel.types'
import {
  drawSegment,
  drawWinningHighlight,
  drawOptionText,
  drawWheelBorder,
  drawCenterButton,
  drawMarker,
} from '../utils/canvas-helpers'

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
   * 处理 Canvas 点击事件
   * 检测是否点击了中心按钮
   */
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || isSpinning) return

    // 获取点击坐标
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // 计算点击点到中心的距离
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))

    // 计算缩放后的中心按钮半径
    const radius = Math.min(centerX, centerY) - 20
    const scale = radius / 230 // 基于原设计半径230
    const centerRadius = 50 * scale

    // 如果点击在中心圆内
    if (distance <= centerRadius) {
      onCenterClick()
    }
  }

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      {/* 玻璃态转盘容器 */}
      <div
        className="relative aspect-square rounded-full"
        style={{
          width: 'min(70vmin, 300px)',
          height: 'min(70vmin, 300px)',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          transform: isSpinning ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
        onMouseEnter={(e) => {
          if (!isSpinning) {
            e.currentTarget.style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSpinning) {
            e.currentTarget.style.transform = 'scale(1)'
          }
        }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative z-10 cursor-pointer"
          style={{
            width: '100%',
            height: '100%',
            filter: isSpinning ? 'brightness(1.2) saturate(1.3)' : 'brightness(1)',
            transition: 'filter 0.3s ease',
          }}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  )
}

// 使用 memo 优化性能，避免不必要的重渲染
export default memo(WheelCanvas)

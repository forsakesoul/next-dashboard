/**
 * 转盘旋转动画 Hook
 */

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseWheelAnimationOptions {
  /** 扇形数量，用于计算每个扇形的角度 */
  segmentCount: number
  /** 动画完成回调 */
  onAnimationComplete?: (winningIndex: number) => void
}

interface UseWheelAnimationReturn {
  /** 是否正在旋转 */
  isSpinning: boolean
  /** 当前旋转角度 */
  currentRotation: number
  /** 中奖扇形索引 */
  winningIndex: number
  /** 启动旋转动画 */
  startSpin: (targetIndex: number) => void
  /** 重置状态 */
  reset: () => void
}

/**
 * 转盘旋转动画管理
 *
 * @param options 配置选项
 * @returns 动画状态和控制函数
 *
 * @example
 * const animation = useWheelAnimation({
 *   segmentCount: 9,
 *   onAnimationComplete: (index) => {
 *     console.log('中奖索引：', index)
 *   }
 * })
 *
 * // 启动动画，转到索引3
 * animation.startSpin(3)
 */
export function useWheelAnimation({
  segmentCount,
  onAnimationComplete,
}: UseWheelAnimationOptions): UseWheelAnimationReturn {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const [winningIndex, setWinningIndex] = useState(-1)

  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(0)

  // 计算每个扇形的角度
  const SEGMENT_ANGLE = (2 * Math.PI) / segmentCount

  /**
   * 启动旋转动画
   *
   * @param targetIndex 目标扇形索引
   */
  const startSpin = useCallback(
    (targetIndex: number) => {
      if (isSpinning) {
        console.warn('Animation already in progress')
        return
      }

      // 参数验证
      if (targetIndex < 0 || targetIndex >= segmentCount) {
        console.error(`Invalid targetIndex: ${targetIndex}, must be 0-${segmentCount - 1}`)
        return
      }

      // 重置中奖状态
      setWinningIndex(-1)

      // 计算目标角度
      const targetAngle = targetIndex * SEGMENT_ANGLE

      // 额外旋转圈数：8-10 圈（随机）
      const extraSpins = (Math.floor(Math.random() * 3) + 8) * Math.PI * 2

      // 动画持续时间：4-5 秒（随机）
      const duration = 4000 + Math.floor(Math.random() * 1000)

      // 设置目标旋转角度（累加，不是重置）
      setTargetRotation(currentRotation + extraSpins + targetAngle)

      // 设置动画参数
      durationRef.current = duration
      startTimeRef.current = 0

      // 启动动画
      setIsSpinning(true)
    },
    [isSpinning, currentRotation, segmentCount, SEGMENT_ANGLE]
  )

  /**
   * 重置所有状态
   */
  const reset = useCallback(() => {
    setIsSpinning(false)
    setCurrentRotation(0)
    setTargetRotation(0)
    setWinningIndex(-1)
    startTimeRef.current = 0
    durationRef.current = 0

    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }
  }, [])

  /**
   * 动画循环
   */
  useEffect(() => {
    if (!isSpinning) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / durationRef.current, 1)

      // 缓动函数（Ease-Out Cubic）
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentAngle = currentRotation + (targetRotation - currentRotation) * easeOut

      // 更新当前角度（这会触发重新渲染，Canvas组件会读取这个值）
      setCurrentRotation(currentAngle)

      if (progress < 1) {
        // 继续动画
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // 动画完成
        setIsSpinning(false)
        setCurrentRotation(targetRotation)

        // 计算中奖项 - 12点钟方向（顶部中间）对应的扇形
        const normalizedRotation = targetRotation % (Math.PI * 2)
        const pointerAngle = -Math.PI / 2 // 12点钟方向
        const relativeAngle = (pointerAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2)

        // 计算索引并确保在有效范围内
        let calculatedIndex = Math.floor(relativeAngle / SEGMENT_ANGLE)
        calculatedIndex = ((calculatedIndex % segmentCount) + segmentCount) % segmentCount

        // 设置中奖索引
        setWinningIndex(calculatedIndex)

        // 触发回调
        if (onAnimationComplete) {
          onAnimationComplete(calculatedIndex)
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isSpinning, currentRotation, targetRotation, segmentCount, SEGMENT_ANGLE, onAnimationComplete])

  return {
    isSpinning,
    currentRotation,
    winningIndex,
    startSpin,
    reset,
  }
}

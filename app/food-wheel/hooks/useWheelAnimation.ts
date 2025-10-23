/**
 * 转盘旋转动画 Hook
 */

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseWheelAnimationOptions {
  /** 扇形数量，用于计算每个扇形的角度 */
  segmentCount: number
  /** 结果准备好的回调（95%时触发） */
  onResultReady?: (winningIndex: number) => void
  /** 动画完全结束的回调（用户看到结果后） */
  onAnimationComplete?: () => void
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
  onResultReady,
  onAnimationComplete,
}: UseWheelAnimationOptions): UseWheelAnimationReturn {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const [winningIndex, setWinningIndex] = useState(-1)

  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(0)
  const targetIndexRef = useRef<number>(-1) // 保存目标索引
  const hasTriggeredComplete = useRef<boolean>(false) // 防止重复触发

  // 计算每个扇形的角度
  const SEGMENT_ANGLE = (2 * Math.PI) / segmentCount

  /**
   * 启动旋转动画
   *
   * @param targetIndex 目标扇形索引（由加权算法决定）
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

      console.log('🚀 Starting spin animation immediately...')

      // 保存目标索引
      targetIndexRef.current = targetIndex

      // 重置标志
      hasTriggeredComplete.current = false

      // 重置中奖状态
      setWinningIndex(-1)

      // 计算目标角度
      const targetAngle = targetIndex * SEGMENT_ANGLE

      // 额外旋转圈数：8-12 圈（随机）- 有足够的仪式感
      const extraSpins = (Math.floor(Math.random() * 5) + 8) * Math.PI * 2

      // 动画持续时间：5-8 秒（随机）- 足够长但不会太久
      const duration = 5000 + Math.floor(Math.random() * 3000)

      // 设置目标旋转角度（累加，不是重置）
      const newTargetRotation = currentRotation + extraSpins + targetAngle
      setTargetRotation(newTargetRotation)

      // 设置动画参数
      durationRef.current = duration
      startTimeRef.current = 0

      // 【关键优化】立即启动动画，不等待 React 重新渲染
      setIsSpinning(true)

      // 使用 queueMicrotask 确保状态更新后立即启动动画循环
      queueMicrotask(() => {
        console.log('⚡ Animation loop starting now!')
      })
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

    // 保存起始值和目标值，避免闭包问题
    const startRotation = currentRotation
    const endRotation = targetRotation

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / durationRef.current, 1)

      // 缓动函数（Ease-Out Quart）- 更强的减速效果，让转盘慢慢停下来
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const currentAngle = startRotation + (endRotation - startRotation) * easeOut

      // 更新当前角度（这会触发重新渲染，Canvas组件会读取这个值）
      setCurrentRotation(currentAngle)

      if (progress < 1) {
        // 继续动画直到100%
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // 动画100%完成 - 立即停止转盘并显示结果
        if (!hasTriggeredComplete.current) {
          hasTriggeredComplete.current = true
          const finalIndex = targetIndexRef.current

          console.log('✅ Animation 100% complete - stopping wheel and showing result immediately')

          // 1. 立即停止转盘
          setIsSpinning(false)
          setCurrentRotation(endRotation)

          // 2. 立即显示结果（同一时刻）
          setWinningIndex(finalIndex)

          // 3. 通知结果准备好
          if (onResultReady) {
            onResultReady(finalIndex)
          }

          // 4. 动画完全结束
          if (onAnimationComplete) {
            onAnimationComplete()
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isSpinning, onResultReady, onAnimationComplete])

  return {
    isSpinning,
    currentRotation,
    winningIndex,
    startSpin,
    reset,
  }
}

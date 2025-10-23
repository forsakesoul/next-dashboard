/**
 * 中奖发光脉冲效果 Hook
 */

import { useState, useRef, useEffect } from 'react'

/**
 * 中奖扇形的脉冲发光效果管理
 *
 * @param winningIndex 中奖扇形索引（-1表示未中奖）
 * @returns 发光强度值 (0.6-1.0之间)
 *
 * @example
 * const glowIntensity = useGlowEffect(winningIndex)
 *
 * // 在Canvas绘制时使用：
 * ctx.shadowBlur = 40 * glowIntensity
 * ctx.globalAlpha = 0.8 * glowIntensity
 */
export function useGlowEffect(winningIndex: number): number {
  const [glowIntensity, setGlowIntensity] = useState(1)
  const glowAnimationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // 如果没有中奖项，停止动画
    if (winningIndex === -1) {
      setGlowIntensity(1)

      if (glowAnimationRef.current !== undefined) {
        cancelAnimationFrame(glowAnimationRef.current)
        glowAnimationRef.current = undefined
      }

      return
    }

    // 启动脉冲动画
    let startTime = 0

    const animateGlow = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime

      // 使用正弦波创建脉冲效果
      // 周期：300ms
      // 强度范围：0.6-1.0（避免完全消失）
      const intensity = 0.6 + 0.4 * Math.sin((elapsed / 300) * Math.PI)
      setGlowIntensity(intensity)

      glowAnimationRef.current = requestAnimationFrame(animateGlow)
    }

    glowAnimationRef.current = requestAnimationFrame(animateGlow)

    // 清理函数
    return () => {
      if (glowAnimationRef.current !== undefined) {
        cancelAnimationFrame(glowAnimationRef.current)
        glowAnimationRef.current = undefined
      }
    }
  }, [winningIndex])

  return glowIntensity
}

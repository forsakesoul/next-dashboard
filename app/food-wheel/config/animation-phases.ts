/**
 * 三阶段旋转动画配置
 * 加速 -> 匀速 -> 减速（回弹）
 */

import { EasingFunctions, type EasingFunction } from './animation-easing'

export interface AnimationPhase {
  name: string
  duration: number
  easing: EasingFunction
  rotation: number
  description: string
}

export const SpinAnimationPhases = {
  // 三阶段旋转系统
  phases: [
    {
      name: 'accelerate',
      duration: 800, // 0.8秒加速
      easing: 'easeInQuad' as EasingFunction,
      rotation: Math.PI * 2, // 旋转1圈
      description: '快速加速阶段',
    },
    {
      name: 'constant',
      duration: 2000, // 2秒匀速
      easing: 'linear' as EasingFunction,
      rotation: Math.PI * 10, // 旋转5圈
      description: '高速匀速旋转',
    },
    {
      name: 'decelerate',
      duration: 2000, // 2秒减速
      easing: 'easeOutBack' as EasingFunction, // 使用回弹效果
      rotation: Math.PI * 4, // 旋转2圈后停止
      description: '减速并回弹到准确位置',
    },
  ] as AnimationPhase[],

  // 总时长计算
  getTotalDuration(): number {
    return this.phases.reduce((sum, phase) => sum + phase.duration, 0)
  },

  // 获取当前阶段
  getCurrentPhase(elapsed: number): AnimationPhase | null {
    let accumulated = 0
    for (const phase of this.phases) {
      accumulated += phase.duration
      if (elapsed < accumulated) {
        return phase
      }
    }
    return null
  },

  // 计算当前旋转角度（三阶段综合）
  calculateRotation(elapsed: number, baseRotation: number, targetAngle: number): number {
    let accumulated = 0
    let currentRotation = baseRotation

    for (const phase of this.phases) {
      const phaseEnd = accumulated + phase.duration

      if (elapsed < phaseEnd) {
        // 在当前阶段内
        const phaseProgress = (elapsed - accumulated) / phase.duration
        const easing = EasingFunctions[phase.easing]
        const easedProgress = easing(phaseProgress)

        return currentRotation + phase.rotation * easedProgress
      }

      // 完成当前阶段
      accumulated = phaseEnd
      currentRotation += phase.rotation
    }

    // 所有阶段完成，返回目标角度
    return targetAngle
  },

  // 获取阶段进度信息（用于调试）
  getPhaseInfo(elapsed: number): {
    phaseName: string
    phaseProgress: number
    totalProgress: number
  } | null {
    const totalDuration = this.getTotalDuration()
    let accumulated = 0

    for (const phase of this.phases) {
      const phaseEnd = accumulated + phase.duration

      if (elapsed < phaseEnd) {
        const phaseProgress = (elapsed - accumulated) / phase.duration
        const totalProgress = elapsed / totalDuration

        return {
          phaseName: phase.name,
          phaseProgress,
          totalProgress,
        }
      }

      accumulated = phaseEnd
    }

    return null
  },
} as const

/**
 * 专业缓动函数库
 * 参考: https://easings.net/
 */

export const EasingFunctions = {
  // 当前使用: Cubic Ease-Out
  easeOutCubic: (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  },

  // 弹性效果（Elastic Ease-Out）- Dribbble 常用
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },

  // 回弹效果（Back Ease-Out）- 推荐用于转盘
  easeOutBack: (t: number): number => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },

  // 弹跳效果（Bounce Ease-Out）
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75

    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  },

  // 二次方缓入（Quad Ease-In）
  easeInQuad: (t: number): number => {
    return t * t
  },

  // 二次方缓出（Quad Ease-Out）
  easeOutQuad: (t: number): number => {
    return 1 - (1 - t) * (1 - t)
  },

  // 线性（无缓动）
  linear: (t: number): number => {
    return t
  },

  // 五次方缓出（Quint Ease-Out）- 更平滑
  easeOutQuint: (t: number): number => {
    return 1 - Math.pow(1 - t, 5)
  },

  // 指数缓出（Expo Ease-Out）
  easeOutExpo: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  },
} as const

// 导出类型
export type EasingFunction = keyof typeof EasingFunctions

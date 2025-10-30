/**
 * PC端专业主题配置
 * 商务风格，低饱和度配色
 */

export const PCTheme = {
  // 背景渐变 - 更丰富的色彩
  background: {
    primary: '#0a0e27',
    secondary: '#1a1f3a',
    tertiary: '#2a2f4a',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
    overlay: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.98) 100%)',
  },

  // 强调色 - 更鲜艳的配色
  accent: {
    primary: '#667eea', // 紫蓝渐变
    primaryHover: '#5568d3',
    secondary: '#f093fb', // 粉紫
    success: '#00f2fe', // 青色
    danger: '#ff6b9d', // 粉红
    info: '#4facfe', // 天蓝
    warning: '#feca57', // 金黄
  },

  // 文字颜色
  text: {
    primary: '#f8fafc', // slate-50
    secondary: '#cbd5e1', // slate-300
    tertiary: '#94a3b8', // slate-400
    muted: '#64748b', // slate-500
    disabled: '#475569', // slate-600
  },

  // 表面/容器 - 更强的玻璃态效果
  surface: {
    card: 'rgba(255, 255, 255, 0.08)',
    cardHover: 'rgba(255, 255, 255, 0.12)',
    cardActive: 'rgba(255, 255, 255, 0.16)',
    panel: 'rgba(255, 255, 255, 0.05)',
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    },
  },

  // 阴影系统 - 更强的发光效果
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 8px 30px rgba(0, 0, 0, 0.12)',
    lg: '0 20px 60px rgba(0, 0, 0, 0.3)',
    xl: '0 30px 90px rgba(0, 0, 0, 0.5)',
    glow: {
      blue: '0 0 40px rgba(102, 126, 234, 0.8), 0 0 80px rgba(102, 126, 234, 0.4)',
      amber: '0 0 40px rgba(240, 147, 251, 0.8), 0 0 80px rgba(240, 147, 251, 0.4)',
      emerald: '0 0 40px rgba(0, 242, 254, 0.8), 0 0 80px rgba(0, 242, 254, 0.4)',
    },
  },

  // 转盘特定样式
  wheel: {
    size: {
      desktop: 500,
      largeDesktop: 600,
    },
    centerButtonRadius: 70,
    pointerSize: 24,
    segmentStrokeWidth: 1,
    segmentStrokeColor: 'rgba(255, 255, 255, 0.2)',
    winningStrokeWidth: 4,
    winningStrokeColor: '#f59e0b',
    winningGlow: '0 0 20px rgba(245, 158, 11, 0.6)',
  },

  // 动画时长
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    easing: {
      smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // 间距系统
  spacing: {
    cardGap: 24,
    sectionGap: 32,
    containerPadding: 32,
    headerHeight: 80,
  },

  // 响应式断点
  breakpoints: {
    desktop: 1280,
    largeDesktop: 1920,
  },
} as const

export type PCThemeType = typeof PCTheme

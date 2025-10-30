/**
 * Dribbble 风格设计系统配置
 * 包含色彩、渐变、阴影等视觉规范
 */

export const DesignTheme = {
  // Dribbble 典型渐变色系
  gradients: {
    // 粉彩系（柔和渐变）
    pastel: {
      from: '#faddd1',
      via: '#fad1e6',
      to: '#f4d1f4',
      css: 'from-[#faddd1] via-[#fad1e6] to-[#f4d1f4]',
    },

    // 明亮系（高饱和度）
    vibrant: {
      from: '#f4b69c',
      via: '#f49cc8',
      to: '#ec4899',
      css: 'from-[#f4b69c] via-[#f49cc8] to-[#ec4899]',
    },

    // 霓虹系（发光效果）
    neon: {
      from: '#FF6B6B',
      via: '#4ECDC4',
      to: '#95E1D3',
      css: 'from-[#FF6B6B] via-[#4ECDC4] to-[#95E1D3]',
    },

    // 深色系（背景）
    dark: {
      from: '#1a1a2e',
      via: '#16213e',
      to: '#0f3460',
      css: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
    },

    // 经典系（当前风格增强）
    classic: {
      from: '#667eea',
      via: '#764ba2',
      to: '#f093fb',
      css: 'from-[#667eea] via-[#764ba2] to-[#f093fb]',
    },

    // 日落系（温暖渐变）
    sunset: {
      from: '#ff9a56',
      via: '#ff6a88',
      to: '#a855f7',
      css: 'from-[#ff9a56] via-[#ff6a88] to-[#a855f7]',
    },
  },

  // 霓虹发光色（用于阴影和边框）
  glows: {
    cyan: {
      rgb: '6, 182, 212',
      rgba: 'rgba(6, 182, 212, 0.8)',
      hex: '#06B6D4',
    },
    pink: {
      rgb: '236, 72, 153',
      rgba: 'rgba(236, 72, 153, 0.8)',
      hex: '#EC4899',
    },
    yellow: {
      rgb: '251, 191, 36',
      rgba: 'rgba(251, 191, 36, 0.8)',
      hex: '#FBBF24',
    },
    purple: {
      rgb: '168, 85, 247',
      rgba: 'rgba(168, 85, 247, 0.8)',
      hex: '#A855F7',
    },
    green: {
      rgb: '52, 211, 153',
      rgba: 'rgba(52, 211, 153, 0.8)',
      hex: '#34D399',
    },
    orange: {
      rgb: '251, 146, 60',
      rgba: 'rgba(251, 146, 60, 0.8)',
      hex: '#FB923C',
    },
  },

  // 美食选项配色（扩展当前 9 种颜色）
  foodColors: [
    { name: '炽热红', hex: '#FF6B6B', glow: 'rgba(255, 107, 107, 0.6)' },
    { name: '青瓷绿', hex: '#4ECDC4', glow: 'rgba(78, 205, 196, 0.6)' },
    { name: '薰衣紫', hex: '#A78BFA', glow: 'rgba(167, 139, 250, 0.6)' },
    { name: '柠檬黄', hex: '#FFD93D', glow: 'rgba(255, 217, 61, 0.6)' },
    { name: '蜜桃粉', hex: '#F8B4D9', glow: 'rgba(248, 180, 217, 0.6)' },
    { name: '天空蓝', hex: '#60A5FA', glow: 'rgba(96, 165, 250, 0.6)' },
    { name: '翡翠绿', hex: '#34D399', glow: 'rgba(52, 211, 153, 0.6)' },
    { name: '珊瑚橙', hex: '#FB923C', glow: 'rgba(251, 146, 60, 0.6)' },
    { name: '玫瑰红', hex: '#F472B6', glow: 'rgba(244, 114, 182, 0.6)' },
  ],
} as const

export const ShadowSystem = {
  // 软阴影（卡片）
  soft: {
    css: '0 4px 20px rgba(0, 0, 0, 0.1)',
    tailwind: 'shadow-[0_4px_20px_rgba(0,0,0,0.1)]',
  },

  // 中等阴影（悬停状态）
  medium: {
    css: '0 8px 40px rgba(0, 0, 0, 0.2)',
    tailwind: 'shadow-[0_8px_40px_rgba(0,0,0,0.2)]',
  },

  // 强阴影（激活状态）
  hard: {
    css: '0 20px 80px rgba(0, 0, 0, 0.4)',
    tailwind: 'shadow-[0_20px_80px_rgba(0,0,0,0.4)]',
  },

  // 霓虹发光阴影
  neon: {
    cyan: '0 0 40px rgba(6, 182, 212, 0.8)',
    pink: '0 0 40px rgba(236, 72, 153, 0.8)',
    yellow: '0 0 40px rgba(251, 191, 36, 0.8)',
    purple: '0 0 40px rgba(168, 85, 247, 0.8)',
    multiColor:
      '0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)',
  },

  // 内阴影（凹陷效果）
  inset: {
    soft: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
    deep: 'inset 0 4px 20px rgba(0, 0, 0, 0.3)',
  },
} as const

export const Wheel3DConfig = {
  // 容器 3D 透视
  container: {
    perspective: '1200px',
    perspectiveOrigin: 'center center',
  },

  // 转盘 3D 变换
  wheel: {
    // 基础倾斜角度
    idle: {
      rotateX: '15deg',
      rotateY: '0deg',
      rotateZ: '0deg',
      transformStyle: 'preserve-3d' as const,
    },

    // 悬停效果
    hover: {
      rotateX: '20deg',
      rotateY: '5deg',
      scale: '1.05',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },

    // 旋转时效果
    spinning: {
      rotateX: '0deg', // 旋转时平视
      rotateY: '0deg',
      filter: 'brightness(1.2) saturate(1.3)',
    },
  },
} as const

export const GlassMaterial = {
  // 主转盘玻璃效果
  wheel: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },

  // 控制面板玻璃效果
  panel: {
    background: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(20px) saturate(150%)',
    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
  },

  // 结果卡片玻璃效果
  card: {
    background: 'rgba(139, 92, 246, 0.2)',
    backdropFilter: 'blur(15px) saturate(200%)',
    WebkitBackdropFilter: 'blur(15px) saturate(200%)',
    border: '2px solid rgba(167, 139, 250, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.4)',
  },
} as const

export const GlowRingSystem = {
  // 三层嵌套发光圈
  rings: [
    {
      name: 'outer',
      radius: '110%',
      blur: '60px',
      spread: '20px',
      color: 'rgba(236, 72, 153, 0.6)',
      animation: 'pulse 3s ease-in-out infinite',
    },
    {
      name: 'middle',
      radius: '105%',
      blur: '40px',
      spread: '10px',
      color: 'rgba(168, 85, 247, 0.5)',
      animation: 'pulse 3s ease-in-out infinite 0.5s',
    },
    {
      name: 'inner',
      radius: '102%',
      blur: '20px',
      spread: '5px',
      color: 'rgba(6, 182, 212, 0.4)',
      animation: 'pulse 3s ease-in-out infinite 1s',
    },
  ],

  // 旋转光环（Canvas 绘制）
  rotatingRing: {
    enabled: true,
    radius: 240,
    lineWidth: 4,
    gradientStops: [
      { offset: 0, color: 'rgba(236, 72, 153, 1)' },
      { offset: 0.5, color: 'rgba(168, 85, 247, 1)' },
      { offset: 1, color: 'rgba(6, 182, 212, 1)' },
    ],
    rotationSpeed: 0.02, // 弧度/帧
  },
} as const

export const WheelSegmentEnhancement = {
  // 扇形绘制增强
  segment: {
    // 内外圈渐变
    gradient: {
      type: 'radial' as const,
      innerRadius: 0,
      outerRadius: 230,
      colorStops: [
        { offset: 0, opacity: 0.8 },
        { offset: 0.7, opacity: 1 },
        { offset: 1, opacity: 0.9 },
      ],
    },

    // 边框效果
    border: {
      width: 2,
      color: 'rgba(255, 255, 255, 0.3)',
      shadowBlur: 5,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
    },

    // 内部发光线
    innerGlow: {
      enabled: true,
      lineCount: 8,
      lineWidth: 2,
      length: 40,
      color: 'rgba(255, 255, 255, 0.5)',
      blur: 10,
    },
  },

  // 中奖扇形特殊效果
  winningSegment: {
    // 脉冲光效
    pulse: {
      minIntensity: 0.6,
      maxIntensity: 1.0,
      frequency: 300, // ms
    },

    // 多层高亮
    highlights: [
      { type: 'border', color: '#FF6B6B', width: 8, blur: 10 },
      { type: 'border', color: '#FFD93D', width: 6, blur: 8 },
      { type: 'border', color: '#FFFFFF', width: 4, blur: 5 },
      { type: 'overlay', color: 'rgba(255, 255, 255, 0.3)' },
    ],

    // 放射发光线
    glowLines: {
      count: 12,
      length: 60,
      width: 3,
      colors: ['#FF6B6B', '#FFD93D', '#FFFFFF'],
    },
  },
} as const

// 导出类型
export type ThemeGradient = keyof typeof DesignTheme.gradients
export type GlowColor = keyof typeof DesignTheme.glows
export type ShadowType = keyof typeof ShadowSystem

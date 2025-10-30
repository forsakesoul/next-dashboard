/**
 * NFT Raffle App 风格主题配置
 * 参考高端加密货币/NFT 应用设计
 */

export const NFTTheme = {
  // 深色奢华背景
  backgrounds: {
    main: {
      gradient: 'from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]',
      overlay: 'radial-gradient(circle at 50% 0%, rgba(138, 43, 226, 0.15), transparent 50%)',
    },
    card: {
      glass: 'rgba(26, 26, 46, 0.6)',
      border: 'linear-gradient(135deg, rgba(218, 165, 32, 0.5), rgba(138, 43, 226, 0.5))',
    },
  },

  // 金色/紫色配色方案
  colors: {
    primary: {
      gold: '#DAA520',
      darkGold: '#B8860B',
      lightGold: '#FFD700',
    },
    accent: {
      neonPurple: '#8A2BE2',
      electricBlue: '#00D4FF',
      neonPink: '#FF10F0',
    },
    glow: {
      gold: 'rgba(218, 165, 32, 0.8)',
      purple: 'rgba(138, 43, 226, 0.8)',
      blue: 'rgba(0, 212, 255, 0.6)',
    },
  },

  // 转盘装饰
  wheel: {
    // 金属边框
    metalRim: {
      outer: {
        width: 8,
        gradient: ['#B8860B', '#DAA520', '#FFD700', '#DAA520', '#B8860B'],
        shadow: '0 0 30px rgba(218, 165, 32, 0.6)',
      },
      inner: {
        width: 4,
        color: '#FFD700',
        shadow: '0 0 20px rgba(255, 215, 0, 0.8)',
      },
    },

    // 粒子轨道
    particleOrbit: {
      count: 24,
      radius: 260,
      size: { min: 2, max: 4 },
      color: '#00D4FF',
      glow: 'rgba(0, 212, 255, 0.8)',
      rotationSpeed: 0.01,
    },

    // 中心宝石效果
    centerGem: {
      layers: [
        { radius: 70, color: '#FFD700', opacity: 0.3, blur: 40 },
        { radius: 60, color: '#8A2BE2', opacity: 0.4, blur: 30 },
        { radius: 50, color: '#00D4FF', opacity: 0.5, blur: 20 },
      ],
      pulse: {
        min: 0.6,
        max: 1.0,
        speed: 2000,
      },
    },
  },

  // 六边形背景网格
  hexGrid: {
    size: 40,
    stroke: 'rgba(138, 43, 226, 0.2)',
    strokeWidth: 1,
    glow: 'rgba(138, 43, 226, 0.4)',
    animation: 'pulse 3s ease-in-out infinite',
  },

  // 全息投影效果
  hologram: {
    scanlines: {
      height: 2,
      spacing: 4,
      color: 'rgba(0, 212, 255, 0.05)',
      animation: 'scan 2s linear infinite',
    },
    aberration: {
      enabled: true,
      offsetR: { x: 2, y: 0 },
      offsetG: { x: 0, y: 0 },
      offsetB: { x: -2, y: 0 },
    },
  },

  // 高级按钮样式
  button: {
    premium: {
      background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 50%, #DAA520 100%)',
      border: '2px solid #FFD700',
      shadow:
        '0 0 20px rgba(218, 165, 32, 0.6), 0 0 40px rgba(218, 165, 32, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.2)',
      text: {
        color: '#0a0a0f',
        shadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
        weight: 900,
      },
      hover: {
        transform: 'scale(1.05) translateY(-2px)',
        shadow:
          '0 0 30px rgba(218, 165, 32, 0.8), 0 0 60px rgba(218, 165, 32, 0.6), inset 0 0 30px rgba(255, 215, 0, 0.3)',
      },
    },
  },

  // 数据流动效果
  dataStream: {
    particles: {
      count: 50,
      color: '#00D4FF',
      size: { min: 1, max: 3 },
      speed: { min: 0.5, max: 2 },
      trail: true,
      trailLength: 20,
    },
  },
} as const

// 六边形路径生成器
export function generateHexagonPath(centerX: number, centerY: number, size: number): string {
  const points: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    points.push([centerX + size * Math.cos(angle), centerY + size * Math.sin(angle)])
  }
  return `M ${points.map((p) => p.join(',')).join(' L ')} Z`
}

// 金属渐变生成器
export function createMetallicGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius)
  gradient.addColorStop(0, '#B8860B')
  gradient.addColorStop(0.25, '#DAA520')
  gradient.addColorStop(0.5, '#FFD700')
  gradient.addColorStop(0.75, '#DAA520')
  gradient.addColorStop(1, '#B8860B')
  return gradient
}

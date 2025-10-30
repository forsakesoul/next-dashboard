/**
 * NFT 风格视觉效果
 * 金属边框、粒子轨道、全息投影等
 */

import { NFTTheme, createMetallicGradient } from '../config/nft-theme'

/**
 * 粒子轨道粒子
 */
interface OrbitParticle {
  angle: number
  size: number
  alpha: number
}

/**
 * 粒子轨道管理器
 */
export class ParticleOrbit {
  private particles: OrbitParticle[] = []
  private rotation: number = 0

  constructor(private config = NFTTheme.wheel.particleOrbit) {
    this.initParticles()
  }

  private initParticles() {
    const angleStep = (Math.PI * 2) / this.config.count
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push({
        angle: i * angleStep,
        size: this.config.size.min + Math.random() * (this.config.size.max - this.config.size.min),
        alpha: 0.5 + Math.random() * 0.5,
      })
    }
  }

  update() {
    this.rotation += this.config.rotationSpeed
  }

  render(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    ctx.save()

    this.particles.forEach((particle) => {
      const angle = particle.angle + this.rotation
      const x = centerX + Math.cos(angle) * this.config.radius
      const y = centerY + Math.sin(angle) * this.config.radius

      // 绘制发光粒子
      ctx.shadowColor = this.config.glow
      ctx.shadowBlur = 10
      ctx.fillStyle = this.config.color
      ctx.globalAlpha = particle.alpha

      ctx.beginPath()
      ctx.arc(x, y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }
}

/**
 * 绘制金属边框
 */
export function drawMetallicRim(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  const { metalRim } = NFTTheme.wheel

  ctx.save()

  // 外层金属边框
  const outerGradient = createMetallicGradient(ctx, centerX, centerY, radius + metalRim.outer.width)
  ctx.strokeStyle = outerGradient
  ctx.lineWidth = metalRim.outer.width
  ctx.shadowColor = metalRim.outer.shadow.split(' ')[3] // 提取颜色
  ctx.shadowBlur = 30

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + metalRim.outer.width / 2, 0, Math.PI * 2)
  ctx.stroke()

  // 内层金色高光
  ctx.shadowBlur = 20
  ctx.shadowColor = metalRim.inner.shadow.split(' ')[3]
  ctx.strokeStyle = metalRim.inner.color
  ctx.lineWidth = metalRim.inner.width

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}

/**
 * 绘制中心宝石效果
 */
export function drawCenterGem(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  pulseIntensity: number
) {
  const { centerGem } = NFTTheme.wheel

  ctx.save()

  // 多层发光
  centerGem.layers.forEach((layer) => {
    const radius = layer.radius * (0.9 + pulseIntensity * 0.1)

    ctx.shadowColor = layer.color
    ctx.shadowBlur = layer.blur
    ctx.fillStyle = layer.color
    ctx.globalAlpha = layer.opacity * pulseIntensity

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.restore()
}

/**
 * 绘制六边形网格背景
 */
export function drawHexGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offsetX: number = 0,
  offsetY: number = 0
) {
  const hexGrid = NFTTheme.hexGrid
  const size = hexGrid.size
  const spacing = size * Math.sqrt(3)

  ctx.save()
  ctx.strokeStyle = hexGrid.stroke
  ctx.lineWidth = hexGrid.strokeWidth
  ctx.shadowColor = hexGrid.glow
  ctx.shadowBlur = 5

  // 绘制六边形网格
  for (let row = -1; row < height / spacing + 2; row++) {
    for (let col = -1; col < width / (size * 1.5) + 2; col++) {
      const x = col * size * 1.5 + offsetX
      const y = row * spacing + (col % 2) * (spacing / 2) + offsetY

      drawHexagon(ctx, x, y, size / 2)
    }
  }

  ctx.restore()
}

/**
 * 绘制单个六边形
 */
function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const px = x + size * Math.cos(angle)
    const py = y + size * Math.sin(angle)
    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.closePath()
  ctx.stroke()
}

/**
 * 绘制扫描线（全息效果）
 */
export function drawScanlines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offset: number = 0
) {
  const { scanlines } = NFTTheme.hologram

  ctx.save()
  ctx.fillStyle = scanlines.color

  for (let y = offset % (scanlines.height + scanlines.spacing); y < height; y += scanlines.height + scanlines.spacing) {
    ctx.fillRect(0, y, width, scanlines.height)
  }

  ctx.restore()
}

/**
 * 绘制数据流粒子
 */
export class DataStream {
  private particles: Array<{
    x: number
    y: number
    vy: number
    size: number
    alpha: number
    trail: Array<{ x: number; y: number; alpha: number }>
  }> = []

  constructor(
    private width: number,
    private height: number,
    private config = NFTTheme.dataStream.particles
  ) {
    this.initParticles()
  }

  private initParticles() {
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vy: this.config.speed.min + Math.random() * (this.config.speed.max - this.config.speed.min),
        size: this.config.size.min + Math.random() * (this.config.size.max - this.config.size.min),
        alpha: 0.3 + Math.random() * 0.7,
        trail: [],
      })
    }
  }

  update() {
    this.particles.forEach((particle) => {
      // 更新位置
      particle.y += particle.vy

      // 循环
      if (particle.y > this.height) {
        particle.y = 0
        particle.x = Math.random() * this.width
      }

      // 更新拖尾
      if (this.config.trail) {
        particle.trail.unshift({ x: particle.x, y: particle.y, alpha: particle.alpha })
        if (particle.trail.length > this.config.trailLength) {
          particle.trail.pop()
        }
      }
    })
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()

    this.particles.forEach((particle) => {
      // 绘制拖尾
      if (this.config.trail) {
        particle.trail.forEach((point, index) => {
          const trailAlpha = point.alpha * (1 - index / particle.trail.length)
          ctx.fillStyle = this.config.color
          ctx.globalAlpha = trailAlpha

          ctx.beginPath()
          ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // 绘制主粒子
      ctx.shadowColor = this.config.color
      ctx.shadowBlur = 8
      ctx.fillStyle = this.config.color
      ctx.globalAlpha = particle.alpha

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }
}

/**
 * 创建高级按钮样式
 */
export function createPremiumButton(element: HTMLElement) {
  const { premium } = NFTTheme.button

  Object.assign(element.style, {
    background: premium.background,
    border: premium.border,
    boxShadow: premium.shadow,
    color: premium.text.color,
    textShadow: premium.text.shadow,
    fontWeight: premium.text.weight,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  })

  // 悬停效果
  element.addEventListener('mouseenter', () => {
    Object.assign(element.style, {
      transform: premium.hover.transform,
      boxShadow: premium.hover.shadow,
    })
  })

  element.addEventListener('mouseleave', () => {
    Object.assign(element.style, {
      transform: 'scale(1) translateY(0)',
      boxShadow: premium.shadow,
    })
  })
}

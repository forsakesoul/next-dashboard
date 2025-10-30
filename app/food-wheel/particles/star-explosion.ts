/**
 * 星星爆炸粒子效果
 */

export interface StarParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  emoji: string
  fontSize: number
  rotation: number
  rotationSpeed: number
  scale: number
}

export const StarExplosionConfig = {
  // 星星配置
  count: 30,
  emojis: ['⭐', '✨', '💫', '🌟'],
  fontSize: { min: 16, max: 24 },

  // 爆炸模式
  explosion: {
    type: 'radial' as const, // 径向爆炸
    velocity: {
      min: 3,
      max: 8,
    },
  },

  // 动画属性
  animation: {
    fadeOut: true,
    fadeStart: 0.5, // 50%生命周期后开始淡出
    scale: {
      start: 0.5,
      end: 1.2,
    },
    rotation: {
      speed: { min: -10, max: 10 }, // 度/帧
    },
  },

  // 生命周期
  lifetime: 1500,
} as const

/**
 * 创建星星爆炸粒子
 */
export function createStarExplosion(x: number, y: number): StarParticle[] {
  const particles: StarParticle[] = []
  const config = StarExplosionConfig

  for (let i = 0; i < config.count; i++) {
    // 均匀分布角度
    const angle = (Math.PI * 2 * i) / config.count
    const velocity =
      config.explosion.velocity.min +
      Math.random() * (config.explosion.velocity.max - config.explosion.velocity.min)

    // 随机选择 emoji
    const emoji = config.emojis[Math.floor(Math.random() * config.emojis.length)]

    // 随机字体大小
    const fontSize =
      config.fontSize.min + Math.random() * (config.fontSize.max - config.fontSize.min)

    // 随机旋转速度
    const rotationSpeed =
      config.animation.rotation.speed.min +
      Math.random() *
        (config.animation.rotation.speed.max - config.animation.rotation.speed.min)

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: config.lifetime,
      maxLife: config.lifetime,
      emoji,
      fontSize,
      rotation: Math.random() * 360,
      rotationSpeed,
      scale: config.animation.scale.start,
    })
  }

  return particles
}

/**
 * 更新星星粒子
 */
export function updateStarParticle(particle: StarParticle, deltaTime: number = 16): boolean {
  const config = StarExplosionConfig

  // 更新位置
  particle.x += particle.vx
  particle.y += particle.vy

  // 应用重力
  particle.vy += 0.2

  // 更新生命值
  particle.life -= deltaTime

  // 更新旋转
  particle.rotation += particle.rotationSpeed

  // 更新缩放
  const lifeRatio = particle.life / particle.maxLife
  particle.scale =
    config.animation.scale.start +
    (config.animation.scale.end - config.animation.scale.start) * (1 - lifeRatio)

  // 返回是否存活
  return particle.life > 0
}

/**
 * 渲染星星粒子
 */
export function renderStarParticle(
  ctx: CanvasRenderingContext2D,
  particle: StarParticle
): void {
  const config = StarExplosionConfig
  const lifeRatio = particle.life / particle.maxLife

  // 计算透明度
  const alpha =
    lifeRatio > config.animation.fadeStart ? 1 : lifeRatio / config.animation.fadeStart

  ctx.save()
  ctx.translate(particle.x, particle.y)
  ctx.rotate((particle.rotation * Math.PI) / 180)
  ctx.scale(particle.scale, particle.scale)
  ctx.globalAlpha = alpha
  ctx.font = `${particle.fontSize}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(particle.emoji, 0, 0)
  ctx.restore()
}

/**
 * 粒子烟花庆祝动画组件
 */

'use client'

import { useEffect, useRef } from 'react'

interface ConfettiProps {
  /** 是否显示 */
  show: boolean
  /** 持续时间（毫秒） */
  duration?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
  decay: number
}

/**
 * 粒子烟花效果
 */
export default function Confetti({ show, duration = 3000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!show) {
      // 清空粒子
      particlesRef.current = []
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置Canvas尺寸
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // 烟花颜色
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#FFD700',
      '#FF1493',
      '#00CED1',
      '#FF4500',
    ]

    /**
     * 创建烟花爆炸
     */
    const createFirework = (x: number, y: number) => {
      const particleCount = 50 // 每次爆炸50个粒子
      const color = colors[Math.floor(Math.random() * colors.length)]

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount
        const speed = 2 + Math.random() * 4
        const size = 2 + Math.random() * 3

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size,
          life: 1,
          decay: 0.008 + Math.random() * 0.012,
        })
      }
    }

    /**
     * 更新和绘制粒子
     */
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current

      // 超过持续时间则停止
      if (elapsed > duration) {
        particlesRef.current = []
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = undefined
        }
        return
      }

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 每隔一段时间创建新烟花
      if (elapsed < duration - 500 && Math.random() < 0.1) {
        const x = canvas.width * (0.3 + Math.random() * 0.4)
        const y = canvas.height * (0.2 + Math.random() * 0.4)
        createFirework(x, y)
      }

      // 更新和绘制所有粒子
      particlesRef.current = particlesRef.current.filter((particle) => {
        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy

        // 重力效果
        particle.vy += 0.1

        // 减少生命值
        particle.life -= particle.decay

        // 如果粒子还活着，绘制它
        if (particle.life > 0) {
          ctx.save()
          ctx.globalAlpha = particle.life
          ctx.fillStyle = particle.color
          ctx.shadowBlur = 10
          ctx.shadowColor = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()

          return true
        }

        return false
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // 初始爆炸
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    createFirework(centerX, centerY - 100)

    // 延迟创建更多烟花
    setTimeout(() => {
      createFirework(centerX - 150, centerY - 50)
    }, 200)

    setTimeout(() => {
      createFirework(centerX + 150, centerY - 50)
    }, 400)

    // 启动动画
    startTimeRef.current = 0
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', updateSize)
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [show, duration])

  if (!show) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

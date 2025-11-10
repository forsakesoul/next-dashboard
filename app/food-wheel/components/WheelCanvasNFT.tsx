/**
 * NFT 风格转盘 Canvas 组件
 * 高端加密货币/NFT 应用风格
 */

'use client'

import { useEffect, useRef, memo } from 'react'
import { FoodOption } from '../types/food-wheel.types'
import {
  drawSegment,
  drawWinningHighlight,
  drawOptionText,
  drawMarker,
} from '../utils/canvas-helpers'
import {
  ParticleOrbit,
  drawMetallicRim,
  drawCenterGem,
  drawHexGrid,
  drawScanlines,
} from '../utils/nft-effects'
import { NFTTheme } from '../config/nft-theme'

interface WheelCanvasNFTProps {
  options: FoodOption[]
  rotation: number
  isSpinning: boolean
  winningIndex: number
  glowIntensity: number
  onCenterClick: () => void
}

/**
 * NFT 风格转盘组件
 */
function WheelCanvasNFT({
  options,
  rotation,
  isSpinning,
  winningIndex,
  glowIntensity,
  onCenterClick,
}: WheelCanvasNFTProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const particleOrbitRef = useRef<ParticleOrbit | null>(null)
  const animationFrameRef = useRef<number>(0)
  const scanlineOffsetRef = useRef<number>(0)

  const SEGMENT_ANGLE = (2 * Math.PI) / options.length

  /**
   * 绘制背景层（静态）
   */
  useEffect(() => {
    const bgCanvas = bgCanvasRef.current
    if (!bgCanvas) return

    const ctx = bgCanvas.getContext('2d')
    if (!ctx) return

    // 绘制六边形网格
    drawHexGrid(ctx, bgCanvas.width, bgCanvas.height)
  }, [])

  /**
   * 初始化粒子轨道
   */
  useEffect(() => {
    if (!particleOrbitRef.current) {
      particleOrbitRef.current = new ParticleOrbit()
    }
  }, [])

  /**
   * 主渲染循环
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    const animate = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // === 1. 绘制扫描线（全息效果） ===
      scanlineOffsetRef.current = (scanlineOffsetRef.current + 0.5) % 10
      drawScanlines(ctx, canvas.width, canvas.height, scanlineOffsetRef.current)

      // === 2. 绘制粒子轨道 ===
      if (particleOrbitRef.current) {
        particleOrbitRef.current.update()
        particleOrbitRef.current.render(ctx, centerX, centerY)
      }

      // === 3. 绘制转盘扇形 ===
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      options.forEach((option, index) => {
        const startAngle = index * SEGMENT_ANGLE - Math.PI / 2
        const endAngle = (index + 1) * SEGMENT_ANGLE - Math.PI / 2
        const isWinner = !isSpinning && winningIndex === index

        drawSegment(ctx, option, startAngle, endAngle, radius)

        if (isWinner) {
          drawWinningHighlight(ctx, startAngle, endAngle, SEGMENT_ANGLE, radius, glowIntensity)
        }
      })

      ctx.restore()

      // === 4. 绘制文字 ===
      ctx.save()
      ctx.translate(centerX, centerY)

      options.forEach((option, index) => {
        const startAngle = index * SEGMENT_ANGLE - Math.PI / 2
        const isWinner = !isSpinning && winningIndex === index
        const midAngle = startAngle + SEGMENT_ANGLE / 2 + rotation

        drawOptionText(ctx, option, midAngle, radius, isWinner)
      })

      ctx.restore()

      // === 5. 绘制金属边框 ===
      drawMetallicRim(ctx, centerX, centerY, radius)

      // === 6. 绘制中心宝石效果 ===
      const pulseIntensity =
        0.7 + 0.3 * Math.sin((Date.now() / NFTTheme.wheel.centerGem.pulse.speed) * Math.PI * 2)
      drawCenterGem(ctx, centerX, centerY, pulseIntensity)

      // === 7. 绘制中心按钮文字 ===
      ctx.save()
      const scale = radius / 270 // 基于原设计半径270
      ctx.font = `bold ${Math.round(24 * scale)}px Arial`
      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = NFTTheme.colors.glow.gold
      ctx.shadowBlur = 10 * scale
      ctx.fillText('🎲', centerX, centerY - 10 * scale)

      ctx.font = `bold ${Math.round(14 * scale)}px Arial`
      ctx.shadowBlur = 6 * scale
      ctx.fillText(isSpinning ? '旋转中' : '开始', centerX, centerY + 15 * scale)
      ctx.restore()

      // === 8. 绘制12点钟标记 ===
      drawMarker(ctx, centerX, radius + 20 * scale)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [rotation, isSpinning, winningIndex, glowIntensity, options, SEGMENT_ANGLE])

  /**
   * 处理点击事件
   */
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || isSpinning) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))

    // 计算缩放后的中心按钮半径（NFT版使用60作为基准）
    const radius = Math.min(centerX, centerY) - 40
    const scale = radius / 230 // 基于原设计半径230
    const centerRadius = 60 * scale

    if (distance <= centerRadius) {
      onCenterClick()
    }
  }

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      {/* 背景 Canvas（六边形网格） */}
      <canvas
        ref={bgCanvasRef}
        width={400}
        height={400}
        className="absolute inset-0 opacity-20"
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* 转盘容器 - NFT 风格玻璃态 */}
      <div
        className="relative aspect-square rounded-full"
        style={{
          width: 'min(70vmin, 300px)',
          height: 'min(70vmin, 300px)',
          background: NFTTheme.backgrounds.card.glass,
          backdropFilter: 'blur(15px) saturate(120%)',
          WebkitBackdropFilter: 'blur(15px) saturate(120%)',
          border: '2px solid rgba(218, 165, 32, 0.3)',
          boxShadow:
            '0 0 40px rgba(218, 165, 32, 0.3), 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(138, 43, 226, 0.1)',
          transform: isSpinning ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
        onMouseEnter={(e) => {
          if (!isSpinning) {
            e.currentTarget.style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSpinning) {
            e.currentTarget.style.transform = 'scale(1)'
          }
        }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative z-10 cursor-pointer"
          style={{
            width: '100%',
            height: '100%',
            filter: isSpinning ? 'brightness(1.3) saturate(1.4)' : 'brightness(1.1)',
            transition: 'filter 0.3s ease',
          }}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  )
}

export default memo(WheelCanvasNFT)

'use client'

import { useEffect, useRef, useState } from 'react'

type FoodOption = {
  id: number
  name: string
  color: string
  emoji: string
}

const FOOD_OPTIONS: FoodOption[] = [
  { id: 1, name: '西部马华', color: '#FF6B6B', emoji: '🍜' },
  { id: 2, name: '地下美食', color: '#4ECDC4', emoji: '🍱' },
  { id: 3, name: '煲仔饭', color: '#45B7D1', emoji: '🍲' },
  { id: 4, name: '晋来顺', color: '#FFA07A', emoji: '🥘' },
  { id: 5, name: '陕一哥', color: '#98D8C8', emoji: '🍝' },
  { id: 6, name: '十街', color: '#F7B731', emoji: '🍛' },
  { id: 7, name: '品渡', color: '#5F27CD', emoji: '🍣' },
  { id: 8, name: '冒菜', color: '#00D2D3', emoji: '🥗' },
]

const SEGMENT_ANGLE = (2 * Math.PI) / FOOD_OPTIONS.length

export default function FoodWheelPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedOption, setSelectedOption] = useState<FoodOption | null>(null)
  const [winningIndex, setWinningIndex] = useState<number>(-1)
  const [glowIntensity, setGlowIntensity] = useState(1)
  const animationFrameRef = useRef<number>()
  const glowAnimationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(0)
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    color: string
    size: number
    life: number
  }>>([])

  // 绘制转盘
  const drawWheel = (ctx: CanvasRenderingContext2D, angle: number, spinning: boolean = false) => {
    const canvas = ctx.canvas
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制扇形区域（旋转的部分）
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle)

    FOOD_OPTIONS.forEach((option, index) => {
      const startAngle = index * SEGMENT_ANGLE - Math.PI / 2
      const endAngle = (index + 1) * SEGMENT_ANGLE - Math.PI / 2
      const isWinner = !spinning && winningIndex === index

      // 绘制扇形
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = option.color
      ctx.fill()

      // 如果是中奖扇形，添加超级明显的高亮效果
      if (isWinner) {
        ctx.save()

        const glow = glowIntensity

        // 1. 绘制外层超级发光边框（多层，带脉冲效果）
        for (let i = 3; i >= 1; i--) {
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.arc(0, 0, radius + i * 4, startAngle, endAngle)
          ctx.closePath()
          ctx.strokeStyle = i === 3 ? '#FF0000' : i === 2 ? '#FFFF00' : '#FFFFFF'
          ctx.lineWidth = 10
          ctx.shadowColor = i === 3 ? '#FF0000' : i === 2 ? '#FFFF00' : '#FFFFFF'
          ctx.shadowBlur = 40 * glow
          ctx.globalAlpha = 0.8 * glow
          ctx.stroke()
        }

        ctx.globalAlpha = 1

        // 2. 超亮白色覆盖层（带脉冲）
        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.3 * glow})`
        ctx.fill()

        // 3. 内部发光线条（从中心放射）
        for (let i = 0; i < 8; i++) {
          const lineAngle = startAngle + (SEGMENT_ANGLE * (i + 0.5)) / 8
          ctx.beginPath()
          ctx.moveTo(radius * 0.2 * Math.cos(lineAngle), radius * 0.2 * Math.sin(lineAngle))
          ctx.lineTo(Math.cos(lineAngle) * radius, Math.sin(lineAngle) * radius)
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * glow})`
          ctx.lineWidth = 4
          ctx.shadowColor = '#FFFF00'
          ctx.shadowBlur = 15 * glow
          ctx.stroke()
        }

        // 4. 超粗白色边框
        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 12
        ctx.shadowColor = '#FFFFFF'
        ctx.shadowBlur = 20
        ctx.stroke()

        // 5. 绘制超大的"中奖"标记（也保持水平）
        ctx.shadowBlur = 0
        ctx.restore()
      }

      // 绘制边框线
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    ctx.restore()

    // 绘制文字和 emoji（不旋转,始终保持水平）
    ctx.save()
    ctx.translate(centerX, centerY)

    FOOD_OPTIONS.forEach((option, index) => {
      const startAngle = index * SEGMENT_ANGLE - Math.PI / 2
      const isWinner = !spinning && winningIndex === index

      // 计算实际角度（包含转盘旋转）
      const midAngle = startAngle + SEGMENT_ANGLE / 2 + angle

      // 计算文字在转盘上的位置
      const textRadius = radius * 0.65
      const textX = textRadius * Math.cos(midAngle)
      const textY = textRadius * Math.sin(midAngle)

      // 绘制 emoji - 保持水平
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(option.emoji, textX, textY)

      // 绘制文字 - 保持水平
      ctx.font = 'bold 14px Arial'
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 2
      ctx.fillText(option.name, textX, textY + 30)

      // 如果是中奖项，绘制"中奖!"标记（水平）
      if (isWinner) {
        const markerRadius = radius * 0.4
        const markerX = markerRadius * Math.cos(midAngle)
        const markerY = markerRadius * Math.sin(midAngle)

        ctx.font = 'bold 28px Arial'
        ctx.fillStyle = '#FFFFFF'
        ctx.strokeStyle = '#FF0000'
        ctx.lineWidth = 3
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = '#000000'
        ctx.shadowBlur = 8
        ctx.strokeText('中奖!', markerX, markerY)
        ctx.fillText('中奖!', markerX, markerY)
        ctx.shadowBlur = 0
      }
    })

    ctx.restore()

    // 绘制外圈金属边框
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2)
    ctx.strokeStyle = '#4a4a4a'
    ctx.lineWidth = 20
    ctx.stroke()

    // 绘制内圈金边
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 6
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)'
    ctx.shadowBlur = 15
    ctx.stroke()
    ctx.shadowBlur = 0

    // 绘制中心按钮
    const centerRadius = 50

    // 外层发光圈
    if (!spinning) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, centerRadius + 5, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)'
      ctx.lineWidth = 3
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
      ctx.shadowBlur = 20
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // 渐变背景
    const gradient = ctx.createRadialGradient(
      centerX - 15,
      centerY - 15,
      0,
      centerX,
      centerY,
      centerRadius
    )
    gradient.addColorStop(0, '#FFD700')
    gradient.addColorStop(0.6, '#FFA500')
    gradient.addColorStop(1, '#FF8C00')

    ctx.beginPath()
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // 立体边框
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 4
    ctx.stroke()

    // 内阴影效果
    ctx.beginPath()
    ctx.arc(centerX, centerY, centerRadius - 3, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.lineWidth = 2
    ctx.stroke()

    // 绘制中心文字
    ctx.font = 'bold 18px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 4
    ctx.fillText('START', centerX, centerY - 5)

    ctx.font = 'bold 12px Arial'
    ctx.fillText('点击开始', centerX, centerY + 12)
    ctx.shadowBlur = 0
  }

  // 绘制12点钟位置标记
  const drawMarker = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas
    const centerX = canvas.width / 2
    const radius = Math.min(centerX, canvas.height / 2) - 20

    ctx.save()

    // 在转盘顶部画一个标记线
    const markerY = centerX - radius - 5

    // 绘制发光的标记线
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.shadowColor = '#FFD700'
    ctx.shadowBlur = 20

    ctx.beginPath()
    ctx.moveTo(centerX - 30, markerY)
    ctx.lineTo(centerX + 30, markerY)
    ctx.stroke()

    // 绘制白色内线
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(centerX - 30, markerY)
    ctx.lineTo(centerX + 30, markerY)
    ctx.stroke()

    // 绘制中心圆点
    ctx.shadowColor = '#FF0000'
    ctx.shadowBlur = 15
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.arc(centerX, markerY, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, markerY, 6, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / durationRef.current, 1)

      // 缓动函数（ease-out）
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentAngle = currentRotation + (targetRotation - currentRotation) * easeOut

      drawWheel(ctx, currentAngle, true)
      drawMarker(ctx)

      if (progress < 1 && isSpinning) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else if (isSpinning) {
        setIsSpinning(false)
        setCurrentRotation(targetRotation)

        // 计算中奖项 - 12点钟方向（顶部中间）对应的扇形
        const normalizedRotation = targetRotation % (Math.PI * 2)
        // 12点钟方向是 -Math.PI/2（或 3*Math.PI/2）
        const pointerAngle = -Math.PI / 2
        // 计算指针相对于转盘的角度
        const relativeAngle = (pointerAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2)
        const calculatedIndex = Math.floor(relativeAngle / SEGMENT_ANGLE) % FOOD_OPTIONS.length
        const winner = FOOD_OPTIONS[calculatedIndex]

        setWinningIndex(calculatedIndex)
        setResult(winner.name)
        setSelectedOption(winner)
        setShowConfetti(true)
        createConfetti(winner.color)

        setTimeout(() => setShowConfetti(false), 3000)
      }
    }

    if (isSpinning) {
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      drawWheel(ctx, currentRotation, false)
      drawMarker(ctx)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isSpinning, currentRotation, targetRotation, winningIndex, glowIntensity])

  // 中奖扇形的脉冲发光动画
  useEffect(() => {
    if (winningIndex === -1) return

    let startTime = 0
    const animateGlow = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // 使用正弦波创建脉冲效果
      const intensity = 0.6 + 0.4 * Math.sin((elapsed / 300) * Math.PI)
      setGlowIntensity(intensity)

      glowAnimationRef.current = requestAnimationFrame(animateGlow)
    }

    glowAnimationRef.current = requestAnimationFrame(animateGlow)

    return () => {
      if (glowAnimationRef.current) {
        cancelAnimationFrame(glowAnimationRef.current)
      }
    }
  }, [winningIndex])

  // 粒子效果
  const createConfetti = (color: string) => {
    const canvas = confettiCanvasRef.current
    if (!canvas) return

    const particles: typeof particlesRef.current = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60
      const velocity = 4 + Math.random() * 6
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        size: 3 + Math.random() * 5,
        life: 1,
      })
    }

    particlesRef.current = particles
  }

  useEffect(() => {
    const canvas = confettiCanvasRef.current
    if (!canvas || particlesRef.current.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3,
          life: p.life - 0.01,
        }))
        .filter(p => p.life > 0)

      particlesRef.current.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1

      if (particlesRef.current.length > 0) {
        animationId = requestAnimationFrame(animateParticles)
      }
    }

    animationId = requestAnimationFrame(animateParticles)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [showConfetti])

  const handleSpin = () => {
    if (isSpinning) return

    const randomIndex = Math.floor(Math.random() * FOOD_OPTIONS.length)
    const targetAngle = randomIndex * SEGMENT_ANGLE
    const extraSpins = (Math.floor(Math.random() * 3) + 8) * Math.PI * 2
    const duration = 4000 + Math.floor(Math.random() * 1000)

    setResult(null)
    setShowConfetti(false)
    setSelectedOption(null)
    setWinningIndex(-1)
    setTargetRotation(currentRotation + extraSpins + targetAngle)
    durationRef.current = duration
    startTimeRef.current = 0
    setIsSpinning(true)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes neon-pulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.8),
                         0 0 20px rgba(255, 215, 0, 0.6),
                         0 0 30px rgba(255, 215, 0, 0.4);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 215, 0, 1),
                         0 0 40px rgba(255, 215, 0, 0.8),
                         0 0 60px rgba(255, 215, 0, 0.6);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .neon-text {
          animation: neon-pulse 2s ease-in-out infinite;
        }

        body {
          overflow-x: hidden;
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 动态背景 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-8">
          {/* 标题 */}
          <header className="text-center flex flex-col items-center gap-3 float-animation">
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 neon-text">
                美食幸运转盘
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 blur-2xl opacity-30 -z-10"></div>
            </div>
            <p className="text-base text-gray-300 max-w-xl">
              🎯 今天吃什么？转动幸运转盘，让它来决定！
            </p>
          </header>

          {/* 主要内容 */}
          <div className="grid w-full gap-10 lg:grid-cols-[1fr_auto] items-start justify-items-center">
            {/* 转盘区域 */}
            <div className="relative flex items-center justify-center w-full lg:justify-end">
              <div className="relative">
                {/* 粒子画布 */}
                <canvas
                  ref={confettiCanvasRef}
                  width={500}
                  height={500}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                />

                {/* 转盘画布 */}
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={500}
                  className="relative z-10 drop-shadow-2xl cursor-pointer"
                  onClick={(e) => {
                    // 检测点击是否在中心圆内
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

                    // 如果点击在中心圆内（半径50）
                    if (distance <= 50) {
                      handleSpin()
                    }
                  }}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vw',
                    width: '500px',
                    height: '500px'
                  }}
                />
              </div>
            </div>

            {/* 控制面板 */}
            <div className="flex flex-col items-center lg:items-start gap-5 w-full lg:w-auto lg:min-w-[320px]">
              {/* 结果显示 */}
              <div className="w-full rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl p-5 shadow-xl">
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3">
                    🎁 抽奖结果
                  </p>

                  {selectedOption && showConfetti ? (
                    <div className="space-y-2 text-center">
                      <div className="text-6xl">{selectedOption.emoji}</div>
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
                        {selectedOption.name}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <span>🎉</span>
                        <span className="text-yellow-300 font-bold">恭喜中奖！</span>
                        <span>🎉</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center">
                      <div className="text-2xl font-bold text-white">
                        {isSpinning ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="animate-spin text-3xl">🎰</span>
                            <span>转盘旋转中...</span>
                          </span>
                        ) : result ? (
                          result
                        ) : (
                          '准备开始'
                        )}
                      </div>
                      <p className="text-sm text-gray-300">
                        {isSpinning ? '命运之轮正在转动...' : result ? '就决定是它了！' : '点击按钮开始抽奖'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 抽奖按钮 */}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-[2px] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="relative rounded-lg bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 px-8 py-3 transition-all duration-300 group-hover:from-orange-500 group-hover:via-red-500 group-hover:to-pink-500">
                  <div className="flex items-center justify-center gap-2 text-lg font-bold text-white">
                    {isSpinning ? (
                      <>
                        <span className="animate-spin">⚡</span>
                        <span>转动中...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🎲</span>
                        <span>{result ? '再转一次' : '开始转动'}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              {/* 美食列表 */}
              <div className="w-full rounded-xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl p-4 shadow-lg">
                <h2 className="text-xs font-bold uppercase tracking-wider text-orange-300 mb-3 flex items-center gap-1">
                  <span>🍽️</span>
                  <span>美食候选</span>
                </h2>
                <ul className="grid grid-cols-2 gap-2">
                  {FOOD_OPTIONS.map(option => (
                    <li
                      key={option.id}
                      className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm px-2 py-2 transition-all duration-300 hover:scale-105 hover:from-white/20 hover:to-white/10 border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{option.emoji}</span>
                        <span className="text-xs font-medium text-white truncate">{option.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

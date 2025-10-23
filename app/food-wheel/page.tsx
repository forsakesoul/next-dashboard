'use client'

import { useEffect, useRef, useState } from 'react'
import foodOptionsData from './food-options.json'

type FoodOption = {
  id: number
  name: string
  color: string
  emoji: string
}

const FOOD_OPTIONS: FoodOption[] = foodOptionsData

const SEGMENT_ANGLE = (2 * Math.PI) / FOOD_OPTIONS.length

export default function FoodWheelPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
        // 确保索引在有效范围内
        let calculatedIndex = Math.floor(relativeAngle / SEGMENT_ANGLE)
        calculatedIndex = ((calculatedIndex % FOOD_OPTIONS.length) + FOOD_OPTIONS.length) % FOOD_OPTIONS.length

        const winner = FOOD_OPTIONS[calculatedIndex]

        // 确保 winner 存在
        if (winner) {
          setWinningIndex(calculatedIndex)
          setResult(winner.name)
          setSelectedOption(winner)
          setShowConfetti(true)

          setTimeout(() => setShowConfetti(false), 3000)
        } else {
          console.error('Invalid winner index:', calculatedIndex)
          // 如果出错，默认选择第一个选项
          const fallbackWinner = FOOD_OPTIONS[0]
          setWinningIndex(0)
          setResult(fallbackWinner.name)
          setSelectedOption(fallbackWinner)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
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
          <div className="flex flex-col lg:flex-row w-full gap-8 items-center lg:items-start justify-center">
            {/* 转盘区域 */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <div className="relative w-[350px] h-[350px] max-w-[80vw] max-h-[80vw]">
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
                />
              </div>
            </div>

            {/* 控制面板 */}
            <div className="flex flex-col gap-4 w-full lg:w-[380px] flex-shrink-0">
              {/* 结果显示卡片 - 科技风格 */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 p-6 overflow-hidden">
                {/* 科技感背景网格 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {/* 顶部霓虹装饰线 */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

                <div className="relative z-10 text-center">
                  {selectedOption && showConfetti ? (
                    <div className="space-y-4">
                      <div className="text-7xl animate-bounce drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                        {selectedOption.emoji}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3 drop-shadow-lg">
                          {selectedOption.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full text-white font-bold text-sm shadow-lg shadow-green-500/50 animate-pulse">
                          <span className="text-base">✓</span>
                          <span>WINNER!</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[200px] flex flex-col items-center justify-center space-y-4">
                      {isSpinning ? (
                        <>
                          <div className="relative">
                            <div className="w-16 h-16 border-4 border-cyan-900/30 border-t-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/50"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-2xl filter drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                              ⚡
                            </div>
                          </div>
                          <p className="text-lg font-bold text-cyan-300 tracking-wider uppercase">
                            Processing...
                          </p>
                        </>
                      ) : result ? (
                        <>
                          <div className="text-6xl drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">🎯</div>
                          <div>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
                              {result}
                            </p>
                            <p className="text-sm text-cyan-300 font-medium">
                              SELECTED
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-6xl mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">🎰</div>
                          <div>
                            <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">
                              今天吃什么？
                            </p>
                            <p className="text-sm text-cyan-300/80 font-medium tracking-wide">
                              CLICK TO START
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* 底部霓虹装饰线 */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              </div>

              {/* 抽奖按钮 - 霓虹科技风 */}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[2px] shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {/* 动态光晕效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg px-6 py-4">
                  <div className="flex items-center justify-center gap-3 text-lg font-black">
                    {isSpinning ? (
                      <>
                        <span className="animate-spin text-cyan-400 text-2xl drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">⚡</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
                          ROLLING
                        </span>
                        <span className="animate-spin text-pink-400 text-2xl drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" style={{ animationDirection: 'reverse' }}>⚡</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">🎲</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 tracking-wider">
                          {result ? 'SPIN AGAIN' : 'START GAME'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              {/* 美食列表 - 科技卡片风格 */}
              <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-500/30 p-4 overflow-hidden">
                {/* 背景网格 */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(indigo 1px, transparent 1px), linear-gradient(90deg, indigo 1px, transparent 1px)',
                    backgroundSize: '15px 15px'
                  }}></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xl drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">🍽️</span>
                      <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-wider uppercase">
                        Options
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-full">
                      {FOOD_OPTIONS.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {FOOD_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className={`
                          relative rounded-lg p-2.5 transition-all duration-300 border
                          ${selectedOption?.id === option.id && showConfetti
                            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400 shadow-lg shadow-yellow-500/50 scale-105 animate-pulse'
                            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/70 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xl transition-transform duration-300 ${selectedOption?.id === option.id && showConfetti ? 'scale-125 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]' : ''}`}>
                            {option.emoji}
                          </span>
                          <span className={`text-xs font-bold truncate ${selectedOption?.id === option.id && showConfetti ? 'text-yellow-300' : 'text-slate-300'}`}>
                            {option.name}
                          </span>
                        </div>

                        {selectedOption?.id === option.id && showConfetti && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce">
                            <span className="text-white text-xs font-black">✓</span>
                          </div>
                        )}

                        {/* 悬停发光效果 */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

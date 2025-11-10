/**
 * PC端美食转盘主页面
 * 专为桌面端优化的商务专业风格
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import foodOptionsConfig from '../food-wheel/food-options.json'
import { useWheelAnimation } from '../food-wheel/hooks/useWheelAnimation'
import { useWeightedSpin } from '../food-wheel/hooks/useWeightedSpin'
import { useGlowEffect } from '../food-wheel/hooks/useGlowEffect'
import { PCTheme } from '../food-wheel/config/pc-theme'
import WheelCanvasPC from './components/WheelCanvasPC'
import PCResultModal from './components/PCResultModal'
import PCStatsPanel from './components/PCStatsPanel'
import { saveSpinRecord } from './utils/storage'
import { inter, spaceGrotesk, fontSize, fontWeight } from './config/fonts'

export default function PCFoodWheelPage() {
  const options = foodOptionsConfig.options
  const [showResultModal, setShowResultModal] = useState(false)

  // 使用现有的动画和加权随机Hooks
  const animation = useWheelAnimation({
    segmentCount: options.length,
    onResultReady: (winningIndex) => {
      const winner = options[winningIndex]
      weightedSpin.setSelectedOption(winner)
      weightedSpin.setResult(winner.name)

      // 保存抽奖记录
      saveSpinRecord({
        foodId: winner.id,
        foodName: winner.name,
        emoji: winner.emoji,
      })
    },
    onAnimationComplete: () => {
      // 动画完成后显示结果弹窗
      setShowResultModal(true)
    },
  })

  const weightedSpin = useWeightedSpin(options)
  const glowIntensity = useGlowEffect(animation.winningIndex)

  // 处理抽奖
  const handleSpin = useCallback(() => {
    if (animation.isSpinning) return

    // 重置状态
    weightedSpin.reset()
    setShowResultModal(false)

    // 执行加权随机选择
    const { index } = weightedSpin.spin()
    console.log('🎯 Target index:', index)

    // 启动动画
    animation.startSpin(index)
  }, [animation, weightedSpin])

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !animation.isSpinning) {
        e.preventDefault()
        handleSpin()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [animation.isSpinning, handleSpin])

  return (
    <div className={`min-h-screen relative overflow-hidden ${inter.variable} ${spaceGrotesk.variable}`}>
      {/* 动态渐变背景 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: PCTheme.background.gradient,
        }}
      />

      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: PCTheme.background.overlay,
        }}
      />

      {/* 动态光斑 */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)',
            animationDuration: '3s',
          }}
        />
        <div
          className="absolute top-40 right-40 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%)',
            animationDuration: '4s',
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.3) 0%, transparent 70%)',
            animationDuration: '5s',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Header */}
      <header
        className="relative z-10 border-b"
        style={{
          height: PCTheme.spacing.headerHeight,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          background: PCTheme.surface.glass.background,
          backdropFilter: PCTheme.surface.glass.backdropFilter,
        }}
      >
        <div className="container mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1
              className="text-3xl font-black bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                textShadow: '0 0 40px rgba(102, 126, 234, 0.5)',
              }}
            >
              🎯 美食决策助手
            </h1>
            <span
              className="px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                boxShadow: PCTheme.shadows.glow.blue,
              }}
            >
              PC专业版
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/food-wheel"
              className="text-sm font-medium hover:text-white transition-all duration-300 flex items-center gap-2"
              style={{ color: PCTheme.text.secondary }}
            >
              <span>←</span>
              <span>经典版</span>
            </Link>
            <Link
              href="/food-wheel/nft"
              className="text-sm font-medium hover:text-white transition-all duration-300 flex items-center gap-2"
              style={{ color: PCTheme.text.secondary }}
            >
              <span>💎</span>
              <span>NFT豪华版</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="relative z-10 container mx-auto px-8"
        style={{
          paddingTop: PCTheme.spacing.sectionGap,
          paddingBottom: PCTheme.spacing.sectionGap,
        }}
      >
        <div className="flex gap-6">
          {/* 左侧：转盘区域 - 更紧凑 */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            <div className="text-center">
              {/* 转盘组件 */}
              <WheelCanvasPC
                options={options}
                rotation={animation.currentRotation}
                isSpinning={animation.isSpinning}
                winningIndex={animation.winningIndex}
                glowIntensity={glowIntensity}
                onCenterClick={handleSpin}
              />

              {/* 提示文字 */}
              <p
                className="mt-4 text-sm"
                style={{ color: PCTheme.text.tertiary }}
              >
                点击中心按钮或右侧"开始抽奖"按钮
              </p>

              {/* 快捷键提示 */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <kbd
                  className="px-2.5 py-1 rounded text-xs font-mono"
                  style={{
                    background: PCTheme.surface.card,
                    border: PCTheme.surface.glass.border,
                    color: PCTheme.text.secondary,
                  }}
                >
                  Space
                </kbd>
                <span className="text-xs" style={{ color: PCTheme.text.muted }}>快捷键启动</span>
              </div>
            </div>
          </div>

          {/* 右侧：控制面板 - 扩展宽度以平衡布局 */}
          <aside className="flex-1 space-y-6 max-w-[600px]">
            {/* 结果卡片 - 优化版 */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group"
              style={{
                background: PCTheme.surface.glass.background,
                backdropFilter: 'blur(20px) saturate(180%)', // 优化：30px → 20px
                border: PCTheme.surface.glass.border,
                boxShadow: PCTheme.shadows.lg,
              }}
            >
              {/* 装饰性渐变 - 优化：动态定位 */}
              <div
                className="absolute right-0 w-32 h-32 rounded-full blur-3xl opacity-30 transition-all duration-500"
                style={{
                  top: weightedSpin.result ? '-40px' : '0', // 中奖时上移，避免遮挡
                  background: 'linear-gradient(135deg, #667eea 0%, #f093fb 50%, #00f2fe 100%)', // 3色渐变
                }}
              />

              <h3
                className="relative z-10 flex items-center gap-2 mb-4 transition-all duration-300 group-hover:translate-x-1"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: fontSize.subheading, // 18px
                  fontWeight: fontWeight.bold, // 700
                  color: '#FFD700', // 金色
                  letterSpacing: '-0.01em',
                  textShadow: '0 2px 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.4)',
                }}
              >
                <span className="text-xl">🎁</span>
                <span>抽奖结果</span>
              </h3>

              {weightedSpin.result ? (
                <div className="text-center py-8 relative z-10">
                  <div
                    className="text-7xl mb-4 animate-bounce"
                    style={{ animationDuration: '1s', animationIterationCount: '3' }}
                  >
                    {weightedSpin.selectedOption?.emoji}
                  </div>
                  <h2
                    className="bg-clip-text text-transparent"
                    style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontSize: fontSize.display, // 48px (从36px提升)
                      fontWeight: fontWeight.bold, // 700
                      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #f093fb 50%, #00f2fe 100%)', // 3色渐变
                      textShadow: `
                        0 0 30px rgba(102, 126, 234, 0.6),
                        0 0 60px rgba(240, 147, 251, 0.4),
                        0 0 80px rgba(0, 242, 254, 0.3),
                        0 2px 20px rgba(0, 0, 0, 0.3)
                      `, // 4层发光
                      letterSpacing: '-0.02em',
                      lineHeight: '1.2',
                    }}
                  >
                    {weightedSpin.result}
                  </h2>
                </div>
              ) : (
                <div className="text-center py-12 relative z-10">
                  <div
                    className="text-5xl mb-4 opacity-30 animate-pulse"
                    style={{ animationDuration: '2s' }}
                  >
                    🎲
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: fontSize.body, // 16px
                      fontWeight: fontWeight.semibold, // 600
                      color: '#00D4FF', // 青蓝色
                      letterSpacing: '0.01em',
                      textShadow: '0 2px 10px rgba(0, 212, 255, 0.6), 0 0 20px rgba(0, 212, 255, 0.4)',
                    }}
                  >
                    等待抽奖...
                  </p>
                </div>
              )}
            </div>

            {/* 操作按钮 - 优化版 */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: PCTheme.surface.glass.background,
                backdropFilter: 'blur(20px) saturate(180%)', // 优化：30px → 20px
                border: PCTheme.surface.glass.border,
                boxShadow: PCTheme.shadows.lg,
              }}
            >
              <button
                onClick={handleSpin}
                disabled={animation.isSpinning}
                className="w-full h-16 rounded-xl transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: animation.isSpinning
                    ? 'linear-gradient(135deg, rgba(100, 116, 139, 0.8) 0%, rgba(71, 85, 105, 0.8) 100%)' // 半透明保持品牌色
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', // 3色渐变
                  color: '#ffffff',
                  cursor: animation.isSpinning ? 'not-allowed' : 'pointer',
                  boxShadow: animation.isSpinning
                    ? 'none'
                    : PCTheme.shadows.glow.blue,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: fontSize.body, // 16px
                  fontWeight: fontWeight.bold, // 700
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => {
                  if (!animation.isSpinning) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                    e.currentTarget.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.8)' // 悬停文字发光
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.textShadow = 'none'
                }}
              >
                {/* 按钮发光效果 */}
                {!animation.isSpinning && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
                  />
                )}

                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-2xl">
                    {animation.isSpinning ? '⟳' : '🎲'}
                  </span>
                  <span>
                    {animation.isSpinning ? '抽奖中...' : '开始抽奖'}
                  </span>
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <kbd
                  className="px-3 py-1.5 rounded-lg font-mono transition-all duration-200 hover:scale-105"
                  style={{
                    background: PCTheme.surface.card,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: fontSize.caption, // 14px
                    fontWeight: fontWeight.medium, // 500
                    color: 'rgba(255, 255, 255, 0.9)', // 优化对比度：5.0:1
                  }}
                >
                  Space
                </kbd>
                <span
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: fontSize.caption, // 14px
                    fontWeight: fontWeight.medium, // 500
                    color: '#FF6B9D', // 粉红色
                    letterSpacing: '0.01em',
                    textShadow: '0 1px 8px rgba(255, 107, 157, 0.5), 0 0 15px rgba(255, 107, 157, 0.3)',
                  }}
                >
                  快捷键启动
                </span>
              </div>
            </div>

            {/* 美食列表 - 优化版 */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden group"
              style={{
                background: PCTheme.surface.glass.background,
                backdropFilter: 'blur(20px) saturate(180%)', // 优化：30px → 20px
                border: PCTheme.surface.glass.border,
                boxShadow: PCTheme.shadows.lg,
              }}
            >
              <h3
                className="flex items-center gap-2 mb-4 transition-all duration-300 group-hover:translate-x-1"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: fontSize.subheading, // 18px (从14px提升)
                  fontWeight: fontWeight.bold, // 700 提升字重
                  color: '#00D4FF', // 青蓝色，高对比度
                  letterSpacing: '-0.01em',
                  textShadow: '0 2px 10px rgba(0, 212, 255, 0.6), 0 0 20px rgba(0, 212, 255, 0.4)', // 发光效果
                }}
              >
                <span className="text-xl">🍽️</span>
                <span>美食选项</span>
                <span
                  className="ml-auto px-2 py-0.5 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(102, 126, 234, 0.35)', // 进一步提升可见度
                    fontSize: fontSize.micro, // 12px
                    fontWeight: fontWeight.bold, // 700 提升字重
                    color: '#A0B4FF', // 更亮的蓝色
                    border: '1px solid rgba(160, 180, 255, 0.5)',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {options.length}
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {options.map((option) => {
                  const isSelected = weightedSpin.selectedOption?.id === option.id
                  return (
                    <div
                      key={option.id}
                      className="rounded-xl p-3 transition-all duration-300 hover:scale-105 relative"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff8a00 100%)' // 3色渐变
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected
                          ? `2px solid #f093fb`
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isSelected
                          ? `${PCTheme.shadows.glow.amber}, 0 0 20px rgba(240, 147, 251, 0.4)` // 多重发光
                          : PCTheme.shadows.sm,
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className="text-3xl transition-transform duration-300"
                          style={{
                            filter: isSelected
                              ? 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 30px rgba(240, 147, 251, 0.5))'
                              : 'none',
                          }}
                        >
                          {option.emoji}
                        </span>
                        <span
                          className="text-center"
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: fontSize.caption, // 14px
                            fontWeight: isSelected ? fontWeight.bold : fontWeight.semibold, // 700 / 600
                            color: isSelected
                              ? '#FFD700' // 金色，高对比度
                              : '#00D4FF', // 青蓝色，高对比度
                            textShadow: isSelected
                              ? '0 2px 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.4)' // 金色发光
                              : '0 1px 8px rgba(0, 212, 255, 0.5), 0 0 15px rgba(0, 212, 255, 0.3)', // 青蓝色发光
                            letterSpacing: '0.01em',
                          }}
                        >
                          {option.name}
                        </span>
                      </div>

                      {/* 中奖标记 - 优化版：多重标识 */}
                      {isSelected && (
                        <div
                          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center animate-bounce"
                          style={{
                            background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 15px rgba(240, 147, 251, 0.6)',
                            border: '2px solid rgba(240, 147, 251, 0.8)',
                            animation: 'bounce 1s ease-in-out infinite, pulse 2s ease-in-out infinite',
                          }}
                        >
                          <span
                            style={{
                              fontSize: fontSize.micro, // 12px
                              fontWeight: fontWeight.bold, // 700
                              color: '#f093fb',
                            }}
                          >
                            ✓
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* 自定义滚动条样式 */}
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(255, 255, 255, 0.05);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(102, 126, 234, 0.5);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(102, 126, 234, 0.8);
                }
              `}</style>
            </div>

            {/* 统计面板 */}
            <PCStatsPanel />
          </aside>
        </div>
      </main>

      {/* 结果弹窗 */}
      <PCResultModal
        show={showResultModal}
        winner={weightedSpin.selectedOption}
        onClose={() => setShowResultModal(false)}
        onReplay={handleSpin}
      />
    </div>
  )
}

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
    <div className="min-h-screen relative overflow-hidden">
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
        <div className="flex gap-8">
          {/* 左侧：转盘区域 (60%) */}
          <div className="flex-1 flex flex-col items-center justify-center">
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
                className="mt-6 text-base"
                style={{ color: PCTheme.text.tertiary }}
              >
                点击中心按钮或右侧"开始抽奖"按钮
              </p>

              {/* 快捷键提示 */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <kbd
                  className="px-3 py-1.5 rounded text-sm font-mono"
                  style={{
                    background: PCTheme.surface.card,
                    border: PCTheme.surface.glass.border,
                    color: PCTheme.text.secondary,
                  }}
                >
                  Space
                </kbd>
                <span style={{ color: PCTheme.text.muted }}>快捷键启动</span>
              </div>
            </div>
          </div>

          {/* 右侧：控制面板 (40%) */}
          <aside className="w-[480px] space-y-6">
            {/* 结果卡片 */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: PCTheme.surface.glass.background,
                backdropFilter: PCTheme.surface.glass.backdropFilter,
                border: PCTheme.surface.glass.border,
                boxShadow: PCTheme.shadows.lg,
              }}
            >
              {/* 装饰性渐变 */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                }}
              />

              <h3
                className="text-sm font-bold mb-4 relative z-10 flex items-center gap-2"
                style={{ color: PCTheme.text.secondary }}
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
                    className="text-4xl font-black bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                      textShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
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
                  <p style={{ color: PCTheme.text.muted }}>
                    等待抽奖...
                  </p>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: PCTheme.surface.glass.background,
                backdropFilter: PCTheme.surface.glass.backdropFilter,
                border: PCTheme.surface.glass.border,
                boxShadow: PCTheme.shadows.lg,
              }}
            >
              <button
                onClick={handleSpin}
                disabled={animation.isSpinning}
                className="w-full h-16 rounded-xl text-lg font-black transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: animation.isSpinning
                    ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  cursor: animation.isSpinning ? 'not-allowed' : 'pointer',
                  boxShadow: animation.isSpinning
                    ? 'none'
                    : PCTheme.shadows.glow.blue,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!animation.isSpinning) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
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
                  className="px-3 py-1.5 rounded-lg text-xs font-mono"
                  style={{
                    background: PCTheme.surface.card,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: PCTheme.text.secondary,
                  }}
                >
                  Space
                </kbd>
                <span
                  className="text-sm"
                  style={{ color: PCTheme.text.muted }}
                >
                  快捷键启动
                </span>
              </div>
            </div>

            {/* 美食列表 */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: PCTheme.surface.glass.background,
                backdropFilter: PCTheme.surface.glass.backdropFilter,
                border: PCTheme.surface.glass.border,
                boxShadow: PCTheme.shadows.lg,
              }}
            >
              <h3
                className="text-sm font-bold mb-4 flex items-center gap-2"
                style={{ color: PCTheme.text.secondary }}
              >
                <span className="text-xl">🍽️</span>
                <span>美食选项</span>
                <span
                  className="ml-auto px-2 py-0.5 rounded-full text-xs"
                  style={{
                    background: 'rgba(102, 126, 234, 0.2)',
                    color: PCTheme.accent.primary,
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
                      className="rounded-xl p-3 transition-all duration-300 hover:scale-105"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected
                          ? `2px solid #f093fb`
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isSelected
                          ? PCTheme.shadows.glow.amber
                          : PCTheme.shadows.sm,
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className="text-3xl transition-transform duration-300"
                          style={{
                            filter: isSelected ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' : 'none',
                          }}
                        >
                          {option.emoji}
                        </span>
                        <span
                          className="text-sm font-bold text-center"
                          style={{
                            color: isSelected
                              ? '#ffffff'
                              : PCTheme.text.secondary,
                            textShadow: isSelected ? '0 2px 10px rgba(0, 0, 0, 0.3)' : 'none',
                          }}
                        >
                          {option.name}
                        </span>
                      </div>

                      {/* 中奖标记 */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center animate-bounce">
                          <span className="text-xs">✓</span>
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

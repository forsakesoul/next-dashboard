/**
 * 美食转盘主页面
 * 基于加权随机算法的抽奖系统
 */

'use client'

import { useState, useCallback } from 'react'
import foodOptionsConfig from './food-options.json'
import WheelCanvas from './components/WheelCanvas'
import ControlPanel from './components/ControlPanel'
import Confetti from './components/Confetti'
import { useWheelAnimation } from './hooks/useWheelAnimation'
import { useWeightedSpin } from './hooks/useWeightedSpin'
import { useGlowEffect } from './hooks/useGlowEffect'

export default function FoodWheelPage() {
  // 从配置文件加载美食选项
  const options = foodOptionsConfig.options

  // 庆祝效果状态
  const [showConfetti, setShowConfetti] = useState(false)

  // 使用自定义 Hooks
  const animation = useWheelAnimation({
    segmentCount: options.length,
    onResultReady: (winningIndex) => {
      // 结果准备好 - 立即显示结果
      console.log('🎉 Result ready, winning index:', winningIndex)

      const winningOption = options[winningIndex]
      if (winningOption) {
        weightedSpin.setSelectedOption(winningOption)
        weightedSpin.setResult(winningOption.name)
        setShowConfetti(true)

        // 3秒后隐藏庆祝效果
        setTimeout(() => {
          setShowConfetti(false)
        }, 3000)
      }
    },
    onAnimationComplete: () => {
      // 动画完全结束（转盘已停止）
      console.log('✅ Animation fully complete - wheel stopped')
    },
  })

  const weightedSpin = useWeightedSpin(options)
  const glowIntensity = useGlowEffect(animation.winningIndex)

  /**
   * 处理抽奖点击
   */
  const handleSpin = useCallback(() => {
    if (animation.isSpinning) {
      console.warn('Spin already in progress')
      return
    }

    try {
      // 1. 立即重置状态并启动UI反馈（不阻塞）
      weightedSpin.setSelectedOption(null)
      weightedSpin.setResult(null)
      setShowConfetti(false)

      // 2. 使用 queueMicrotask 确保UI立即更新
      queueMicrotask(() => {
        try {
          // 执行加权随机选择
          const { index, option } = weightedSpin.spin()
          console.log('🎲 Selected option:', option.name, 'at index:', index)

          // 启动转盘动画（动画完成后会触发 onAnimationComplete 回调）
          animation.startSpin(index)
        } catch (error) {
          console.error('Error during spin:', error)
          // 容错：重置状态
          animation.reset()
          weightedSpin.reset()
          setShowConfetti(false)
        }
      })
    } catch (error) {
      console.error('Error in handleSpin:', error)
      animation.reset()
      weightedSpin.reset()
      setShowConfetti(false)
    }
  }, [animation, weightedSpin])

  return (
    <>
      {/* 粒子烟花庆祝动画 */}
      <Confetti show={showConfetti} duration={3000} />

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes neon-pulse {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6),
              0 0 30px rgba(255, 215, 0, 0.4);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8),
              0 0 60px rgba(255, 215, 0, 0.6);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .neon-text {
          animation: neon-pulse 2s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        body {
          overflow-x: hidden;
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 动态背景 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-0 left-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:gap-10 px-4 py-6 sm:py-8 min-h-screen">
          {/* 标题 */}
          <header className="text-center flex flex-col items-center gap-2 sm:gap-3 float-animation w-full">
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 neon-text px-4">
                美食幸运转盘
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 blur-2xl opacity-30 -z-10"></div>
            </div>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl px-4">
              🎯 今天吃什么？转动幸运转盘，让它来决定！
            </p>
          </header>

          {/* 主要内容 */}
          <div className="flex flex-col lg:flex-row w-full gap-6 sm:gap-8 items-center lg:items-start justify-center flex-1">
            {/* 转盘区域 */}
            <div className="w-full flex justify-center lg:flex-1 lg:max-w-lg">
              <WheelCanvas
                options={options}
                rotation={animation.currentRotation}
                isSpinning={animation.isSpinning}
                winningIndex={animation.winningIndex}
                glowIntensity={glowIntensity}
                onCenterClick={handleSpin}
              />
            </div>

            {/* 控制面板 */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <ControlPanel
                options={options}
                selectedOption={weightedSpin.selectedOption}
                isSpinning={animation.isSpinning}
                showConfetti={showConfetti}
                result={weightedSpin.result}
                onSpin={handleSpin}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

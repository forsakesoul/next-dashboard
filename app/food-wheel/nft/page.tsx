/**
 * NFT 风格美食转盘页面
 * 高端加密货币/NFT 应用风格
 */

'use client'

import { useState, useCallback } from 'react'
import foodOptionsConfig from '../food-options.json'
import WheelCanvasNFT from '../components/WheelCanvasNFT'
import ControlPanel from '../components/ControlPanel'
import Confetti from '../components/Confetti'
import { useWheelAnimation } from '../hooks/useWheelAnimation'
import { useWeightedSpin } from '../hooks/useWeightedSpin'
import { useGlowEffect } from '../hooks/useGlowEffect'

export default function NFTFoodWheelPage() {
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

  // 处理开始抽奖
  const handleSpin = useCallback(() => {
    if (animation.isSpinning) return

    // 重置状态
    weightedSpin.reset()
    setShowConfetti(false)

    // 使用加权随机选择目标
    const { index: targetIndex } = weightedSpin.spin()
    console.log('🎯 Target index:', targetIndex)

    // 启动动画
    animation.startSpin(targetIndex)
  }, [animation, weightedSpin])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] overflow-hidden">
      {/* 背景装饰 - 径向紫光 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(138, 43, 226, 0.15), transparent 50%)',
        }}
      />

      {/* 主容器 */}
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        {/* 标题区域 - NFT 风格 */}
        <div className="text-center mb-8 lg:mb-12">
          <h1
            className="text-4xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-[#DAA520] via-[#FFD700] to-[#DAA520] bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 30px rgba(218, 165, 32, 0.5)',
            }}
          >
            NFT 美食转盘
          </h1>
          <p className="text-gray-400 text-sm lg:text-base">
            Premium Raffle Experience
          </p>
          {/* 返回链接 */}
          <a
            href="/food-wheel"
            className="inline-block mt-4 text-[#00D4FF] hover:text-[#8A2BE2] transition-colors duration-300"
            style={{
              textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
            }}
          >
            ← 返回经典版本
          </a>
        </div>

        {/* 主内容区 */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
          {/* 左侧：NFT 风格转盘 */}
          <div className="relative flex-shrink-0">
            <WheelCanvasNFT
              options={options}
              rotation={animation.currentRotation}
              isSpinning={animation.isSpinning}
              winningIndex={animation.winningIndex}
              glowIntensity={glowIntensity}
              onCenterClick={handleSpin}
            />
          </div>

          {/* 右侧：控制面板 */}
          <div className="w-full max-w-md">
            <ControlPanel
              result={weightedSpin.result}
              isSpinning={animation.isSpinning}
              selectedOption={weightedSpin.selectedOption}
              showConfetti={showConfetti}
              options={options}
              onSpin={handleSpin}
            />
          </div>
        </div>

        {/* 特性说明 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-xl text-center"
              style={{
                background: 'rgba(26, 26, 46, 0.6)',
                border: '1px solid rgba(218, 165, 32, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-lg font-bold text-[#FFD700] mb-2">金属质感</h3>
              <p className="text-gray-400 text-sm">
                高级金属渐变边框，奢华质感
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{
                background: 'rgba(26, 26, 46, 0.6)',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-4xl mb-2">💎</div>
              <h3 className="text-lg font-bold text-[#8A2BE2] mb-2">宝石光效</h3>
              <p className="text-gray-400 text-sm">
                三层脉冲宝石效果，动态发光
              </p>
            </div>

            <div
              className="p-6 rounded-xl text-center"
              style={{
                background: 'rgba(26, 26, 46, 0.6)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-4xl mb-2">🌐</div>
              <h3 className="text-lg font-bold text-[#00D4FF] mb-2">粒子轨道</h3>
              <p className="text-gray-400 text-sm">
                24个粒子环绕旋转，科技感十足
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 庆祝特效 */}
      <Confetti show={showConfetti} duration={3000} />
    </div>
  )
}

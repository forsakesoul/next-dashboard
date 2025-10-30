/**
 * 结果显示卡片组件 - 3D 翻转增强版
 */

'use client'

import { memo, useState, useEffect } from 'react'
import { FoodOption } from '../types/food-wheel.types'
import { GlassMaterial } from '../config/design-config'

interface ResultCardProps {
  /** 选中的选项 */
  selectedOption: FoodOption | null
  /** 是否正在旋转 */
  isSpinning: boolean
  /** 是否显示中奖庆祝效果 */
  showConfetti: boolean
  /** 结果名称 */
  result: string | null
}

/**
 * 结果显示卡片 - 3D 翻转 + 玻璃态质感
 */
function ResultCard({ selectedOption, isSpinning, showConfetti, result }: ResultCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // 当中奖时触发翻转动画
  useEffect(() => {
    if (selectedOption && showConfetti) {
      setIsFlipped(true)
    } else {
      setIsFlipped(false)
    }
  }, [selectedOption, showConfetti])

  return (
    <div
      className="relative rounded-2xl"
      style={{
        perspective: '1000px',
        minHeight: '240px',
      }}
    >
      {/* 3D 翻转容器 */}
      <div
        className="relative w-full h-full transition-transform duration-800 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 正面 - 等待/旋转状态 */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackdropFilter: GlassMaterial.card.WebkitBackdropFilter,
            backdropFilter: GlassMaterial.card.backdropFilter,
            background: 'linear-gradient(135deg, rgba(102,126,234,0.3) 0%, rgba(118,75,162,0.3) 100%)',
            border: GlassMaterial.card.border,
            boxShadow: GlassMaterial.card.boxShadow,
          }}
        >
          {/* 背景网格 */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            ></div>
          </div>

          {/* 顶部霓虹装饰线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

          <div className="relative z-10 p-6 min-h-[240px] flex flex-col items-center justify-center">
            {isSpinning ? (
              // 旋转中状态 - 添加立即出现的动画
              <div className="animate-fadeIn">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan-900/30 border-t-cyan-400 rounded-full animate-spin shadow-lg shadow-cyan-500/50"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl filter drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] animate-pulse">
                    ⚡
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-lg font-bold text-cyan-300 tracking-wider uppercase animate-pulse">
                    ROLLING...
                  </p>
                  <div className="flex justify-center gap-1">
                    <span
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-500/50"
                      style={{ animationDelay: '0ms' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-500/50"
                      style={{ animationDelay: '150ms' }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-500/50"
                      style={{ animationDelay: '300ms' }}
                    ></span>
                  </div>
                </div>
              </div>
            ) : result ? (
              // 有结果但未显示庆祝效果
              <>
                <div className="text-6xl drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">🎯</div>
                <div>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
                    {result}
                  </p>
                  <p className="text-sm text-cyan-300 font-medium">SELECTED</p>
                </div>
              </>
            ) : (
              // 初始状态
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

          {/* 底部霓虹装饰线 */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
        </div>

        {/* 背面 - 中奖状态 */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackdropFilter: GlassMaterial.card.WebkitBackdropFilter,
            backdropFilter: GlassMaterial.card.backdropFilter,
            background:
              'linear-gradient(135deg, rgba(240,147,251,0.4) 0%, rgba(245,87,108,0.4) 100%)',
            border: '2px solid rgba(245, 87, 108, 0.8)',
            boxShadow: '0 8px 32px 0 rgba(240, 147, 251, 0.5)',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* 庆祝背景动画 */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-purple-500/20 animate-pulse"></div>
          </div>

          <div className="relative z-10 p-6 min-h-[240px] flex flex-col items-center justify-center space-y-4">
            {/* 徽章图标 */}
            <div
              className="text-7xl animate-[bounce-in_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)]"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.8))',
              }}
            >
              🎉
            </div>

            {/* 美食名称 */}
            {selectedOption && (
              <div className="space-y-2">
                <div className="text-6xl mb-2">{selectedOption.emoji}</div>
                <h3
                  className="text-3xl font-black text-white"
                  style={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                    animation: 'scale-in 0.4s ease-out 0.2s backwards',
                  }}
                >
                  {selectedOption.name}
                </h3>
                <p className="text-base text-white/90 font-medium">今天就吃这个！</p>

                {/* WINNER 徽章 */}
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full text-white font-bold text-sm shadow-lg shadow-green-500/50 mt-3">
                  <span className="text-base">✓</span>
                  <span>WINNER!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS 动画定义 */}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.2) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default memo(ResultCard)

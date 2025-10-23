/**
 * 结果显示卡片组件
 */

'use client'

import { memo } from 'react'
import { FoodOption } from '../types/food-wheel.types'

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
 * 结果显示卡片 - 科技风格
 */
function ResultCard({ selectedOption, isSpinning, showConfetti, result }: ResultCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 p-6 overflow-hidden">
      {/* 科技感背景网格 */}
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

      <div className="relative z-10 text-center">
        {selectedOption && showConfetti ? (
          // 中奖状态
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
        )}
      </div>

      {/* 底部霓虹装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
    </div>
  )
}

export default memo(ResultCard)

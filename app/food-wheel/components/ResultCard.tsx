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
 * 结果显示卡片 - 超炫酷霓虹风格
 */
function ResultCard({ selectedOption, isSpinning, showConfetti, result }: ResultCardProps) {
  return (
    <div className="relative">
      {/* 超强发光外圈 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl opacity-75 blur-xl animate-pulse"></div>

      {/* 次级发光层 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl opacity-50 blur-lg"></div>

      {/* 主卡片 - 深色背景 */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-6 sm:p-8 overflow-hidden border-2 border-purple-500/30 shadow-2xl">
        {/* 动态光线扫描效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* 背景光斑 */}
        <div className="absolute top-0 -right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
        {selectedOption && showConfetti ? (
          // 中奖状态
          <div className="space-y-3 md:space-y-4">
            <div className="text-7xl sm:text-8xl md:text-9xl animate-bounce filter drop-shadow-[0_0_40px_rgba(255,215,0,1)]">
              {selectedOption.emoji}
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-pulse">
                {selectedOption.name}
              </h3>
              <div className="relative inline-flex">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full text-white font-black text-lg shadow-2xl">
                  <span className="text-2xl animate-spin">💫</span>
                  <span>恭喜中奖!</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px] flex flex-col items-center justify-center space-y-4 md:space-y-5">
            {isSpinning ? (
              // 旋转中状态 - 现代化设计
              <div className="animate-fadeIn space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  {/* 最外圈 */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 border-r-pink-500 rounded-full animate-spin shadow-lg shadow-pink-500/50"></div>
                  {/* 中圈反向 */}
                  <div className="absolute inset-3 border-4 border-transparent border-b-purple-500 border-l-purple-500 rounded-full animate-spin shadow-lg shadow-purple-500/50" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  {/* 内圈 */}
                  <div className="absolute inset-6 border-4 border-transparent border-t-cyan-500 border-r-cyan-500 rounded-full animate-spin shadow-lg shadow-cyan-500/50" style={{ animationDuration: '2s' }}></div>
                  {/* 中心图标 */}
                  <div className="absolute inset-0 flex items-center justify-center text-4xl filter drop-shadow-[0_0_20px_rgba(168,85,247,1)] animate-pulse">
                    ⚡
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    转盘旋转中...
                  </p>
                  <div className="flex justify-center gap-3">
                    <span className="w-3 h-3 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full animate-bounce shadow-lg shadow-pink-500/50" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full animate-bounce shadow-lg shadow-cyan-500/50" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            ) : result ? (
              // 有结果但未显示庆祝效果
              <div className="space-y-5">
                <div className="text-6xl sm:text-7xl md:text-8xl filter drop-shadow-[0_0_35px_rgba(168,85,247,1)] animate-pulse">🎯</div>
                <div className="space-y-3">
                  <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]">
                    {result}
                  </p>
                  <p className="text-base text-purple-300/80 font-bold tracking-widest">✓ 已选择</p>
                </div>
              </div>
            ) : (
              // 初始状态
              <div className="space-y-5">
                <div className="text-6xl sm:text-7xl md:text-8xl filter drop-shadow-[0_0_35px_rgba(6,182,212,1)] animate-pulse">🎲</div>
                <div className="space-y-3">
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.7)]">
                    今天吃什么？
                  </p>
                  <p className="text-base text-cyan-300/80 font-bold tracking-widest">
                    ⚡ 点击转盘开始
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default memo(ResultCard)

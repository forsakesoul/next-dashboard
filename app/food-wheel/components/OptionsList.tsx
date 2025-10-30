/**
 * 美食选项列表组件
 */

'use client'

import { memo } from 'react'
import { FoodOption } from '../types/food-wheel.types'

interface OptionsListProps {
  /** 美食选项列表 */
  options: FoodOption[]
  /** 选中的选项 */
  selectedOption: FoodOption | null
  /** 是否显示中奖庆祝效果 */
  showConfetti: boolean
}

/**
 * 美食列表 - 科技卡片风格
 */
function OptionsList({ options, selectedOption, showConfetti }: OptionsListProps) {
  return (
    <div className="relative">
      {/* 超强外发光 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl blur-xl opacity-60 animate-pulse"></div>

      {/* 次级发光 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl blur-lg opacity-40"></div>

      {/* 主容器 - 深色霓虹风 */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-5 sm:p-6 overflow-hidden border-2 border-purple-500/30 shadow-2xl">
        {/* 背景光斑 */}
        <div className="absolute top-0 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* 列表头部 - 炫酷设计 */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-purple-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl filter drop-shadow-[0_0_15px_rgba(236,72,153,1)] animate-pulse">🍽️</span>
              <h3 className="text-base sm:text-lg font-black bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                美食选项
              </h3>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-75"></div>
              <span className="relative text-sm font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1.5 rounded-full shadow-lg">
                {options.length}
              </span>
            </div>
          </div>

          {/* 选项网格 - 超炫卡片 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {options.map((option) => {
              const isSelected = selectedOption?.id === option.id && showConfetti

              return (
                <div
                  key={option.id}
                  className={`relative group/item transition-all duration-300 ${
                    isSelected ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  {/* 超强卡片发光 */}
                  <div
                    className={`absolute -inset-0.5 rounded-2xl blur-md transition duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-90 animate-pulse'
                        : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover/item:opacity-60'
                    }`}
                  ></div>

                  {/* 卡片主体 - 深色霓虹 */}
                  <div
                    className={`relative rounded-2xl p-3 sm:p-4 border-2 transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-400/70'
                        : 'bg-gradient-to-br from-gray-800/50 to-purple-900/30 border-purple-500/30 hover:border-pink-500/50'
                    }`}
                  >
                    {/* 卡片内发光 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

                    {/* 动态扫光 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000"></div>

                    <div className="relative flex items-center gap-2.5">
                      <span
                        className={`text-2xl sm:text-3xl transition-all duration-300 ${
                          isSelected
                            ? 'scale-125 filter drop-shadow-[0_0_20px_rgba(255,215,0,1)] animate-bounce'
                            : 'group-hover/item:scale-110 group-hover/item:rotate-12'
                        }`}
                      >
                        {option.emoji}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-black truncate transition-colors ${
                          isSelected
                            ? 'text-yellow-200 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]'
                            : 'text-white/90'
                        }`}
                      >
                        {option.name}
                      </span>
                    </div>

                    {/* 超炫中奖标记 */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                        <div className="relative w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce border-2 border-white">
                          <span className="text-white text-base font-black">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(OptionsList)

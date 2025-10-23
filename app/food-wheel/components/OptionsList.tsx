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
    <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-500/30 p-4 overflow-hidden">
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(indigo 1px, transparent 1px), linear-gradient(90deg, indigo 1px, transparent 1px)',
            backgroundSize: '15px 15px',
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* 列表头部 */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">🍽️</span>
            <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-wider uppercase">
              Options
            </h3>
          </div>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-full">
            {options.length}
          </span>
        </div>

        {/* 选项网格 */}
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => {
            const isSelected = selectedOption?.id === option.id && showConfetti

            return (
              <div
                key={option.id}
                className={`
                  relative rounded-lg p-2.5 transition-all duration-300 border
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400 shadow-lg shadow-yellow-500/50 scale-105 animate-pulse'
                      : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/70 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xl transition-transform duration-300 ${
                      isSelected ? 'scale-125 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]' : ''
                    }`}
                  >
                    {option.emoji}
                  </span>
                  <span
                    className={`text-xs font-bold truncate ${
                      isSelected ? 'text-yellow-300' : 'text-slate-300'
                    }`}
                  >
                    {option.name}
                  </span>
                </div>

                {/* 中奖勾选标记 */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce">
                    <span className="text-white text-xs font-black">✓</span>
                  </div>
                )}

                {/* 悬停发光效果 */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default memo(OptionsList)

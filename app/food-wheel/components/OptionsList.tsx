/**
 * 美食选项列表组件 - Dribbble 卡片式设计
 */

'use client'

import { memo } from 'react'
import { FoodOption } from '../types/food-wheel.types'
import { GlassMaterial } from '../config/design-config'

interface OptionsListProps {
  /** 美食选项列表 */
  options: FoodOption[]
  /** 选中的选项 */
  selectedOption: FoodOption | null
  /** 是否显示中奖庆祝效果 */
  showConfetti: boolean
}

/**
 * 美食列表 - Dribbble 卡片式 + 玻璃态质感
 */
function OptionsList({ options, selectedOption, showConfetti }: OptionsListProps) {
  return (
    <div
      className="relative rounded-2xl shadow-2xl p-4 overflow-hidden"
      style={{
        background: GlassMaterial.panel.background,
        backdropFilter: GlassMaterial.panel.backdropFilter,
        WebkitBackdropFilter: GlassMaterial.panel.WebkitBackdropFilter,
        border: GlassMaterial.panel.border,
        boxShadow: GlassMaterial.panel.boxShadow,
      }}
    >
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
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-400/50">
          <div className="flex items-center gap-2">
            <span className="text-xl drop-shadow-[0_0_12px_rgba(236,72,153,1)]">🍽️</span>
            <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 tracking-wider uppercase">
              Options
            </h3>
          </div>
          <span className="text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 rounded-full shadow-lg shadow-pink-500/50">
            {options.length}
          </span>
        </div>

        {/* 选项网格 - 卡片式设计 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {options.map((option) => {
            const isSelected = selectedOption?.id === option.id && showConfetti

            return (
              <div
                key={option.id}
                className="group relative"
                style={{
                  animation: isSelected ? 'wiggle 0.5s ease-in-out' : 'none',
                }}
              >
                <div
                  className={`
                    relative rounded-2xl p-3.5 transition-all duration-300
                    cursor-pointer overflow-hidden
                    ${
                      isSelected
                        ? 'scale-110 translate-y-[-8px]'
                        : 'scale-100 translate-y-0 hover:scale-105 hover:translate-y-[-5px]'
                    }
                  `}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #FFD93D 0%, #6BCB77 100%)'
                      : 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: isSelected ? '3px solid #FFD93D' : '2px solid rgba(236, 72, 153, 0.4)',
                    boxShadow: isSelected
                      ? '0 0 40px rgba(255, 217, 61, 0.8), 0 10px 30px rgba(0, 0, 0, 0.3)'
                      : '0 4px 20px rgba(236, 72, 153, 0.3), 0 0 15px rgba(168, 85, 247, 0.2)',
                  }}
                >
                  {/* 悬停发光效果 */}
                  {!isSelected && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-pink-500/40 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}

                  {/* 内容 */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <span
                      className={`text-3xl transition-all duration-300 ${
                        isSelected
                          ? 'scale-125 drop-shadow-[0_0_15px_rgba(234,179,8,0.9)]'
                          : 'group-hover:scale-110'
                      }`}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' : 'none',
                      }}
                    >
                      {option.emoji}
                    </span>
                    <span
                      className="text-sm font-bold text-center truncate w-full"
                      style={{
                        color: '#ffffff',
                        textShadow: isSelected
                          ? '0 2px 10px rgba(0, 0, 0, 0.8)'
                          : '0 2px 8px rgba(236, 72, 153, 0.6)',
                      }}
                    >
                      {option.name}
                    </span>
                  </div>

                  {/* 中奖勾选标记 - 弹出动画 */}
                  {isSelected && (
                    <div
                      className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50"
                      style={{
                        animation: 'pop-in 0.3s ease-out',
                      }}
                    >
                      <span className="text-white text-sm font-black">✓</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CSS 动画定义 */}
      <style jsx>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        @keyframes pop-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          70% {
            transform: scale(1.2) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow: 0 0 40px rgba(255, 217, 61, 0.8);
          }
          50% {
            box-shadow: 0 0 60px rgba(255, 217, 61, 1);
          }
        }
      `}</style>
    </div>
  )
}

export default memo(OptionsList)

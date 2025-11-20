/**
 * PC端美食选项卡片组件
 * 环绕式布局专用，紧凑设计
 */

'use client'

import { FoodOption } from '../../food-wheel/types/food-wheel.types'
import { fontSize, fontWeight } from '../config/fonts'

interface FoodOptionCardProps {
  option: FoodOption
  isSelected: boolean
}

export default function FoodOptionCard({ option, isSelected }: FoodOptionCardProps) {
  return (
    <div
      className="rounded-xl p-2.5 transition-all duration-300 hover:scale-110 relative cursor-pointer"
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff8a00 100%)' // 3色渐变
          : 'rgba(255, 255, 255, 0.05)',
        border: isSelected ? '2px solid #f093fb' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isSelected
          ? '0 0 40px rgba(240, 147, 251, 0.8), 0 0 80px rgba(240, 147, 251, 0.4)' // 多重发光
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        width: '96px', // 固定宽度
        height: '96px', // 固定高度
      }}
    >
      <div className="flex flex-col items-center justify-center gap-1.5 h-full">
        {/* Emoji图标 */}
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

        {/* 美食名称 */}
        <span
          className="text-center leading-tight"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: fontSize.micro, // 12px
            fontWeight: isSelected ? fontWeight.bold : fontWeight.semibold, // 700 / 600
            color: isSelected ? '#FFD700' : '#00D4FF', // 金色 / 青蓝色
            textShadow: isSelected
              ? '0 2px 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.4)' // 金色发光
              : '0 1px 8px rgba(0, 212, 255, 0.5), 0 0 15px rgba(0, 212, 255, 0.3)', // 青蓝色发光
            letterSpacing: '0.01em',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '0 4px',
          }}
        >
          {option.name}
        </span>
      </div>

      {/* 中奖标记 */}
      {isSelected && (
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center animate-bounce"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 15px rgba(240, 147, 251, 0.6)',
            border: '2px solid rgba(240, 147, 251, 0.8)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: fontWeight.bold,
              color: '#f093fb',
            }}
          >
            ✓
          </span>
        </div>
      )}
    </div>
  )
}

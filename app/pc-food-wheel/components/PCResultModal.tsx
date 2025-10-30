/**
 * PC端结果弹窗组件
 * 模态对话框展示抽奖结果
 */

'use client'

import { useEffect } from 'react'
import { FoodOption } from '../../food-wheel/types/food-wheel.types'
import { PCTheme } from '../../food-wheel/config/pc-theme'

interface PCResultModalProps {
  show: boolean
  winner: FoodOption | null
  onClose: () => void
  onReplay: () => void
}

export default function PCResultModal({
  show,
  winner,
  onClose,
  onReplay,
}: PCResultModalProps) {
  // ESC键关闭
  useEffect(() => {
    if (!show) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [show, onClose])

  if (!show || !winner) return null

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out',
        }}
        onClick={onClose}
      >
        {/* 弹窗内容 */}
        <div
          className="relative rounded-2xl p-8 max-w-md w-full mx-4"
          style={{
            background: PCTheme.surface.panel,
            border: `2px solid ${PCTheme.accent.secondary}`,
            boxShadow: `${PCTheme.shadows.xl}, ${PCTheme.shadows.glow.amber}`,
            animation: 'modalSlideIn 0.3s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: PCTheme.surface.card,
              color: PCTheme.text.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = PCTheme.surface.cardHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = PCTheme.surface.card
            }}
          >
            ✕
          </button>

          {/* 庆祝标题 */}
          <div className="text-center mb-6">
            <div
              className="text-6xl mb-4"
              style={{
                animation: 'celebrate 0.6s ease-out',
              }}
            >
              🎉
            </div>
            <h2
              className="text-2xl font-bold"
              style={{
                color: PCTheme.accent.secondary,
                textShadow: PCTheme.shadows.glow.amber,
              }}
            >
              抽奖结果
            </h2>
          </div>

          {/* 中奖内容 */}
          <div
            className="text-center py-8 rounded-xl mb-6"
            style={{
              background: PCTheme.surface.card,
              border: `2px solid ${PCTheme.accent.secondary}`,
            }}
          >
            <div
              className="text-8xl mb-4"
              style={{
                animation: 'bounce 0.6s ease-out',
              }}
            >
              {winner.emoji}
            </div>
            <h3
              className="text-4xl font-bold"
              style={{ color: PCTheme.text.primary }}
            >
              {winner.name}
            </h3>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-lg font-semibold transition-all duration-200"
              style={{
                background: PCTheme.surface.card,
                color: PCTheme.text.secondary,
                border: `1px solid ${PCTheme.text.muted}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = PCTheme.surface.cardHover
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = PCTheme.surface.card
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              确定
            </button>
            <button
              onClick={() => {
                onClose()
                onReplay()
              }}
              className="flex-1 h-12 rounded-lg font-semibold transition-all duration-200"
              style={{
                background: PCTheme.accent.primary,
                color: '#ffffff',
                boxShadow: PCTheme.shadows.glow.blue,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = PCTheme.accent.primaryHover
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = PCTheme.accent.primary
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              再抽一次
            </button>
          </div>

          {/* 提示文字 */}
          <p
            className="text-center text-sm mt-4"
            style={{ color: PCTheme.text.muted }}
          >
            按 ESC 或点击遮罩关闭
          </p>
        </div>
      </div>

      {/* CSS动画 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes celebrate {
          0% {
            transform: scale(0) rotate(-180deg);
          }
          60% {
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </>
  )
}

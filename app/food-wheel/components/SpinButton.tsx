/**
 * 抽奖按钮组件
 */

'use client'

import { memo } from 'react'

interface SpinButtonProps {
  /** 是否正在旋转 */
  isSpinning: boolean
  /** 是否有结果 */
  hasResult: boolean
  /** 点击回调 */
  onSpin: () => void
}

/**
 * 抽奖按钮 - 霓虹科技风
 */
function SpinButton({ isSpinning, hasResult, onSpin }: SpinButtonProps) {
  const handleClick = () => {
    // 添加触觉反馈（移动端）
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    onSpin()
  }

  return (
    <button
      onClick={handleClick}
      disabled={isSpinning}
      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[2px] shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 transform hover:scale-105 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {/* 动态光晕效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg px-6 py-4">
        <div className="flex items-center justify-center gap-3 text-lg font-black">
          {isSpinning ? (
            // 旋转中状态
            <>
              <span className="animate-spin text-cyan-400 text-2xl drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                ⚡
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
                ROLLING
              </span>
              <span
                className="animate-spin text-pink-400 text-2xl drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                style={{ animationDirection: 'reverse' }}
              >
                ⚡
              </span>
            </>
          ) : (
            // 静止状态
            <>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
                🎲
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 tracking-wider">
                {hasResult ? 'SPIN AGAIN' : 'START GAME'}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  )
}

export default memo(SpinButton)

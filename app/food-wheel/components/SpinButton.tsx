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
      className="group relative w-full overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
    >
      {/* 超强外发光 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 animate-pulse"></div>

      {/* 次级发光 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-60"></div>

      {/* 主按钮 - 超级渐变 */}
      <div className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-3xl px-8 sm:px-10 py-5 sm:py-6 shadow-2xl">
        {/* 顶部高光 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-3xl"></div>

        {/* 动态光线扫描 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-3xl"></div>

        <div className="relative flex items-center justify-center gap-3 text-xl sm:text-2xl font-black text-white">
          {isSpinning ? (
            // 旋转中状态 - 超炫
            <>
              <span className="animate-spin text-3xl sm:text-4xl filter drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
                ⚡
              </span>
              <span className="tracking-widest font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse">
                转盘旋转中
              </span>
              <span
                className="animate-spin text-3xl sm:text-4xl filter drop-shadow-[0_0_20px_rgba(255,255,255,1)]"
                style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
              >
                ⚡
              </span>
            </>
          ) : (
            // 静止状态 - 超炫
            <>
              <span className="text-3xl sm:text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 filter drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
                🎯
              </span>
              <span className="tracking-widest font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                {hasResult ? '再转一次' : '开始抽奖'}
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">✨</span>
            </>
          )}
        </div>
      </div>
    </button>
  )
}

export default memo(SpinButton)

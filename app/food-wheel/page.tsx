'use client'

import { useEffect, useRef, useState } from 'react'

type FoodOption = {
  id: number
  name: string
  color: string
}

const FOOD_OPTIONS: FoodOption[] = [
  { id: 1, name: '西部马华', color: '#F97316' },
  { id: 2, name: '地下美食', color: '#FACC15' },
  { id: 3, name: '煲仔饭', color: '#34D399' },
  { id: 4, name: '晋来顺', color: '#60A5FA' },
  { id: 5, name: '陕一哥', color: '#A855F7' },
  { id: 6, name: '十街', color: '#FB7185' },
  { id: 7, name: '品渡', color: '#F59E0B' },
  { id: 8, name: '冒菜', color: '#2DD4BF' },
  { id: 9, name: '金拱门', color: '#F973AB' },
]

const SEGMENT_ANGLE = 360 / FOOD_OPTIONS.length
const LABEL_RADIUS = 'calc(50% - 3.2rem)'
const WHEEL_GRADIENT = FOOD_OPTIONS.map((option, index) => {
  const start = index * SEGMENT_ANGLE
  const end = start + SEGMENT_ANGLE
  return `${option.color} ${start}deg ${end}deg`
}).join(', ')

export default function FoodWheelPage() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinDuration, setSpinDuration] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleSpin = () => {
    if (isSpinning) return

    const randomIndex = Math.floor(Math.random() * FOOD_OPTIONS.length)
    const targetAngle = randomIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    const extraSpins = Math.floor(Math.random() * 3) + 6 // 6-8 extra spins for flair
    const duration = 4200 + Math.floor(Math.random() * 900)

    setSpinDuration(duration)
    setIsSpinning(true)
    setResult(null)

    setRotation(prevRotation => {
      const normalized = prevRotation % 360
      return prevRotation + extraSpins * 360 + (360 - targetAngle) - normalized
    })

    const chosen = FOOD_OPTIONS[randomIndex].name

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsSpinning(false)
      setResult(chosen)
    }, duration)
  }

  const statusMessage = isSpinning
    ? '转盘旋转中，请稍候…'
    : result
      ? `恭喜抽中 ${result}`
      : '点击下方按钮开始抽奖'

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-100 px-4 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12">
        <header className="text-center flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Food Spin Wheel
          </span>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">美食大转盘</h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            为纠结的午餐带来一点惊喜吧！点击按钮让幸运之轮旋转，看看今天是哪一家美食上榜。
          </p>
        </header>

        <section className="grid w-full gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="relative mx-auto flex items-center justify-center">
            <div className="absolute inset-0 -translate-y-6 scale-110 transform rounded-full bg-gradient-to-br from-amber-200/50 to-orange-200/10 blur-2xl" />

            <div className="relative w-[18rem] h-[18rem] sm:w-[22rem] sm:h-[22rem]">
              <div className="absolute -top-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-rose-500 shadow-[0_12px_30px_rgba(244,63,94,0.45)]" />
              </div>

              <div className="relative h-full w-full">
                <div className="absolute inset-0 rounded-full border-[10px] border-white/80 shadow-[0_25px_60px_rgba(249,115,22,0.25)]" />

                <div
                  className="relative h-full w-full overflow-hidden rounded-full"
                  style={{
                    background: `conic-gradient(${WHEEL_GRADIENT})`,
                    transform: `rotate(${rotation}deg)`,
                    transition: spinDuration
                      ? `transform ${spinDuration}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
                      : undefined,
                  }}
                >
                  {FOOD_OPTIONS.map((option, index) => {
                    const labelAngle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
                    return (
                      <div key={option.id} className="absolute inset-0">
                        <div
                          className="absolute left-1/2 top-1/2"
                          style={{ transform: `translate(-50%, -50%) rotate(${labelAngle}deg)` }}
                        >
                          <div
                            className="flex justify-center"
                            style={{ transform: `translateX(${LABEL_RADIUS}) rotate(-${labelAngle}deg)` }}
                          >
                            <span className="w-24 text-center text-xs font-semibold uppercase tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] sm:w-28 sm:text-sm">
                              {option.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pointer-events-none absolute inset-0">
                  {FOOD_OPTIONS.map((option, index) => (
                    <div
                      key={`divider-${option.id}`}
                      className="absolute left-1/2 top-1/2 h-1/2 w-[2px] origin-top bg-white/40"
                      style={{ transform: `translate(-50%, -1px) rotate(${index * SEGMENT_ANGLE}deg)` }}
                    />
                  ))}
                </div>

                <div className="absolute inset-[26%] flex items-center justify-center rounded-full border border-white/70 bg-white/80 text-amber-600 shadow-inner">
                  <span className="text-sm font-semibold tracking-[0.35em]">幸运</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
            <div
              role="status"
              aria-live="polite"
              className="w-full rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-500">状态</p>
              <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                {isSpinning ? '转盘旋转中…' : result ? result : '准备就绪'}
              </p>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">{statusMessage}</p>
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-10 py-4 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(234,88,12,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_22px_60px_rgba(234,88,12,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSpinning ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                  转盘旋转中…
                </>
              ) : (
                <>
                  <span className="text-xl">🎲</span>
                  {result ? '再来一次' : '开始抽奖'}
                </>
              )}
            </button>

            <div className="w-full rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-100/70 to-white/80 p-6 shadow-inner">
              <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-500">美食候选</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
                {FOOD_OPTIONS.map(option => (
                  <li
                    key={`option-${option.id}`}
                    className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                    {option.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

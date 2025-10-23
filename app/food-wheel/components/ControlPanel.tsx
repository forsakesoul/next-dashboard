/**
 * 控制面板容器组件
 */

'use client'

import { memo } from 'react'
import { FoodOption } from '../types/food-wheel.types'
import ResultCard from './ResultCard'
import SpinButton from './SpinButton'
import OptionsList from './OptionsList'

interface ControlPanelProps {
  /** 美食选项列表 */
  options: FoodOption[]
  /** 选中的选项 */
  selectedOption: FoodOption | null
  /** 是否正在旋转 */
  isSpinning: boolean
  /** 是否显示中奖庆祝效果 */
  showConfetti: boolean
  /** 结果名称 */
  result: string | null
  /** 抽奖回调 */
  onSpin: () => void
}

/**
 * 控制面板
 * 包含结果卡片、抽奖按钮和选项列表
 */
function ControlPanel({
  options,
  selectedOption,
  isSpinning,
  showConfetti,
  result,
  onSpin,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4 w-full lg:w-[380px] flex-shrink-0">
      {/* 结果显示卡片 */}
      <ResultCard
        selectedOption={selectedOption}
        isSpinning={isSpinning}
        showConfetti={showConfetti}
        result={result}
      />

      {/* 抽奖按钮 */}
      <SpinButton isSpinning={isSpinning} hasResult={!!result} onSpin={onSpin} />

      {/* 美食列表 */}
      <OptionsList options={options} selectedOption={selectedOption} showConfetti={showConfetti} />
    </div>
  )
}

export default memo(ControlPanel)

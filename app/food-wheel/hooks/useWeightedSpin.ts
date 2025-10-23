/**
 * 加权随机抽奖 Hook
 */

import { useState, useCallback } from 'react'
import { FoodOption } from '../types/food-wheel.types'
import { calculateAllWeights } from '../utils/weight-calculator'
import { weightedRandomSelect } from '../utils/weighted-random'

interface UseWeightedSpinReturn {
  /** 选中的选项 */
  selectedOption: FoodOption | null
  /** 结果名称（冗余字段，方便使用） */
  result: string | null
  /** 执行加权随机选择 */
  spin: () => { index: number; option: FoodOption }
  /** 设置选中的选项 */
  setSelectedOption: (option: FoodOption | null) => void
  /** 设置结果 */
  setResult: (result: string | null) => void
  /** 重置状态 */
  reset: () => void
}

/**
 * 加权随机抽奖逻辑
 *
 * @param options 美食选项列表
 * @returns 抽奖状态和控制函数
 *
 * @example
 * const weightedSpin = useWeightedSpin(foodOptions)
 *
 * // 执行抽奖
 * const { index, option } = weightedSpin.spin()
 * console.log('中奖:', option.name, '索引:', index)
 *
 * // 设置显示结果
 * weightedSpin.setSelectedOption(option)
 * weightedSpin.setResult(option.name)
 *
 * // 重置
 * weightedSpin.reset()
 */
export function useWeightedSpin(options: FoodOption[]): UseWeightedSpinReturn {
  const [selectedOption, setSelectedOption] = useState<FoodOption | null>(null)
  const [result, setResult] = useState<string | null>(null)

  /**
   * 执行加权随机选择
   *
   * @returns 选中的索引和选项
   */
  const spin = useCallback(() => {
    // 参数验证
    if (!Array.isArray(options) || options.length === 0) {
      console.error('useWeightedSpin: options is empty or invalid')
      throw new Error('无可用的美食选项')
    }

    try {
      // 计算当前时间的权重
      const weightedOptions = calculateAllWeights(options)

      // 调试信息：显示当前权重分布
      if (process.env.NODE_ENV === 'development') {
        console.group('🎲 权重抽奖信息')
        console.log('当前时间:', new Date().toLocaleTimeString())
        weightedOptions.forEach((opt) => {
          const totalWeight = weightedOptions.reduce((sum, o) => sum + o.currentWeight, 0)
          const probability = ((opt.currentWeight / totalWeight) * 100).toFixed(2)
          console.log(
            `${opt.emoji} ${opt.name}: 权重=${opt.currentWeight.toFixed(2)}, 概率=${probability}%`
          )
        })
        console.groupEnd()
      }

      // 加权随机选择
      const selectedIndex = weightedRandomSelect(weightedOptions)
      const selectedOpt = options[selectedIndex]

      // 验证结果
      if (!selectedOpt) {
        console.error(`Invalid selection: index ${selectedIndex} out of bounds`)
        throw new Error('选择结果无效')
      }

      return {
        index: selectedIndex,
        option: selectedOpt,
      }
    } catch (error) {
      console.error('Error in spin():', error)

      // 容错：使用均等随机
      const fallbackIndex = Math.floor(Math.random() * options.length)
      return {
        index: fallbackIndex,
        option: options[fallbackIndex],
      }
    }
  }, [options])

  /**
   * 重置所有状态
   */
  const reset = useCallback(() => {
    setSelectedOption(null)
    setResult(null)
  }, [])

  return {
    selectedOption,
    result,
    spin,
    setSelectedOption,
    setResult,
    reset,
  }
}

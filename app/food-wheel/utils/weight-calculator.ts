/**
 * 权重计算工具
 */

import { FoodOption, WeightedOption } from '../types/food-wheel.types'

/**
 * 判断当前小时是否在时间范围内
 * 支持跨天场景（如 22:00-02:00）
 *
 * @param currentHour 当前小时 (0-23)
 * @param startHour 开始小时 (0-23)
 * @param endHour 结束小时 (0-23)
 * @returns 是否在范围内
 *
 * @example
 * // 同一天内
 * isInTimeRange(12, 11, 14) // true (12:00 在 11:00-14:00 内)
 * isInTimeRange(15, 11, 14) // false
 *
 * // 跨天场景
 * isInTimeRange(1, 22, 2) // true (1:00 在 22:00-02:00 内)
 * isInTimeRange(23, 22, 2) // true (23:00 在 22:00-02:00 内)
 * isInTimeRange(10, 22, 2) // false
 */
function isInTimeRange(
  currentHour: number,
  startHour: number,
  endHour: number
): boolean {
  // 参数验证
  if (currentHour < 0 || currentHour > 23) {
    console.warn(`Invalid currentHour: ${currentHour}, using 0`)
    currentHour = 0
  }
  if (startHour < 0 || startHour > 23) {
    console.warn(`Invalid startHour: ${startHour}, skipping boost`)
    return false
  }
  if (endHour < 0 || endHour > 23) {
    console.warn(`Invalid endHour: ${endHour}, skipping boost`)
    return false
  }

  if (startHour <= endHour) {
    // 同一天内，如 11:00-14:00
    return currentHour >= startHour && currentHour < endHour
  } else {
    // 跨天场景，如 22:00-02:00
    return currentHour >= startHour || currentHour < endHour
  }
}

/**
 * 计算当前时间某个选项的实际权重
 *
 * @param option 美食选项
 * @param currentTime 当前时间（可选，默认为系统当前时间，主要用于测试）
 * @returns 实际权重值
 *
 * @example
 * const option: FoodOption = {
 *   id: 1,
 *   name: "西部马华",
 *   baseWeight: 1,
 *   timeBoosts: [
 *     { name: "午餐时段", startHour: 11, endHour: 14, multiplier: 2.0 }
 *   ]
 * }
 *
 * // 在12:00调用，返回 2.0 (1 * 2.0)
 * calculateWeight(option, new Date('2025-01-23T12:00:00'))
 *
 * // 在15:00调用，返回 1.0 (基础权重)
 * calculateWeight(option, new Date('2025-01-23T15:00:00'))
 */
export function calculateWeight(
  option: FoodOption,
  currentTime: Date = new Date()
): number {
  // 参数验证
  if (!option) {
    console.error('calculateWeight: option is null or undefined')
    return 0
  }

  if (typeof option.baseWeight !== 'number' || option.baseWeight < 0) {
    console.warn(`Invalid baseWeight for ${option.name}: ${option.baseWeight}, using 1`)
    option.baseWeight = 1
  }

  const currentHour = currentTime.getHours()

  // 从基础权重开始
  let weight = option.baseWeight

  // 检查是否在任何时间加成区间内
  if (Array.isArray(option.timeBoosts)) {
    for (const boost of option.timeBoosts) {
      // 验证 boost 对象
      if (!boost || typeof boost.multiplier !== 'number') {
        console.warn(`Invalid boost config for ${option.name}:`, boost)
        continue
      }

      if (isInTimeRange(currentHour, boost.startHour, boost.endHour)) {
        weight *= boost.multiplier
        // 只应用第一个匹配的加成（避免重复加成）
        break
      }
    }
  }

  return weight
}

/**
 * 为所有选项计算当前权重
 *
 * @param options 美食选项列表
 * @param currentTime 当前时间（可选，默认为系统当前时间）
 * @returns 带计算后权重的选项列表
 *
 * @example
 * const options = [
 *   { id: 1, name: "西部马华", baseWeight: 1, timeBoosts: [...] },
 *   { id: 2, name: "食堂", baseWeight: 0.3, timeBoosts: [] }
 * ]
 *
 * const weighted = calculateAllWeights(options)
 * // 返回：
 * // [
 * //   { ...选项1, currentWeight: 2.0 },  // 假设在午餐时段
 * //   { ...选项2, currentWeight: 0.3 }
 * // ]
 */
export function calculateAllWeights(
  options: FoodOption[],
  currentTime?: Date
): WeightedOption[] {
  // 参数验证
  if (!Array.isArray(options)) {
    console.error('calculateAllWeights: options is not an array')
    return []
  }

  if (options.length === 0) {
    console.warn('calculateAllWeights: options array is empty')
    return []
  }

  return options.map((option) => ({
    ...option,
    currentWeight: calculateWeight(option, currentTime),
  }))
}

/**
 * 获取选项的中奖概率百分比（用于调试和展示）
 *
 * @param option 带权重的选项
 * @param allOptions 所有带权重的选项
 * @returns 概率百分比 (0-100)
 *
 * @example
 * const weighted = calculateAllWeights(options)
 * const prob = getOptionProbability(weighted[0], weighted)
 * console.log(`${weighted[0].name} 的中奖概率：${prob.toFixed(2)}%`)
 */
export function getOptionProbability(
  option: WeightedOption,
  allOptions: WeightedOption[]
): number {
  if (!option || !Array.isArray(allOptions) || allOptions.length === 0) {
    return 0
  }

  const totalWeight = allOptions.reduce((sum, opt) => sum + opt.currentWeight, 0)

  if (totalWeight === 0) {
    console.warn('Total weight is 0, returning equal probability')
    return 100 / allOptions.length
  }

  return (option.currentWeight / totalWeight) * 100
}

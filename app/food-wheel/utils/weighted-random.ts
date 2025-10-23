/**
 * 加权随机选择算法
 */

import { WeightedOption } from '../types/food-wheel.types'

/**
 * 加权随机选择算法
 * 使用轮盘赌算法（Roulette Wheel Selection）
 *
 * @param options 带权重的选项列表
 * @returns 被选中的选项索引
 *
 * @example
 * const options = [
 *   { id: 1, name: "A", currentWeight: 2.0 },  // 50%概率
 *   { id: 2, name: "B", currentWeight: 1.0 },  // 25%概率
 *   { id: 3, name: "C", currentWeight: 1.0 }   // 25%概率
 * ]
 * const index = weightedRandomSelect(options) // 返回 0, 1, 或 2
 *
 * 算法原理：
 * 1. 计算总权重：2.0 + 1.0 + 1.0 = 4.0
 * 2. 生成随机数：0 到 4.0 之间，假设是 2.5
 * 3. 遍历选项，累减权重：
 *    - 2.5 - 2.0 = 0.5 (>0, 继续)
 *    - 0.5 - 1.0 = -0.5 (<=0, 选中B)
 */
export function weightedRandomSelect(options: WeightedOption[]): number {
  // 参数验证
  if (!Array.isArray(options)) {
    console.error('weightedRandomSelect: options is not an array')
    return 0
  }

  if (options.length === 0) {
    console.error('weightedRandomSelect: options array is empty')
    return 0
  }

  if (options.length === 1) {
    return 0
  }

  // 计算总权重
  const totalWeight = options.reduce((sum, opt) => {
    const weight = opt.currentWeight || 0
    return sum + weight
  }, 0)

  // 如果总权重为0或无效，使用均等随机
  if (totalWeight <= 0 || !isFinite(totalWeight)) {
    console.warn('Total weight is invalid, using uniform random selection')
    return Math.floor(Math.random() * options.length)
  }

  // 生成 0 到 totalWeight 之间的随机数
  let random = Math.random() * totalWeight

  // 找到对应的选项
  for (let i = 0; i < options.length; i++) {
    const weight = options[i].currentWeight || 0

    // 累减权重
    random -= weight

    // 如果减到0或以下，说明落在这个选项的区间内
    if (random <= 0) {
      return i
    }
  }

  // 容错：如果因为浮点误差没找到，返回最后一个
  console.warn('weightedRandomSelect: fallback to last option due to floating point error')
  return options.length - 1
}

/**
 * 测试加权随机分布（仅用于开发调试）
 *
 * @param options 带权重的选项列表
 * @param iterations 测试次数
 * @returns 每个选项被选中的次数统计
 *
 * @example
 * const options = calculateAllWeights(foodOptions)
 * const stats = testWeightedDistribution(options, 10000)
 * console.log('分布统计：', stats)
 * // 输出：
 * // {
 * //   "西部马华": { count: 2500, percentage: 25.0 },
 * //   "食堂": { count: 750, percentage: 7.5 },
 * //   ...
 * // }
 */
export function testWeightedDistribution(
  options: WeightedOption[],
  iterations: number = 10000
): Record<string, { count: number; percentage: number; expectedPercentage: number }> {
  const counts: Record<string, number> = {}
  const totalWeight = options.reduce((sum, opt) => sum + opt.currentWeight, 0)

  // 初始化计数器
  options.forEach((opt) => {
    counts[opt.name] = 0
  })

  // 执行多次随机选择
  for (let i = 0; i < iterations; i++) {
    const index = weightedRandomSelect(options)
    counts[options[index].name]++
  }

  // 生成统计结果
  const result: Record<string, { count: number; percentage: number; expectedPercentage: number }> = {}
  options.forEach((opt) => {
    const count = counts[opt.name] || 0
    const percentage = (count / iterations) * 100
    const expectedPercentage = (opt.currentWeight / totalWeight) * 100

    result[opt.name] = {
      count,
      percentage: parseFloat(percentage.toFixed(2)),
      expectedPercentage: parseFloat(expectedPercentage.toFixed(2)),
    }
  })

  return result
}

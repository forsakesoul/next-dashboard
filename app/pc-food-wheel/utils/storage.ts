/**
 * 本地存储工具
 * 管理抽奖历史记录
 */

export interface SpinRecord {
  timestamp: number
  foodId: number
  foodName: string
  emoji: string
}

const STORAGE_KEY = 'pc-food-wheel-history'
const MAX_RECORDS = 100

/**
 * 保存抽奖记录
 */
export function saveSpinRecord(record: Omit<SpinRecord, 'timestamp'>): void {
  if (typeof window === 'undefined') return

  try {
    const history = getSpinHistory()
    const newRecord: SpinRecord = {
      ...record,
      timestamp: Date.now(),
    }

    history.unshift(newRecord)
    const trimmedHistory = history.slice(0, MAX_RECORDS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory))
  } catch (error) {
    console.error('Failed to save spin record:', error)
  }
}

/**
 * 获取所有抽奖记录
 */
export function getSpinHistory(): SpinRecord[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    return JSON.parse(data) as SpinRecord[]
  } catch (error) {
    console.error('Failed to load spin history:', error)
    return []
  }
}

/**
 * 获取今日抽奖次数
 */
export function getTodaySpinCount(): number {
  const history = getSpinHistory()
  const today = new Date().toDateString()

  return history.filter((record) => {
    const recordDate = new Date(record.timestamp).toDateString()
    return recordDate === today
  }).length
}

/**
 * 获取最近N条记录
 */
export function getRecentSpins(count: number = 10): SpinRecord[] {
  const history = getSpinHistory()
  return history.slice(0, count)
}

/**
 * 获取本周统计
 */
export function getWeeklyStats(): Record<string, number> {
  const history = getSpinHistory()
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weeklyRecords = history.filter((r) => r.timestamp > oneWeekAgo)

  const stats: Record<string, number> = {}
  weeklyRecords.forEach((record) => {
    stats[record.foodName] = (stats[record.foodName] || 0) + 1
  })

  return stats
}

/**
 * 清空历史记录
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear history:', error)
  }
}

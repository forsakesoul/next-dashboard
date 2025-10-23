/**
 * 美食转盘类型定义
 */

/**
 * 时间段权重加成配置
 */
export interface TimeBoost {
  /** 时段名称，如"午餐时段" */
  name: string
  /** 开始小时 (0-23) */
  startHour: number
  /** 结束小时 (0-23)，支持跨天（如22表示22:00-23:59） */
  endHour: number
  /** 权重倍数，如2.0表示权重翻倍 */
  multiplier: number
}

/**
 * 美食选项
 */
export interface FoodOption {
  /** 唯一标识符 */
  id: number
  /** 美食名称 */
  name: string
  /** 扇形背景色(HEX格式) */
  color: string
  /** 美食图标emoji */
  emoji: string
  /** 基础权重 (0-1之间，1为正常，<1为降低，>1为提高) */
  baseWeight: number
  /** 时间段加成列表 */
  timeBoosts: TimeBoost[]
}

/**
 * 带计算后权重的美食选项
 */
export interface WeightedOption extends FoodOption {
  /** 计算后的实际权重（基础权重 × 时间加成） */
  currentWeight: number
}

/**
 * 美食选项配置文件结构
 */
export interface FoodOptionsConfig {
  /** 美食选项列表 */
  options: FoodOption[]
  /** 元数据 */
  metadata: {
    /** 配置版本 */
    version: string
    /** 最后更新时间 */
    lastUpdated: string
    /** 配置描述 */
    description: string
  }
}

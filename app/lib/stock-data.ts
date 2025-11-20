import { StockIndex, StockItem, MarketSentiment, KLineData, SectorData } from './definitions'

/**
 * 获取指数数据
 * 在服务端直接生成模拟数据，避免API调用问题
 */
export async function fetchIndexData(): Promise<StockIndex[]> {
  try {
    // 直接返回模拟数据（在实际项目中，可以在这里调用外部API）
    return getMockIndexData()
  } catch (error) {
    console.error('获取指数数据错误:', error)
    return getMockIndexData()
  }
}

/**
 * 获取涨幅榜
 */
export async function fetchTopGainers(limit: number = 10): Promise<StockItem[]> {
  // 模拟数据
  return getMockTopGainers(limit)
}

/**
 * 获取跌幅榜
 */
export async function fetchTopLosers(limit: number = 10): Promise<StockItem[]> {
  // 模拟数据
  return getMockTopLosers(limit)
}

/**
 * 获取市场情绪数据
 */
export async function fetchMarketSentiment(): Promise<MarketSentiment> {
  // 模拟数据
  return getMockMarketSentiment()
}

/**
 * 获取K线数据
 */
export async function fetchKLineData(code: string, days: number = 30): Promise<KLineData[]> {
  // 模拟数据
  return getMockKLineData(days)
}

/**
 * 获取板块数据
 */
export async function fetchSectorData(): Promise<SectorData[]> {
  // 模拟数据
  return getMockSectorData()
}

// ==================== 模拟数据生成函数 ====================

function getMockIndexData(): StockIndex[] {
  const baseIndex = 3100
  const baseChange = Math.random() * 50 - 25
  const changePercent = (baseChange / baseIndex) * 100

  return [
    {
      code: 'sh000001',
      name: '上证指数',
      current: parseFloat((baseIndex + baseChange).toFixed(2)),
      change: parseFloat(baseChange.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 500000000),
      turnover: parseFloat((Math.random() * 400000).toFixed(2)),
      timestamp: new Date().toISOString()
    },
    {
      code: 'sz399001',
      name: '深证成指',
      current: parseFloat((10000 + Math.random() * 200 - 100).toFixed(2)),
      change: parseFloat((Math.random() * 100 - 50).toFixed(2)),
      changePercent: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      volume: Math.floor(Math.random() * 400000000),
      turnover: parseFloat((Math.random() * 350000).toFixed(2)),
      timestamp: new Date().toISOString()
    }
  ]
}

function getMockTopGainers(limit: number): StockItem[] {
  const gainers: StockItem[] = []
  const stockNames = [
    '中国平安', '招商银行', '贵州茅台', '比亚迪', '宁德时代',
    '五粮液', '隆基绿能', '中兴通讯', '海康威视', '立讯精密',
    '东方财富', '三一重工', '药明康德', '京东方A', '长江电力'
  ]

  for (let i = 0; i < limit; i++) {
    const code = `${i < 5 ? 'sh' : 'sz'}${String(600000 + i).padStart(6, '0')}`
    const previousClose = 10 + Math.random() * 90
    const changePercent = 10 - i * 0.8 - Math.random() * 0.3 // 递减的涨幅
    const current = previousClose * (1 + changePercent / 100)

    gainers.push({
      code,
      name: stockNames[i] || `股票${i + 1}`,
      current: parseFloat(current.toFixed(2)),
      change: parseFloat((current - previousClose).toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 100000000),
      turnover: parseFloat((Math.random() * 50000).toFixed(2)),
      high: parseFloat((current * 1.02).toFixed(2)),
      low: parseFloat((current * 0.98).toFixed(2)),
      open: parseFloat((previousClose * 1.01).toFixed(2)),
      previousClose: parseFloat(previousClose.toFixed(2))
    })
  }

  return gainers
}

function getMockTopLosers(limit: number): StockItem[] {
  const losers: StockItem[] = []
  const stockNames = [
    '中国石油', '中国石化', '中国联通', '中国铝业', '包钢股份',
    '紫金矿业', '中国中铁', '中国铁建', '中国建筑', '中国交建',
    '中国人寿', '中国太保', '新华保险', '中国神华', '兖矿能源'
  ]

  for (let i = 0; i < limit; i++) {
    const code = `${i < 5 ? 'sh' : 'sz'}${String(600000 + i + 100).padStart(6, '0')}`
    const previousClose = 10 + Math.random() * 90
    const changePercent = -10 + i * 0.8 + Math.random() * 0.3 // 递增的跌幅（负数）
    const current = previousClose * (1 + changePercent / 100)

    losers.push({
      code,
      name: stockNames[i] || `股票${i + 1}`,
      current: parseFloat(current.toFixed(2)),
      change: parseFloat((current - previousClose).toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 100000000),
      turnover: parseFloat((Math.random() * 50000).toFixed(2)),
      high: parseFloat((current * 1.02).toFixed(2)),
      low: parseFloat((current * 0.98).toFixed(2)),
      open: parseFloat((previousClose * 0.99).toFixed(2)),
      previousClose: parseFloat(previousClose.toFixed(2))
    })
  }

  return losers
}

function getMockMarketSentiment(): MarketSentiment {
  const total = 5000
  const upCount = Math.floor(total * (0.45 + Math.random() * 0.15))
  const downCount = Math.floor(total * (0.40 + Math.random() * 0.15))
  const flatCount = total - upCount - downCount

  return {
    upCount,
    downCount,
    flatCount,
    limitUpCount: Math.floor(upCount * 0.05),
    limitDownCount: Math.floor(downCount * 0.05),
    totalTurnover: parseFloat((Math.random() * 1000000).toFixed(2)),
    avgChangePercent: parseFloat((Math.random() * 2 - 1).toFixed(2))
  }
}

function getMockKLineData(days: number): KLineData[] {
  const data: KLineData[] = []
  let basePrice = 3000 + Math.random() * 200

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // 跳过周末
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const open = basePrice + (Math.random() - 0.5) * 50
    const close = open + (Math.random() - 0.5) * 100
    const high = Math.max(open, close) + Math.random() * 30
    const low = Math.min(open, close) - Math.random() * 30

    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume: Math.floor(Math.random() * 500000000),
      turnover: parseFloat((Math.random() * 400000).toFixed(2))
    })

    basePrice = close // 下一天基于前一天收盘价
  }

  return data
}

function getMockSectorData(): SectorData[] {
  const sectors = [
    '人工智能', '新能源车', '半导体', '医药生物', '白酒',
    '证券', '银行', '地产', '煤炭', '有色金属',
    '军工', '5G通信', '消费电子', '新能源', '光伏'
  ]

  return sectors.map((name, index) => ({
    name,
    changePercent: parseFloat((Math.random() * 10 - 5).toFixed(2)),
    leadStock: `龙头股${index + 1}`,
    stockCount: Math.floor(20 + Math.random() * 80),
    totalTurnover: parseFloat((Math.random() * 50000).toFixed(2))
  })).sort((a, b) => b.changePercent - a.changePercent)
}

/**
 * 格式化成交量
 * @param volume 成交量（手）
 */
export function formatVolume(volume: number): string {
  if (volume >= 100000000) {
    return `${(volume / 100000000).toFixed(2)}亿手`
  }
  if (volume >= 10000) {
    return `${(volume / 10000).toFixed(2)}万手`
  }
  return `${volume}手`
}

/**
 * 格式化成交额
 * @param turnover 成交额（万元）
 */
export function formatTurnover(turnover: number): string {
  if (turnover >= 100000) {
    return `${(turnover / 10000).toFixed(2)}亿元`
  }
  if (turnover >= 10000) {
    return `${(turnover / 10000).toFixed(2)}万元`
  }
  return `${turnover}元`
}

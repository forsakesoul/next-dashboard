'use client'

import { KLineData } from '@/app/lib/definitions'
import { useState, useMemo } from 'react'

interface SimpleChartProps {
  data: KLineData[]
  title: string
}

export default function SimpleChart({ data, title }: SimpleChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // 计算数据范围
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 0, priceRange: 0 }

    const prices = data.flatMap(d => [d.high, d.low])
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min

    return {
      minPrice: min - range * 0.1, // 留10%边距
      maxPrice: max + range * 0.1,
      priceRange: range * 1.2
    }
  }, [data])

  // 计算K线位置和高度
  const getKLineStyle = (item: KLineData) => {
    const bodyTop = Math.max(item.open, item.close)
    const bodyBottom = Math.min(item.open, item.close)
    const bodyHeight = Math.abs(item.close - item.open)

    return {
      shadowTop: ((maxPrice - item.high) / priceRange) * 100,
      shadowHeight: ((item.high - item.low) / priceRange) * 100,
      bodyTop: ((maxPrice - bodyTop) / priceRange) * 100,
      bodyHeight: (bodyHeight / priceRange) * 100,
      isRising: item.close >= item.open
    }
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          暂无数据
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>

      {/* 图表区域 */}
      <div className="relative h-80 bg-gray-50 rounded-lg p-4">
        {/* Y轴标签 */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
          <div>{maxPrice.toFixed(0)}</div>
          <div>{((maxPrice + minPrice) / 2).toFixed(0)}</div>
          <div>{minPrice.toFixed(0)}</div>
        </div>

        {/* K线容器 */}
        <div className="ml-16 h-full flex items-end gap-px">
          {data.slice(-30).map((item, index) => {
            const style = getKLineStyle(item)
            const isHovered = hoveredIndex === index

            return (
              <div
                key={item.date}
                className="relative flex-1 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 影线（最高最低价） */}
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-400"
                  style={{
                    top: `${style.shadowTop}%`,
                    height: `${style.shadowHeight}%`
                  }}
                />

                {/* K线实体 */}
                <div
                  className={`
                    absolute left-0 right-0 rounded-sm transition-all
                    ${style.isRising
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                    }
                    ${isHovered ? 'opacity-80 scale-110' : 'opacity-100'}
                  `}
                  style={{
                    top: `${style.bodyTop}%`,
                    height: `${Math.max(style.bodyHeight, 1)}%`, // 最小1%高度
                    minHeight: '2px'
                  }}
                />

                {/* 悬停提示 */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10 shadow-lg">
                    <div className="font-medium mb-1">{item.date}</div>
                    <div className="space-y-1">
                      <div>开: {item.open.toFixed(2)}</div>
                      <div>收: {item.close.toFixed(2)}</div>
                      <div>高: {item.high.toFixed(2)}</div>
                      <div>低: {item.low.toFixed(2)}</div>
                    </div>
                    {/* 小三角 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* X轴标签（显示部分日期） */}
        <div className="ml-16 mt-2 flex justify-between text-xs text-gray-500">
          {[0, Math.floor(data.length / 2), data.length - 1].map(index => (
            <div key={index}>{data[index]?.date.slice(5)}</div>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-gray-600">上涨</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-gray-600">下跌</span>
        </div>
      </div>
    </div>
  )
}

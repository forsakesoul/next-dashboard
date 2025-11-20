import { StockIndex } from '@/app/lib/definitions'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'
import { lusitana } from '@/app/ui/fonts'
import { formatVolume, formatTurnover } from '@/app/lib/stock-data'

export default function StockIndexCard({ index }: { index: StockIndex }) {
  const isPositive = index.changePercent >= 0
  const colorClass = isPositive ? 'text-red-600' : 'text-green-600'
  const bgClass = isPositive ? 'bg-red-50' : 'bg-green-50'
  const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{index.name}</h3>
          <p className="text-xs text-gray-400">{index.code}</p>
        </div>
        <div className={`p-3 rounded-full ${bgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>

      {/* 当前点数 */}
      <div className={`${lusitana.className} mb-2`}>
        <p className="text-4xl font-bold text-gray-900">
          {index.current.toFixed(2)}
        </p>
      </div>

      {/* 涨跌幅 */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-lg font-semibold ${colorClass}`}>
          {isPositive ? '+' : ''}{index.change.toFixed(2)}
        </span>
        <span className={`text-lg font-semibold ${colorClass}`}>
          {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* 成交数据 */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">成交量</p>
          <p className="text-sm font-medium text-gray-900">
            {formatVolume(index.volume)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">成交额</p>
          <p className="text-sm font-medium text-gray-900">
            {formatTurnover(index.turnover)}
          </p>
        </div>
      </div>

      {/* 更新时间 */}
      <div className="mt-3 text-xs text-gray-400 text-right">
        {new Date(index.timestamp).toLocaleTimeString('zh-CN')}
      </div>
    </div>
  )
}

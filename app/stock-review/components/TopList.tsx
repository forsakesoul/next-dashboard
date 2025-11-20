import { StockItem } from '@/app/lib/definitions'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

interface TopListProps {
  title: string
  stocks: StockItem[]
  type: 'gainers' | 'losers'
}

export default function TopList({ title, stocks, type }: TopListProps) {
  const isGainers = type === 'gainers'

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {isGainers ? (
          <ArrowUpIcon className="h-6 w-6 text-red-600" />
        ) : (
          <ArrowDownIcon className="h-6 w-6 text-green-600" />
        )}
      </div>

      <div className="space-y-3">
        {stocks.map((stock, index) => (
          <div
            key={stock.code}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* 排名 */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${index < 3
                  ? isGainers ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {index + 1}
              </div>

              {/* 股票信息 */}
              <div className="flex-1">
                <div className="font-medium text-gray-900">{stock.name}</div>
                <div className="text-xs text-gray-500">{stock.code}</div>
              </div>
            </div>

            {/* 价格和涨跌幅 */}
            <div className="text-right">
              <div className="font-bold text-gray-900">
                ¥{stock.current.toFixed(2)}
              </div>
              <div className={`text-sm font-semibold ${
                isGainers ? 'text-red-600' : 'text-green-600'
              }`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

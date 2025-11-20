import { MarketSentiment as MarketSentimentType } from '@/app/lib/definitions'
import { lusitana } from '@/app/ui/fonts'
import { formatTurnover } from '@/app/lib/stock-data'

export default function MarketSentiment({ sentiment }: { sentiment: MarketSentimentType }) {
  const total = sentiment.upCount + sentiment.downCount + sentiment.flatCount
  const upPercent = ((sentiment.upCount / total) * 100).toFixed(1)
  const downPercent = ((sentiment.downCount / total) * 100).toFixed(1)

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-lg">
      <h3 className={`${lusitana.className} text-xl font-bold text-gray-900 mb-6`}>
        市场情绪
      </h3>

      {/* 涨跌家数比例可视化 */}
      <div className="mb-6">
        <div className="flex h-6 rounded-full overflow-hidden">
          <div
            className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ width: `${upPercent}%` }}
          >
            {parseFloat(upPercent) > 10 && `${upPercent}%`}
          </div>
          <div
            className="bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold"
            style={{ width: `${((sentiment.flatCount / total) * 100).toFixed(1)}%` }}
          />
          <div
            className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ width: `${downPercent}%` }}
          >
            {parseFloat(downPercent) > 10 && `${downPercent}%`}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>上涨 {upPercent}%</span>
          <span>下跌 {downPercent}%</span>
        </div>
      </div>

      {/* 详细数据 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">上涨家数</span>
            <span className="text-2xl font-bold text-red-600">
              {sentiment.upCount}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            涨停: {sentiment.limitUpCount}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">下跌家数</span>
            <span className="text-2xl font-bold text-green-600">
              {sentiment.downCount}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            跌停: {sentiment.limitDownCount}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">平盘家数</span>
            <span className="text-2xl font-bold text-gray-600">
              {sentiment.flatCount}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">总成交额</span>
            <span className="text-lg font-bold text-blue-600">
              {formatTurnover(sentiment.totalTurnover)}
            </span>
          </div>
        </div>
      </div>

      {/* 平均涨跌幅 */}
      <div className="mt-4 bg-white rounded-lg p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">平均涨跌幅</div>
        <div className={`text-3xl font-bold ${
          sentiment.avgChangePercent >= 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          {sentiment.avgChangePercent >= 0 ? '+' : ''}{sentiment.avgChangePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

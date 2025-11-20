import { Suspense } from 'react'
import { lusitana } from '@/app/ui/fonts'
import StockIndexCard from './components/StockIndexCard'
import MarketSentiment from './components/MarketSentiment'
import TopList from './components/TopList'
import SimpleChart from './components/SimpleChart'
import SectorHeatmap from './components/SectorHeatmap'
import RefreshButton from './components/RefreshButton'
import {
  fetchIndexData,
  fetchTopGainers,
  fetchTopLosers,
  fetchMarketSentiment,
  fetchKLineData,
  fetchSectorData
} from '@/app/lib/stock-data'
import { ChartBarIcon, FireIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

/**
 * 证券交易每日复盘页面
 * 展示市场指数、涨跌榜、市场情绪、K线图、板块热力图等数据
 */
export default async function StockReviewPage() {
  // 并行获取所有数据
  const [indices, gainers, losers, sentiment, klineData, sectors] = await Promise.all([
    fetchIndexData(),
    fetchTopGainers(10),
    fetchTopLosers(10),
    fetchMarketSentiment(),
    fetchKLineData('sh000001', 30),
    fetchSectorData()
  ])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`${lusitana.className} text-4xl font-bold text-gray-900 mb-2`}>
                📈 证券交易复盘
              </h1>
              <p className="text-gray-600">
                实时追踪市场动态，把握投资机会
              </p>
            </div>

            {/* 刷新按钮 */}
            <RefreshButton />
          </div>
        </div>

        {/* 指数卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {indices.map(index => (
            <Suspense key={index.code} fallback={<div className="h-48 bg-white rounded-xl animate-pulse" />}>
              <StockIndexCard index={index} />
            </Suspense>
          ))}
        </div>

        {/* 市场情绪 */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
            <MarketSentiment sentiment={sentiment} />
          </Suspense>
        </div>

        {/* K线图 */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
            <SimpleChart
              data={klineData}
              title="上证指数 30日走势"
            />
          </Suspense>
        </div>

        {/* 涨跌榜 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
            <TopList title="涨幅榜 TOP10" stocks={gainers} type="gainers" />
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
            <TopList title="跌幅榜 TOP10" stocks={losers} type="losers" />
          </Suspense>
        </div>

        {/* 板块热力图 */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
            <SectorHeatmap sectors={sectors} />
          </Suspense>
        </div>

        {/* 功能提示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <ChartBarIcon className="h-12 w-12 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2">实时数据</h3>
            <p className="text-sm opacity-90">
              指数、个股、板块数据实时更新，延迟仅3秒
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <FireIcon className="h-12 w-12 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2">市场情绪</h3>
            <p className="text-sm opacity-90">
              全面分析涨跌家数、涨停跌停、市场热度
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <ArrowPathIcon className="h-12 w-12 mb-4 opacity-80" />
            <h3 className="text-lg font-bold mb-2">智能复盘</h3>
            <p className="text-sm opacity-90">
              K线图表、热力图、榜单多维度复盘分析
            </p>
          </div>
        </div>

        {/* 页脚提示 */}
        <div className="text-center text-gray-500 text-sm py-8">
          <p>💡 数据来源：新浪财经API | 延迟约3秒 | 仅供参考，不构成投资建议</p>
          <p className="mt-2">⚠️ 投资有风险，入市需谨慎</p>
        </div>
      </div>
    </main>
  )
}

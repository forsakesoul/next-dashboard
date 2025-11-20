import { SectorData } from '@/app/lib/definitions'

export default function SectorHeatmap({ sectors }: { sectors: SectorData[] }) {
  // 计算颜色（根据涨跌幅）
  const getColor = (changePercent: number) => {
    const intensity = Math.min(Math.abs(changePercent) / 5, 1) // 5%为最大强度
    if (changePercent > 0) {
      return `rgba(220, 38, 38, ${0.1 + intensity * 0.9})` // 红色（涨）
    } else if (changePercent < 0) {
      return `rgba(22, 163, 74, ${0.1 + intensity * 0.9})` // 绿色（跌）
    }
    return 'rgb(229, 231, 235)' // 灰色（平）
  }

  // 计算文字颜色（深色背景用白色，浅色背景用黑色）
  const getTextColor = (changePercent: number) => {
    const intensity = Math.abs(changePercent) / 5
    return intensity > 0.5 ? 'text-white' : 'text-gray-900'
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">板块热力图</h3>

      {/* 热力图网格 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {sectors.map((sector) => (
          <div
            key={sector.name}
            className="relative aspect-square rounded-lg p-3 flex flex-col justify-between cursor-pointer transform hover:scale-105 transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: getColor(sector.changePercent) }}
          >
            {/* 板块名称 */}
            <div className={`text-sm font-bold ${getTextColor(sector.changePercent)}`}>
              {sector.name}
            </div>

            {/* 涨跌幅 */}
            <div className="space-y-1">
              <div className={`text-2xl font-black ${getTextColor(sector.changePercent)}`}>
                {sector.changePercent >= 0 ? '+' : ''}{sector.changePercent.toFixed(2)}%
              </div>
              <div className={`text-xs opacity-80 ${getTextColor(sector.changePercent)}`}>
                {sector.leadStock}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 颜色说明 */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded" />
          <span className="text-sm text-gray-600">强势板块</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <span className="text-sm text-gray-600">平稳板块</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded" />
          <span className="text-sm text-gray-600">弱势板块</span>
        </div>
      </div>
    </div>
  )
}

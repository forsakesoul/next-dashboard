'use client'

import { useState, useEffect } from 'react'
import { lusitana } from '@/app/ui/fonts'
import {
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ClipboardDocumentIcon,
  CalendarIcon,
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

/**
 * 交易类型定义
 */
interface Trade {
  id: number
  stock_name: string
  stock_code: string
  action: 'BUY' | 'SELL' | 'HOLD' | 'WATCH'
  price: string
  change_percent: string
  logic: string
  attribution: 'NONE' | 'MODE_WIN' | 'LUCK_WIN' | 'MODE_LOSS' | 'DISCIPLINE_LOSS'
}

/**
 * 复盘数据类型定义
 */
interface ReviewData {
  meta: {
    date: string
    version: string
  }
  market_environment: {
    index_performance: string
    total_volume: string
    sentiment: string
    main_theme: string
  }
  account_summary: {
    daily_pnl: number
    daily_pnl_percent: number
    total_asset: number
    discipline_score: number
  }
  trade_details: Array<{
    stock: string
    code: string
    action: string
    avg_price: number
    stock_daily_change: number
    rationale: string
    result_attribution: string
  }>
}

/**
 * 每日A股复盘系统 - 客户端版本
 * 数据保存在本地localStorage，支持多日期管理
 */
export default function DailyReviewPage() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [allReviews, setAllReviews] = useState<ReviewData[]>([])

  // 市场数据
  const [marketData, setMarketData] = useState({
    shanghai_index: '',
    market_volume: '',
    market_sentiment: '平淡',
    main_theme: ''
  })

  // 账户数据
  const [accountData, setAccountData] = useState({
    daily_pnl: '',
    pnl_percent: '',
    total_asset: '',
    self_rating: 3
  })

  // 交易列表
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: 1,
      stock_name: '',
      stock_code: '',
      action: 'BUY',
      price: '',
      change_percent: '',
      logic: '',
      attribution: 'NONE'
    }
  ])

  // 从localStorage加载数据
  useEffect(() => {
    const saved = localStorage.getItem('stock_reviews')
    if (saved) {
      try {
        const reviews = JSON.parse(saved)
        setAllReviews(reviews)
        // 尝试加载当前日期的数据
        loadDateData(currentDate, reviews)
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    }
  }, [])

  // 加载指定日期的数据
  const loadDateData = (date: string, reviews?: ReviewData[]) => {
    const reviewList = reviews || allReviews
    const dateReview = reviewList.find(r => r.meta.date === date)

    if (dateReview) {
      // 加载市场数据
      setMarketData({
        shanghai_index: dateReview.market_environment.index_performance,
        market_volume: dateReview.market_environment.total_volume,
        market_sentiment: dateReview.market_environment.sentiment,
        main_theme: dateReview.market_environment.main_theme
      })

      // 加载账户数据
      setAccountData({
        daily_pnl: dateReview.account_summary.daily_pnl.toString(),
        pnl_percent: dateReview.account_summary.daily_pnl_percent.toString(),
        total_asset: dateReview.account_summary.total_asset.toString(),
        self_rating: dateReview.account_summary.discipline_score
      })

      // 加载交易数据
      if (dateReview.trade_details.length > 0) {
        setTrades(dateReview.trade_details.map((t, idx) => ({
          id: idx + 1,
          stock_name: t.stock,
          stock_code: t.code,
          action: t.action as Trade['action'],
          price: t.avg_price.toString(),
          change_percent: t.stock_daily_change.toString(),
          logic: t.rationale,
          attribution: t.result_attribution as Trade['attribution']
        })))
      }
    } else {
      // 重置为空数据
      resetForm()
    }
  }

  // 重置表单
  const resetForm = () => {
    setMarketData({
      shanghai_index: '',
      market_volume: '',
      market_sentiment: '平淡',
      main_theme: ''
    })
    setAccountData({
      daily_pnl: '',
      pnl_percent: '',
      total_asset: '',
      self_rating: 3
    })
    setTrades([{
      id: 1,
      stock_name: '',
      stock_code: '',
      action: 'BUY',
      price: '',
      change_percent: '',
      logic: '',
      attribution: 'NONE'
    }])
  }

  // 切换日期
  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate)
    loadDateData(newDate)
  }

  // 添加交易行
  const addTrade = () => {
    setTrades([...trades, {
      id: Date.now(),
      stock_name: '',
      stock_code: '',
      action: 'BUY',
      price: '',
      change_percent: '',
      logic: '',
      attribution: 'NONE'
    }])
  }

  // 删除交易行
  const removeTrade = (id: number) => {
    if (trades.length > 1) {
      setTrades(trades.filter(t => t.id !== id))
    }
  }

  // 更新交易
  const updateTrade = (id: number, field: keyof Trade, value: string) => {
    setTrades(trades.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  // 生成JSON
  const generateJSON = (): ReviewData => {
    return {
      meta: {
        date: currentDate,
        version: '1.0'
      },
      market_environment: {
        index_performance: marketData.shanghai_index,
        total_volume: marketData.market_volume,
        sentiment: marketData.market_sentiment,
        main_theme: marketData.main_theme
      },
      account_summary: {
        daily_pnl: parseFloat(accountData.daily_pnl) || 0,
        daily_pnl_percent: parseFloat(accountData.pnl_percent) || 0,
        total_asset: parseFloat(accountData.total_asset) || 0,
        discipline_score: accountData.self_rating
      },
      trade_details: trades.map(t => ({
        stock: t.stock_name,
        code: t.stock_code,
        action: t.action,
        avg_price: parseFloat(t.price) || 0,
        stock_daily_change: parseFloat(t.change_percent) || 0,
        rationale: t.logic,
        result_attribution: t.attribution
      }))
    }
  }

  // 保存当前数据
  const saveToLocal = () => {
    const newReview = generateJSON()
    const existingIndex = allReviews.findIndex(r => r.meta.date === currentDate)

    let updatedReviews
    if (existingIndex >= 0) {
      // 更新已有记录
      updatedReviews = [...allReviews]
      updatedReviews[existingIndex] = newReview
    } else {
      // 添加新记录
      updatedReviews = [...allReviews, newReview]
    }

    // 按日期排序（最新的在前面）
    updatedReviews.sort((a, b) => b.meta.date.localeCompare(a.meta.date))

    setAllReviews(updatedReviews)
    localStorage.setItem('stock_reviews', JSON.stringify(updatedReviews))

    alert('✅ 复盘数据已保存到本地！')
  }

  // 导出JSON文件
  const exportJSON = () => {
    const dataStr = JSON.stringify(allReviews, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `stock_reviews_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 导入JSON文件
  const importJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (Array.isArray(imported)) {
          setAllReviews(imported)
          localStorage.setItem('stock_reviews', JSON.stringify(imported))
          alert('✅ 数据导入成功！')
          // 加载第一条数据
          if (imported.length > 0) {
            handleDateChange(imported[0].meta.date)
          }
        } else {
          alert('❌ 文件格式错误！请确保是有效的JSON数组')
        }
      } catch (error) {
        alert('❌ 导入失败：' + error)
      }
    }
    reader.readAsText(file)
  }

  // 复制JSON
  const copyJSON = () => {
    const json = JSON.stringify(generateJSON(), null, 2)
    navigator.clipboard.writeText(json)
    alert('✅ JSON已复制到剪贴板！')
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
        body {
          font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .json-pre {
          background-color: #1e293b;
          color: #a5b4fc;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* 页面头部 */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                <SparklesIcon style={{ width: '24px', height: '24px', color: '#ef4444', strokeWidth: 2 }} />
                每日A股复盘系统
              </h1>
              <p className="text-slate-500 mt-1">知行合一 · 数据驱动 · 逻辑验证</p>
            </div>

            {/* 操作按钮组 */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 日期选择 */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                <span className="text-slate-600 font-medium">日期:</span>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="border-none focus:ring-0 text-slate-800 font-bold"
                />
              </div>

              {/* 保存按钮 */}
              <button
                onClick={saveToLocal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
              >
                <BookOpenIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                保存复盘
              </button>

              {/* 导出按钮 */}
              <button
                onClick={exportJSON}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
              >
                <DocumentArrowDownIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                导出全部
              </button>

              {/* 导入按钮 */}
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2 cursor-pointer">
                <DocumentArrowUpIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                导入数据
                <input
                  type="file"
                  accept=".json"
                  onChange={importJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 历史记录快捷选择 */}
          {allReviews.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpenIcon style={{ width: '16px', height: '16px', color: '#4b5563', strokeWidth: 2 }} />
                <span className="text-sm font-medium text-gray-700">历史记录：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allReviews.slice(0, 10).map((review) => (
                  <button
                    key={review.meta.date}
                    onClick={() => handleDateChange(review.meta.date)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      review.meta.date === currentDate
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {review.meta.date}
                  </button>
                ))}
                {allReviews.length > 10 && (
                  <span className="px-3 py-1 text-sm text-gray-500">
                    +{allReviews.length - 10} 更多...
                  </span>
                )}
              </div>
            </div>
          )}
        </header>

        {/* 主内容区域 */}
        <div className="space-y-6">
          {/* 1. 市场环境 */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <ChartBarIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
              市场环境
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">上证指数涨跌</label>
                <input
                  type="text"
                  placeholder="+0.5% / 放量长阳"
                  className="w-full p-2 border rounded bg-slate-50 focus:border-blue-500 outline-none"
                  value={marketData.shanghai_index}
                  onChange={(e) => setMarketData({ ...marketData, shanghai_index: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">两市成交额</label>
                <input
                  type="text"
                  placeholder="8000亿 / 缩量"
                  className="w-full p-2 border rounded bg-slate-50 focus:border-blue-500 outline-none"
                  value={marketData.market_volume}
                  onChange={(e) => setMarketData({ ...marketData, market_volume: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">核心主线/题材</label>
                <input
                  type="text"
                  placeholder="例如：低空经济、华为产业链、高股息..."
                  className="w-full p-2 border rounded bg-slate-50 focus:border-blue-500 outline-none"
                  value={marketData.main_theme}
                  onChange={(e) => setMarketData({ ...marketData, main_theme: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* 2. 个股操作与逻辑 */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <SparklesIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                个股操作与逻辑
              </h2>
              <button
                onClick={addTrade}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition flex items-center gap-1"
              >
                <PlusIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                添加
              </button>
            </div>

            <div className="space-y-4">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group"
                >
                  {/* 删除按钮 */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => removeTrade(trade.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <TrashIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                    </button>
                  </div>

                  {/* 第一行：基本信息 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="股票名称"
                      className="p-2 border rounded text-sm font-bold text-slate-700"
                      value={trade.stock_name}
                      onChange={(e) => updateTrade(trade.id, 'stock_name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="代码"
                      className="p-2 border rounded text-sm font-mono text-slate-600"
                      value={trade.stock_code}
                      onChange={(e) => updateTrade(trade.id, 'stock_code', e.target.value)}
                    />
                    <select
                      className={`p-2 border rounded text-sm font-bold ${
                        trade.action === 'BUY' ? 'text-red-600 bg-red-50' :
                        trade.action === 'SELL' ? 'text-green-600 bg-green-50' :
                        'text-slate-600'
                      }`}
                      value={trade.action}
                      onChange={(e) => updateTrade(trade.id, 'action', e.target.value)}
                    >
                      <option value="BUY">买入 (开仓)</option>
                      <option value="SELL">卖出 (止盈/损)</option>
                      <option value="HOLD">持仓不动</option>
                      <option value="WATCH">观察/卖飞</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="成交/当前价"
                      className="p-2 border rounded text-sm"
                      value={trade.price}
                      onChange={(e) => updateTrade(trade.id, 'price', e.target.value)}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="个股涨跌%"
                      className={`p-2 border rounded text-sm ${
                        parseFloat(trade.change_percent) > 0 ? 'text-red-500' :
                        parseFloat(trade.change_percent) < 0 ? 'text-green-500' :
                        ''
                      }`}
                      value={trade.change_percent}
                      onChange={(e) => updateTrade(trade.id, 'change_percent', e.target.value)}
                    />
                  </div>

                  {/* 第二行：逻辑与归因 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="核心逻辑：为何买？为何卖？(例如：打板、突破均线、止损)"
                        className="w-full p-2 border rounded text-sm bg-white focus:border-indigo-500 outline-none"
                        value={trade.logic}
                        onChange={(e) => updateTrade(trade.id, 'logic', e.target.value)}
                      />
                    </div>
                    <div>
                      <select
                        className="w-full p-2 border rounded text-sm bg-white text-slate-700"
                        value={trade.attribution}
                        onChange={(e) => updateTrade(trade.id, 'attribution', e.target.value)}
                      >
                        <option value="NONE">选择盈亏归因...</option>
                        <option value="MODE_WIN">✅ 模式内盈利 (实力)</option>
                        <option value="LUCK_WIN">🍀 模式外盈利 (运气)</option>
                        <option value="MODE_LOSS">🛡️ 模式内亏损 (成本)</option>
                        <option value="DISCIPLINE_LOSS">⚠️ 模式外亏损 (乱做)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 账户总结 */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-700 mb-4">账户总结</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-xs text-slate-500">当日盈亏 (元)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded font-mono"
                  value={accountData.daily_pnl}
                  onChange={(e) => setAccountData({ ...accountData, daily_pnl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">总资产</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded font-mono"
                  value={accountData.total_asset}
                  onChange={(e) => setAccountData({ ...accountData, total_asset: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-2">今日自我打分 (纪律性)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setAccountData({ ...accountData, self_rating: star })}
                      className={`w-8 h-8 rounded-full font-bold transition ${
                        accountData.self_rating >= star
                          ? 'bg-yellow-400 text-white'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. JSON预览 */}
          <section className="bg-slate-800 rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <ClipboardDocumentIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                JSON 数据预览
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={copyJSON}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                  title="复制"
                >
                  <ClipboardDocumentIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <pre className="json-pre">
                {JSON.stringify(generateJSON(), null, 4)}
              </pre>
            </div>
            <div className="mt-4 text-xs text-slate-500 text-center">
              该 JSON 格式可用于后续量化回测或数据导入
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

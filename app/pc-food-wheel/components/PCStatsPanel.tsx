/**
 * PC端统计面板组件 - 升级版
 * 炫酷的渐变卡片设计
 */

'use client'

import { useState, useEffect } from 'react'
import { PCTheme } from '../../food-wheel/config/pc-theme'
import {
  getTodaySpinCount,
  getRecentSpins,
  getWeeklyStats,
  type SpinRecord,
} from '../utils/storage'

export default function PCStatsPanel() {
  const [todayCount, setTodayCount] = useState(0)
  const [recentSpins, setRecentSpins] = useState<SpinRecord[]>([])
  const [weeklyStats, setWeeklyStats] = useState<Record<string, number>>({})

  // 刷新统计数据
  const refreshStats = () => {
    setTodayCount(getTodaySpinCount())
    setRecentSpins(getRecentSpins(5))
    setWeeklyStats(getWeeklyStats())
  }

  // 初始加载和定时刷新
  useEffect(() => {
    refreshStats()

    // 监听storage变化
    const handleStorageChange = () => {
      refreshStats()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}小时前`
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 奖牌图标
  const getMedalIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: PCTheme.surface.glass.background,
        backdropFilter: PCTheme.surface.glass.backdropFilter,
        border: PCTheme.surface.glass.border,
        boxShadow: PCTheme.shadows.lg,
      }}
    >
      {/* 装饰性渐变 */}
      <div
        className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        }}
      />

      {/* 标题 */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: PCTheme.text.secondary }}>
          <span className="text-xl">📊</span>
          <span>统计信息</span>
        </h3>
        <button
          onClick={refreshStats}
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105"
          style={{
            color: PCTheme.text.secondary,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          🔄 刷新
        </button>
      </div>

      {/* 今日统计 - 炫酷卡片 */}
      <div
        className="rounded-xl p-5 mb-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
        }}
      >
        {/* 发光效果 */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              }}
            >
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <p className="text-xs" style={{ color: PCTheme.text.tertiary }}>
                今日抽奖次数
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: PCTheme.text.secondary }}>
                继续加油！
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className="text-4xl font-black bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
              }}
            >
              {todayCount}
            </p>
            <p className="text-xs mt-1" style={{ color: PCTheme.text.muted }}>
              次
            </p>
          </div>
        </div>
      </div>

      {/* 本周热门 - 排行榜 */}
      {Object.keys(weeklyStats).length > 0 && (
        <div className="mb-5 relative z-10">
          <h4
            className="text-xs font-bold mb-3 flex items-center gap-2"
            style={{ color: PCTheme.text.tertiary }}
          >
            <span>🏆</span>
            <span>本周最爱 TOP3</span>
          </h4>
          <div className="space-y-2">
            {Object.entries(weeklyStats)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([name, count], index) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:translate-x-1"
                  style={{
                    background: index === 0
                      ? 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: index === 0
                      ? '1px solid rgba(240, 147, 251, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: index === 0
                      ? '0 4px 15px rgba(240, 147, 251, 0.2)'
                      : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMedalIcon(index)}</span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: index === 0 ? PCTheme.text.primary : PCTheme.text.secondary,
                      }}
                    >
                      {name}
                    </span>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: index === 0
                        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: index === 0 ? '#ffffff' : PCTheme.text.tertiary,
                    }}
                  >
                    {count}次
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 最近记录 - 时间线 */}
      {recentSpins.length > 0 && (
        <div className="relative z-10">
          <h4
            className="text-xs font-bold mb-3 flex items-center gap-2"
            style={{ color: PCTheme.text.tertiary }}
          >
            <span>🕐</span>
            <span>最近记录</span>
          </h4>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {recentSpins.map((record, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(79, 172, 254, 0.2) 100%)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                  }}
                >
                  <span className="text-xl">{record.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: PCTheme.text.secondary }}
                  >
                    {record.foodName}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: PCTheme.text.muted }}
                  >
                    {formatTime(record.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {recentSpins.length === 0 && (
        <div className="text-center py-10 relative z-10">
          <div
            className="text-6xl mb-3 opacity-20 animate-pulse"
            style={{ animationDuration: '3s' }}
          >
            📊
          </div>
          <p className="text-sm font-semibold" style={{ color: PCTheme.text.muted }}>
            暂无抽奖记录
          </p>
          <p className="text-xs mt-2" style={{ color: PCTheme.text.disabled }}>
            开始抽奖，记录你的美食之旅！
          </p>
        </div>
      )}

      {/* 自定义滚动条样式 */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
      `}</style>
    </div>
  )
}

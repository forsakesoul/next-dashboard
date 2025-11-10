import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '美食幸运转盘 - 今天吃什么',
  description: '随机美食选择转盘，帮你决定今天吃什么。炫酷的动画效果，简单易用的H5应用。',
  keywords: ['美食', '转盘', '抽奖', '随机选择', '今天吃什么'],
  authors: [{ name: 'Dashboard App' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  themeColor: '#6d28d9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '美食转盘',
  },
}

export default function FoodWheelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

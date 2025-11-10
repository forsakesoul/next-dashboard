/**
 * PC转盘专用字体配置
 * 使用 Google Fonts 提升视觉品质
 */

import { Inter, Space_Grotesk } from 'next/font/google'

/**
 * Inter - 正文和UI元素
 * 特点：极佳屏幕可读性，现代无衬线
 */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * Space Grotesk - 标题和强调元素
 * 特点：现代几何美学，Dribbble 趋势字体
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

/**
 * 字号系统（5级层次）
 */
export const fontSize = {
  hero: '72px',      // 超大中奖
  display: '48px',   // 中奖结果
  heading: '24px',   // 页面标题
  subheading: '18px', // 卡片标题
  body: '16px',      // 按钮/选项
  caption: '14px',   // 快捷键
  micro: '12px',     // 徽章
}

/**
 * 字重系统
 */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

/**
 * 行高系统
 */
export const lineHeight = {
  tight: '1.2',
  normal: '1.5',
  relaxed: '1.75',
}

/**
 * 字间距系统
 */
export const letterSpacing = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.05em',
}

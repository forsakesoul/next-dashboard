import { Lusitana } from 'next/font/google';

// 配置 Lusitana 字体
// 支持 400（normal）和 700（bold）权重以满足设计需求
// 使用 latin 子集优化加载性能
// 启用 swap 显示策略避免布局偏移
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
}); 
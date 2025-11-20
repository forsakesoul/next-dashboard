/**
 * PC端环绕式布局容器
 * 美食选项5列网格环绕转盘周围
 */

'use client'

import { FoodOption } from '../../food-wheel/types/food-wheel.types'
import FoodOptionCard from './FoodOptionCard'

interface SurroundLayoutProps {
  options: FoodOption[]
  selectedOption: FoodOption | null
  children: React.ReactNode // 转盘组件
}

// 定义9个美食选项在5x5网格中的位置
const GRID_POSITIONS = [
  { col: 1, row: 1 }, // 左上
  { col: 2, row: 1 }, // 上偏左
  { col: 3, row: 1 }, // 正上
  { col: 4, row: 1 }, // 上偏右
  { col: 5, row: 1 }, // 右上
  { col: 5, row: 3 }, // 正右
  { col: 4, row: 5 }, // 右下
  { col: 3, row: 5 }, // 正下
  { col: 1, row: 3 }, // 正左
]

export default function SurroundLayout({ options, selectedOption, children }: SurroundLayoutProps) {
  return (
    <div className="relative w-full flex items-center justify-center">
      {/* 5x5 网格容器 */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(5, 96px)', // 5列，每列96px
          gridTemplateRows: 'repeat(5, 96px)', // 5行，每行96px
        }}
      >
        {/* 美食选项环绕布局 */}
        {options.slice(0, 9).map((option, index) => {
          const position = GRID_POSITIONS[index]
          const isSelected = selectedOption?.id === option.id

          return (
            <div
              key={option.id}
              style={{
                gridColumn: position.col,
                gridRow: position.row,
              }}
            >
              <FoodOptionCard option={option} isSelected={isSelected} />
            </div>
          )
        })}

        {/* 转盘占据中心3x3区域 */}
        <div
          className="flex items-center justify-center"
          style={{
            gridColumn: '2 / 5', // 从第2列到第5列（占3列）
            gridRow: '2 / 5', // 从第2行到第5行（占3行）
          }}
        >
          {children}
        </div>
      </div>

      {/* 额外的美食选项（如果超过9个）显示在底部 */}
      {options.length > 9 && (
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-[600px]">
          <div className="flex flex-wrap justify-center gap-3">
            {options.slice(9).map((option) => {
              const isSelected = selectedOption?.id === option.id
              return (
                <div key={option.id}>
                  <FoodOptionCard option={option} isSelected={isSelected} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

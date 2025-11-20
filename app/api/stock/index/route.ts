import { NextRequest, NextResponse } from 'next/server'

/**
 * 获取指数数据API代理
 * 解决跨域问题并提供统一的错误处理
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const codes = searchParams.get('codes') || 's_sh000001,s_sz399001' // 默认上证和深证

    // 调用新浪财经API
    const response = await fetch(
      `http://hq.sinajs.cn/list=${codes}`,
      {
        headers: {
          'Referer': 'http://finance.sina.com.cn'
        },
        next: { revalidate: 3 } // 缓存3秒
      }
    )

    if (!response.ok) {
      throw new Error('获取指数数据失败')
    }

    const text = await response.text()

    // 解析新浪API返回的数据
    const indices = parseIndexData(text)

    return NextResponse.json({
      success: true,
      data: indices,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('指数数据API错误:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 解析新浪API返回的指数数据
 * 格式: var hq_str_s_sh000001="上证指数,3089.2633,10.8336,0.35,1281234,14555424";
 */
function parseIndexData(text: string) {
  const lines = text.trim().split('\n')
  const indices = []

  for (const line of lines) {
    const match = line.match(/var hq_str_(s_\w+)="([^"]+)"/)
    if (!match) continue

    const code = match[1]
    const data = match[2].split(',')

    if (data.length < 6) continue

    indices.push({
      code: code.replace('s_', ''),
      name: data[0],
      current: parseFloat(data[1]) || 0,
      change: parseFloat(data[2]) || 0,
      changePercent: parseFloat(data[3]) || 0,
      volume: parseInt(data[4]) || 0,
      turnover: parseFloat(data[5]) || 0,
      timestamp: new Date().toISOString()
    })
  }

  return indices
}

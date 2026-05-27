import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useAppStore } from '@/store'
import './index.scss'

export default function Portfolio() {
  const [loading, setLoading] = useState(true)
  const { accountData, setAccountData } = useAppStore()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const mockAccount = {
        total_value: 125680.50,
        cash: 45680.50,
        positions: [
          { stock_code: '600519', stock_name: '贵州茅台', shares: 10, avg_price: 1650, current_price: 1685, profit: 350, profit_pct: 2.12 },
          { stock_code: '600036', stock_name: '招商银行', shares: 500, avg_price: 35.2, current_price: 36.8, profit: 800, profit_pct: 4.55 },
          { stock_code: '000858', stock_name: '五粮液', shares: 200, avg_price: 138, current_price: 142.5, profit: 900, profit_pct: 3.26 },
          { stock_code: '601318', stock_name: '中国平安', shares: 300, avg_price: 47.5, current_price: 48.2, profit: 210, profit_pct: 1.47 },
          { stock_code: '600887', stock_name: '伊利股份', shares: 400, avg_price: 26.8, current_price: 27.6, profit: 320, profit_pct: 2.99 }
        ],
        stats: {
          total_profit: 2850.00,
          total_profit_pct: 2.32,
          win_rate: 75.5,
          total_trades: 28
        }
      }

      setAccountData(mockAccount)
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载持仓数据中...</Text>
      </View>
    )
  }

  const positions = accountData?.positions || []
  const stats = accountData?.stats || {}

  return (
    <ScrollView className='portfolio' scrollY>
      <View className='page-header'>
        <Text className='title'>持仓管理</Text>
        <Text className='subtitle'>管理您的投资组合</Text>
      </View>

      <View className='summary-card'>
        <View className='summary-item'>
          <Text className='label'>总资产</Text>
          <Text className='value'>¥{accountData?.total_value?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '0.00'}</Text>
        </View>
        <View className='divider' />
        <View className='summary-item'>
          <Text className='label'>可用资金</Text>
          <Text className='value'>¥{accountData?.cash?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '0.00'}</Text>
        </View>
      </View>

      <View className='stats-row'>
        <View className='stat-item'>
          <Text className='stat-label'>总收益</Text>
          <Text className='stat-value profit'>+¥{stats.total_profit?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '0.00'}</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>收益率</Text>
          <Text className='stat-value profit'>+{stats.total_profit_pct || 0}%</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-label'>胜率</Text>
          <Text className='stat-value'>{stats.win_rate || 0}%</Text>
        </View>
      </View>

      <View className='positions-section'>
        <Text className='section-title'>当前持仓</Text>
        {positions.map((position) => (
          <View key={position.stock_code} className='position-card'>
            <View className='position-header'>
              <View className='stock-info'>
                <Text className='stock-name'>{position.stock_name}</Text>
                <Text className='stock-code'>{position.stock_code}</Text>
              </View>
              <View className={`profit-badge ${position.profit >= 0 ? 'profit' : 'loss'}`}>
                <Text>{position.profit >= 0 ? '+' : ''}{position.profit_pct}%</Text>
              </View>
            </View>

            <View className='position-details'>
              <View className='detail-row'>
                <View className='detail-item'>
                  <Text className='label'>持仓数量</Text>
                  <Text className='value'>{position.shares}</Text>
                </View>
                <View className='detail-item'>
                  <Text className='label'>成本价</Text>
                  <Text className='value'>¥{position.avg_price.toFixed(2)}</Text>
                </View>
                <View className='detail-item'>
                  <Text className='label'>现价</Text>
                  <Text className='value'>¥{position.current_price.toFixed(2)}</Text>
                </View>
              </View>
              <View className='detail-row'>
                <View className='detail-item'>
                  <Text className='label'>持仓市值</Text>
                  <Text className='value'>¥{(position.shares * position.current_price).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</Text>
                </View>
                <View className='detail-item'>
                  <Text className='label'>浮动收益</Text>
                  <Text className={`value ${position.profit >= 0 ? 'profit' : 'loss'}`}>
                    {position.profit >= 0 ? '+' : ''}¥{position.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </View>

            <View className='position-actions'>
              <View className='btn-buy'>
                <Text>加仓</Text>
              </View>
              <View className='btn-sell'>
                <Text>减仓</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className='empty-space' />
    </ScrollView>
  )
}

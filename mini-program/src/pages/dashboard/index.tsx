import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useAppStore } from '@/store'
import './index.scss'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const { accountData, recommendations, setAccountData, setRecommendations } = useAppStore()

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
          { stock_code: '000858', stock_name: '五粮液', shares: 200, avg_price: 138, current_price: 142.5, profit: 900, profit_pct: 3.26 }
        ],
        stats: {
          total_profit: 2850.00,
          total_profit_pct: 2.32,
          win_rate: 75.5,
          total_trades: 28
        }
      }

      const mockRecommendations = [
        { stock_code: '600519', stock_name: '贵州茅台', score: 92, signal: '强烈推荐', risk_level: '低风险', current_price: 1685.00, target_price: 1850, stop_loss: 1580, position_ratio: 0.20, reasons: ['行业龙头', '业绩稳定', '机构持仓'] },
        { stock_code: '000858', stock_name: '五粮液', score: 88, signal: '强烈推荐', risk_level: '低风险', current_price: 142.50, target_price: 158, stop_loss: 132, position_ratio: 0.15, reasons: ['品牌优势', '消费升级'] },
        { stock_code: '600036', stock_name: '招商银行', score: 85, signal: '推荐', risk_level: '中风险', current_price: 36.80, target_price: 41, stop_loss: 33.5, position_ratio: 0.12, reasons: ['资产质量优', '零售业务强'] },
        { stock_code: '300750', stock_name: '宁德时代', score: 80, signal: '推荐', risk_level: '高风险', current_price: 198.00, target_price: 230, stop_loss: 175, position_ratio: 0.06, reasons: ['全球领先', '技术优势'] },
        { stock_code: '601318', stock_name: '中国平安', score: 82, signal: '推荐', risk_level: '中风险', current_price: 48.20, target_price: 54, stop_loss: 44, position_ratio: 0.10, reasons: ['综合金融', '科技赋能'] }
      ]

      setAccountData(mockAccount)
      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载市场数据中...</Text>
      </View>
    )
  }

  const stats = accountData?.stats || {}

  return (
    <ScrollView className='dashboard' scrollY>
      <View className='page-header'>
        <Text className='title'>数据看板</Text>
        <Text className='subtitle'>实时监控账户表现与市场动态</Text>
      </View>

      <View className='stats-grid'>
        <View className='stat-card primary'>
          <View className='stat-icon'>💰</View>
          <View className='stat-content'>
            <Text className='stat-label'>总资产</Text>
            <Text className='stat-value'>¥{(accountData?.total_value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        <View className='stat-card success'>
          <View className='stat-icon'>🏆</View>
          <View className='stat-content'>
            <Text className='stat-label'>总收益</Text>
            <Text className='stat-value'>+¥{stats.total_profit?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '0.00'}</Text>
          </View>
        </View>

        <View className='stat-card info'>
          <View className='stat-icon'>📈</View>
          <View className='stat-content'>
            <Text className='stat-label'>收益率</Text>
            <Text className='stat-value'>+{stats.total_profit_pct || 0}%</Text>
          </View>
        </View>

        <View className='stat-card warning'>
          <View className='stat-icon'>📊</View>
          <View className='stat-content'>
            <Text className='stat-label'>胜率</Text>
            <Text className='stat-value'>{stats.win_rate || 0}%</Text>
          </View>
        </View>
      </View>

      <View className='card'>
        <Text className='card-title'>热门推荐</Text>
        <View className='stock-list'>
          {recommendations.slice(0, 5).map((stock, index) => (
            <View key={stock.stock_code} className='stock-item'>
              <View className='stock-rank'>{index + 1}</View>
              <View className='stock-info'>
                <Text className='stock-name'>{stock.stock_name}</Text>
                <Text className='stock-code'>{stock.stock_code}</Text>
              </View>
              <View className='stock-price'>
                <Text className='price'>¥{stock.current_price?.toFixed(2)}</Text>
                <View className={`signal ${stock.signal.includes('强烈') ? 'strong' : ''}`}>
                  <Text>{stock.signal}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useWebSocket, useReachBottom } from '@tarojs/taro'
import { useAppStore } from '@/store'
import { LineChart, PieChart } from '@/components/Charts'
import './index.scss'

interface StockItem {
  stock_code: string
  stock_name: string
  score: number
  signal: string
  risk_level: string
  current_price: number
  target_price: number
  stop_loss: number
  position_ratio: number
  reasons: string[]
}

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

      const mockRecommendations: StockItem[] = [
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

  const getPortfolioChartOption = () => {
    return {
      backgroundColor: 'transparent',
      grid: { top: 40, right: 20, bottom: 40, left: 60 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#6B7280', fontSize: 20 }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#F3F4F6' } },
        axisLabel: { color: '#6B7280', fontSize: 20, formatter: v => `¥${(v / 1000).toFixed(0)}k` }
      },
      series: [{
        data: [100000, 102000, 101500, 104000, 105500, 106000, 108000],
        type: 'line',
        smooth: 0.6,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#1E40AF', width: 3 },
        itemStyle: { color: '#1E40AF', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(30, 64, 175, 0.15)' },
              { offset: 1, color: 'rgba(30, 64, 175, 0.01)' }
            ]
          }
        }
      }]
    }
  }

  const getPieChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
      legend: { orient: 'vertical', right: 20, top: 'center', textStyle: { color: '#6B7280', fontSize: 20 } },
      series: [{
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
        label: { show: false },
        emphasis: { label: { show: false } },
        data: [
          { value: 16850, name: '贵州茅台', itemStyle: { color: '#1E40AF' } },
          { value: 18400, name: '招商银行', itemStyle: { color: '#52C41A' } },
          { value: 28500, name: '五粮液', itemStyle: { color: '#722ED1' } },
          { value: 61930.50, name: '现金', itemStyle: { color: '#F0F0F0' } }
        ]
      }]
    }
  }

  const stats = accountData?.stats || {}

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载市场数据中...</Text>
      </View>
    )
  }

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
        <Text className='card-title'>资产走势</Text>
        <View className='chart-container'>
          <LineChart option={getPortfolioChartOption()} />
        </View>
      </View>

      <View className='card'>
        <Text className='card-title'>持仓分布</Text>
        <View className='chart-container'>
          <PieChart option={getPieChartOption()} />
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

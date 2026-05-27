import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useAppStore } from '@/store'
import './index.scss'

interface Strategy {
  name: string
  description: string
  enabled: boolean
  return: number
  trades: number
}

export default function Analysis() {
  const [loading, setLoading] = useState(true)
  const [strategies, setStrategies] = useState<Strategy[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const mockStrategies: Strategy[] = [
        { name: 'momentum', description: '趋势动量策略', enabled: true, return: 15.8, trades: 45 },
        { name: 'value', description: '价值成长策略', enabled: true, return: 12.3, trades: 28 },
        { name: 'breakout', description: '技术突破策略', enabled: false, return: 8.5, trades: 62 },
        { name: 'mean_reversion', description: '均值回归策略', enabled: true, return: 18.2, trades: 36 },
        { name: 'grid_trading', description: '网格交易策略', enabled: false, return: 6.8, trades: 128 }
      ]

      setStrategies(mockStrategies)
    } catch (error) {
      console.error('Failed to fetch strategies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载分析数据中...</Text>
      </View>
    )
  }

  const enabledStrategies = strategies.filter(s => s.enabled)
  const disabledStrategies = strategies.filter(s => !s.enabled)
  const avgReturn = enabledStrategies.length > 0
    ? (enabledStrategies.reduce((sum, s) => sum + s.return, 0) / enabledStrategies.length).toFixed(2)
    : '0.00'

  return (
    <ScrollView className='analysis' scrollY>
      <View className='page-header'>
        <Text className='title'>策略分析</Text>
        <Text className='subtitle'>量化策略表现与回测分析</Text>
      </View>

      <View className='summary-card'>
        <View className='summary-header'>
          <Text className='summary-title'>策略总览</Text>
        </View>
        <View className='summary-stats'>
          <View className='stat-item'>
            <Text className='stat-value'>{strategies.length}</Text>
            <Text className='stat-label'>全部策略</Text>
          </View>
          <View className='stat-item'>
            <Text className='stat-value success'>{enabledStrategies.length}</Text>
            <Text className='stat-label'>运行中</Text>
          </View>
          <View className='stat-item'>
            <Text className='stat-value'>{avgReturn}%</Text>
            <Text className='stat-label'>平均收益</Text>
          </View>
        </View>
      </View>

      <View className='section'>
        <Text className='section-title'>运行中的策略</Text>
        {enabledStrategies.map((strategy) => (
          <View key={strategy.name} className='strategy-card'>
            <View className='strategy-header'>
              <View className='strategy-info'>
                <Text className='strategy-name'>{strategy.description}</Text>
                <Text className='strategy-code'>{strategy.name}</Text>
              </View>
              <View className='status-badge active'>
                <Text>运行中</Text>
              </View>
            </View>

            <View className='strategy-stats'>
              <View className='stat-item'>
                <Text className='stat-label'>累计收益</Text>
                <Text className='stat-value success'>+{strategy.return}%</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-label'>交易次数</Text>
                <Text className='stat-value'>{strategy.trades}</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-label'>收益率</Text>
                <Text className='stat-value success'>{(strategy.return / strategy.trades).toFixed(2)}%</Text>
              </View>
            </View>

            <View className='strategy-chart'>
              <View className='chart-placeholder'>
                <Text className='placeholder-text'>收益曲线</Text>
              </View>
            </View>

            <View className='strategy-actions'>
              <View className='btn-detail'>
                <Text>查看详情</Text>
              </View>
              <View className='btn-pause'>
                <Text>暂停</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className='section'>
        <Text className='section-title'>已暂停的策略</Text>
        {disabledStrategies.map((strategy) => (
          <View key={strategy.name} className='strategy-card paused'>
            <View className='strategy-header'>
              <View className='strategy-info'>
                <Text className='strategy-name'>{strategy.description}</Text>
                <Text className='strategy-code'>{strategy.name}</Text>
              </View>
              <View className='status-badge paused'>
                <Text>已暂停</Text>
              </View>
            </View>

            <View className='strategy-stats'>
              <View className='stat-item'>
                <Text className='stat-label'>累计收益</Text>
                <Text className='stat-value success'>+{strategy.return}%</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-label'>交易次数</Text>
                <Text className='stat-value'>{strategy.trades}</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-label'>收益率</Text>
                <Text className='stat-value success'>{(strategy.return / strategy.trades).toFixed(2)}%</Text>
              </View>
            </View>

            <View className='strategy-actions'>
              <View className='btn-resume'>
                <Text>启动策略</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className='empty-space' />
    </ScrollView>
  )
}

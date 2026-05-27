import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useAppStore } from '@/store'
import './index.scss'

export default function Recommendations() {
  const [loading, setLoading] = useState(true)
  const { recommendations, setRecommendations } = useAppStore()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const mockRecommendations = [
        { stock_code: '600519', stock_name: '贵州茅台', score: 92, signal: '强烈推荐', risk_level: '低风险', current_price: 1685.00, target_price: 1850, stop_loss: 1580, position_ratio: 0.20, reasons: ['行业龙头', '业绩稳定', '机构持仓', '估值修复'] },
        { stock_code: '000858', stock_name: '五粮液', score: 88, signal: '强烈推荐', risk_level: '低风险', current_price: 142.50, target_price: 158, stop_loss: 132, position_ratio: 0.15, reasons: ['品牌优势', '消费升级', '渠道优化'] },
        { stock_code: '600036', stock_name: '招商银行', score: 85, signal: '推荐', risk_level: '中风险', current_price: 36.80, target_price: 41, stop_loss: 33.5, position_ratio: 0.12, reasons: ['资产质量优', '零售业务强', '估值合理'] },
        { stock_code: '601318', stock_name: '中国平安', score: 82, signal: '推荐', risk_level: '中风险', current_price: 48.20, target_price: 54, stop_loss: 44, position_ratio: 0.10, reasons: ['综合金融', '科技赋能', '业绩增长'] },
        { stock_code: '000001', stock_name: '平安银行', score: 78, signal: '推荐', risk_level: '中风险', current_price: 11.35, target_price: 12.8, stop_loss: 10.2, position_ratio: 0.08, reasons: ['零售转型', '资产质量改善', '估值较低'] },
        { stock_code: '600887', stock_name: '伊利股份', score: 76, signal: '推荐', risk_level: '低风险', current_price: 27.60, target_price: 31, stop_loss: 25, position_ratio: 0.10, reasons: ['乳业龙头', '稳定分红', '消费刚需'] },
        { stock_code: '601888', stock_name: '中国中免', score: 74, signal: '推荐', risk_level: '中风险', current_price: 68.50, target_price: 78, stop_loss: 62, position_ratio: 0.08, reasons: ['免税龙头', '政策利好', '消费回流'] },
        { stock_code: '300750', stock_name: '宁德时代', score: 80, signal: '推荐', risk_level: '高风险', current_price: 198.00, target_price: 230, stop_loss: 175, position_ratio: 0.06, reasons: ['全球领先', '技术优势', '市场份额'] }
      ]

      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载推荐数据中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className='recommendations' scrollY>
      <View className='page-header'>
        <Text className='title'>智能推荐</Text>
        <Text className='subtitle'>基于多维度分析的投资建议</Text>
      </View>

      <View className='recommendations-list'>
        {recommendations.map((stock, index) => (
          <View key={stock.stock_code} className='recommendation-card'>
            <View className='card-header'>
              <View className='stock-info'>
                <Text className='stock-name'>{stock.stock_name}</Text>
                <Text className='stock-code'>{stock.stock_code}</Text>
              </View>
              <View className={`signal-badge ${stock.signal.includes('强烈') ? 'strong' : ''}`}>
                <Text>{stock.signal}</Text>
              </View>
            </View>

            <View className='price-row'>
              <View className='price-item'>
                <Text className='label'>现价</Text>
                <Text className='value'>¥{stock.current_price.toFixed(2)}</Text>
              </View>
              <View className='price-item'>
                <Text className='label'>目标价</Text>
                <Text className='value success'>¥{stock.target_price}</Text>
              </View>
              <View className='price-item'>
                <Text className='label'>止损价</Text>
                <Text className='value danger'>¥{stock.stop_loss}</Text>
              </View>
              <View className='price-item'>
                <Text className='label'>风险</Text>
                <Text className={`value risk-${stock.risk_level}`}>{stock.risk_level}</Text>
              </View>
            </View>

            <View className='score-section'>
              <Text className='score-label'>综合评分</Text>
              <View className='score-bar'>
                <View className='score-fill' style={{ width: `${stock.score}%` }} />
              </View>
              <Text className='score-value'>{stock.score}</Text>
            </View>

            <View className='reasons-section'>
              <Text className='reasons-title'>推荐理由</Text>
              <View className='reasons-tags'>
                {stock.reasons.map((reason, idx) => (
                  <View key={idx} className='reason-tag'>
                    <Text>{reason}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className='action-section'>
              <View className='btn-buy'>
                <Text>立即买入</Text>
              </View>
              <View className='btn-detail'>
                <Text>查看详情</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

import React, { useState, useEffect } from 'react'

export default function Recommendations() {
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载推荐数据中...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>智能推荐</h1>
        <p>基于多维度分析的投资建议</p>
      </div>

      <div className="recommendations-list">
        {recommendations.map((stock, index) => (
          <div key={stock.stock_code} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>{stock.stock_name}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{stock.stock_code}</div>
              </div>
              <span className={`signal ${stock.signal.includes('强烈') ? 'strong' : ''}`}>
                {stock.signal}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>现价</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>¥{stock.current_price.toFixed(2)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>目标价</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#52C41A' }}>¥{stock.target_price}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>止损价</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#F5222D' }}>¥{stock.stop_loss}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>风险</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: stock.risk_level === '低风险' ? '#52C41A' : stock.risk_level === '中风险' ? '#FADB14' : '#F5222D' }}>{stock.risk_level}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#6B7280', marginRight: '12px', flexShrink: 0 }}>综合评分</span>
              <div style={{ flex: 1, height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginRight: '12px' }}>
                <div style={{ width: `${stock.score}%`, height: '100%', background: 'linear-gradient(90deg, #1E40AF, #3B82F6)', borderRadius: '4px' }}></div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF', flexShrink: 0 }}>{stock.score}</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>推荐理由</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {stock.reasons.map((reason, idx) => (
                  <span key={idx} style={{ padding: '4px 12px', background: 'rgba(30, 64, 175, 0.1)', color: '#1E40AF', borderRadius: '4px', fontSize: '12px' }}>
                    {reason}
                  </span>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: '12px' }}>
              立即买入
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [accountData, setAccountData] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载市场数据中...</p>
      </div>
    )
  }

  const stats = accountData?.stats || {}

  return (
    <div>
      <div className="page-header">
        <h1>数据看板</h1>
        <p>实时监控账户表现与市场动态</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">总资产</span>
            <span className="stat-value">¥{(accountData?.total_value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <span className="stat-label">总收益</span>
            <span className="stat-value">+¥{stats.total_profit?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '0.00'}</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">收益率</span>
            <span className="stat-value">+{stats.total_profit_pct || 0}%</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">胜率</span>
            <span className="stat-value">{stats.win_rate || 0}%</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>热门推荐</h3>
        <div className="stock-list">
          {recommendations.slice(0, 5).map((stock, index) => (
            <div key={stock.stock_code} className="stock-item">
              <div className="stock-rank">{index + 1}</div>
              <div className="stock-info">
                <span className="stock-name">{stock.stock_name}</span>
                <span className="stock-code">{stock.stock_code}</span>
              </div>
              <div className="stock-price">
                <span className="price">¥{stock.current_price?.toFixed(2)}</span>
                <span className={`signal ${stock.signal.includes('强烈') ? 'strong' : ''}`}>
                  {stock.signal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

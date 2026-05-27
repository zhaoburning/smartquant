import React, { useState, useEffect } from 'react'

export default function Portfolio() {
  const [loading, setLoading] = useState(true)
  const [accountData, setAccountData] = useState(null)

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载持仓数据中...</p>
      </div>
    )
  }

  const positions = accountData?.positions || []
  const stats = accountData?.stats || {}

  return (
    <div>
      <div className="page-header">
        <h1>持仓管理</h1>
        <p>管理您的投资组合</p>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>总资产</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>¥{accountData?.total_value?.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>可用资金</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>¥{accountData?.cash?.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>总收益</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#52C41A' }}>+¥{stats.total_profit?.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>收益率</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#52C41A' }}>+{stats.total_profit_pct || 0}%</div>
        </div>
        <div className="card" style={{ padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>胜率</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{stats.win_rate || 0}%</div>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>当前持仓</h3>
      
      {positions.map((position) => (
        <div key={position.stock_code} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{position.stock_name}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{position.stock_code}</div>
            </div>
            <span className={`signal ${position.profit >= 0 ? '' : 'strong'}`} style={{ background: position.profit >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)', color: position.profit >= 0 ? '#52C41A' : '#F5222D' }}>
              {position.profit >= 0 ? '+' : ''}{position.profit_pct}%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>持仓数量</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>{position.shares}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>成本价</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>¥{position.avg_price.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>现价</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>¥{position.current_price.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>持仓市值</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>¥{(position.shares * position.current_price).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>浮动收益</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: position.profit >= 0 ? '#52C41A' : '#F5222D' }}>
                {position.profit >= 0 ? '+' : ''}¥{position.profit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button className="btn-primary" style={{ marginTop: 0 }}>加仓</button>
            <button className="btn-secondary" style={{ marginTop: 0, color: '#F5222D', borderColor: '#F5222D' }}>减仓</button>
          </div>
        </div>
      ))}
    </div>
  )
}

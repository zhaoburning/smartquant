import React, { useState, useEffect } from 'react'

export default function Analysis() {
  const [loading, setLoading] = useState(true)
  const [strategies, setStrategies] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockStrategies = [
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载分析数据中...</p>
      </div>
    )
  }

  const enabledStrategies = strategies.filter(s => s.enabled)
  const disabledStrategies = strategies.filter(s => !s.enabled)
  const avgReturn = enabledStrategies.length > 0
    ? (enabledStrategies.reduce((sum, s) => sum + s.return, 0) / enabledStrategies.length).toFixed(2)
    : '0.00'

  return (
    <div>
      <div className="page-header">
        <h1>策略分析</h1>
        <p>量化策略表现与回测分析</p>
      </div>

      <div className="card">
        <h3>策略总览</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>{strategies.length}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>全部策略</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#52C41A', marginBottom: '4px' }}>{enabledStrategies.length}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>运行中</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>{avgReturn}%</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>平均收益</div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px', marginTop: '20px' }}>运行中的策略</h3>

      {enabledStrategies.map((strategy) => (
        <div key={strategy.name} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{strategy.description}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{strategy.name}</div>
            </div>
            <span style={{ padding: '4px 12px', background: 'rgba(82, 196, 26, 0.1)', color: '#52C41A', borderRadius: '8px', fontSize: '12px', fontWeight: '500' }}>
              运行中
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>累计收益</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#52C41A' }}>+{strategy.return}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>交易次数</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{strategy.trades}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>收益率</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#52C41A' }}>{(strategy.return / strategy.trades).toFixed(2)}%</div>
            </div>
          </div>

          <div style={{ height: '100px', background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF' }}>收益曲线</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button className="btn-primary" style={{ marginTop: 0 }}>查看详情</button>
            <button className="btn-secondary" style={{ marginTop: 0, color: '#FADB14', borderColor: '#FADB14' }}>暂停</button>
          </div>
        </div>
      ))}

      {disabledStrategies.length > 0 && (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px', marginTop: '20px' }}>已暂停的策略</h3>

          {disabledStrategies.map((strategy) => (
            <div key={strategy.name} className="card" style={{ opacity: 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{strategy.description}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{strategy.name}</div>
                </div>
                <span style={{ padding: '4px 12px', background: 'rgba(156, 163, 175, 0.1)', color: '#9CA3AF', borderRadius: '8px', fontSize: '12px', fontWeight: '500' }}>
                  已暂停
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>累计收益</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#52C41A' }}>+{strategy.return}%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>交易次数</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>{strategy.trades}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>收益率</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#52C41A' }}>{(strategy.return / strategy.trades).toFixed(2)}%</div>
                </div>
              </div>

              <button className="btn-primary" style={{ marginTop: 0, background: 'linear-gradient(135deg, #52C41A, #73D13D)' }}>
                启动策略
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

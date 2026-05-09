import React, { useState, useEffect } from 'react'
import { Button, Tag, Modal, message, InputNumber, Space } from 'antd'
import { ReloadOutlined, ShoppingCartOutlined, ThunderboltOutlined, FireOutlined } from '@ant-design/icons'
import { getRecommendations, buyStock } from '../api'

function Recommendations() {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [buyModalVisible, setBuyModalVisible] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [shares, setShares] = useState(100)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const res = await getRecommendations()
      if (res.data.success) {
        setRecommendations(res.data.data)
      }
    } catch (error) {
      message.error('获取推荐失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBuy = (stock) => {
    setSelectedStock(stock)
    setBuyModalVisible(true)
    setShares(100)
  }

  const confirmBuy = async () => {
    try {
      const res = await buyStock({
        stock_code: selectedStock.stock_code,
        stock_name: selectedStock.stock_name,
        price: selectedStock.current_price,
        shares: shares
      })
      if (res.data.success) {
        message.success(res.data.message)
        setBuyModalVisible(false)
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      message.error('买入失败')
    }
  }

  const getRiskColor = (risk) => {
    if (risk.includes('低')) return 'success'
    if (risk.includes('高')) return 'error'
    return 'warning'
  }

  const getScoreColor = (score) => {
    if (score >= 85) return '#52c41a'
    if (score >= 75) return '#1890ff'
    return '#faad14'
  }

  return (
    <div className="recommendations">
      <div className="page-header">
        <div>
          <h1>智能推荐</h1>
          <p>基于量化模型精选优质股票</p>
        </div>
        <Button 
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={fetchRecommendations}
          className="refresh-btn"
        >
          刷新推荐
        </Button>
      </div>

      <div className="stock-grid">
        {recommendations.map((stock, index) => (
          <div key={stock.stock_code} className="stock-card">
            <div className="stock-card-header">
              <div className="stock-title">
                <span className="rank-badge">
                  {index === 0 ? <FireOutlined /> : `#${index + 1}`}
                </span>
                <div>
                  <h4>{stock.stock_name}</h4>
                  <span className="stock-code">{stock.stock_code}</span>
                </div>
              </div>
              <Tag color={stock.signal.includes('强烈') ? 'red' : 'blue'}>
                <ThunderboltOutlined /> {stock.signal}
              </Tag>
            </div>

            <div className="stock-card-body">
              <div className="price-row">
                <span className="label">现价</span>
                <span className="value price">¥{stock.current_price?.toFixed(2)}</span>
              </div>
              
              <div className="target-row">
                <div>
                  <span className="label">目标价</span>
                  <span className="value target">¥{stock.target_price?.toFixed(2)}</span>
                </div>
                <div>
                  <span className="label">止损价</span>
                  <span className="value stop-loss">¥{stock.stop_loss?.toFixed(2)}</span>
                </div>
              </div>

              <div className="score-section">
                <span className="label">综合评分</span>
                <div className="score-display">
                  <div className="score-bar-bg">
                    <div 
                      className="score-bar-fill"
                      style={{ 
                        width: `${stock.score}%`,
                        backgroundColor: getScoreColor(stock.score)
                      }}
                    />
                  </div>
                  <span className="score-number" style={{ color: getScoreColor(stock.score) }}>
                    {stock.score}
                  </span>
                </div>
              </div>

              <div className="risk-row">
                <Tag color={getRiskColor(stock.risk_level)}>
                  {stock.risk_level}
                </Tag>
                <span className="position-ratio">
                  建议仓位: {(stock.position_ratio * 100).toFixed(0)}%
                </span>
              </div>

              <div className="reasons">
                {stock.reasons?.map((reason, i) => (
                  <Tag key={i} className="reason-tag">{reason}</Tag>
                ))}
              </div>
            </div>

            <div className="stock-card-footer">
              <Button 
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleBuy(stock)}
                block
              >
                立即买入
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="确认买入"
        open={buyModalVisible}
        onOk={confirmBuy}
        onCancel={() => setBuyModalVisible(false)}
        okText="确认买入"
        cancelText="取消"
      >
        {selectedStock && (
          <div className="buy-modal">
            <div className="modal-stock-info">
              <h3>{selectedStock.stock_name}</h3>
              <p>股票代码: {selectedStock.stock_code}</p>
            </div>
            
            <div className="modal-price">
              <span>当前价格</span>
              <strong>¥{selectedStock.current_price?.toFixed(2)}</strong>
            </div>

            <div className="modal-input">
              <label>买入数量 (手)</label>
              <Space>
                <InputNumber
                  min={1}
                  max={1000}
                  value={shares}
                  onChange={setShares}
                  size="large"
                />
                <span>手 (1手=100股)</span>
              </Space>
            </div>

            <div className="modal-summary">
              <div className="summary-row">
                <span>买入股数</span>
                <span>{shares * 100} 股</span>
              </div>
              <div className="summary-row total">
                <span>预计金额</span>
                <strong>¥{(selectedStock.current_price * shares * 100).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Recommendations

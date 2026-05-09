import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Tag, Modal, message, InputNumber } from 'antd'
import { ReloadOutlined, DollarOutlined, ArrowUpOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { getAccount, getTradeHistory, sellStock } from '../api'

function Portfolio() {
  const [loading, setLoading] = useState(false)
  const [accountData, setAccountData] = useState(null)
  const [tradeHistory, setTradeHistory] = useState([])
  const [sellModalVisible, setSellModalVisible] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [shares, setShares] = useState(100)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [accountRes, tradeRes] = await Promise.all([
        getAccount(),
        getTradeHistory()
      ])
      
      if (accountRes.data.success) {
        setAccountData(accountRes.data.data)
      }
      if (tradeRes.data.success) {
        setTradeHistory(tradeRes.data.data || [])
      }
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSell = (position) => {
    setSelectedPosition(position)
    setSellModalVisible(true)
    setShares(position.shares || 100)
  }

  const confirmSell = async () => {
    try {
      const res = await sellStock({
        stock_code: selectedPosition.stock_code,
        price: selectedPosition.current_price,
        shares: shares
      })
      if (res.data.success) {
        message.success(res.data.message)
        setSellModalVisible(false)
        fetchData()
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      message.error('卖出失败')
    }
  }

  const mockPositions = accountData?.positions || [
    { stock_code: '600519', stock_name: '贵州茅台', shares: 10, avg_price: 1650, current_price: 1685, profit: 350, profit_pct: 2.12 },
    { stock_code: '600036', stock_name: '招商银行', shares: 500, avg_price: 35.2, current_price: 36.8, profit: 800, profit_pct: 4.55 },
    { stock_code: '000858', stock_name: '五粮液', shares: 200, avg_price: 138, current_price: 142.5, profit: 900, profit_pct: 3.26 }
  ]

  const getPositionChartOption = () => {
    const validPositions = mockPositions.filter(p => p.current_price && p.shares)
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: { label: { show: false } },
        data: validPositions.map((p, i) => ({
          value: (p.current_price * p.shares).toFixed(2),
          name: p.stock_name,
          itemStyle: { color: ['#1890ff', '#52c41a', '#722ed1', '#faad14'][i % 4] }
        }))
      }]
    }
  }

  return (
    <div className="portfolio">
      <div className="page-header">
        <div>
          <h1>持仓管理</h1>
          <p>查看持仓明细与交易记录</p>
        </div>
        <Button icon={<ReloadOutlined />} loading={loading} onClick={fetchData}>
          刷新
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card primary">
            <div className="stat-icon"><DollarOutlined /></div>
            <div className="stat-content">
              <span className="stat-label">总资产</span>
              <span className="stat-value">¥{(accountData?.total_value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card success">
            <div className="stat-icon"><DollarOutlined /></div>
            <div className="stat-content">
              <span className="stat-label">持仓市值</span>
              <span className="stat-value">¥{mockPositions.reduce((sum, p) => sum + (p.current_price * p.shares || 0), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card warning">
            <div className="stat-icon"><DollarOutlined /></div>
            <div className="stat-content">
              <span className="stat-label">可用资金</span>
              <span className="stat-value">¥{(accountData?.cash || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card info">
            <div className="stat-icon"><ArrowUpOutlined /></div>
            <div className="stat-content">
              <span className="stat-label">总盈亏</span>
              <span className="stat-value" style={{ color: '#52c41a' }}>+¥{mockPositions.reduce((sum, p) => sum + (p.profit || 0), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <div className="chart-card">
            <h3>持仓分布</h3>
            <ReactECharts option={getPositionChartOption()} style={{ height: 280 }} />
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div className="chart-card">
            <h3>当前持仓</h3>
            <div className="position-table">
              {mockPositions.map((position) => (
                <div key={position.stock_code} className="position-item">
                  <div className="position-info">
                    <span className="stock-name">{position.stock_name}</span>
                    <span className="stock-code">{position.stock_code}</span>
                  </div>
                  <div className="position-detail">
                    <div className="detail-item">
                      <span className="label">持仓</span>
                      <span className="value">{position.shares} 股</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">成本</span>
                      <span className="value">¥{position.avg_price?.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">现价</span>
                      <span className="value">¥{position.current_price?.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">盈亏</span>
                      <span className="value profit">+¥{position.profit?.toFixed(2)} ({position.profit_pct?.toFixed(2)}%)</span>
                    </div>
                  </div>
                  <Button type="primary" danger onClick={() => handleSell(position)}>卖出</Button>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <div className="chart-card">
            <h3>交易历史</h3>
            <div className="trade-history">
              {tradeHistory.length > 0 ? tradeHistory.map((trade, index) => (
                <div key={index} className="trade-item">
                  <div className="trade-date">{trade.date}</div>
                  <Tag color={trade.action === '买入' ? 'blue' : 'red'}>{trade.action}</Tag>
                  <div className="trade-info">
                    <span className="stock-name">{trade.stock_name}</span>
                    <span className="stock-detail">{trade.shares} 股 @ ¥{trade.price}</span>
                  </div>
                  <div className="trade-amount">¥{trade.amount?.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
                  {trade.profit && <Tag color="green">+¥{trade.profit}</Tag>}
                </div>
              )) : (
                <div className="empty-state">暂无交易记录</div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Modal
        title="卖出股票"
        open={sellModalVisible}
        onOk={confirmSell}
        onCancel={() => setSellModalVisible(false)}
        okText="确认卖出"
        cancelText="取消"
      >
        {selectedPosition && (
          <div className="buy-modal">
            <div className="modal-stock-info">
              <h3>{selectedPosition.stock_name}</h3>
              <p>{selectedPosition.stock_code}</p>
            </div>
            <div className="modal-price">
              <span>当前价格</span>
              <strong>¥{selectedPosition.current_price?.toFixed(2)}</strong>
            </div>
            <div className="modal-input">
              <label>卖出数量 (股)</label>
              <InputNumber
                min={100}
                max={selectedPosition.shares}
                value={shares}
                onChange={setShares}
                style={{ width: '100%' }}
              />
            </div>
            <div className="modal-summary">
              <div className="summary-row total">
                <span>预计金额</span>
                <strong>¥{(selectedPosition.current_price * shares).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Portfolio

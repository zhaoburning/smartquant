import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Tag, Modal, message, Space, InputNumber, Statistic } from 'antd'
import { ReloadOutlined, DollarOutlined, ArrowUpOutlined } from '@ant-design/icons'
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

  const mockPositions = [
    {
      stock_code: '600519',
      stock_name: '贵州茅台',
      shares: 100,
      cost_price: 1700,
      current_price: 1850,
      profit: 15000,
      profit_rate: 8.82
    },
    {
      stock_code: '000858',
      stock_name: '五粮液',
      shares: 500,
      cost_price: 140,
      current_price: 145,
      profit: 2500,
      profit_rate: 3.57
    },
    {
      stock_code: '600036',
      stock_name: '招商银行',
      shares: 1000,
      cost_price: 36,
      current_price: 38,
      profit: 2000,
      profit_rate: 5.56
    }
  ]

  const positionColumns = [
    {
      title: '股票名称',
      dataIndex: 'stock_name',
      key: 'stock_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.stock_code}</div>
        </div>
      )
    },
    {
      title: '持仓数量',
      dataIndex: 'shares',
      key: 'shares',
      render: (shares) => `${shares} 股`,
    },
    {
      title: '成本价',
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (price) => `¥${price?.toFixed(2)}`,
    },
    {
      title: '现价',
      dataIndex: 'current_price',
      key: 'current_price',
      render: (price) => `¥${price?.toFixed(2)}`,
    },
    {
      title: '持仓市值',
      key: 'market_value',
      render: (_, record) => `¥${(record.current_price * record.shares).toFixed(2)}`,
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit, record) => (
        <span style={{ color: profit >= 0 ? '#cf1322' : '#3f8600', fontWeight: 600 }}>
          {profit >= 0 ? '+' : ''}¥{profit?.toFixed(2)}
        </span>
      ),
    },
    {
      title: '收益率',
      dataIndex: 'profit_rate',
      key: 'profit_rate',
      render: (rate) => (
        <Tag color={rate >= 0 ? 'red' : 'green'}>
          {rate >= 0 ? '+' : ''}{rate?.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          danger
          onClick={() => handleSell(record)}
        >
          卖出
        </Button>
      ),
    },
  ]

  const historyColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '股票名称',
      dataIndex: 'stock_name',
      key: 'stock_name',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={action === '买入' ? 'blue' : 'red'}>{action}</Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'shares',
      key: 'shares',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Card className="stat-card">
          <Space size={48}>
            <Statistic
              title="总资产"
              value={accountData?.total_value || 1080000}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
            <Statistic
              title="持仓市值"
              value={accountData?.position_value || 730000}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
            <Statistic
              title="可用资金"
              value={accountData?.cash || 350000}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="总盈亏"
              value={accountData?.total_profit || 80000}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Space>
        </Card>
      </div>

      <Card 
        title="当前持仓" 
        className="stat-card"
        style={{ marginBottom: 16 }}
        extra={
          <Button 
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={fetchData}
          >
            刷新
          </Button>
        }
      >
        <Table
          columns={positionColumns}
          dataSource={mockPositions}
          rowKey="stock_code"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Card title="交易历史" className="stat-card">
        <Table
          columns={historyColumns}
          dataSource={tradeHistory}
          rowKey={(record, index) => index}
          loading={loading}
        />
      </Card>

      <Modal
        title="卖出股票"
        open={sellModalVisible}
        onOk={confirmSell}
        onCancel={() => setSellModalVisible(false)}
        okText="确认卖出"
        cancelText="取消"
      >
        {selectedPosition && (
          <div>
            <p><strong>股票名称：</strong>{selectedPosition.stock_name}</p>
            <p><strong>股票代码：</strong>{selectedPosition.stock_code}</p>
            <p><strong>当前价格：</strong>¥{selectedPosition.current_price?.toFixed(2)}</p>
            <p><strong>可卖数量：</strong>{selectedPosition.shares} 股</p>
            <div style={{ marginTop: 16 }}>
              <Space>
                <span>卖出数量：</span>
                <InputNumber
                  min={100}
                  max={selectedPosition.shares}
                  step={100}
                  value={shares}
                  onChange={setShares}
                />
                <span>股</span>
              </Space>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
              <p><strong>预计金额：</strong>¥{(selectedPosition.current_price * shares).toFixed(2)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Portfolio

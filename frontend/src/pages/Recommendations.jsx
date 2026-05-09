import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Tag, Modal, message, Space, InputNumber } from 'antd'
import { ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { getRecommendations, generateRecommendations, buyStock } from '../api'

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

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const res = await generateRecommendations()
      if (res.data.success) {
        setRecommendations(res.data.data)
        message.success('推荐生成成功')
      }
    } catch (error) {
      message.error('生成推荐失败')
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

  const columns = [
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
      title: '当前价格',
      dataIndex: 'current_price',
      key: 'current_price',
      render: (price) => `¥${price?.toFixed(2) || '-'}`,
    },
    {
      title: '目标价格',
      dataIndex: 'target_price',
      key: 'target_price',
      render: (price) => `¥${price?.toFixed(2) || '-'}`,
    },
    {
      title: '止损价格',
      dataIndex: 'stop_loss',
      key: 'stop_loss',
      render: (price) => `¥${price?.toFixed(2) || '-'}`,
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <Tag color={score >= 80 ? 'green' : score >= 70 ? 'blue' : 'orange'}>
          {score}
        </Tag>
      ),
    },
    {
      title: '信号',
      dataIndex: 'signal',
      key: 'signal',
      render: (signal) => (
        <Tag color={signal.includes('强烈') ? 'red' : 'blue'}>
          {signal}
        </Tag>
      ),
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (risk) => (
        <Tag color={risk.includes('低') ? 'green' : 'orange'}>
          {risk}
        </Tag>
      ),
    },
    {
      title: '推荐理由',
      dataIndex: 'reasons',
      key: 'reasons',
      render: (reasons) => (
        <div style={{ maxWidth: 200, fontSize: 12, color: '#666' }}>
          {reasons?.join('；') || '-'}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<ShoppingCartOutlined />}
          onClick={() => handleBuy(record)}
        >
          买入
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Card 
        title="智能推荐股票" 
        className="stat-card"
        extra={
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={handleGenerate}
          >
            生成推荐
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={recommendations}
          rowKey="stock_code"
          loading={loading}
        />
      </Card>

      <Modal
        title="买入股票"
        open={buyModalVisible}
        onOk={confirmBuy}
        onCancel={() => setBuyModalVisible(false)}
        okText="确认买入"
        cancelText="取消"
      >
        {selectedStock && (
          <div>
            <p><strong>股票名称：</strong>{selectedStock.stock_name}</p>
            <p><strong>股票代码：</strong>{selectedStock.stock_code}</p>
            <p><strong>当前价格：</strong>¥{selectedStock.current_price?.toFixed(2)}</p>
            <div style={{ marginTop: 16 }}>
              <Space>
                <span>买入数量：</span>
                <InputNumber
                  min={100}
                  step={100}
                  value={shares}
                  onChange={setShares}
                />
                <span>股</span>
              </Space>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
              <p><strong>预计金额：</strong>¥{(selectedStock.current_price * shares).toFixed(2)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Recommendations

import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Spin, message } from 'antd'
import { DollarOutlined, TrophyOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { getAccount, getRecommendations } from '../api'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [accountData, setAccountData] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [accountRes, recRes] = await Promise.all([
        getAccount(),
        getRecommendations()
      ])
      
      if (accountRes.data.success) {
        setAccountData(accountRes.data.data)
      }
      if (recRes.data.success) {
        setRecommendations(recRes.data.data)
      }
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const getPortfolioChartOption = () => {
    return {
      title: { text: '资产走势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: { type: 'value' },
      series: [{
        data: [1000000, 1020000, 1015000, 1040000, 1055000, 1060000, 1080000],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
            ]
          }
        }
      }]
    }
  }

  const getPieChartOption = () => {
    return {
      title: { text: '持仓分布', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: true, formatter: '{b}: ¥{c}' },
        data: [
          { value: 300000, name: '贵州茅台', itemStyle: { color: '#1890ff' } },
          { value: 200000, name: '五粮液', itemStyle: { color: '#52c41a' } },
          { value: 150000, name: '招商银行', itemStyle: { color: '#faad14' } },
          { value: 350000, name: '现金', itemStyle: { color: '#d9d9d9' } }
        ]
      }]
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="总资产"
              value={accountData?.total_value || 1000000}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="总收益"
              value={accountData?.total_profit || 80000}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="收益率"
              value={accountData?.profit_rate || 8}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="持仓数量"
              value={accountData?.position_count || 3}
              valueStyle={{ color: '#faad14' }}
              prefix={<FallOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="资产走势" className="stat-card">
            <ReactECharts option={getPortfolioChartOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="持仓分布" className="stat-card">
            <ReactECharts option={getPieChartOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="今日推荐股票" className="stat-card">
            {recommendations.slice(0, 3).map((stock, index) => (
              <div key={stock.stock_code} style={{ 
                padding: '12px 0', 
                borderBottom: index < 2 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{stock.stock_name}</div>
                  <div style={{ color: '#999', fontSize: 12 }}>{stock.stock_code}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: stock.signal.includes('强烈') ? '#cf1322' : '#faad14', fontWeight: 600 }}>
                    {stock.signal}
                  </div>
                  <div style={{ color: '#999', fontSize: 12 }}>
                    评分: {stock.score}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

import React, { useState, useEffect } from 'react'
import { Row, Col, Spin, message } from 'antd'
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
      backgroundColor: 'transparent',
      grid: { top: 40, right: 20, bottom: 40, left: 60 },
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e8e8e8',
        textStyle: { color: '#333' }
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: '#e8e8e8' } },
        axisLabel: { color: '#666' }
      },
      yAxis: { 
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: { color: '#666', formatter: v => `¥${(v/1000).toFixed(0)}k` }
      },
      series: [{
        data: [100000, 102000, 101500, 104000, 105500, 106000, 108000],
        type: 'line',
        smooth: 0.6,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#1890ff', width: 3 },
        itemStyle: { color: '#1890ff', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.15)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.01)' }
            ]
          }
        }
      }]
    }
  }

  const getPieChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: { 
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e8e8e8',
        textStyle: { color: '#333' },
        formatter: '{b}: ¥{c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 20,
        top: 'center',
        textStyle: { color: '#666' }
      },
      series: [{
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 3
        },
        label: { show: false },
        emphasis: {
          label: { show: false }
        },
        data: [
          { value: 16850, name: '贵州茅台', itemStyle: { color: '#1890ff' } },
          { value: 18400, name: '招商银行', itemStyle: { color: '#52c41a' } },
          { value: 28500, name: '五粮液', itemStyle: { color: '#722ed1' } },
          { value: 61930.50, name: '现金', itemStyle: { color: '#f0f0f0' } }
        ]
      }]
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>加载市场数据中...</p>
      </div>
    )
  }

  const stats = accountData?.stats || {}

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>数据看板</h1>
        <p>实时监控账户表现与市场动态</p>
      </div>

      <Row gutter={[24, 24]} className="stats-row">
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
            <div className="stat-icon"><TrophyOutlined /></div>
            <div className="stat-content">
              <span className="stat-label">总收益</span>
              <span className="stat-value">+¥{stats.total_profit?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '0.00'}</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card info">
            <div className="stat-icon"><RiseOutlined /></div>
            <div className="stat-content">
              <span className="stat-label">收益率</span>
              <span className="stat-value">+{stats.total_profit_pct || 0}%</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card warning">
            <div className="stat-icon"><FallOutlined /></div>
            <div className="stat-content">
              <span className="stat-label">胜率</span>
              <span className="stat-value">{stats.win_rate || 0}%</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <div className="chart-card">
            <h3>资产走势</h3>
            <ReactECharts option={getPortfolioChartOption()} style={{ height: 320 }} />
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div className="chart-card">
            <h3>持仓分布</h3>
            <ReactECharts option={getPieChartOption()} style={{ height: 320 }} />
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <div className="chart-card">
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
                  <div className="stock-score">
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${stock.score}%` }} />
                    </div>
                    <span className="score-value">{stock.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

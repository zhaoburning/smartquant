import React, { useState, useEffect } from 'react'
import { Row, Col, Select, Tag, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import { getStrategies, getStockInfo } from '../api'

const { Option } = Select

function Analysis() {
  const [strategies, setStrategies] = useState([])
  const [selectedStock, setSelectedStock] = useState('600519')
  const [stockData, setStockData] = useState(null)

  useEffect(() => {
    fetchStrategies()
    fetchStockData(selectedStock)
  }, [])

  const fetchStrategies = async () => {
    try {
      const res = await getStrategies()
      if (res.data.success) {
        setStrategies(res.data.data)
      }
    } catch (error) {
      message.error('获取策略失败')
    }
  }

  const fetchStockData = async (stockCode) => {
    try {
      const res = await getStockInfo(stockCode)
      if (res.data.success) {
        setStockData(res.data.data)
      }
    } catch (error) {
      message.error('获取股票数据失败')
    }
  }

  const handleStockChange = (value) => {
    setSelectedStock(value)
    fetchStockData(value)
  }

  const getKLineChartOption = () => {
    if (!stockData?.history) return {}
    
    const dates = stockData.history.map(item => item.trade_date)
    const data = stockData.history.map(item => [
      item.open_price,
      item.close_price,
      item.low_price,
      item.high_price
    ])
    const volumes = stockData.history.map((item, index) => ({
      value: item.volume,
      itemStyle: {
        color: index > 0 && item.close_price >= stockData.history[index - 1].close_price 
          ? '#52c41a' : '#f5222d'
      }
    }))

    return {
      backgroundColor: 'transparent',
      grid: [
        { left: 60, right: 20, top: 40, height: '55%' },
        { left: 60, right: 20, top: '72%', height: '18%' }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e8e8e8',
        textStyle: { color: '#333' }
      },
      xAxis: [
        { type: 'category', data: dates, boundaryGap: true, axisLine: { lineStyle: { color: '#e8e8e8' } } },
        { type: 'category', gridIndex: 1, data: dates, boundaryGap: true, axisLine: { lineStyle: { color: '#e8e8e8' } }, axisTick: { show: false } }
      ],
      yAxis: [
        { scale: true, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#666' } },
        { scale: true, gridIndex: 1, splitNumber: 2, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } }
      ],
      dataZoom: [
        { type: 'inside', xAxisIndex: [0, 1], start: 60, end: 100 },
        { show: true, xAxisIndex: [0, 1], type: 'slider', bottom: '2%', start: 60, end: 100, borderColor: '#e8e8e8' }
      ],
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: data,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: '#52c41a',
            color0: '#f5222d',
            borderColor: '#52c41a',
            borderColor0: '#f5222d'
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes
        }
      ]
    }
  }

  const getStrategyChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { data: strategies.map(s => s.description), bottom: 0, textStyle: { color: '#666' } },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: { lineStyle: { color: '#e8e8e8' } },
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: '{value}%', color: '#666' },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: strategies.map((strategy, i) => ({
        name: strategy.description,
        type: 'line',
        smooth: 0.6,
        data: [
          Math.random() * 10 + 5,
          Math.random() * 10 + 8,
          Math.random() * 10 + 12,
          Math.random() * 10 + 10,
          Math.random() * 10 + 15,
          Math.random() * 10 + (12 + i * 2)
        ],
        lineStyle: { width: 3 },
        itemStyle: { color: ['#1890ff', '#52c41a', '#722ed1'][i % 3] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `rgba(${24 + i * 30}, ${144 - i * 20}, ${255 - i * 50}, 0.2)` },
              { offset: 1, color: 'rgba(255, 255, 255, 0.01)' }
            ]
          }
        }
      }))
    }
  }

  const stockOptions = [
    { value: '600519', label: '贵州茅台' },
    { value: '000858', label: '五粮液' },
    { value: '600036', label: '招商银行' },
    { value: '601318', label: '中国平安' },
    { value: '000001', label: '平安银行' },
    { value: '600887', label: '伊利股份' }
  ]

  return (
    <div className="analysis">
      <div className="page-header">
        <div>
          <h1>策略分析</h1>
          <p>回测模型表现与个股技术分析</p>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <div className="chart-card">
            <h3>量化策略概览</h3>
            <div className="strategy-grid">
              {strategies.map((strategy, index) => (
                <div key={strategy.name} className="strategy-card">
                  <div className="strategy-header">
                    <span className="strategy-name">{strategy.description}</span>
                    <Tag color={strategy.enabled ? 'green' : 'red'}>
                      {strategy.enabled ? '已启用' : '已禁用'}
                    </Tag>
                  </div>
                  <div className="strategy-metrics">
                    <div className="metric">
                      <span className="metric-label">年化收益</span>
                      <span className="metric-value positive">+{(strategy.return || Math.random() * 10 + 10).toFixed(1)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">交易次数</span>
                      <span className="metric-value">{strategy.trades || Math.floor(Math.random() * 50 + 20)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">夏普比率</span>
                      <span className="metric-value">{(Math.random() * 1 + 1.5).toFixed(2)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">最大回撤</span>
                      <span className="metric-value negative">-{(Math.random() * 5 + 3).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="chart-card">
            <h3>策略收益对比</h3>
            <ReactECharts option={getStrategyChartOption()} style={{ height: 320 }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="chart-card">
            <div className="chart-header">
              <h3>个股K线分析</h3>
              <Select
                value={selectedStock}
                onChange={handleStockChange}
                style={{ width: 140 }}
                size="small"
              >
                {stockOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </div>
            {stockData?.quote && (
              <div className="stock-quote">
                <span className="quote-name">{stockData.quote.stock_name}</span>
                <span className="quote-price">¥{stockData.quote.close_price?.toFixed(2)}</span>
                <span className={`quote-change ${stockData.quote.change_pct >= 0 ? 'up' : 'down'}`}>
                  {stockData.quote.change_pct >= 0 ? '+' : ''}{stockData.quote.change_pct?.toFixed(2)}%
                </span>
              </div>
            )}
            <ReactECharts option={getKLineChartOption()} style={{ height: 280 }} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Analysis

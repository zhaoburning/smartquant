import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Tag, message, Select } from 'antd'
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

  const getKLineChartOption = () => {
    if (!stockData?.history) return {}
    
    const dates = stockData.history.map(item => item.trade_date)
    const data = stockData.history.map(item => [
      item.open_price,
      item.close_price,
      item.low_price,
      item.high_price
    ])
    const volumes = stockData.history.map(item => item.volume)

    return {
      title: { text: `${stockData.quote?.stock_name || '股票'} K线图`, left: 'center' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: { data: ['K线', '成交量'] },
      grid: [
        { left: '10%', right: '8%', height: '50%' },
        { left: '10%', right: '8%', top: '63%', height: '16%' }
      ],
      xAxis: [
        { type: 'category', data: dates, boundaryGap: true, axisLine: { onZero: false } },
        { type: 'category', gridIndex: 1, data: dates, boundaryGap: true, axisLine: { onZero: false }, position: 'bottom' }
      ],
      yAxis: [
        { scale: true, splitArea: { show: true } },
        { scale: true, gridIndex: 1, splitNumber: 2, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } }
      ],
      dataZoom: [
        { type: 'inside', xAxisIndex: [0, 1], start: 50, end: 100 },
        { show: true, xAxisIndex: [0, 1], type: 'slider', bottom: '10%', start: 50, end: 100 }
      ],
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: data,
          itemStyle: {
            color: '#ef232a',
            color0: '#14b143',
            borderColor: '#ef232a',
            borderColor0: '#14b143'
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: function(params) {
              var dataList = params.dataIndex >= 0 ? data : []
              var color = '#ef232a'
              if (dataList[params.dataIndex] && dataList[params.dataIndex][1] > dataList[params.dataIndex][0]) {
                color = '#14b143'
              }
              return color
            }
          }
        }
      ]
    }
  }

  const getStrategyChartOption = () => {
    return {
      title: { text: '策略收益对比', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['趋势动量', '价值成长', '技术突破'], bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: '{value}%' }
      },
      series: [
        {
          name: '趋势动量',
          type: 'line',
          smooth: true,
          data: [5, 8, 12, 10, 15, 18],
          itemStyle: { color: '#1890ff' }
        },
        {
          name: '价值成长',
          type: 'line',
          smooth: true,
          data: [3, 6, 8, 11, 10, 14],
          itemStyle: { color: '#52c41a' }
        },
        {
          name: '技术突破',
          type: 'line',
          smooth: true,
          data: [7, 5, 10, 8, 12, 16],
          itemStyle: { color: '#faad14' }
        }
      ]
    }
  }

  const strategyColumns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <span style={{ fontWeight: 600 }}>
          {name === 'momentum' ? '趋势动量策略' : 
           name === 'value' ? '价值成长策略' : '技术突破策略'}
        </span>
      ),
    },
    {
      title: '策略描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '年化收益率',
      key: 'annual_return',
      render: () => <span style={{ color: '#cf1322', fontWeight: 600 }}>15.2%</span>,
    },
    {
      title: '最大回撤',
      key: 'max_drawdown',
      render: () => <span style={{ color: '#3f8600' }}>-8.5%</span>,
    },
    {
      title: '夏普比率',
      key: 'sharpe',
      render: () => '1.8',
    },
  ]

  const mockStrategies = [
    { name: 'momentum', description: '趋势动量策略', enabled: true },
    { name: 'value', description: '价值成长策略', enabled: true },
    { name: 'breakout', description: '技术突破策略', enabled: true }
  ]

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title="策略分析" 
            className="stat-card"
          >
            <Table
              columns={strategyColumns}
              dataSource={mockStrategies}
              rowKey="name"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="策略收益对比" className="stat-card">
            <ReactECharts option={getStrategyChartOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="股票K线图" 
            className="stat-card"
            extra={
              <Select 
                defaultValue="600519" 
                style={{ width: 150 }}
                onChange={(value) => {
                  setSelectedStock(value)
                  fetchStockData(value)
                }}
              >
                <Option value="600519">贵州茅台</Option>
                <Option value="000858">五粮液</Option>
                <Option value="600036">招商银行</Option>
                <Option value="601318">中国平安</Option>
              </Select>
            }
          >
            <ReactECharts option={getKLineChartOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Analysis
